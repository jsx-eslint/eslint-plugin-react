'use strict';

const assert = require('assert');
const entries = require('object.entries');
const eslint = require('eslint');
const fromEntries = require('object.fromentries');
const values = require('object.values');

const Components = require('../../lib/util/Components');
const parsers = require('../helpers/parsers');

const ruleTester = new eslint.RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

describe('Components', () => {
  describe('static detect', () => {
    function testComponentsDetect(test, instructionsOrDone, orDone) {
      const done = orDone || instructionsOrDone;
      const instructions = orDone ? instructionsOrDone : instructionsOrDone;

      const rule = Components.detect((_context, components, util) => {
        const instructionResults = [];

        const augmentedInstructions = fromEntries(
          entries(instructions || {}).map((nodeTypeAndHandler) => {
            const nodeType = nodeTypeAndHandler[0];
            const handler = nodeTypeAndHandler[1];
            return [nodeType, (node) => {
              instructionResults.push({ type: nodeType, result: handler(node, context, components, util) });
            }];
          })
        );

        return Object.assign({}, augmentedInstructions, {
          'Program:exit'(node) {
            if (augmentedInstructions['Program:exit']) {
              augmentedInstructions['Program:exit'](node, context, components, util);
            }
            done(components, instructionResults);
          },
        });
      });

      const tests = {
        valid: parsers.all([Object.assign({}, test, {
          settings: {
            react: {
              version: 'detect',
            },
          },
        })]),
        invalid: [],
      };

      ruleTester.run(test.code, rule, tests);
    }

    it('should detect Stateless Function Component', () => {
      testComponentsDetect({
        code: `import React from 'react'
          function MyStatelessComponent() {
            return <React.Fragment />;
          }`,
      }, (components) => {
        assert.equal(components.length(), 1, 'MyStatelessComponent should be detected component');
        values(components.list()).forEach((component) => {
          assert.equal(
            component.node.id.name,
            'MyStatelessComponent',
            'MyStatelessComponent should be detected component'
          );
        });
      });
    });

    it('should detect Class Components', () => {
      testComponentsDetect({
        code: `import React from 'react'
        class MyClassComponent extends React.Component {
          render() {
            return <React.Fragment />;
          }
        }`,
      }, (components) => {
        assert(components.length() === 1, 'MyClassComponent should be detected component');
        values(components.list()).forEach((component) => {
          assert.equal(
            component.node.id.name,
            'MyClassComponent',
            'MyClassComponent should be detected component'
          );
        });
      });
    });

    it('should detect React Imports', () => {
      testComponentsDetect({
        code: 'import React, { useCallback, useState } from \'react\'',
      }, (components) => {
        assert.deepEqual(
          components.getDefaultReactImports().map((specifier) => specifier.local.name),
          ['React'],
          'default React import identifier should be "React"'
        );

        assert.deepEqual(
          components.getNamedReactImports().map((specifier) => specifier.local.name),
          ['useCallback', 'useState'],
          'named React import identifiers should be "useCallback" and "useState"'
        );
      });
    });

    describe('utils', () => {
      describe('isReactHookCall', () => {
        it('should not identify hook-like call', () => {
          testComponentsDetect({
            code: `import { useRef } from 'react'
            function useColor() {
              return useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should identify hook call', () => {
          testComponentsDetect({
            code: `import { useState } from 'react'
            function useColor() {
              return useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify aliased hook call', () => {
          testComponentsDetect({
            code: `import { useState as useStateAlternative } from 'react'
            function useColor() {
              return useStateAlternative()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify aliased present named hook call', () => {
          testComponentsDetect({
            code: `import { useState as useStateAlternative } from 'react'
            function useColor() {
              return useStateAlternative()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should not identify shadowed hook call', () => {
          testComponentsDetect({
            code: `import { useState } from 'react'
            function useColor() {
              function useState() {
                return null
              }
              return useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should not identify shadowed aliased present named hook call', () => {
          testComponentsDetect({
            code: `import { useState as useStateAlternative } from 'react'
            function useColor() {
              function useStateAlternative() {
                return null
              }
              return useStateAlternative()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should identify React hook call', () => {
          testComponentsDetect({
            code: `import React from 'react'
            function useColor() {
              return React.useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify aliased React hook call', () => {
          testComponentsDetect({
            code: `import ReactAlternative from 'react'
            function useColor() {
              return ReactAlternative.useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should not identify shadowed React hook call', () => {
          testComponentsDetect({
            code: `import React from 'react'
            function useColor() {
              const React = {
                useState: () => null
              }
              return React.useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should identify present named hook call', () => {
          testComponentsDetect({
            code: `import { useState } from 'react'
            function useColor() {
              return useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify present named React hook call', () => {
          testComponentsDetect({
            code: `import React from 'react'
            function useColor() {
              return React.useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should not identify missing named hook call', () => {
          testComponentsDetect({
            code: `import { useState } from 'react'
            function useColor() {
              return useState()
            }`,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useRef']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });
      });
    });

    describe('testComponentsDetect', () => {
      it('should log Program:exit instruction', () => {
        testComponentsDetect({
          code: '',
        }, {
          'Program:exit': () => true,
        }, (_components, instructionResults) => {
          assert.deepEqual(instructionResults, [{ type: 'Program:exit', result: true }]);
        });
      });
    });
  });
});
