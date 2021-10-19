/**
 * @fileoverview Require or prevent a new line after jsx elements and expressions
 * @author Johnny Zabala
 * @author Joseph Stiles
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-newline');
const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

new RuleTester({ parserOptions }).run('jsx-newline', rule, {
  valid: parsers.all([
    {
      code: `
        <div>
          <Button>{data.label}</Button>

          <List />

          <Button>
            <IconPreview />
            Button 2

            <span></span>
          </Button>

          {showSomething === true && <Something />}

          <Button>Button 3</Button>

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
    },
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          <List />
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
          {showSomething === true && <Something />}
          <Button>Button 3</Button>
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      options: [{ prevent: true }],
    },
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      options: [{ prevent: true }],
      features: ['fragment'],
    },
  ]),
  invalid: parsers.all([
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          <List />
        </div>
      `,
      output: `
        <div>
          <Button>{data.label}</Button>

          <List />
        </div>
      `,
      errors: [{
        messageId: 'require',
      }],
    },
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          {showSomething === true && <Something />}
        </div>
      `,
      output: `
        <div>
          <Button>{data.label}</Button>

          {showSomething === true && <Something />}
        </div>
      `,
      errors: [{ messageId: 'require' }],
    },
    {
      code: `
        <div>
          {showSomething === true && <Something />}
          <Button>{data.label}</Button>
        </div>
      `,
      output: `
        <div>
          {showSomething === true && <Something />}

          <Button>{data.label}</Button>
        </div>
      `,
      errors: [{ messageId: 'require' }],
    },
    {
      code: `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      output: `
        <div>
          {showSomething === true && <Something />}

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      errors: [{ messageId: 'require' }],
    },
    {
      code: `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `,
      output: `
        <div>
          <div>
            <button></button>

            <button></button>
          </div>

          <div>
            <span></span>

            <span></span>
          </div>
        </div>
      `,
      errors: [
        { messageId: 'require' },
        { messageId: 'require' },
        { messageId: 'require' },
      ],
    },
    {
      output: `
        <div>
          <Button>{data.label}</Button>
          <List />
        </div>
      `,
      code: `
        <div>
          <Button>{data.label}</Button>

          <List />
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          <Button>{data.label}</Button>
          {showSomething === true && <Something />}
        </div>
      `,
      code: `
        <div>
          <Button>{data.label}</Button>

          {showSomething === true && <Something />}
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          {showSomething === true && <Something />}
          <Button>{data.label}</Button>
        </div>
      `,
      code: `
        <div>
          {showSomething === true && <Something />}

          <Button>{data.label}</Button>
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      code: `
        <div>
          {showSomething === true && <Something />}

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `,
      code: `
        <div>
          <div>
            <button></button>

            <button></button>
          </div>

          <div>
            <span></span>

            <span></span>
          </div>
        </div>
      `,
      errors: [
        { messageId: 'prevent' },
        { messageId: 'prevent' },
        { messageId: 'prevent' },
      ],
      options: [{ prevent: true }],
    },
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      output: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      errors: [{ messageId: 'require' }],
      features: ['fragment'],
    },
    {
      output: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      code: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
      features: ['fragment'],
    },
  ]),
});
