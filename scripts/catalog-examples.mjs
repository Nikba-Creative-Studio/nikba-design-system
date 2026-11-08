import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('html', xml);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('javascript', javascript);
import { readFile, writeFile } from 'node:fs/promises';
import { componentCatalog } from '../playground/component-catalog.js';
const check = process.argv.includes('--check');
const aliases = { 'form-validation': 'form-validation-submission' };
for (const component of componentCatalog) {
  const path = new URL('../playground/components/' + component.slug + '.html', import.meta.url);
  const html = await readFile(path, 'utf8');
  const doc = await readFile(new URL('../docs/' + (component.type === 'pattern' ? 'patterns/' : 'components/') + (aliases[component.slug] || component.slug) + '.md', import.meta.url), 'utf8');
  let examples = [...doc.matchAll(/```(html|js|javascript)\n([\s\S]*?)```/g)].map(match => ({ language: match[1], code: match[2].trim() }));
  if (!examples.some(example => example.language === 'html')) {
    const specimen = html.match(/<section\b[^>]*class="specimen[^>]*>([\s\S]*?)<\/section>/);
    if (!specimen) throw new Error('Missing implementation example: ' + component.slug);
    examples.unshift({ language: 'html', code: specimen[1].replace(/<div class="specimen-heading">[\s\S]*?<\/div>/, '').trim() });
  }
  const initializers = { combobox: 'initComboboxes', 'multi-select': 'initMultiSelects', 'data-table': 'initDataTables', select: 'initSelects', tabs: 'initTabs', dialog: 'initDialogs', 'disclosure-accordion': 'initAccordions', 'popover-menu': 'initPopovers', tooltip: 'initTooltips', 'header-navigation': 'initNavigations', table: 'initTables', 'form-validation': 'initForms' };
  if (initializers[component.slug] && !examples.some(example => example.language !== 'html')) {
    const name = initializers[component.slug];
    examples.push({ language: 'javascript', code: "import { " + name + " } from '@nikba/design-system';\n\nconst cleanup = " + name + "(document);\n\n// Call before removing the component from the page.\n// cleanup();" });
  }
  const blocks = examples.map((example, index) => `<div class="implementation-example"><div class="implementation-example__toolbar"><span>${example.language === 'html' ? 'HTML' : 'JavaScript'} · Example ${index + 1}</span><button type="button" class="nds-button nds-button--secondary nds-button--small" data-copy-example aria-label="Copy ${component.title} example ${index + 1}">Copy</button></div><pre tabindex="0" aria-label="${example.language} implementation example ${index + 1}"><code class="hljs language-${example.language}">${hljs.highlight(example.code, { language: example.language }).value}</code></pre></div>`).join('\n');
  const section = `<!-- implementation:start -->\n<section class="implementation-panel" aria-labelledby="implementation-title"><p class="component-label">Developer reference</p><h2 id="implementation-title">Implementation</h2><p><a class="nds-link" href="/#installation">Install from npm</a>, import <code>@nikba/design-system/css</code>, and place this markup inside <code>.nds-scope</code>. JavaScript examples use the public package exports.</p>${blocks}<p class="implementation-copy-status" role="status" aria-live="polite"></p></section>\n<!-- implementation:end -->`;
  const updated = html.includes('<!-- implementation:start -->') ? html.replace(/<!-- implementation:start -->[\s\S]*?<!-- implementation:end -->/, section) : html.replace(/<section\b[^>]*class="guidance-panel[^>]*>/, match => section + '\n' + match);
  if (updated === html && !html.includes('<!-- implementation:start -->')) throw new Error('No insertion point: ' + component.slug);
  if (check && updated !== html) throw new Error('Stale implementation examples: ' + component.slug);
  if (!check) await writeFile(path, updated);
}
console.log('Implementation examples verified for ' + componentCatalog.length + ' modules.');
