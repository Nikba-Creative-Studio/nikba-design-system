import { readFile, writeFile } from 'node:fs/promises';
import { parse } from 'parse5';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import { componentCatalog } from '../playground/component-catalog.js';
hljs.registerLanguage('html', xml);
const check = process.argv.includes('--check');
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value || '';
const classes = node => attr(node, 'class').split(/\s+/);
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let count = 0;
for (const component of componentCatalog) {
 const path = new URL('../playground/components/' + component.slug + '.html', import.meta.url);
 const original = await readFile(path, 'utf8');
 const html = original.replace(/<!-- variants:start -->[\s\S]*?<!-- variants:end -->/g, '');
 const tree = parse(html, { sourceCodeLocationInfo: true });
 const edits = [];
 const visit = node => {
  if (node.tagName === 'section' && classes(node).includes('specimen')) {
   const targets = [];
   const collect = child => {
    if (classes(child).includes('specimen-heading')) return;
    if (child.tagName && classes(child).some(name => name.startsWith('nds-')) && child.sourceCodeLocation) { targets.push(child); return; }
    child.childNodes?.forEach(collect);
   };
   node.childNodes?.forEach(collect);
   const snippets = targets.map((target,index) => {
    const location = target.sourceCodeLocation;
    const code = html.slice(location.startOffset, location.endOffset);
    const modifiers = classes(target).filter(name => name.startsWith('nds-'));
    const label = modifiers.join(' ');
    count++;
    return `<details class="variant-code"><summary>View code · <code>${escape(label)}</code></summary><div class="implementation-example"><div class="implementation-example__toolbar"><span>HTML · Variant ${index+1}</span><button type="button" class="nds-button nds-button--secondary nds-button--small" data-copy-example aria-label="Copy ${escape(label)} variant ${index+1}">Copy</button></div><pre tabindex="0" aria-label="${escape(label)} source"><code class="hljs language-html">${hljs.highlight(code,{language:'html'}).value}</code></pre></div></details>`;
   });
   if (snippets.length) edits.push({offset:node.sourceCodeLocation.endTag.startOffset,text:'<!-- variants:start --><div class="variant-code-panel">'+snippets.join('\n')+'<p role="status" aria-live="polite" class="implementation-copy-status"></p></div><!-- variants:end -->'});
  }
  node.childNodes?.forEach(visit);
 };
 visit(tree);
 let updated=html;
 for(const edit of edits.sort((a,b)=>b.offset-a.offset)) updated=updated.slice(0,edit.offset)+edit.text+updated.slice(edit.offset);
 if(check && updated!==original) throw new Error('Stale variant examples: '+component.slug);
 if(!check) await writeFile(path,updated);
}
console.log('Verified '+count+' contextual variant examples across '+componentCatalog.length+' modules.');
