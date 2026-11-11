import { mkdtemp, mkdir, writeFile, readFile, copyFile, rm } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawn } from 'node:child_process';
import { parseArgs } from 'node:util';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

if (process.platform !== 'darwin') throw new Error('Native iOS consumer tests require macOS and Xcode.');
const repository = fileURLToPath(new URL('../', import.meta.url));
const { values } = parseArgs({ options: { 'package-root': { type: 'string' }, packed: { type: 'boolean' } } });
if (values.packed && values['package-root']) throw new Error('Use --packed or --package-root, not both.');
let packageRoot = resolve(values['package-root'] ?? repository);
const scratch = await mkdtemp(join(tmpdir(), 'nds-swiftpm-consumer-'));
const output = resolve(repository, 'artifacts/native-ios');
await mkdir(output, { recursive: true });
const logPath = join(output, 'consumer.log');
const run = (command, args) => execFileSync(command, args, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let simulator;
const client = new Client({ name: 'nikba-ios-consumer', version: '1.0.0' });
try {
  if (values.packed) {
    const [{ filename }] = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', scratch], { cwd: repository, encoding: 'utf8' }));
    const installation = join(scratch, 'installation');
    await mkdir(installation);
    await writeFile(join(installation, 'package.json'), JSON.stringify({ private: true,
      dependencies: { '@nikba/design-system': `file:${join(scratch, filename)}` } }));
    execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], { cwd: installation, stdio: 'pipe' });
    packageRoot = join(installation, 'node_modules/@nikba/design-system');
  }
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(packageRoot, 'mcp/server.js')], cwd: packageRoot, stderr: 'pipe' }));
  const get = async (name, args) => {
    const result = await client.callTool({ name, arguments: args });
    if (result.isError) throw new Error(result.content[0].text);
    return JSON.parse(result.content[0].text);
  };
  const installation = await get('get_installation', { platform: 'ios' });
  const example = await get('get_native_source', { platform: 'ios', kind: 'example' });
  if (installation.sourceFingerprint !== example.sourceFingerprint) throw new Error('Native package snapshots differ.');
  for (const slug of ['button', 'field', 'card', 'badge', 'product-states']) {
    const component = await get('get_component', { platform: 'ios', slug });
    if (!component.available || component.sourceFingerprint !== example.sourceFingerprint) throw new Error(`Inconsistent ${slug} contract.`);
  }
  await client.close();
  await mkdir(join(scratch, 'App'));
  await mkdir(join(scratch, 'Tests'));
  await writeFile(join(scratch, 'App/FirstScreen.swift'), example.source);
  await writeFile(join(scratch, 'App/ConsumerApp.swift'), 'import SwiftUI\n@main struct ConsumerApp: App { var body: some Scene { WindowGroup { NikbaFirstScreen() } } }\n');
  await copyFile(resolve(repository, 'tests/native-ios/ConsumerTests.swift'), join(scratch, 'Tests/ConsumerTests.swift'));
  const spec = {
    name: 'NativeConsumer', options: { deploymentTarget: { iOS: '17.0' } },
    settings: { base: { SWIFT_VERSION: '6.0', GENERATE_INFOPLIST_FILE: 'YES', CODE_SIGN_STYLE: 'Automatic' } },
    packages: { NikbaDesignSystem: { path: packageRoot } },
    targets: {
      NativeConsumer: { type: 'application', platform: 'iOS', sources: ['App'],
        settings: { base: { PRODUCT_BUNDLE_IDENTIFIER: 'com.nikba.native-consumer' } },
        dependencies: [{ package: 'NikbaDesignSystem', product: 'NikbaDesignSystem' }] },
      ConsumerTests: { type: 'bundle.unit-test', platform: 'iOS', sources: ['Tests'],
        dependencies: [{ target: 'NativeConsumer' }, { package: 'NikbaDesignSystem', product: 'NikbaDesignSystem' }] },
    },
    schemes: { NativeConsumer: { build: { targets: { NativeConsumer: 'all' } }, test: { targets: ['ConsumerTests'] } } },
  };
  await writeFile(join(scratch, 'project.json'), JSON.stringify(spec));
  run('xcodegen', ['generate', '--spec', 'project.json']);
  const runtimes = JSON.parse(run('xcrun', ['simctl', 'list', 'runtimes', '--json'])).runtimes
    .filter(runtime => runtime.isAvailable && /SimRuntime\.iOS-\d+-\d+$/.test(runtime.identifier))
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
  const runtime = runtimes[0];
  if (!runtime) throw new Error('Install an iOS simulator runtime in Xcode.');
  const deviceType = runtime.supportedDeviceTypes?.find(device => device.name.startsWith('iPhone'))?.identifier
    ?? 'com.apple.CoreSimulator.SimDeviceType.iPhone-16';
  simulator = run('xcrun', ['simctl', 'create', 'Nikba SwiftPM Consumer QA', deviceType, runtime.identifier]);
  run('xcrun', ['simctl', 'boot', simulator]);
  const log = createWriteStream(logPath);
  const exitCode = await new Promise((done, reject) => {
    const child = spawn('xcodebuild', ['-project', join(scratch, 'NativeConsumer.xcodeproj'), '-scheme', 'NativeConsumer',
      '-destination', `platform=iOS Simulator,id=${simulator}`, '-derivedDataPath', join(scratch, 'DerivedData'),
      '-resultBundlePath', join(output, `consumer-${Date.now()}.xcresult`), 'CODE_SIGN_IDENTITY=-', 'test'], { cwd: scratch });
    child.stdout.pipe(log, { end: false });
    child.stderr.pipe(log, { end: false });
    child.on('error', reject);
    child.on('close', code => log.end(() => done(code)));
  });
  if (exitCode !== 0) {
    const log = await readFile(logPath, 'utf8');
    throw new Error(`SwiftPM consumer failed. ${logPath}\n${log.split('\n').filter(line => /error:|failed|TEST FAILED/i.test(line)).slice(-25).join('\n')}`);
  }
  console.log(`SwiftPM ${values.packed ? 'packed ' : ''}consumer passed: MCP first screen, public APIs, bundled Onest and idempotent registration. Log: ${logPath}`);
} finally {
  await client.close();
  if (simulator) {
    try { run('xcrun', ['simctl', 'shutdown', simulator]); } catch { /* Already shut down. */ }
    try { run('xcrun', ['simctl', 'delete', simulator]); } catch { /* Keep the test error if cleanup fails. */ }
  }
  await rm(scratch, { recursive: true, force: true });
}
