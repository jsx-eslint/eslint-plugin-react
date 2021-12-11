'use strict';

const path = require('path');
const semver = require('semver');
const version = require('eslint/package.json').version;
const flatMap = require('array.prototype.flatmap');
const tsParserVersion = require('@typescript-eslint/parser/package.json').version;

const disableNewTS = semver.satisfies(tsParserVersion, '>= 4.1') // this rule is not useful on v4.1+ of the TS parser
  ? (x) => Object.assign({}, x, { features: [].concat(x.features, 'no-ts-new') })
  : (x) => x;

const NODE_MODULES = '../../node_modules';

const parsers = {
  BABEL_ESLINT: path.join(__dirname, NODE_MODULES, 'babel-eslint'),
  '@BABEL_ESLINT': path.join(__dirname, NODE_MODULES, '@babel/eslint-parser'),
  TYPESCRIPT_ESLINT: path.join(__dirname, NODE_MODULES, 'typescript-eslint-parser'),
  '@TYPESCRIPT_ESLINT': path.join(__dirname, NODE_MODULES, '@typescript-eslint/parser'),
  disableNewTS,
  babelParserOptions: function parserOptions(test, features) {
    return Object.assign({}, test.parserOptions, {
      requireConfigFile: false,
      babelOptions: {
        presets: [
          '@babel/preset-react',
        ],
        plugins: [
          '@babel/plugin-syntax-do-expressions',
          '@babel/plugin-syntax-function-bind',
          ['@babel/plugin-syntax-decorators', { legacy: true }],
        ],
        parserOpts: {
          allowSuperOutsideMethod: false,
          allowReturnOutsideFunction: false,
        },
      },
      ecmaFeatures: Object.assign(
        {},
        test.parserOptions && test.parserOptions.ecmaFeatures,
        {
          jsx: true,
          modules: true,
          legacyDecorators: features.has('decorators'),
        }
      ),
    });
  },
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
        const extras = [].concat(
          `features: [${Array.from(features).join(',')}]`,
          `parser: ${parser}`,
          testObject.parserOptions ? `parserOptions: ${JSON.stringify(testObject.parserOptions)}` : [],
          testObject.options ? `options: ${JSON.stringify(testObject.options)}` : []
        );

        const extraComment = `\n// ${extras.join(', ')}`;

        // Augment expected fix code output with extraComment
        const nextCode = { code: testObject.code + extraComment };
        const nextOutput = testObject.output && { output: testObject.output + extraComment };

        // Augment expected suggestion outputs with extraComment
        // `errors` may be a number (expected number of errors) or an array of
        // error objects.
        const nextErrors = testObject.errors
          && typeof testObject.errors !== 'number'
          && {
            errors: testObject.errors.map(
              (errorObject) => {
                const nextSuggestions = errorObject.suggestions && {
                  suggestions: errorObject.suggestions.map((suggestion) => Object.assign({}, suggestion, {
                    output: suggestion.output + extraComment,
                  })),
                };

                return Object.assign({}, errorObject, nextSuggestions);
              }
            ),
          };

        return Object.assign(
          {},
          testObject,
          nextCode,
          nextOutput,
          nextErrors
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
      const skipOldBabel = skipBabel || features.has('no-babel-old') || semver.satisfies(version, '>= 8');
      const skipNewBabel = skipBabel
        || features.has('no-babel-new')
        || !semver.satisfies(version, '^7.5.0') // require('@babel/eslint-parser/package.json').peerDependencies.eslint
        || features.has('flow')
        || features.has('types')
        || features.has('ts');
      const skipTS = semver.satisfies(version, '< 5')
        || features.has('no-ts')
        || features.has('flow')
        || features.has('jsx namespace')
        || features.has('bind operator')
        || features.has('do expressions');
      const tsOld = !skipTS && !features.has('no-ts-old');
      const tsNew = !skipTS && !features.has('no-ts-new');

      return [].concat(
        skipBase ? [] : addComment(
          Object.assign({}, test, features.has('class fields') && {
            parserOptions: Object.assign({}, test.parserOptions, {
              ecmaVersion: Math.max((test.parserOptions && test.parserOptions.ecmaVersion) || 0, 2022),
            }),
          }),
          'default'
        ),
        skipOldBabel ? [] : addComment(Object.assign({}, test, {
          parser: parsers.BABEL_ESLINT,
          parserOptions: parsers.babelParserOptions(test, features),
        }), 'babel-eslint'),
        skipNewBabel ? [] : addComment(Object.assign({}, test, {
          parser: parsers['@BABEL_ESLINT'],
          parserOptions: parsers.babelParserOptions(test, features),
        }), '@babel/eslint-parser'),
        tsOld ? addComment(Object.assign({}, test, { parser: parsers.TYPESCRIPT_ESLINT }), 'typescript-eslint') : [],
        tsNew ? addComment(Object.assign({}, test, { parser: parsers['@TYPESCRIPT_ESLINT'] }), '@typescript/eslint') : []
      );
    });
    return t;
  },
};

module.exports = parsers;
