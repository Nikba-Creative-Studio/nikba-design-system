import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
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
  assert.deepEqual(
    tools.map(({ name }) => name).sort(),
    ['get_component', 'get_tokens', 'list_components', 'search_design_system']
  );
  assert.ok(prompts.some(({ name }) => name === 'build_with_nikba'));

  const component = await client.callTool({
    name: 'get_component',
    arguments: { slug: 'avatar' }
  });
  assert.match(component.content[0].text, /^# Avatar/m);

  const search = await client.callTool({
    name: 'search_design_system',
    arguments: { query: 'indeterminate checkbox', limit: 3 }
  });
  assert.match(search.content[0].text, /checkbox-radio/);

  const tokenResource = await client.readResource({ uri: 'nikba://foundations/tokens' });
  assert.match(tokenResource.contents[0].text, /--nds-color-/);

  console.log('MCP server contract passed.');
} finally {
  await client.close();
}
