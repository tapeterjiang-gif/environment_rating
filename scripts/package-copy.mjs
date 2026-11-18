import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const check=process.argv.includes('--check');
const encoder=new TextEncoder();
async function tree(path){
  const entries=await readdir(resolve(root,path),{withFileTypes:true});
  const files=[];
  for(const entry of entries.sort((a,b)=>a.name.localeCompare(b.name,'en'))){
    const child=`${path}/${entry.name}`;
    if(entry.isDirectory())files.push(...await tree(child));else if(entry.isFile())files.push(child);
  }
  return files;
}
const crcTable=Array.from({length:256},(_,n)=>{
  for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;
  return n>>>0;
});
function crc32(data){let n=0xffffffff;for(const byte of data)n=crcTable[(n^byte)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
// Standard ZIP with stored entries, fixed timestamps, sorted names and UTF-8 flags.
// No external archiver dependency; --check produces identical bytes on CI.
async function zip(files){
  const locals=[],central=[];let offset=0;
  for(const [name,path]of files.sort(([a],[b])=>a<b?-1:a>b?1:0)){
    if(name.startsWith('/')||name.split('/').includes('..'))throw Error(`Unsafe archive path: ${name}`);
    const bytes=await readFile(resolve(root,path)),filename=Buffer.from(encoder.encode(name));
    const compressed=bytes,crc=crc32(bytes);
    const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(0,8);header.writeUInt16LE(0x21,12);
    header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(bytes.length,22);header.writeUInt16LE(filename.length,26);
    locals.push(header,filename,compressed);
    const record=Buffer.alloc(46);record.writeUInt32LE(0x02014b50);record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(0x800,8);record.writeUInt16LE(0,10);record.writeUInt16LE(0x21,14);
    record.writeUInt32LE(crc,16);record.writeUInt32LE(compressed.length,20);record.writeUInt32LE(bytes.length,24);record.writeUInt16LE(filename.length,28);record.writeUInt32LE(offset,42);
    central.push(record,filename);offset+=header.length+filename.length+compressed.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...locals,directory,end]);
}
const locales=['zh-Hans','zh-Hant','en','ja'];
const enumHeaders=['air_quality_rating.h','thermal_comfort.h','sound_light_rating.h','pollen_rating.h','uv_index_rating.h','outdoor_index_rating.h'].map(name => `c/${name}`);
const firmware=['c/environment_text.c','c/environment_text.h',...enumHeaders];
const generated=await tree('content/generated');
const shared=['content/README.md','content/manifest.json',...locales.map(l=>`content/${l}.json`),...await tree('content/guides')];
const items={
  all:[...shared,...generated,...firmware].map(p=>[p,p]),
  ios:(await tree('content/generated/ios')).map(p=>[p.slice('content/generated/ios/'.length),p]),
  android:(await tree('content/generated/android')).map(p=>[p.slice('content/generated/android/'.length),p]),
  web:(await tree('content/generated/web')).map(p=>[p.slice('content/generated/web/'.length),p]),
  lvgl:[...firmware.map(p=>[p,p]),...(await tree('content/generated/fonts')).map(p=>['fonts/'+p.split('/').pop(),p])]
};
const index={};let changed=0;
if(!check)await mkdir(resolve(root,'site/dist/downloads'),{recursive:true});
for(const [id,files]of Object.entries(items)){
  const data=await zip(files),filename=`environment-copy-${id}.zip`;
  index[id]={file:filename,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),files:files.map(([name])=>name)};
  let old;try{old=await readFile(resolve(root,'site/dist/downloads',filename));}catch{}
  if(old?.equals(data))continue;changed++;
  if(check){console.error(`Outdated download: ${filename}`);continue;}
  await writeFile(resolve(root,'site/dist/downloads',filename),data);
}
const serialized=JSON.stringify(index,null,2)+'\n';let oldIndex;
try{oldIndex=await readFile(resolve(root,'site/dist/downloads/index.json'),'utf8');}catch{}
if(oldIndex!==serialized){changed++;if(check)console.error('Outdated download index');else await writeFile(resolve(root,'site/dist/downloads/index.json'),serialized);}
if(check&&changed)process.exitCode=1;
console.log(`${check?'Checked':'Packaged'} five resource downloads; ${changed} outputs changed.`);
