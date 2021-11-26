'use strict';

const assert = require('assert');
const eslint = require('eslint');
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
    function testComponentsDetect(test, done) {
      const rule = Components.detect((context, components, util) => ({
        'Program:exit'() {
          done(context, components, util);
        },
      }));

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
      }, (_context, components) => {
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
      }, (_context, components) => {
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
  });
});
