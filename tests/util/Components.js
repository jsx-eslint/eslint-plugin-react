'use strict';

const assert = require('assert');
const entries = require('object.entries');
const fromEntries = require('object.fromentries');
const values = require('object.values');

const Linter = require('eslint').Linter;

const Components = require('../../lib/util/Components');
const parsers = require('../helpers/parsers');

const linter = new Linter();

// Runs `rule` on every parser variant of `test` synchronously (RuleTester can not be used inside `it`)
function runRule(test, rule) {
  parsers.all([test]).forEach((variant) => {
    const languageOptions = {
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: Object.assign({ ecmaFeatures: { jsx: true } }, variant.parserOptions),
    };
    if (variant.parser) {
      languageOptions.parser = require(variant.parser); // eslint-disable-line global-require
    }
    const messages = linter.verify(variant.code, {
      plugins: { test: { rules: { detect: rule } } },
      rules: { 'test/detect': 'error' },
      languageOptions,
      settings: { react: { version: 'detect' } },
    });
    const fatal = messages.filter((message) => message.fatal);
    assert.deepEqual(fatal, [], 'should parse without errors');
  });
}

describe('Components', () => {
  describe('static detect', () => {
    function testComponentsDetect(test, instructionsOrDone, orDone) {
      const done = orDone || instructionsOrDone;
      const instructions = orDone ? instructionsOrDone : instructionsOrDone;

      const rule = {
        create: Components.detect((context, components, util) => {
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
        }),
      };

      runRule(test, rule);
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
            code: `
              import { useRef } from 'react'
              function useColor() {
                return useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should identify hook call', () => {
          testComponentsDetect({
            code: `
              import { useState } from 'react'
              function useColor() {
                return useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify aliased hook call', () => {
          testComponentsDetect({
            code: `
              import { useState as useStateAlternative } from 'react'
              function useColor() {
                return useStateAlternative()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify aliased present named hook call', () => {
          testComponentsDetect({
            code: `
              import { useState as useStateAlternative } from 'react'
              function useColor() {
                return useStateAlternative()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should not identify shadowed hook call', () => {
          testComponentsDetect({
            code: `
              import { useState } from 'react'
              function useColor() {
                function useState() {
                  return null
                }
                return useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should not identify shadowed aliased present named hook call', () => {
          testComponentsDetect({
            code: `
              import { useState as useStateAlternative } from 'react'
              function useColor() {
                function useStateAlternative() {
                  return null
                }
                return useStateAlternative()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should identify React hook call', () => {
          testComponentsDetect({
            code: `
              import React from 'react'
              function useColor() {
                return React.useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify aliased React hook call', () => {
          testComponentsDetect({
            code: `
              import ReactAlternative from 'react'
              function useColor() {
                return ReactAlternative.useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should not identify shadowed React hook call', () => {
          testComponentsDetect({
            code: `
              import React from 'react'
              function useColor() {
                const React = {
                  useState: () => null
                }
                return React.useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });

        it('should identify present named hook call', () => {
          testComponentsDetect({
            code: `
              import { useState } from 'react'
              function useColor() {
                return useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should identify present named React hook call', () => {
          testComponentsDetect({
            code: `
              import React from 'react'
              function useColor() {
                return React.useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useState']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: true }]);
          });
        });

        it('should not identify missing named hook call', () => {
          testComponentsDetect({
            code: `
              import { useState } from 'react'
              function useColor() {
                return useState()
              }
            `,
          }, {
            CallExpression: (node, _context, _components, util) => util.isReactHookCall(node, ['useRef']),
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'CallExpression', result: false }]);
          });
        });
      });

      describe('getWrappedComponentNode', () => {
        // the type of the node wrapped by the last variable declaration's initializer
        function testWrappedType(code, expectedType) {
          testComponentsDetect({ code }, {
            'Program:exit': (node, _context, _components, util) => {
              const lastStatement = node.body[node.body.length - 1];
              return util.getWrappedComponentNode(lastStatement.declarations[0].init).type;
            },
          }, (_components, instructionResults) => {
            assert.deepEqual(instructionResults, [{ type: 'Program:exit', result: expectedType }]);
          });
        }

        it('should unwrap memo', () => {
          testWrappedType(`
            import React from 'react'
            const Hello = React.memo(() => <div />)
          `, 'ArrowFunctionExpression');
        });

        it('should unwrap nested memo and forwardRef', () => {
          testWrappedType(`
            import React from 'react'
            const Hello = React.memo(React.forwardRef((props, ref) => <div ref={ref} />))
          `, 'ArrowFunctionExpression');
        });

        it('should unwrap a destructured memo', () => {
          testWrappedType(`
            import { memo } from 'react'
            const Hello = memo(function Hello() { return <div /> })
          `, 'FunctionExpression');
        });

        it('should not unwrap other calls', () => {
          testWrappedType(`
            import React from 'react'
            const Hello = withStyles(styles)(() => <div />)
          `, 'CallExpression');
        });

        it('should not unwrap a wrapper without arguments', () => {
          testWrappedType(`
            import React from 'react'
            const Hello = React.memo()
          `, 'CallExpression');
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
