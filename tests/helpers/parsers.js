'use strict';

const path = require('path');
const semver = require('semver');
const version = require('eslint/package.json').version;
const flatMap = require('array.prototype.flatmap');

const NODE_MODULES = '../../node_modules';

const parsers = {
  BABEL_ESLINT: path.join(__dirname, NODE_MODULES, 'babel-eslint'),
  TYPESCRIPT_ESLINT: path.join(__dirname, NODE_MODULES, 'typescript-eslint-parser'),
  '@TYPESCRIPT_ESLINT': path.join(__dirname, NODE_MODULES, '@typescript-eslint/parser'),
  all: function all(tests) {
    const t = flatMap(tests, (test) => {
      if (typeof test === 'string') {
        test = { code: test };
      }
      if ('parser' in test) {
        delete test.features;
        return test;
      }
      const features = new Set([].concat(test.features || []));
      delete test.features;
      const es = test.parserOptions && test.parserOptions.ecmaVersion;

      function addComment(testObject, parser) {
        const extraComment = `\n// features: [${Array.from(features).join(',')}], parser: ${parser}`;
        return Object.assign(
          {},
          testObject,
          { code: testObject.code + extraComment },
          testObject.output && { output: testObject.output + extraComment }
        );
      }

      const skipBase = (features.has('class fields') && semver.satisfies(version, '< 8'))
        || (es >= 2020 && semver.satisfies(version, '< 6'))
        || features.has('no-default')
        || features.has('bind operator')
        || features.has('do expressions')
        || features.has('decorators')
        || features.has('flow')
        || features.has('ts')
        || features.has('types')
        || (features.has('fragment') && semver.satisfies(version, '< 5'));

      const skipBabel = features.has('no-babel');
      const skipTS = semver.satisfies(version, '< 5')
        || features.has('flow')
        || features.has('no-ts')
        || features.has('jsx namespace')
        || features.has('bind operator')
        || features.has('do expressions');
      const tsOld = !skipTS && !features.has('no-ts-old');
      const tsNew = !skipTS && !features.has('no-ts-new');

      return [].concat(
        skipBase ? [] : addComment(test, 'default'),
        skipBabel ? [] : addComment(Object.assign({}, test, { parser: parsers.BABEL_ESLINT }), 'babel-eslint'),
        tsOld ? addComment(Object.assign({}, test, { parser: parsers.TYPESCRIPT_ESLINT }), 'typescript-eslint') : [],
        tsNew ? addComment(Object.assign({}, test, { parser: parsers['@TYPESCRIPT_ESLINT'] }), '@typescript/eslint') : []
      );
    });
    return t;
  },
};

module.exports = parsers;
