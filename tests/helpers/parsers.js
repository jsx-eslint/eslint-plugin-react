'use strict';

const entries = require('object.entries');
const flatMap = require('array.prototype.flatmap');

// this rule is not useful on v4.1+ of the TS parser
const disableNewTS = (x) => Object.assign({}, x, { features: [].concat(x.features, 'no-ts-new') });

function minEcmaVersion(features, parserOptions) {
  const minEcmaVersionForFeatures = {
    'class fields': 2022,
    'optional chaining': 2020,
    'nullish coalescing': 2020,
  };
  const result = Math.max.apply(
    Math,
    [].concat(
      (parserOptions && parserOptions.ecmaVersion) || [],
      flatMap(entries(minEcmaVersionForFeatures), (entry) => {
        const f = entry[0];
        const y = entry[1];
        return features.has(f) ? y : [];
      })
    ).map((y) => (y > 5 && y < 2015 ? y + 2009 : y)) // normalize editions to years
  );
  return Number.isFinite(result) ? result : undefined;
}

const parsers = {
  '@TYPESCRIPT_ESLINT': require.resolve('@typescript-eslint/parser'),
  disableNewTS,
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

      const es = minEcmaVersion(features, test.parserOptions);

      function addComment(testObject, parser) {
        const extras = [].concat(
          `features: [${Array.from(features).join(',')}]`,
          `parser: ${parser}`,
          testObject.parserOptions ? `parserOptions: ${JSON.stringify(testObject.parserOptions)}` : [],
          testObject.options ? `options: ${JSON.stringify(testObject.options)}` : [],
          testObject.settings ? `settings: ${JSON.stringify(testObject.settings)}` : []
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
                const nextSuggestions = errorObject.suggestions && typeof errorObject.suggestions !== 'number' && {
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

      const skipBase = features.has('no-default')
        || features.has('decorators')
        || features.has('ts')
        || features.has('types');

      const skipTS = features.has('no-ts')
        || features.has('jsx namespace');
      const tsNew = !skipTS && !features.has('no-ts-new');

      return [].concat(
        skipBase ? [] : addComment(
          Object.assign({}, test, typeof es === 'number' && {
            parserOptions: Object.assign({}, test.parserOptions, { ecmaVersion: es }),
          }),
          'default'
        ),
        tsNew ? addComment(Object.assign({}, test, { parser: parsers['@TYPESCRIPT_ESLINT'] }), '@typescript-eslint/parser') : []
      );
    });

    return t;
  },
};

module.exports = parsers;
