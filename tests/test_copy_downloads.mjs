import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const read=path=>readFile(new URL('../'+path,import.meta.url));
const index=JSON.parse(await read('site/dist/downloads/index.json'));
// Inspect stored ZIP entries independently of the package generator.
function entries(zip){
  const files=new Map();let offset=0;
  while(zip.readUInt32LE(offset)===0x04034b50){
    assert.equal(zip.readUInt16LE(offset+8),0);
    const size=zip.readUInt32LE(offset+18),nameLength=zip.readUInt16LE(offset+26),extraLength=zip.readUInt16LE(offset+28);
    const name=zip.subarray(offset+30,offset+30+nameLength).toString('utf8');
    assert.ok(!name.startsWith('/')&&!name.split('/').includes('..'));
    assert.ok(!files.has(name));
    const start=offset+30+nameLength+extraLength;
    files.set(name,zip.subarray(start,start+size));offset=start+size;
  }
  assert.equal(zip.readUInt32LE(offset),0x02014b50);
  assert.equal(zip.readUInt32LE(zip.length-22),0x06054b50);
  assert.equal(zip.readUInt16LE(zip.length-12),files.size);
  return files;
}
const required={all:'content/zh-Hans.json',ios:'EnvironmentCopy.xcstrings',android:'res/values/environment_copy.xml',web:'environment-copy.mjs',lvgl:'environment_text.c'};
for(const [id,item] of Object.entries(index))test(`${id}: ZIP matches every current source file and its download metadata`,async()=>{
  const zip=await read('site/dist/downloads/'+item.file);
  assert.equal(zip.length,item.bytes);
  assert.equal(createHash('sha256').update(zip).digest('hex'),item.sha256);
  const files=entries(zip);
  assert.deepEqual([...files.keys()],item.files);
  assert.ok(files.has(required[id]));
  for(const [name,bytes]of files){
    let path=name;
    if(['ios','android','web'].includes(id))path=`content/generated/${id}/${name}`;
    if(id==='lvgl'&&name.startsWith('fonts/'))path=`content/generated/${name}`;
    assert.deepEqual(bytes,await read(path),`Stale bundled file: ${id}/${name}`);
  }
});
