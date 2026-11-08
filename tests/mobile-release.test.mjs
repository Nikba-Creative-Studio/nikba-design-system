import { webkit, devices } from 'playwright';
import assert from 'node:assert/strict';
const browser = await webkit.launch();
try {
const context = await browser.newContext({...devices['iPhone 13']});
const page = await context.newPage();
for (const theme of ['frost','mist','graphite']) {
 for (const slug of ['combobox','multi-select','data-table']) {
  await page.goto('http://127.0.0.1:4199/components/'+slug+'.html');
  await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), slug+' overflow '+theme);
  if(slug==='combobox') {
   const control=page.getByRole('combobox').first();
   await control.fill('review');
   await page.getByRole('option',{name:'In review',exact:true}).tap();
   assert.equal(await control.inputValue(),'In review');
  }
  if(slug==='multi-select') {
   await page.getByRole('checkbox').first().tap();
   await page.getByRole('button',{name:'Remove Maya Chen'}).tap();
   assert.equal(await page.locator('input:checked').count(),0);
  }
  if(slug==='data-table') {
   await page.getByRole('checkbox',{name:'Select current page'}).tap();
   await page.getByRole('button',{name:'Next',exact:true}).tap();
   assert.equal(await page.locator('[data-row-select]:checked').count(),3);
   await page.getByRole('button',{name:'Archive selected'}).tap();
   assert.ok((await page.locator('#bulk-feedback').innerText()).includes('Aurora'));
  }
  await page.screenshot({path:'artifacts/release/'+slug+'-'+theme+'.png',fullPage:true});
 }
}
console.log('PASS: iPhone emulation, WebKit touch actions, three themes, three components; no horizontal overflow.');
await context.close();
} finally {await browser.close();}
