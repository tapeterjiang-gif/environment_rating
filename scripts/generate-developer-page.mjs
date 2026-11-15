import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFile(resolve(root,path),'utf8');
const check=process.argv.includes('--check');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
// Deliberately supports the small Markdown subset used by these local guides.
function inline(value){
  const code=[];
  let safe=escape(value).replace(/`([^`]+)`/g,(_,text)=>{code.push(`<code>${text}</code>`);return `\u0001${code.length-1}\u0001`;});
  safe=safe.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  return safe.replace(/\u0001(\d+)\u0001/g,(_,index)=>code[Number(index)]);
}
function render(markdown,firstHeading){
  const sections=[];
  let title=firstHeading,parts=[],paragraph=[],list=[],fenced=false,code=[],language='';
  const flush=()=>{
    if(paragraph.length){parts.push(`<p>${inline(paragraph.join(' '))}</p>`);paragraph=[];}
    if(list.length){parts.push('<ul>'+list.map(item=>`<li>${inline(item)}</li>`).join('')+'</ul>');list=[];}
  };
  const section=()=>{flush();sections.push(`<section class="section"><div class="container"><article class="developer-chapter"><h2>${escape(title)}</h2>${parts.join('\n')}</article></div></section>`);parts=[];};
  for(const line of markdown.split('\n')){
    if(line.startsWith('```')){
      if(!fenced){flush();fenced=true;language=line.slice(3).trim();code=[];}
      else {parts.push(`<pre translate="no"><code class="language-${escape(language)}">${escape(code.join('\n'))}</code></pre>`);fenced=false;}
      continue;
    }
    if(fenced){code.push(line);continue;}
    if(line.startsWith('# '))continue;
    if(line.startsWith('## ')){section();title=line.slice(3);continue;}
    if(!line.trim()){flush();continue;}
    if(line.startsWith('- ')){if(paragraph.length)flush();list.push(line.slice(2));continue;}
    if(list.length)flush();paragraph.push(line);
  }
  if(fenced)throw new Error('Unclosed code block');
  section();return sections.join('\n');
}
const locales={
  'zh-Hans':{source:'content/README.md',title:'开发参考',first:'统一文案源',lead:'将同一份环境指标文案接入 iOS、Android、青萍 Web 与 LVGL 固件。这里说明资源结构、评级映射、生成流程和各平台的使用方式。'},
  'zh-Hant':{source:'content/guides/zh-Hant.md',title:'開發參考',first:'統一文字來源',lead:'將同一份環境指標文字接入 iOS、Android、青萍 Web 與 LVGL 韌體。這裡介紹資源結構、評級對應、產生流程與各平台的使用方式。'},
  en:{source:'content/guides/en.md',title:'Developer Guide',first:'One source for copy',lead:'Use the same environmental copy in iOS, Android, Qingping Web, and LVGL firmware. Learn the resource structure, rating mapping, generation workflow, and platform integration steps.'},
  ja:{source:'content/guides/ja.md',title:'開発者ガイド',first:'共通のテキストソース',lead:'環境指標の共通テキストをiOS、Android、Qingping Web、LVGLファームウェアに組み込みます。リソース構造、評価の対応、生成手順、各プラットフォームでの使い方をまとめています。'}
};
const content={};
const downloads=JSON.parse(await read('site/dist/downloads/index.json'));
const downloadText={
  'zh-Hans':{title:'下载文案资源',lead:'每个包均包含简体中文、繁体中文、英文和日语。完整包包含文案源、评级映射、各端资源与接入说明；也可以只下载所需平台。',labels:['完整资源包','iOS','Android','青萍 Web','LVGL 固件'],descriptions:['文案源、全部生成资源与说明文档','EnvironmentCopy.xcstrings 字符串目录','四语言 res 字符串资源','JSON、查询模块与 TypeScript 声明','C 查询接口、枚举头文件与字库字符集'],action:'下载 ZIP'},
  'zh-Hant':{title:'下載文字資源',lead:'每個包都包含簡體中文、繁體中文、英文與日語。完整包包含文字來源、評級對應、各平台資源與接入說明；也可以只下載需要的平台。',labels:['完整資源包','iOS','Android','青萍 Web','LVGL 韌體'],descriptions:['文字來源、全部產生資源與說明文件','EnvironmentCopy.xcstrings 字串目錄','四語言 res 字串資源','JSON、查詢模組與 TypeScript 宣告','C 查詢介面、列舉標頭與字庫字元集'],action:'下載 ZIP'},
  en:{title:'Download copy resources',lead:'Every package includes Simplified Chinese, Traditional Chinese, English, and Japanese. The complete package contains source catalogs, rating mappings, platform resources, and integration guides. You can also download one platform.',labels:['Complete resource package','iOS','Android','Qingping Web','LVGL firmware'],descriptions:['Source catalogs, all generated resources, and guides','EnvironmentCopy.xcstrings string catalog','Localized res strings for four languages','JSON, lookup module, and TypeScript declarations','C lookup API, enum headers, and font character lists'],action:'Download ZIP'},
  ja:{title:'テキストリソースのダウンロード',lead:'各パッケージは簡体字中国語、繁体字中国語、英語、日本語を含みます。完全版にはソース、評価対応表、各プラットフォームのリソースとガイドが含まれます。必要なプラットフォームだけのダウンロードも可能です。',labels:['全リソースパッケージ','iOS','Android','Qingping Web','LVGLファームウェア'],descriptions:['ソース、すべての生成リソースとガイド','EnvironmentCopy.xcstrings文字列カタログ','4言語のres文字列リソース','JSON、取得モジュール、TypeScript型宣言','C取得API、列挙型ヘッダーとフォント用文字一覧'],action:'ZIPをダウンロード'}
};
function downloadSection(locale){
  const t=downloadText[locale];
  return '<section class="section"><div class="container"><article class="developer-chapter"><h2>'+t.title+'</h2><p>'+t.lead+'</p><div class="download-grid">'+Object.entries(downloads).map(([id,item],i)=>`<a class="download-card ${id==='all'?'download-complete':''}" href="downloads/${item.file}" download><strong>${t.labels[i]}</strong><span>${t.descriptions[i]}</span><small>${t.action} ↓ · ${Math.ceil(item.bytes/1024)} KB</small></a>`).join('')+'</div></article></div></section>';
}
for(const [locale,meta]of Object.entries(locales)){
  const markdown=await read(meta.source);
  content[locale]=`<section class="interpret-hero"><div class="container interpret-hero-inner"><span class="eyebrow">Environment developer guide</span><h1>${meta.title}</h1><p class="lead">${meta.lead}</p></div></section>\n`+downloadSection(locale)+render(markdown,meta.first);
}
const base=await read('site/dist/index.html');
let head=base.match(/<head>([\s\S]*?)<\/head>/)[1];
head=head.replace(/<title>.*?<\/title>/,'<title>开发参考｜青萍环境评级指南</title>').replace(/(<meta name="description" content=")[^"]*/,'$1'+locales['zh-Hans'].lead).replace(/(<meta name="apple-mobile-web-app-title" content=")[^"]*/,'$1青萍环境评级指南');
head=head.replaceAll('environment_rating/?','environment_rating/developer.html?').replaceAll('environment_rating/"','environment_rating/developer.html"');
head=head.replace('<script src="i18n.js"','<script src="developer-content.js" defer></script>\n  <script src="i18n.js"');
const header=base.match(/<header class="site-header">[\s\S]*?<\/header>/)[0].replace('<a href="index.html" aria-current="page">','<a href="index.html">').replace('<a href="developer.html">','<a href="developer.html" aria-current="page">');
const footer=base.match(/<footer class="page-footer">[\s\S]*?<\/footer>/)[0];
const page='<!doctype html>\n<html lang="zh-CN">\n<head>'+head+'</head>\n<body class="developer-page">\n<a class="skip-link" href="#main">跳到主要内容</a>\n'+header+'\n<main id="main" data-developer-content translate="no">'+content['zh-Hans']+'</main>\n'+footer+'\n</body>\n</html>\n';
const meta=Object.fromEntries(Object.entries(locales).map(([locale,{title,lead}])=>[locale,{title,description:lead}]));
const outputs={'site/dist/developer.html':page,'site/dist/developer-content.js':'// Generated from content/README.md and content/guides/*.md.\nwindow.ENV_DEVELOPER_CONTENT = '+JSON.stringify(content)+';\nwindow.ENV_DEVELOPER_META = '+JSON.stringify(meta)+';\n'};
let changed=0;
for(const [path,data]of Object.entries(outputs)){
  let old;try{old=await read(path);}catch{}
  if(old===data)continue;changed++;
  if(check){console.error(`Outdated developer page: ${path}`);continue;}
  await writeFile(resolve(root,path),data);
}
if(check&&changed)process.exitCode=1;
console.log(`${check?'Checked':'Generated'} developer guide in four languages; ${changed} outputs changed.`);
