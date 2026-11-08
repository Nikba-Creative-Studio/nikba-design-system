import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const server=spawn('node',['node_modules/vite/bin/vite.js','--config','vite.playground.config.js','--port','4199'],{cwd:process.cwd()});
try {
await new Promise(r=>setTimeout(r,1000));
const browser=await chromium.launch({executablePath:process.env.NDS_CHROMIUM_PATH || undefined});
for(const width of [390,776,1280]){
const page=await browser.newPage({viewport:{width,height:844}});
await page.goto('http://localhost:4199/components/combobox.html');
const input=page.getByRole('combobox').first();
await input.fill('review'); await input.press('ArrowDown'); await input.press('Enter');
assert.equal(await input.inputValue(),'In review');
assert.equal(await page.locator('select').first().inputValue(),'review');
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.close();
}
await browser.close();
console.log('Combobox keyboard, native value and responsive checks passed.');
} finally {server.kill();}
