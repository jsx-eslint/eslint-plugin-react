/**
 * @fileoverview Tests for jsx-props-no-spreading
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-props-no-spreading');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
const expectedError = { messageId: 'noSpreading' };

ruleTester.run('jsx-props-no-spreading', rule, {
  valid: parsers.all([
    {
      code: `
        const {one_prop, two_prop} = props;
        <App one_prop={one_prop} two_prop={two_prop}/>
      `,
    },
    {
      code: `
        const {one_prop, two_prop} = props;
        <div one_prop={one_prop} two_prop={two_prop}></div>
      `,
    },
    {
      code: `
        const newProps = {...props};
        <App one_prop={newProps.one_prop} two_prop={newProps.two_prop} style={{...styles}}/>
      `,
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        <App>
           <Image {...props}/>
           <img {...props}/>
        </App>
      `,
      options: [{ exceptions: ['Image', 'img'] }],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        const { src, alt } = props;
        <App>
           <Image {...props}/>
           <img src={src} alt={alt}/>
        </App>
      `,
      options: [{ custom: 'ignore' }],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        const { src, alt } = props;
        <App>
           <Image {...props}/>
           <img {...props}/>
        </App>
      `,
      options: [{ custom: 'enforce', html: 'ignore', exceptions: ['Image'] }],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        const { src, alt } = props;
        <App>
           <img {...props}/>
           <Image src={src} alt={alt}/>
           <div {...someOtherProps}/>
        </App>
      `,
      options: [{ html: 'ignore' }],
    },
    {
      code: `
        <App>
          <Foo {...{ prop1, prop2, prop3 }} />
        </App>
      `,
      options: [{ explicitSpread: 'ignore' }],
    },
    {
      code: `
        const props = {};
        <App>
           <components.Group {...props}/>
           <Nav.Item {...props}/>
        </App>
      `,
      options: [{ exceptions: ['components.Group', 'Nav.Item'] }],
    },
    {
      code: `
        const props = {};
        <App>
           <components.Group {...props}/>
           <Nav.Item {...props}/>
        </App>
      `,
      options: [{ custom: 'ignore' }],
    },
    {
      code: `
        const props = {};
        <App>
           <components.Group {...props}/>
           <Nav.Item {...props}/>
        </App>
      `,
      options: [
        {
          custom: 'enforce',
          html: 'ignore',
          exceptions: ['components.Group', 'Nav.Item'],
        },
      ],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        <App {...props}/>
      `,
      errors: [expectedError],
    },
    {
      code: `
        <div {...props}></div>
      `,
      errors: [expectedError],
    },
    {
      code: `
        <App {...props} some_other_prop={some_other_prop}/>
      `,
      errors: [expectedError],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        <App>
           <Image {...props}/>
           <span {...props}/>
        </App>
      `,
      options: [{ exceptions: ['Image', 'img'] }],
      errors: [expectedError],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        const { src, alt } = props;
        <App>
           <Image {...props}/>
           <img {...props}/>
        </App>
      `,
      options: [{ custom: 'ignore' }],
      errors: [expectedError],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        const { src, alt } = props;
        <App>
           <Image {...props}/>
           <img {...props}/>
        </App>
      `,
      options: [{ html: 'ignore', exceptions: ['Image', 'img'] }],
      errors: [expectedError],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        const { src, alt } = props;
        <App>
           <Image {...props}/>
           <img {...props}/>
           <div {...props}/>
        </App>
      `,
      options: [{ custom: 'ignore', html: 'ignore', exceptions: ['Image', 'img'] }],
      errors: [expectedError, expectedError],
    },
    {
      code: `
        const props = {src: "dummy.jpg", alt: "dummy"};
        const { src, alt } = props;
        <App>
           <img {...props}/>
           <Image {...props}/>
        </App>
      `,
      options: [{ html: 'ignore' }],
      errors: [expectedError],
    },
    {
      code: `
        <App>
          <Foo {...{ prop1, prop2, prop3 }} />
        </App>
      `,
      errors: [expectedError],
    },
    {
      code: `
        <App>
          <Foo {...{ prop1, ...rest }} />
        </App>
      `,
      options: [{ explicitSpread: 'ignore' }],
      errors: [expectedError],
    },
    {
      code: `
        <App>
          <Foo {...{ ...props }} />
        </App>
      `,
      options: [{ explicitSpread: 'ignore' }],
      errors: [expectedError],
    },
    {
      code: `
        <App>
          <Foo {...props } />
        </App>
      `,
      options: [{ explicitSpread: 'ignore' }],
      errors: [expectedError],
    },
    {
      code: `
        const props = {};
        <App>
           <components.Group {...props}/>
           <Nav.Item {...props}/>
        </App>
      `,
      options: [{ exceptions: ['components.DropdownIndicator', 'Nav.Item'] }],
      errors: [expectedError],
    },
  ]),
});
