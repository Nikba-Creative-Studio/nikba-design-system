import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

// All source paths come from the packaged manifest, never from a tool's path input.
export async function loadNativeCatalog(root, webVersion) {
  const manifestText = await readFile(join(root, 'native/manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestText);
  if (manifest.schemaVersion !== 1) throw new Error('Unsupported native manifest.');
  const packageSource = await readFile(join(root, 'Package.swift'), 'utf8');
  const sources = {};
  const examples = {};
  for (const [platform, config] of Object.entries(manifest.platforms)) {
    sources[platform] = {};
    for (const [kind, path] of Object.entries(config.sources)) sources[platform][kind] = await readFile(join(root, path), 'utf8');
    examples[platform] = await readFile(join(root, config.example), 'utf8');
  }
  const font = await readFile(join(root, 'native/ios/Resources/Onest.ttf'));
  const fingerprint = createHash('sha256').update(JSON.stringify({ manifestText, packageSource, sources, examples }))
    .update(font).digest('hex');
  const metadata = { webVersion, nativeVersion: manifest.nativeVersion, status: manifest.status, releaseStatus: manifest.releaseStatus, releaseTag: manifest.releaseTag, sourceFingerprint: fingerprint };
  const uri = (platform, kind) => `nikba://native/${platform}/source/${kind}`;
  const language = platform => platform === 'ios' ? 'swift' : 'kotlin';
  const mimeType = platform => platform === 'ios' ? 'text/x-swift' : 'text/x-kotlin';
  const canonical = slug => Object.hasOwn(manifest.aliases, slug) ? manifest.aliases[slug] : slug;

  function signatures(source, platform, symbol) {
    let block = source;
    let pattern = new RegExp(`fun ${symbol}\\(`, 'g');
    if (platform === 'ios') {
      const start = source.indexOf(`public struct ${symbol}`);
      if (start < 0) throw new Error(`Missing native symbol: ${symbol}`);
      block = source.slice(start, source.indexOf('\n}', start) + 2);
      const extensionStart = source.indexOf(`extension ${symbol} where`);
      if (extensionStart >= 0) block += '\n' + source.slice(extensionStart, source.indexOf('\n}', extensionStart) + 2);
      pattern = /public init\(/g;
    }
    const result = [];
    for (const match of block.matchAll(pattern)) {
      let cursor = match.index + match[0].length;
      let depth = 1;
      while (cursor < block.length && depth > 0) {
        if (block[cursor] === '(') depth++;
        if (block[cursor] === ')') depth--;
        cursor++;
      }
      if (depth !== 0) throw new Error(`Unbalanced API declaration: ${symbol}`);
      result.push(block.slice(match.index, cursor));
    }
    if (!result.length) throw new Error(`Missing API declaration: ${symbol}`);
    return result;
  }

  function getComponent(platform, requestedSlug) {
    const slug = canonical(requestedSlug.trim().toLowerCase());
    const component = manifest.components.find(entry => entry.slug === slug);
    if (!component) return {
      ...metadata, platform, slug, available: false,
      reason: 'No Nikba native component with this slug is shipped for this platform.',
      fallback: Object.hasOwn(manifest.fallbacks[platform], slug) ? manifest.fallbacks[platform][slug] : 'Use the platform control with Nikba colors and typography; keep its native semantics.',
      guidance: 'Do not invent an NDS API or port an HTML/CSS contract to SwiftUI or Compose.',
    };
    const marker = `// example:${slug}:`;
    const example = examples[platform].split(`${marker}start`)[1]?.split(`${marker}end`)[0];
    if (!example) throw new Error(`Missing compiled example: ${platform}/${slug}`);
    return {
      ...metadata, platform, available: true, slug, title: component.title, symbol: component.symbol,
      description: component.description, states: component.states, variants: component.variants?.[platform] ?? [],
      imports: platform === 'ios' ? ['SwiftUI', 'NikbaDesignSystem'] : ['androidx.compose.material3.*', 'com.nikba.designsystem.*'],
      api: signatures(sources[platform].components, platform, component.symbol), guidance: component.guidance,
      uri: `nikba://native/${platform}/components/${slug}`, sourceUri: uri(platform, 'components'),
      example: {
        language: language(platform), code: example.replace(/^\s*\/\/ example:.*$/gm, '').trim(),
        context: 'Excerpt from the complete FirstScreen example; its state, bindings and imports are declared there.',
        contextUri: uri(platform, 'example'),
        validationCommand: platform === 'ios' ? 'npm run test:native:ios' : 'npm run test:native:android -- --gradle-command /absolute/path/to/gradle-8.11.1/bin/gradle',
      },
    };
  }

  function getSource(platform, kind) {
    const text = kind === 'example' ? examples[platform] : kind === 'manifest' ? manifestText
      : kind === 'package' && platform === 'ios' ? packageSource : sources[platform][kind];
    if (!text) return { ...metadata, platform, kind, available: false, reason: `No ${kind} source is shipped for ${platform}.` };
    return { ...metadata, platform, kind, available: true, language: kind === 'manifest' ? 'json' : language(platform), uri: uri(platform, kind), source: text };
  }

  function installation(platform) {
    const config = manifest.platforms[platform];
    return {
      ...metadata, platform, ...config, repository: manifest.repository,
      packagePath: platform === 'ios' ? root : undefined,
      swiftPackage: platform === 'ios' ? { url: manifest.repository, exactVersion: webVersion, tag: manifest.releaseTag, product: 'NikbaDesignSystem' } : undefined,
      releaseNote: `Release ${webVersion} includes published native pilot APIs. Use ${manifest.releaseTag} for SwiftPM; v1.0.0 is web-only. Native APIs remain experimental.`,
      steps: platform === 'ios' ? [
        `In Xcode choose Add Package Dependencies, enter ${manifest.repository}, and select Exact Version ${webVersion}.`,
        `For local development, choose Add Local and select ${root}; this path belongs to the machine running the MCP server.`,
        'Link the NikbaDesignSystem product to the iOS app target (iOS 17+, Swift 6).',
        'Import SwiftUI and NikbaDesignSystem. NDSTypography.font registers the bundled Onest font automatically; NDSFonts.register() is also available.',
        `Read ${uri(platform, 'example')} for the complete first screen. Use system Frost/Graphite colors and retain Dynamic Type.`,
        'Use SwiftUI NavigationStack, TabView, Picker and sheet for platform-owned navigation and controls not supplied by Nikba.',
        'Build for an iOS simulator; test appearance, large text, focus, disabled/loading actions, validation and recovery. Perform manual VoiceOver review before release.',
        `For a SwiftPM manifest use .package(url: "${manifest.repository}", exact: "${webVersion}") and link the NikbaDesignSystem product.`,
      ] : [
        'Use an existing Compose UI/Foundation/Material3 project, including tooling-preview for the source previews.',
        'Copy NikbaTokens.kt and NikbaComponents.kt into an app source set; import com.nikba.designsystem.*.',
        'Bundle Onest in the app and map typography and color roles in its MaterialTheme. An Android library artifact is not published.',
        `Read ${uri(platform, 'example')} for a complete composable using the five native components.`,
        'Use platform navigation and unsupported controls with Nikba tokens. Validate TalkBack and large text before release.',
      ],
      sourceUris: Object.keys(config.sources).map(kind => uri(platform, kind)),
      exampleUri: uri(platform, 'example'), guideUri: `nikba://guides/${config.guide}`,
    };
  }

  const documents = [];
  const resources = [];
  for (const platform of Object.keys(manifest.platforms)) {
    for (const component of manifest.components) {
      const contract = getComponent(platform, component.slug);
      documents.push({ platform, category: 'components', slug: component.slug, title: `${component.title} (${platform})`,
        description: component.description, uri: contract.uri,
        markdown: `# ${component.title} — ${platform}\n\n${component.description}\n\nNative version: ${metadata.nativeVersion} (${metadata.status}, ${metadata.releaseStatus}).\n\n## API\n\n${contract.api.map(api => `\`\`\`${language(platform)}\n${api}\n\`\`\``).join('\n\n')}\n\n${contract.guidance}\n\n## Example\n\n${contract.example.context}\n\n\`\`\`${language(platform)}\n${contract.example.code}\n\`\`\`\n\nFull context: ${contract.example.contextUri}\nSource: ${contract.sourceUri}\n`,
      });
    }
    for (const kind of [...Object.keys(manifest.platforms[platform].sources), 'example', 'manifest', ...(platform === 'ios' ? ['package'] : [])]) {
      const source = getSource(platform, kind);
      resources.push({ uri: source.uri, title: `Nikba ${platform} ${kind} source`,
        mimeType: kind === 'manifest' ? 'application/json' : mimeType(platform), text: source.source });
    }
  }

  return {
    metadata, documents, resources, getComponent, getSource, installation,
    listComponents: platform => manifest.components.map(component => {
      const { slug, title, description, uri, symbol, status, nativeVersion } = getComponent(platform, component.slug);
      return { slug, title, description, uri, symbol, platform, status, nativeVersion, available: true };
    }),
    capabilities: platform => ({ ...metadata, platforms: Object.fromEntries(Object.entries(manifest.platforms)
      .filter(([name]) => platform === 'all' || name === platform)
      .map(([name, config]) => [name, { ...config, components: manifest.components.map(c => c.slug), available: true,
        themes: ['frost', 'mist', 'graphite'], componentAppearance: 'system Frost/Graphite; Mist is raw palette tokens only' }])) }),
  };
}
