import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getMetric, getStandard, getRating, getText, resolveLocale, manifest } from '../content/generated/web/environment-copy.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const load=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));

test('four source catalogs export identical copy in JSON, Web and Apple resources', async()=>{
  const apple=await load('content/generated/ios/EnvironmentCopy.xcstrings');
  const expected=[];
  for(const locale of manifest.locales){
    const source=await load(`content/${locale}.json`);
    assert.deepEqual(await load(`content/generated/web/${locale}.json`),source);
    for(const [id,metric] of Object.entries(source.metrics)){
      assert.deepEqual(getMetric(locale,id),metric);
      const pairs=['name','description','advice'].map(field=>[`env_${id}_${field}`,metric[field]]);
      for(const [rating,copy]of Object.entries(metric.ratings)){
        for(const field of ['label','summary','detail'])pairs.push([`env_${id}_rating_${rating}_${field}`,copy[field]]);
      }
      for(const [key,value] of pairs){
        assert.equal(getText(locale,key),value);
        assert.equal(apple.strings[key].localizations[locale].stringUnit.value,value);
        if(locale==='en')expected.push(key);
      }
    }
    for(const [id,standard] of Object.entries(source.standards)){
      assert.deepEqual(getStandard(locale,id),standard);
      const pairs=Object.entries(standard).map(([field,value])=>[`env_standard_${id}_${field}`,value]);
      (manifest.standards[id].organizations.length===1 ? [standard.organization] : standard.organization.split(locale==='en'?' / ':'、')).forEach((part,index)=>pairs.push([`env_standard_${id}_organization_${index+1}`,part]));
      for(const [key,value] of pairs){
        assert.equal(getText(locale,key),value);
        assert.equal(apple.strings[key].localizations[locale].stringUnit.value,value);
        if(locale==='en')expected.push(key);
      }
    }
  }
  assert.equal(expected.length,Object.keys(apple.strings).length);
});
test('locale aliases, invalid input and algorithm enum mapping',()=>{
  assert.equal(resolveLocale('zh_HK'),'zh-Hant');
  assert.equal(resolveLocale('zh-Hans-CN'),'zh-Hans');
  assert.equal(resolveLocale('ja-JP'),'ja');
  assert.equal(resolveLocale('fr'),'en');
  assert.equal(getRating('en','co2',3).label,'Ventilate');
  assert.equal(getRating('en','co2',2).label,'Unknown');
  assert.equal(getRating('en','pollen',1).label,'Not detected');
  assert.equal(getRating('en','pmv',5).label,'Slightly warm');
  assert.equal(getRating('en','tvoc',0),null);
  assert.equal(getRating('en','temperature',0),null);
  assert.equal(getRating('en','pm25',NaN).label,'Unknown');
  assert.equal(getRating('en','pm25','bad_key').label,'Unknown');
  assert.equal(getText('en','bad_key'),null);
  assert.equal(getMetric('en','bad_key'),null);
  assert.equal(getMetric('en','__proto__'),null);
  assert.equal(getRating('en','constructor',0),null);
  assert.equal(getText('en','toString'),null);
  assert.equal(getStandard('en','__proto__'),null);
  assert.ok(getStandard('en','who_uv_index').organization.includes('WHO'));
  assert.throws(()=>{getMetric('en','co2').name='Changed';},TypeError);
});
test('font character sets cover every localized text',async()=>{
  for(const locale of manifest.locales){
    const source=await load(`content/${locale}.json`);
    const charset=await readFile(resolve(root,`content/generated/fonts/${locale}.txt`),'utf8');
    const chars=new Set(charset);
    const walk=value=>{
      if(typeof value==='string')for(const c of value)assert.ok(chars.has(c)||/\s/u.test(c),`Missing glyph ${locale}: ${c}`);
      else if(value&&typeof value==='object')Object.values(value).forEach(walk);
    };
    // Locale names are metadata and are not displayed.
    walk(source.metrics);
    walk(source.standards);
  }
});

test('external indices keep native scheme labels and NEA has only five grades', ()=>{
  assert.equal(getRating('en','aqi_epa','grade_3').label,'Unhealthy for Sensitive Groups');
  assert.equal(getRating('en','psi','grade_3').label,'Unhealthy');
  assert.equal(getRating('zh-Hans','aqi_hj','grade_3').label,'轻度污染');
  assert.equal(getRating('en','eea_index','grade_3').label,'Moderate');
  assert.equal(manifest.metrics.psi.ratings.some(r=>r.value===6),false);
});
