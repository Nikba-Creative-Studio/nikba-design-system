#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const tokenDirectory = join(packageRoot, 'src', 'tokens');
const documentationSources = [
  { category: 'components', directory: join(packageRoot, 'docs', 'components') },
  { category: 'patterns', directory: join(packageRoot, 'docs', 'patterns') },
  { category: 'integrations', directory: join(packageRoot, 'docs', 'integrations') },
];
const guideFiles = ['FOUNDATIONS.md', 'JAVASCRIPT.md', 'MCP.md', 'SUPPORT.md', 'RELEASES.md', 'MIGRATIONS.md'];

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

async function loadDocumentationCatalog() {
  const groupedDocuments = await Promise.all(documentationSources.map(async ({ category, directory }) => {
    const filenames = (await readdir(directory)).filter((filename) => filename.endsWith('.md')).sort();
    return Promise.all(filenames.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      const markdown = await readFile(join(directory, filename), 'utf8');

      return {
        category,
        slug,
        title: titleFromMarkdown(markdown, slug),
        description: descriptionFromMarkdown(markdown),
        uri: `nikba://${category}/${slug}`,
        markdown
      };
    }));
  }));
  const guides = await Promise.all(guideFiles.map(async (filename) => {
    const slug = filename.replace(/\.md$/, '').toLowerCase();
    const markdown = await readFile(join(packageRoot, 'docs', filename), 'utf8');
    return { category: 'guides', slug, title: titleFromMarkdown(markdown, slug), description: descriptionFromMarkdown(markdown), uri: `nikba://guides/${slug}`, markdown };
  }));
  return [...groupedDocuments.flat(), ...guides];
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
  const [documents, overview, allTokens, packageMetadata] = await Promise.all([
    loadDocumentationCatalog(),
    readFile(join(packageRoot, 'README.md'), 'utf8'),
    loadTokens('all'),
    readFile(join(packageRoot, 'package.json'), 'utf8').then(JSON.parse)
  ]);
  const components = documents.filter(({ category }) => category === 'components');

  const server = new McpServer({
    name: 'nikba-design-system',
    version: packageMetadata.version
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

  for (const document of documents) {
    server.registerResource(
      `${document.category}-${document.slug}`,
      document.uri,
      {
        ...resourceConfig,
        title: document.title,
        description: document.description
      },
      async (uri) => ({
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: document.markdown }]
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
    'list_documents',
    {
      title: 'List Nikba documentation',
      description: 'List component, pattern, integration, and guide documents with MCP resource URIs.',
      inputSchema: z.object({ category: z.enum(['all', 'components', 'patterns', 'integrations', 'guides']).default('all') }),
      annotations: readOnlyAnnotations
    },
    async ({ category }) => textResult(documents
      .filter((document) => category === 'all' || document.category === category)
      .map(({ category: documentCategory, slug, title, description, uri }) => ({ category: documentCategory, slug, title, description, uri })))
  );

  server.registerTool(
    'get_document',
    {
      title: 'Get Nikba documentation',
      description: 'Return one complete component, pattern, integration, or guide document.',
      inputSchema: z.object({
        category: z.enum(['components', 'patterns', 'integrations', 'guides']),
        slug: z.string().min(1)
      }),
      annotations: readOnlyAnnotations
    },
    async ({ category, slug }) => {
      const document = documents.find((entry) => entry.category === category && entry.slug === slug.trim().toLowerCase());
      return document ? textResult(document.markdown) : toolError(`Unknown ${category} document: ${slug}`);
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
      description: 'Search component, pattern, integration, and guide documents and return relevant excerpts.',
      inputSchema: z.object({
        query: z.string().min(2).describe('Word or phrase to find in component documentation.'),
        limit: z.number().int().min(1).max(10).default(5)
      }),
      annotations: readOnlyAnnotations
    },
    async ({ query, limit }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      const matches = documents
        .map((document) => {
          const searchable = `${document.title}\n${document.description}\n${document.markdown}`.toLowerCase();
          const score = terms.reduce((total, term) => total + searchable.split(term).length - 1, 0);
          const firstIndex = Math.max(0, document.markdown.toLowerCase().indexOf(terms[0]));
          const excerptStart = Math.max(0, firstIndex - 100);
          const excerpt = document.markdown
            .slice(excerptStart, excerptStart + 420)
            .replace(/\s+/g, ' ')
            .trim();

          return { category: document.category, slug: document.slug, title: document.title, uri: document.uri, score, excerpt };
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
            text: `Implement this task with Nikba Design System: ${task}\n\nRead nikba://system/overview, inspect the relevant component and pattern resources, and use published tokens and public APIs. Preserve native semantics, keyboard access, visible focus, and reduced-motion behavior.`
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
