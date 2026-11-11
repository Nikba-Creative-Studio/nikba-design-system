import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const repositoryRoot = resolve(process.env.NDS_MCP_PACKAGE_ROOT ?? dirname(dirname(fileURLToPath(import.meta.url))));
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [join(repositoryRoot, 'mcp', 'server.js')],
  cwd: repositoryRoot,
  stderr: 'pipe'
});
const client = new Client({ name: 'nikba-design-system-test', version: '1.0.0' });

try {
  await client.connect(transport);

  const [{ resources }, { tools }, { prompts }] = await Promise.all([
    client.listResources(),
    client.listTools(),
    client.listPrompts()
  ]);

  assert.ok(resources.some(({ uri }) => uri === 'nikba://system/overview'));
  assert.ok(resources.some(({ uri }) => uri === 'nikba://foundations/tokens'));
  assert.ok(resources.some(({ uri }) => uri === 'nikba://components/button'));
  assert.ok(resources.some(({ uri }) => uri === 'nikba://patterns/search-filter'));
  assert.ok(resources.some(({ uri }) => uri === 'nikba://integrations/livewire'));
  assert.ok(resources.some(({ uri }) => uri === 'nikba://guides/releases'));
  assert.ok(resources.some(({ uri }) => uri === 'nikba://guides/javascript'));
  assert.deepEqual(
    tools.map(({ name }) => name).sort(),
    ['get_capabilities', 'get_component', 'get_document', 'get_installation', 'get_native_source', 'get_tokens', 'list_components', 'list_documents', 'search_design_system']
  );
  assert.ok(prompts.some(({ name }) => name === 'build_with_nikba'));

  const component = await client.callTool({
    name: 'get_component',
    arguments: { slug: 'avatar' }
  });
  assert.match(component.content[0].text, /^# Avatar/m);

  const pattern = await client.callTool({
    name: 'get_document',
    arguments: { category: 'patterns', slug: 'settings-account' }
  });
  assert.match(pattern.content[0].text, /^# Settings and Account/m);

  const patterns = await client.callTool({
    name: 'list_documents',
    arguments: { category: 'patterns' }
  });
  assert.match(patterns.content[0].text, /destructive-confirmation/);

  const search = await client.callTool({
    name: 'search_design_system',
    arguments: { query: 'indeterminate checkbox', limit: 3 }
  });
  assert.match(search.content[0].text, /checkbox-radio/);

  const integrationSearch = await client.callTool({
    name: 'search_design_system',
    arguments: { query: 'Livewire morph', limit: 3 }
  });
  assert.match(integrationSearch.content[0].text, /"category": "integrations"/);

  const tokenResource = await client.readResource({ uri: 'nikba://foundations/tokens' });
  assert.match(tokenResource.contents[0].text, /--nds-color-/);

  const call = async (name, args) => {
    const result = await client.callTool({ name, arguments: args });
    assert.ok(!result.isError, result.content[0].text);
    return result.content[0].text;
  };
  const json = async (name, args) => JSON.parse(await call(name, args));
  const capabilities = await json('get_capabilities', {});
  assert.equal(capabilities.platforms.web.status, 'stable');
  assert.equal(capabilities.nativeStatus, 'pilot');
  assert.equal(capabilities.nativeReleaseStatus, 'published');
  assert.equal(capabilities.platforms.ios.module, 'NikbaDesignSystem');
  assert.match(capabilities.sourceFingerprint, /^[0-9a-f]{64}$/);
  assert.deepEqual(Object.keys((await json('get_capabilities', { platform: 'ios' })).platforms), ['ios']);
  for (const platform of ['ios', 'android']) {
    const nativeComponents = await json('list_components', { platform });
    assert.deepEqual(nativeComponents.map(component => component.slug).sort(), ['badge', 'button', 'card', 'field', 'product-states']);
    const source = await json('get_native_source', { platform, kind: 'components' });
    const example = await json('get_native_source', { platform, kind: 'example' });
    assert.equal(source.sourceFingerprint, capabilities.sourceFingerprint);
    assert.equal(example.sourceFingerprint, capabilities.sourceFingerprint);
    for (const { slug } of nativeComponents) {
      const contract = await json('get_component', { slug, platform });
      assert.equal(contract.available, true);
      assert.equal(contract.sourceFingerprint, capabilities.sourceFingerprint);
      assert.ok(contract.api.length > 0);
      for (const api of contract.api) assert.ok(source.source.includes(api), `${platform}/${slug}: API must come from shipped source.`);
      assert.ok(example.source.includes(contract.symbol), `${platform}/${slug}: complete example must use the component.`);
      const resource = await client.readResource({ uri: contract.uri });
      assert.ok(resource.contents[0].text.includes(contract.symbol));
    }
    const alias = await json('get_component', { slug: 'badge-chip', platform });
    assert.equal(alias.slug, 'badge');
    const unsupported = await json('get_component', { slug: 'select', platform });
    assert.equal(unsupported.available, false);
    assert.ok(unsupported.fallback);
    const unknown = await json('get_component', { slug: 'not-a-component', platform });
    assert.equal(unknown.available, false);
    for (const slug of ['constructor', '__proto__']) {
      const unsupported = await json('get_component', { slug, platform });
      assert.equal(unsupported.available, false);
      assert.equal(typeof unsupported.fallback, 'string');
    }
    const tokens = await json('get_tokens', { platform });
    assert.equal(tokens.language, platform === 'ios' ? 'swift' : 'kotlin');
    assert.ok(tokens.source.includes('NDSPalette'));
    const badCategory = await client.callTool({ name: 'get_tokens', arguments: { platform, category: 'semantic' } });
    assert.equal(badCategory.isError, true);
    const install = await json('get_installation', { platform });
    assert.equal(install.sourceFingerprint, capabilities.sourceFingerprint);
    if (platform === 'ios') {
      assert.equal(install.swiftPackage.exactVersion, capabilities.webVersion);
      assert.equal(install.swiftPackage.tag, 'v' + capabilities.webVersion);
      assert.equal(install.nativeVersion, capabilities.webVersion);
    }
    const exampleResource = await client.readResource({ uri: install.exampleUri });
    assert.equal(exampleResource.contents[0].text, example.source);
    const guide = await call('get_document', { platform, category: 'guides', slug: 'native' });
    assert.match(guide, /^# Native foundations/m);
    const search = await json('search_design_system', { query: 'NDSButton', platform, limit: 10 });
    assert.ok(search.matches.some(match => match.uri === `nikba://native/${platform}/components/button`));
    assert.ok(search.matches.every(match => !match.uri.startsWith('nikba://components/')));
    const prompt = await client.getPrompt({ name: 'build_with_nikba', arguments: { task: 'Build a settings screen', platform } });
    assert.ok(prompt.messages[0].content.text.includes(`platform="${platform}"`));
    assert.ok(prompt.messages[0].content.text.includes('available=false'));
  }
  const fontSource = await json('get_native_source', { platform: 'ios', kind: 'fonts' });
  assert.ok(fontSource.source.includes('Bundle.module'));
  assert.ok((await json('get_native_source', { platform: 'ios', kind: 'package' })).source.includes('NikbaDesignSystem'));
  assert.equal((await json('get_native_source', { platform: 'android', kind: 'fonts' })).available, false);
  assert.equal((await json('get_native_source', { platform: 'android', kind: 'package' })).available, false);
  assert.match(await call('get_document', { category: 'guides', slug: 'ios', platform: 'ios' }), /^# Build an iOS app/m);
  const traversal = await client.callTool({ name: 'get_native_source', arguments: { platform: 'ios', kind: '../../package.json' } });
  assert.equal(traversal.isError, true);
  assert.ok(tools.every(tool => tool.annotations.readOnlyHint === true));

  console.log('MCP server contract passed.');
} finally {
  await client.close();
}
