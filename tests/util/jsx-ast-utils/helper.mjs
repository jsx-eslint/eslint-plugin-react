// Ported from the tests of jsx-ast-utils (MIT, Copyright (c) 2016 Ethan Cohen), see lib/util/jsx-ast-utils/LICENSE

import { beforeEach } from 'vitest';
import { createRequire } from 'node:module';

import getPropModule from '../../../lib/util/jsx-ast-utils/getProp.js';

const require = createRequire(import.meta.url);
const babelParser = require('@babel/parser');
const flowParser = require('flow-parser');

const getProp = getPropModule.default;

let parserName;

const defaultPlugins = [
  'jsx',
  'functionBind',
  'estree',
  'objectRestSpread',
  'optionalChaining',
];
let plugins = [...defaultPlugins];
let isESM = false;

export function setParserName(name) {
  parserName = name;
}

export function changePlugins(pluginOrFn) {
  if (Array.isArray(pluginOrFn)) {
    plugins = pluginOrFn;
  } else if (typeof pluginOrFn === 'function') {
    plugins = pluginOrFn(plugins);
  } else {
    throw new Error('changePlugins argument should be either an array or a function');
  }
}

export function setIsESM() {
  isESM = true;
}

beforeEach(() => {
  plugins = [...defaultPlugins];
  isESM = false;
});

function parse(code) {
  if (parserName === undefined) {
    throw new Error('No parser specified');
  }
  if (parserName === 'babel') {
    try {
      return babelParser.parse(code, { plugins, sourceFilename: 'test.js', ...(isESM && { sourceType: 'module' }) });
    } catch {
      console.warn('Failed to parse with Babel parser.');
    }
  }
  if (parserName === 'flow') {
    try {
      return flowParser.parse(code, { plugins });
    } catch {
      console.warn('Failed to parse with the Flow parser');
    }
  }
  throw new Error(`The parser ${parserName} is not yet supported for testing.`);
}

export function getOpeningElement(code) {
  const parsedCode = parse(code);
  const body = parsedCode.program ? parsedCode.program.body : parsedCode.body;
  if (Array.isArray(body) && body[0] != null) {
    const [{ expression }] = body;
    return expression.type === 'JSXFragment' ? expression.openingFragment : expression.openingElement;
  }

  return null;
}

export function extractProp(code, prop = 'foo') {
  const node = getOpeningElement(code);
  const { attributes: props } = node;
  return getProp(props, prop);
}
