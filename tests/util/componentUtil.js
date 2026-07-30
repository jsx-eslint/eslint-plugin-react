'use strict';

const assert = require('assert');
const componentUtil = require('../../lib/util/componentUtil');

const isExplicitComponent = componentUtil.isExplicitComponent;

describe('componentUtil', () => {
  describe('isExplicitComponent', () => {
    it('should return true for node with @extends React.Component and fallback getJSDocComment', () => {
      const node = { type: 'ClassDeclaration', id: { name: 'MyComponent' } };
      
      const mockComment = {
        type: 'Block',
        value: '*\n * @extends React.Component\n ',
      };

      const mockSourceCode = {
        getJSDocComment: undefined, // Force fallback path
        getCommentsBefore(n) {
          assert.equal(n, node);
          return [mockComment];
        }
      };

      const mockContext = {
        getSourceCode() {
          return mockSourceCode;
        }
      };

      assert.equal(isExplicitComponent(node, mockContext), true);
    });

    it('should return false if no JSDoc comment in fallback getJSDocComment', () => {
      const node = { type: 'ClassDeclaration', id: { name: 'MyComponent' } };
      const mockSourceCode = {
        getJSDocComment: undefined,
        getCommentsBefore() {
          return [{ type: 'Line', value: ' just a line comment' }];
        }
      };
      const mockContext = {
        getSourceCode: () => mockSourceCode
      };
      assert.equal(isExplicitComponent(node, mockContext), false);
    });
    
    it('should return false if block comment does not start with * in fallback getJSDocComment', () => {
      const node = { type: 'ClassDeclaration', id: { name: 'MyComponent' } };
      const mockSourceCode = {
        getJSDocComment: undefined,
        getCommentsBefore() {
          return [{ type: 'Block', value: ' Not a jsdoc comment ' }];
        }
      };
      const mockContext = {
        getSourceCode: () => mockSourceCode
      };
      assert.equal(isExplicitComponent(node, mockContext), false);
    });
  });
});
