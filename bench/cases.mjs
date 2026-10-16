// The lint workloads shared by the benchmarks: each shareable config of a plugin over the fixtures in `fixtures/`.

import fs from 'node:fs';
import path from 'node:path';

import tsParser from '@typescript-eslint/parser';

const fixturesDir = path.join(import.meta.dirname, 'fixtures');

function readFixtures(extension) {
  return fs.readdirSync(fixturesDir)
    .filter((file) => file.endsWith(extension))
    .map((file) => ({ filename: file, code: fs.readFileSync(path.join(fixturesDir, file), 'utf8') }));
}

const jsxFixtures = readFixtures('.jsx');
const tsxFixtures = readFixtures('.tsx');

function makeConfig(shareableConfig, files, parser) {
  return [{
    ...shareableConfig,
    files,
    languageOptions: {
      ...shareableConfig.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      ...(parser && { parser }),
    },
    settings: { react: { version: '19.0' } },
  }];
}

/**
 * @param {{ configs: { flat: Record<string, object> } }} plugin eslint-plugin-react, or this fork
 * @returns {{ name: string, fixtures: { filename: string, code: string }[], config: object[] }[]}
 */
export function cases(plugin) {
  return [
    { name: 'recommended', fixtures: jsxFixtures, config: makeConfig(plugin.configs.flat.recommended, ['**/*.jsx']) },
    { name: 'all', fixtures: jsxFixtures, config: makeConfig(plugin.configs.flat.all, ['**/*.jsx']) },
    { name: 'all-typescript', fixtures: tsxFixtures, config: makeConfig(plugin.configs.flat.all, ['**/*.tsx'], tsParser) },
  ];
}
