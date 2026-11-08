import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const server=spawn('node',['node_modules/vite/bin/vite.js','--config','vite.playground.config.js','--port','4199'],{cwd:process.cwd()});
try {
await new Promise(r=>setTimeout(r,1000));
const browser=await chromium.launch({executablePath:process.env.NDS_CHROMIUM_PATH || undefined});
for(const width of [390,776,1280]){
const page=await browser.newPage({viewport:{width,height:844}});
await page.goto('http://localhost:4199/components/multi-select.html');
await page.getByRole('checkbox').first().check();
await page.getByRole('searchbox').fill('Jordan');
assert.ok((await page.getByRole('status').innerText()).includes('1 selected'));
await page.getByRole('button', {name:'Clear selection'}).click();
assert.equal(await page.locator('input:checked').count(),0);
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.goto('http://localhost:4199/components/data-table.html');
assert.equal(await page.locator('tbody tr:visible').count(),3);
await page.getByRole('button',{name:'Next',exact:true}).click();
assert.ok((await page.getByRole('status').innerText()).includes('Page 2'));
await page.getByRole('searchbox').fill('Aurora');
assert.equal(await page.locator('tbody tr:visible').count(),1);
assert.ok((await page.getByRole('status').innerText()).includes('1 results'));
await page.getByRole('searchbox').fill('missing');
assert.equal(await page.locator('tbody tr:visible').count(),0);
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.close();
}
await browser.close();
console.log('Multi-select reset/filter and Data Table pagination/search passed at 390, 776 and 1280px.');
} finally {server.kill();}
