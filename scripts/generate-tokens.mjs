import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = JSON.parse(await readFile(resolve(root, 'src/tokens/foundations.json'), 'utf8'));
if (source.schemaVersion !== 1) throw new Error('Unsupported foundations schema.');
const check = process.argv.includes('--check');
const camel = value => value.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const title = value => value[0].toUpperCase() + value.slice(1);
const generated = '// Generated from src/tokens/foundations.json. Do not edit.\n';
const outputs = new Map();

for (const [name, blocks] of Object.entries(source.web)) {
  outputs.set(`src/tokens/${name}.css`, '/* Generated from foundations.json. Do not edit. */\n' + blocks.map(block =>
    `${block.selector} {\n${Object.entries(block.declarations).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`
  ).join('\n\n') + '\n');
}

// Only opaque semantic colors are portable here; blur and elevation remain web effects.
const themes = source.web.themes.filter(block => block.declarations['color-scheme']);
const palettes = themes.map(block => ({
  name: block.selector.match(/data-theme='(\w+)'/)[1],
  colors: Object.fromEntries(Object.entries(block.declarations)
    .filter(([key, value]) => key.startsWith('--nds-color-') && /^#[0-9a-f]{6}$/i.test(value))
    .map(([key, value]) => [camel(key.slice('--nds-color-'.length)), value.slice(1)])),
}));
const colorNames = Object.keys(palettes[0].colors);
for (const palette of palettes) {
  if (JSON.stringify(Object.keys(palette.colors)) !== JSON.stringify(colorNames)) throw new Error(`Incomplete palette: ${palette.name}`);
}
const primitive = source.web.primitive[0].declarations;
const scales = [
  ['Space', 'space', 'rem', 'dp'], ['Radius', 'radius', 'rem', 'dp'],
  ['ControlHeight', 'control-height', 'rem', 'dp'], ['FontSize', 'font-size', 'rem', 'sp'],
  ['FontWeight', 'font-weight', '', ''], ['Duration', 'duration', 'ms', ''],
  ['Opacity', 'opacity', '', ''],
].map(([name, prefix, unit, kotlinUnit]) => ({ name, kotlinUnit, values: Object.entries(primitive)
  .filter(([key, value]) => key.startsWith(`--nds-${prefix}-`) && (value === '0' || new RegExp(`^\\d+(?:\\.\\d+)?${unit === 'rem' ? '(rem|px)' : unit}$`).test(value)))
  .map(([key, value]) => {
    const suffix = key.slice(`--nds-${prefix}-`.length);
    return [(/^\d/.test(suffix) ? 's' : '') + camel(suffix), parseFloat(value) * (value.endsWith('rem') ? 16 : 1)];
  }),
}));

let swift = generated + 'import SwiftUI\nimport UIKit\n\npublic enum NDSPalette: String, CaseIterable, Sendable {\n';
swift += `    case ${palettes.map(p => p.name).join(', ')}\n`;
for (const key of colorNames) {
  swift += `\n    public var ${key}: UInt32 {\n        switch self {\n`;
  for (const palette of palettes) swift += `        case .${palette.name}: 0x${palette.colors[key]}\n`;
  swift += '        }\n    }\n';
}
swift += '}\n\n// Follows the system appearance: Frost in light mode, Graphite in dark mode.\npublic enum NDSColors {\n';
for (const key of colorNames) swift += `    public static let ${key} = adaptive { $0.${key} }\n`;
swift += `\n    private static func adaptive(_ value: @escaping @Sendable (NDSPalette) -> UInt32) -> Color {
        Color(uiColor: UIColor { traits in
            let hex = value(traits.userInterfaceStyle == .dark ? .graphite : .frost)
            return UIColor(red: CGFloat((hex >> 16) & 0xff) / 255,
                           green: CGFloat((hex >> 8) & 0xff) / 255,
                           blue: CGFloat(hex & 0xff) / 255, alpha: 1)
        })
    }
}
\npublic enum NDSTypography {
    public static let fontName = "Onest-Regular"
    public static func font(_ size: CGFloat = NDSFontSize.md, weight: Font.Weight = .regular, relativeTo style: Font.TextStyle = .body) -> Font {
        #if SWIFT_PACKAGE
        NDSFonts.register()
        #endif
        return .custom(fontName, size: size, relativeTo: style).weight(weight)
    }
}
`;
for (const scale of scales) {
  swift += `\npublic enum NDS${scale.name} {\n`;
  for (const [key, value] of scale.values) swift += `    public static let ${key}: ${['Duration', 'FontWeight'].includes(scale.name) ? 'Int' : 'CGFloat'} = ${value}\n`;
  swift += '}\n';
}
outputs.set('native/ios/NikbaTokens.swift', swift);

let kotlin = generated + `package com.nikba.designsystem

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class NDSPalette(
${colorNames.map(key => `    val ${key}: Color,`).join('\n')}
)

object NDSColors {
`;
for (const palette of palettes) kotlin += `    val ${palette.name} = NDSPalette(\n${colorNames.map(key => `        ${key} = Color(0xff${palette.colors[key]}),`).join('\n')}\n    )\n`;
kotlin += '}\n';
for (const scale of scales) {
  kotlin += `\nobject NDS${scale.name} {\n`;
  for (const [key, value] of scale.values) kotlin += `    ${scale.kotlinUnit ? 'val' : 'const val'} ${key} = ${scale.kotlinUnit ? `${value}.${scale.kotlinUnit}` : scale.name === 'Opacity' ? `${value}f` : value}\n`;
  kotlin += '}\n';
}
outputs.set('native/android/NikbaTokens.kt', kotlin);

// Optional consumer destinations must already exist. No application paths are assumed.
for (const [flag, artifact] of [['--ios-output', 'native/ios/NikbaTokens.swift'], ['--android-output', 'native/android/NikbaTokens.kt']]) {
  const index = process.argv.indexOf(flag);
  if (index < 0) continue;
  const destination = process.argv[index + 1];
  if (!destination || destination.startsWith('--')) throw new Error(`${flag} requires an existing directory.`);
  const { stat } = await import('node:fs/promises');
  if (!(await stat(destination)).isDirectory()) throw new Error(`${destination} is not a directory.`);
  outputs.set(resolve(destination, artifact.split('/').at(-1)), outputs.get(artifact));
}
for (const [path, content] of outputs) {
  const target = resolve(root, path);
  if (check) {
    if (await readFile(target, 'utf8') !== content) throw new Error(`Stale tokens: ${path}. Run npm run tokens:generate.`);
  } else {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
  }
}
console.log(`${check ? 'Checked' : 'Generated'} ${outputs.size} token files (${palettes.map(p => title(p.name)).join(', ')}).`);
