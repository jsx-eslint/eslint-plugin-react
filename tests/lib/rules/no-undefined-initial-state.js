/**
 * @fileoverview Tests for react-in-jsx-scope
 * @author hjoel
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-undefined-initial-state');

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

const errors = [
  {
    messageId: 'noUndefinedInitialState',
  },
];

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-undefined-initial-state', rule, {
  valid: parsers.all([
    { code: 'const [test, setTest] = useState(null);' },
    { code: 'const [test, setTest] = useState(true);' },
    { code: 'const [test, setTest] = useState(false);' },
    { code: 'const [test, setTest] = useState(123);' },
    { code: 'const [test, setTest] = useState({});' },
    { code: 'const [test, setTest] = useState([]);' },
    {
      code: `import { useState } from "react";

export default function App() {
  const [state, setState] = useState(0);

  return (
    <div className="App">
      <button onClick={() => setState((s) => s + 1)}>Hello Test</button>
      <h2>{state}</h2>
    </div>
  );
}`,
    },
  ]),
  invalid: parsers.all([
    {
      code: 'const [test, setTest] = useState(undefined);',
      errors,
    },
    {
      code: 'const [test, setTest] = useState();',
      errors,
    },
    {
      code: `import { useState } from "react";

export default function App() {
  const [state, setState] = useState();

  return (
    <div className="App">
      <button onClick={() => setState((s) => s + 1)}>Hello Test</button>
      <h2>{state}</h2>
    </div>
  );
}`,
      errors,
    },
    {
      code: `import { useState } from "react";

export default function App() {
  const [state, setState] = useState(undefined);

  return (
    <div className="App">
      <button onClick={() => setState((s) => s + 1)}>Hello Test</button>
      <h2>{state}</h2>
    </div>
  );
}`,
      errors,
    },
  ]),
});
