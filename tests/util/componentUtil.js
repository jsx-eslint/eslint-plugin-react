'use strict';

const assert = require('assert'); // NOSONAR - `node:assert` requires Node 14.18+; engine floor is Node >=6. Pattern is consistent across all test files.
const componentUtil = require('../../lib/util/componentUtil');

const isExplicitComponent = componentUtil.isExplicitComponent;


/**
 * Helper to build a minimal AST node stub with `loc` and `parent` properties.
 */
function makeNode(type, parentType, parentParentType) {
  const node = {
    type,
    loc: { start: { line: 10 } }, // default: adjacent (gap = 0)
    parent: null,
  };

  if (parentType) {
    const parent = { type: parentType, parent: null };
    if (parentParentType) {
      parent.parent = { type: parentParentType, parent: null };
    }
    node.parent = parent;
  }

  return node;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared JSDoc comment token factories
// ─────────────────────────────────────────────────────────────────────────────
const REACT_COMPONENT_JSDOC = {
  type: 'Block',
  value: '*\n * @extends React.Component\n ',
};
const NOT_JSDOC = {
  type: 'Block',
  value: ' Not a JSDoc comment ',
};
const LINE_COMMENT = {
  type: 'Line',
  value: ' just a line comment',
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock context helper
// ─────────────────────────────────────────────────────────────────────────────
function makeContext(sourceCode) {
  return {
    getSourceCode() { return sourceCode; },
    // ESLint 9 flat-config compat shim
    sourceCode,
  };
}

// =============================================================================
describe('componentUtil', () => {
  describe('isExplicitComponent', () => {

    // ─── ESLint 9 path (getJSDocComment is available) ──────────────────────
    describe('ESLint 9 path (getJSDocComment available)', () => {
      it('returns true when getJSDocComment returns a valid @extends comment', () => {
        const node = makeNode('ClassDeclaration');
        const mockSourceCode = {
          getJSDocComment() {
            return REACT_COMPONENT_JSDOC;
          },
        };
        assert.equal(isExplicitComponent(node, makeContext(mockSourceCode)), true);
      });

      it('returns false when getJSDocComment returns null', () => {
        const node = makeNode('ClassDeclaration');
        const mockSourceCode = {
          getJSDocComment() { return null; },
        };
        assert.equal(isExplicitComponent(node, makeContext(mockSourceCode)), false);
      });

      it('returns false when getJSDocComment throws', () => {
        const node = makeNode('ClassDeclaration');
        const mockSourceCode = {
          getJSDocComment() { throw new Error('not yet parsed'); },
        };
        assert.equal(isExplicitComponent(node, makeContext(mockSourceCode)), false);
      });
    });

    // ─── ESLint 10+ fallback path ───────────────────────────────────────────
    describe('ESLint 10+ fallback (getJSDocComment absent)', () => {

      // ── ClassDeclaration (plain) ──────────────────────────────────────────
      describe('ClassDeclaration', () => {
        it('returns true when JSDoc is directly adjacent (gap = 0 lines)', () => {
          const node = makeNode('ClassDeclaration');
          node.loc = { start: { line: 11 } }; // tokenBefore.loc.end.line will be 10 → gap = 1

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() {
              return {
                type: 'Block',
                value: '* @extends React.Component\n ',
                loc: { end: { line: 10 } },
              };
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), true);
        });

        it('returns false when JSDoc is separated by a blank line (gap = 2)', () => {
          const node = makeNode('ClassDeclaration');
          node.loc = { start: { line: 13 } }; // tokenBefore.loc.end.line = 10 → gap = 3

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() {
              return {
                type: 'Block',
                value: '* @extends React.Component\n ',
                loc: { end: { line: 10 } },
              };
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), false);
        });

        it('returns false when token before is a line comment (not Block)', () => {
          const node = makeNode('ClassDeclaration');
          node.loc = { start: { line: 11 } };

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() {
              return {
                type: 'Line',
                value: ' intervening line comment',
                loc: { end: { line: 10 } },
              };
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), false);
        });

        it('returns false when block comment does not start with *', () => {
          const node = makeNode('ClassDeclaration');
          node.loc = { start: { line: 11 } };

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() {
              return {
                type: 'Block',
                value: ' not a jsdoc comment ',
                loc: { end: { line: 10 } },
              };
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), false);
        });

        it('returns false when there is no token before the node', () => {
          const node = makeNode('ClassDeclaration');
          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() { return null; },
            getCommentsBefore() { return []; },
          };
          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), false);
        });
      });

      // ── Exported ClassDeclaration ─────────────────────────────────────────
      describe('exported ClassDeclaration', () => {
        it('returns true when JSDoc is adjacent to ExportNamedDeclaration (not to class node)', () => {
          // Simulates: /** @extends React.Component */
          //            export class Exported {}
          //
          // The class node has no comment directly before it (the export does),
          // so the fallback must remap to parent (ExportNamedDeclaration).
          const exportNode = {
            type: 'ExportNamedDeclaration',
            loc: { start: { line: 11 } },
            parent: null,
          };
          const node = makeNode('ClassDeclaration');
          node.loc = { start: { line: 11 } };
          node.parent = exportNode;

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore(target) {
              // Only the export node has an adjacent JSDoc; the class node itself has none.
              if (target === exportNode || target.type === 'ExportNamedDeclaration') {
                return {
                  type: 'Block',
                  value: '* @extends React.Component\n ',
                  loc: { end: { line: 10 } },
                };
              }
              return null;
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), true);
        });

        it('returns true when JSDoc is adjacent to ExportDefaultDeclaration', () => {
          const exportNode = {
            type: 'ExportDefaultDeclaration',
            loc: { start: { line: 11 } },
            parent: null,
          };
          const node = makeNode('ClassDeclaration');
          node.loc = { start: { line: 11 } };
          node.parent = exportNode;

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore(target) {
              if (target.type === 'ExportDefaultDeclaration') {
                return {
                  type: 'Block',
                  value: '* @extends React.Component\n ',
                  loc: { end: { line: 10 } },
                };
              }
              return null;
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), true);
        });

        it('returns false when JSDoc is adjacent to export but has blank-line gap', () => {
          const exportNode = {
            type: 'ExportNamedDeclaration',
            loc: { start: { line: 14 } }, // gap = 4 lines
            parent: null,
          };
          const node = makeNode('ClassDeclaration');
          node.loc = { start: { line: 14 } };
          node.parent = exportNode;

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() {
              return {
                type: 'Block',
                value: '* @extends React.Component\n ',
                loc: { end: { line: 10 } },
              };
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), false);
        });
      });

      // ── ClassExpression ───────────────────────────────────────────────────
      describe('ClassExpression', () => {
        it('returns true when JSDoc is adjacent to VariableDeclaration (parent.parent)', () => {
          // Simulates: /** @extends React.Component */
          //            const Expression = class {}
          const varDecl = {
            type: 'VariableDeclaration',
            loc: { start: { line: 11 } },
            parent: null,
          };
          const varDeclarator = { type: 'VariableDeclarator', parent: varDecl };
          const node = makeNode('ClassExpression');
          node.parent = varDeclarator;
          node.loc = { start: { line: 11 } };

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore(target) {
              if (target === varDecl || target.type === 'VariableDeclaration') {
                return {
                  type: 'Block',
                  value: '* @extends React.Component\n ',
                  loc: { end: { line: 10 } },
                };
              }
              return null;
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), true);
        });

        it('returns false when JSDoc adjacent to VariableDeclaration but separated by blank line', () => {
          const varDecl = {
            type: 'VariableDeclaration',
            loc: { start: { line: 15 } },
            parent: null,
          };
          const varDeclarator = { type: 'VariableDeclarator', parent: varDecl };
          const node = makeNode('ClassExpression');
          node.parent = varDeclarator;
          node.loc = { start: { line: 15 } };

          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() {
              return {
                type: 'Block',
                value: '* @extends React.Component\n ',
                loc: { end: { line: 10 } }, // gap = 5
              };
            },
            getCommentsBefore() { return []; },
          };

          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), false);
        });
      });

      // ── Unknown / default node type ───────────────────────────────────────
      describe('unknown node type', () => {
        it('returns false for node types not handled by the switch', () => {
          const node = makeNode('Identifier');
          const sourceCode = {
            getJSDocComment: undefined,
            getTokenBefore() {
              return {
                type: 'Block',
                value: '* @extends React.Component\n ',
                loc: { end: { line: 10 } },
              };
            },
            getCommentsBefore() { return []; },
          };

          // Even though a JSDoc is adjacent, Identifier is not a handled case
          assert.equal(isExplicitComponent(node, makeContext(sourceCode)), false);
        });
      });

    }); // ESLint 10+ fallback

  }); // isExplicitComponent
}); // componentUtil
