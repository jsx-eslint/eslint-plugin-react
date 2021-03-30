/**
 * @fileoverview Validate JSX maximum depth
 * @author Chris<wfsr@foxmail.com>
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-max-depth');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  sourceType: 'module',
  ecmaVersion: 2015,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-max-depth', rule, {
  valid: [{
    code: [
      '<App />'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  <foo />',
      '</App>'
    ].join('\n'),
    options: [{max: 1}]
  }, {
    code: [
      '<App>',
      '  <foo>',
      '    <bar />',
      '  </foo>',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  <foo>',
      '    <bar />',
      '  </foo>',
      '</App>'
    ].join('\n'),
    options: [{max: 2}]
  }, {
    code: [
      'const x = <div><em>x</em></div>;',
      '<div>{x}</div>'
    ].join('\n'),
    options: [{max: 2}]
  }, {
    code: 'const foo = (x) => <div><em>{x}</em></div>;',
    options: [{max: 2}]
  }, {
    code: [
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<>',
      '  <foo />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 1}]
  }, {
    code: [
      'const x = <><em>x</em></>;',
      '<>{x}</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 2}]
  }, {
    code: `
      const x = (
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
      );
      <tbody>
        {x}
      </tbody>
    `,
    options: [{max: 2}]
  }, {
    code: [
      'const Example = props => {',
      '  for (let i = 0; i < length; i++) {',
      '    return <Text key={i} />;',
      '  }',
      '};'
    ].join('\n'),
    options: [{max: 1}]
  }, {
    code: [
      'export function MyComponent() {',
      '  const A = <React.Fragment>{<div />}</React.Fragment>;',
      '  return <div>{A}</div>;',
      '}'
    ].join('\n')
  }, {
    // Validates circular references don't get rule stuck
    code: `
      function Component() {
        let first = "";
        const second = first;
        first = second;
        return <div id={first} />;
      };
    `
  },
  {
    // Validates circular references are checked at multiple levels
    code: `
      function Component() {
        let first = "";
        let second = "";
        let third = "";
        let fourth = "";
        const fifth = first;
        first = second;
        second = third;
        third = fourth;
        fourth = fifth;
        return <div id={first} />;
      };
    `
  }],

  invalid: [{
    code: [
      '<App>',
      '  <foo />',
      '</App>'
    ].join('\n'),
    options: [{max: 0}],
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 0, found: 1}
    }]
  }, {
    code: [
      '<App>',
      '  <foo>{bar}</foo>',
      '</App>'
    ].join('\n'),
    options: [{max: 0}],
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 0, found: 1}
    }]
  }, {
    code: [
      '<App>',
      '  <foo>',
      '    <bar />',
      '  </foo>',
      '</App>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 1, found: 2}
    }]
  }, {
    code: [
      'const x = <div><span /></div>;',
      '<div>{x}</div>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 1, found: 2}
    }]
  }, {
    code: [
      'const x = <div><span /></div>;',
      'let y = x;',
      '<div>{y}</div>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 1, found: 2}
    }]
  }, {
    code: [
      'const x = <div><span /></div>;',
      'let y = x;',
      '<div>{x}-{y}</div>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [
      {
        messageId: 'wrongDepth',
        data: {needed: 1, found: 2}
      },
      {
        messageId: 'wrongDepth',
        data: {needed: 1, found: 2}
      }
    ]
  }, {
    code: [
      '<div>',
      '{<div><div><span /></div></div>}',
      '</div>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 2, found: 3}
    }]
  }, {
    code: [
      '<>',
      '  <foo />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 0}],
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 0, found: 1}
    }]
  }, {
    code: [
      '<>',
      '  <>',
      '    <bar />',
      '  </>',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 1}],
    errors: [{
      messageId: 'wrongDepth',
      data: {needed: 1, found: 2}
    }]
  }, {
    code: [
      'const x = <><span /></>;',
      'let y = x;',
      '<>{x}-{y}</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 1}],
    errors: [
      {
        messageId: 'wrongDepth',
        data: {needed: 1, found: 2}
      },
      {
        messageId: 'wrongDepth',
        data: {needed: 1, found: 2}
      }
    ]
  }, {
    code: `
      const x = (
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
      );
      <tbody>
        {x}
      </tbody>
    `,
    options: [{max: 1}],
    errors: [
      {
        messageId: 'wrongDepth',
        data: {needed: 1, found: 2}
      },
      {
        messageId: 'wrongDepth',
        data: {needed: 1, found: 2}
      }
    ]
  }, {
    code: `
      <div className="custom_modal">
        <Modal className={classes.modal} open={isOpen} closeAfterTransition>
          <Fade in={isOpen}>
            <DialogContent>
              <Icon icon="cancel" onClick={onClose} popoverText="Close Modal" />
              <div className="modal_content">{children}</div>
              <div className={clxs('modal_buttons', classes.buttons)}>
                <Button className="modal_buttons--cancel" onClick={onCancel}>
                  {cancelMsg ? cancelMsg : 'Cancel'}
                </Button>
              </div>
            </DialogContent>
          </Fade>
        </Modal>
      </div>
    `,
    options: [{max: 4}],
    errors: [
      {
        messageId: 'wrongDepth',
        data: {needed: 4, found: 5}
      }
    ]
  }]
});
