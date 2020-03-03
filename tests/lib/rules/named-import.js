/**
 * @fileoverview Tests for named-import
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/named-import');
const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  react: {
    pragma: 'Act'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('named-import', rule, {
  valid: [
    {
      code: "import Act from 'react';",
      settings
    },
    {
      code: "import Act, { useState } from 'react';",
      settings
    },
    {
      code: `
        import Act from 'react';
        const [loading, setLoading] = Act.useState(false);
      `,
      options: ['property'],
      settings
    },
    {
      code: `
        import Act, { useState } from 'react';
        const [loading, setLoading] = useState(false);
      `,
      options: ['import'],
      settings
    },
    {
      code: `
        import Act, { useEffect, Component } from 'react';
        const [loading, setLoading] = Act.useState(false);
      `,
      options: [
        'import',
        {
          useEffect: 'import',
          useState: 'property'
        }
      ],
      settings
    },
    {
      code: `
        import Act, { useEffect } from 'react';
        const [loading, setLoading] = Act.useState(false);
        const a = Act.Component;
      `,
      options: [
        'property',
        {
          useEffect: 'import',
          useState: 'property'
        }
      ],
      settings
    }
  ],
  invalid: [
    {
      code: `
        import Act from 'react';
        const [value, setValue] = Act.useState('');
      `,
      output: `
        import Act, { useState } from 'react';
        const [value, setValue] = useState('');
      `,
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'useNamedImport',
          data: {
            name: 'useState'
          }
        }
      ],
      settings
    },
    {
      code: `
        import Act from 'react';
        const [value, setValue] = Act.useState('');
      `,
      output: `
        import Act, { useState } from 'react';
        const [value, setValue] = useState('');
      `,
      options: ['import'],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'useState'}
        }
      ],
      settings
    },
    {
      code: `
        import Act, { useState } from 'react';
        const [value, setValue] = useState('');
      `,
      output: `
        import Act from 'react';
        const [value, setValue] = Act.useState('');
      `,
      options: ['property'],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'usePropertyAccessor',
          data: {
            name: 'useState',
            react: 'Act'
          }
        }
      ],
      settings
    },
    {
      code: `
        import Act from 'react';
        const [value, setValue] = Act.useState('');
        Act.useEffect(() => {}, []);
      `,
      output: `
        import Act, { useEffect } from 'react';
        const [value, setValue] = Act.useState('');
        useEffect(() => {}, []);
      `,
      options: ['property', {useEffect: 'import'}],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'useNamedImport',
          data: {
            name: 'useEffect'
          }
        }
      ],
      settings
    },
    {
      code: `
        import Act from 'react';
        const [value, setValue] = Act.useState('');
        Act.useEffect(() => {}, []);
      `,
      output: `
        import Act, { useEffect } from 'react';
        const [value, setValue] = Act.useState('');
        useEffect(() => {}, []);
      `,
      options: ['import', {useState: 'property'}],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'useEffect'}
        }
      ],
      settings
    }

  ].concat(parsers.TS([
    {
      code: `
        import Act from 'react';
        const Comp: Act.AType = () => {}
        const a = (p: Act.BType) => {}

        type A = {
          b: Act.CType;
        }

        type B<C> = {
          d: C
        }

        type A = B<Act.DType>;
      `,
      output: `
        import Act, { AType, BType, CType, DType } from 'react';
        const Comp: AType = () => {}
        const a = (p: BType) => {}

        type A = {
          b: CType;
        }

        type B<C> = {
          d: C
        }

        type A = B<DType>;
      `,
      options: ['import'],
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'AType'}
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'BType'}
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'CType'}
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'DType'}
        }
      ],
      settings
    },
    {
      code: `
        import Act, { AType, BType, CType, DType } from 'react';
        const Comp: AType = () => {}
        const a = (p: BType) => {}

        type A = {
          b: CType;
        }

        type B<C> = {
          d: C
        }

        type A = B<DType>;
      `,
      output: `
        import Act from 'react';
        const Comp: Act.AType = () => {}
        const a = (p: Act.BType) => {}

        type A = {
          b: Act.CType;
        }

        type B<C> = {
          d: C
        }

        type A = B<Act.DType>;
      `,
      options: ['property'],
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'usePropertyAccessor',
          data: {name: 'AType', react: 'Act'}
        },
        {
          messageId: 'usePropertyAccessor',
          data: {name: 'BType', react: 'Act'}
        },
        {
          messageId: 'usePropertyAccessor',
          data: {name: 'CType', react: 'Act'}
        },
        {
          messageId: 'usePropertyAccessor',
          data: {name: 'DType', react: 'Act'}
        }
      ],
      settings
    },
    {
      code: `
        import Act, { AType, BType } from 'react';
        type Props = {
          a: AType,
          b: BType
        }
      `,
      output: `
        import Act, { BType } from 'react';
        type Props = {
          a: Act.AType,
          b: BType
        }
      `,
      options: ['property', {BType: 'import'}],
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'usePropertyAccessor',
          data: {name: 'AType', react: 'Act'}
        }
      ],
      settings
    },
    {
      code: `
        import Act from 'react';
        type Props = {
          a: Act.AType,
          b: Act.BType
        }
      `,
      output: `
        import Act, { BType } from 'react';
        type Props = {
          a: Act.AType,
          b: BType
        }
      `,
      options: ['import', {AType: 'property'}],
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'BType'}
        }
      ],
      settings
    },
    {
      code: `
        import Act, { AType } from 'react';
        type Props = {
          a: AType,
          b: Act.BType
        }
      `,
      output: `
        import Act, { BType } from 'react';
        type Props = {
          a: Act.AType,
          b: BType
        }
      `,
      options: ['property', {BType: 'import'}],
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [
        {
          messageId: 'fixImportStatement'
        },
        {
          messageId: 'usePropertyAccessor',
          data: {name: 'AType', react: 'Act'}
        },
        {
          messageId: 'useNamedImport',
          data: {name: 'BType'}
        }
      ],
      settings
    }
  ]))
});
