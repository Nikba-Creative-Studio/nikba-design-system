#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const componentDocsDirectory = join(packageRoot, 'docs', 'components');
const tokenDirectory = join(packageRoot, 'src', 'tokens');

const tokenFiles = {
  primitive: 'primitive.css',
  semantic: 'semantic.css',
  themes: 'themes.css'
};

function titleFromMarkdown(markdown, fallback) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback;
}

function descriptionFromMarkdown(markdown) {
  const purpose = markdown.match(/## Purpose\s+([\s\S]*?)(?=\n## |$)/)?.[1]?.trim();
  return purpose?.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ') ?? '';
}

async function loadComponentCatalog() {
  const filenames = (await readdir(componentDocsDirectory))
    .filter((filename) => filename.endsWith('.md'))
    .sort();

  return Promise.all(
    filenames.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      const markdown = await readFile(join(componentDocsDirectory, filename), 'utf8');

      return {
        slug,
        title: titleFromMarkdown(markdown, slug),
        description: descriptionFromMarkdown(markdown),
        uri: `nikba://components/${slug}`,
        markdown
      };
    })
  );
}

async function loadTokens(category) {
  if (category === 'all') {
    const sections = await Promise.all(
      Object.entries(tokenFiles).map(async ([name, filename]) => {
        const css = await readFile(join(tokenDirectory, filename), 'utf8');
        return `/* ${name} */\n${css.trim()}`;
      })
    );

    return sections.join('\n\n');
  }

  return readFile(join(tokenDirectory, tokenFiles[category]), 'utf8');
}

function textResult(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: 'text', text }] };
}

function toolError(message) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

async function createNikbaServer() {
  const [components, overview, allTokens] = await Promise.all([
    loadComponentCatalog(),
    readFile(join(packageRoot, 'README.md'), 'utf8'),
    loadTokens('all')
  ]);

  const server = new McpServer({
    name: 'nikba-design-system',
    version: '0.1.0-alpha.1'
  });

  const resourceConfig = {
    mimeType: 'text/markdown',
    annotations: { audience: ['assistant'], priority: 0.8 }
  };

  server.registerResource(
    'system-overview',
    'nikba://system/overview',
    {
      ...resourceConfig,
      title: 'Nikba Design System overview',
      description: 'Package principles, setup, usage, and current public surface.'
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'text/markdown', text: overview }]
    })
  );

  server.registerResource(
    'design-tokens',
    'nikba://foundations/tokens',
    {
      ...resourceConfig,
      title: 'Nikba design tokens',
      description: 'Primitive, semantic, and theme CSS custom properties.'
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'text/css', text: allTokens }]
    })
  );

  for (const component of components) {
    server.registerResource(
      `component-${component.slug}`,
      component.uri,
      {
        ...resourceConfig,
        title: component.title,
        description: component.description
      },
      async (uri) => ({
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: component.markdown }]
      })
    );
  }

  const readOnlyAnnotations = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  };

  server.registerTool(
    'list_components',
    {
      title: 'List Nikba components',
      description: 'List documented Nikba Design System components and their MCP resource URIs.',
      inputSchema: z.object({}),
      annotations: readOnlyAnnotations
    },
    async () =>
      textResult(
        components.map(({ slug, title, description, uri }) => ({ slug, title, description, uri }))
      )
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get a Nikba component contract',
      description: 'Return the complete Markdown contract for one documented component.',
      inputSchema: z.object({
        slug: z.string().min(1).describe('Component slug, such as button or checkbox-radio.')
      }),
      annotations: readOnlyAnnotations
    },
    async ({ slug }) => {
      const component = components.find((entry) => entry.slug === slug.trim().toLowerCase());
      return component ? textResult(component.markdown) : toolError(`Unknown component: ${slug}`);
    }
  );

  server.registerTool(
    'get_tokens',
    {
      title: 'Get Nikba design tokens',
      description: 'Return CSS custom properties from a token layer or from all token layers.',
      inputSchema: z.object({
        category: z.enum(['all', 'primitive', 'semantic', 'themes']).default('all')
      }),
      annotations: readOnlyAnnotations
    },
    async ({ category }) => textResult(await loadTokens(category))
  );

  server.registerTool(
    'search_design_system',
    {
      title: 'Search Nikba Design System',
      description: 'Search component contracts and return the most relevant matching excerpts.',
      inputSchema: z.object({
        query: z.string().min(2).describe('Word or phrase to find in component documentation.'),
        limit: z.number().int().min(1).max(10).default(5)
      }),
      annotations: readOnlyAnnotations
    },
    async ({ query, limit }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      const matches = components
        .map((component) => {
          const searchable = `${component.title}\n${component.description}\n${component.markdown}`.toLowerCase();
          const score = terms.reduce((total, term) => total + searchable.split(term).length - 1, 0);
          const firstIndex = Math.max(0, component.markdown.toLowerCase().indexOf(terms[0]));
          const excerptStart = Math.max(0, firstIndex - 100);
          const excerpt = component.markdown
            .slice(excerptStart, excerptStart + 420)
            .replace(/\s+/g, ' ')
            .trim();

          return { slug: component.slug, title: component.title, uri: component.uri, score, excerpt };
        })
        .filter((match) => match.score > 0)
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
        .slice(0, limit);

      return textResult({ query, matches });
    }
  );

  server.registerPrompt(
    'build_with_nikba',
    {
      title: 'Build with Nikba Design System',
      description: 'Start an implementation task using the published Nikba component contracts and tokens.',
      argsSchema: z.object({
        task: z.string().min(1).describe('The interface or flow to implement.')
      })
    },
    ({ task }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Implement this task with Nikba Design System: ${task}\n\nRead nikba://system/overview, inspect the relevant component resources, and use published tokens and public APIs. Preserve native semantics, keyboard access, visible focus, and reduced-motion behavior.`
          }
        }
      ]
    })
  );

  return server;
}

serveStdio(createNikbaServer, {
  onerror(error) {
    process.stderr.write(`[nikba-design-system-mcp] ${error.message}\n`);
  }
});
