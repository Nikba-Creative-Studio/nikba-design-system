import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { parseArgs } from 'node:util';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const root = fileURLToPath(new URL('../', import.meta.url));
const { values } = parseArgs({ options: { 'gradle-command': { type: 'string', default: 'gradle' } } });
const scratch = await mkdtemp(join(tmpdir(), 'nds-compose-consumer-'));
const output = resolve(root, 'artifacts/native-android');
await mkdir(output, { recursive: true });
const logPath = join(output, 'consumer.log');
const client = new Client({ name: 'nikba-compose-consumer', version: '1.0.0' });
try {
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(root, 'mcp/server.js')], cwd: root, stderr: 'pipe' }));
  await mkdir(join(scratch, 'app/src/main/java'), { recursive: true });
  let fingerprint;
  for (const [kind, file] of [['tokens', 'NikbaTokens.kt'], ['components', 'NikbaComponents.kt'], ['example', 'FirstScreen.kt']]) {
    const result = await client.callTool({ name: 'get_native_source', arguments: { platform: 'android', kind } });
    if (result.isError) throw new Error(result.content[0].text);
    const source = JSON.parse(result.content[0].text);
    if (!source.available || fingerprint && fingerprint !== source.sourceFingerprint) throw new Error('Native Android snapshots differ.');
    fingerprint = source.sourceFingerprint;
    await writeFile(join(scratch, 'app/src/main/java', file), source.source);
  }
  await client.close();
  await writeFile(join(scratch, 'settings.gradle.kts'), `pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name = "NikbaNativeConsumer"
include(":app")
`);
  await writeFile(join(scratch, 'build.gradle.kts'), `plugins {
    id("com.android.library") version "8.10.1" apply false
    id("org.jetbrains.kotlin.android") version "2.1.10" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.1.10" apply false
}
`);
  await writeFile(join(scratch, 'gradle.properties'), 'android.useAndroidX=true\norg.gradle.jvmargs=-Xmx2g\n');
  await writeFile(join(scratch, 'app/src/main/AndroidManifest.xml'), '<manifest />\n');
  await writeFile(join(scratch, 'app/build.gradle.kts'), `plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}
android {
    namespace = "com.nikba.consumer"
    compileSdk = 36
    defaultConfig { minSdk = 26 }
    buildFeatures { compose = true }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation(platform("androidx.compose:compose-bom:2025.02.00"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
}
`);
  const log = createWriteStream(logPath);
  const code = await new Promise((done, reject) => {
    const child = spawn(values['gradle-command'], ['--project-dir', scratch, '--no-daemon', ':app:assembleDebug'], { cwd: scratch });
    child.stdout.pipe(log, { end: false }); child.stderr.pipe(log, { end: false });
    child.on('error', reject); child.on('close', code => log.end(() => done(code)));
  });
  if (code !== 0) throw new Error(`Compose consumer failed: ${logPath}\n${(await readFile(logPath, 'utf8')).split('\n').slice(-30).join('\n')}`);
  console.log(`Compose consumer passed: compiled the exact MCP tokens, components and complete first screen. Log: ${logPath}`);
} finally {
  await client.close();
  await rm(scratch, { recursive: true, force: true });
}
