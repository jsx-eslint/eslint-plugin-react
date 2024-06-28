# Disallow returning undefined from react components (`react/no-render-return-undefined`)

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

<!-- end auto-generated rule header -->

> Starting in React 18, components may render `undefined`, and React will render nothing to the DOM instead of throwing an error. However, accidentally rendering nothing in a component could still cause surprises. This rule will warn if the `return` statement in a React Component returns `undefined`.

## Rule Details

This rule will warn if the `return` statement in a React component returns `undefined`.

Examples of **incorrect** code for this rule:

```jsx
function App() {}

// OR

function App() {
  return undefined;
}

// OR

let ui;
function App() {
  return ui;
}

// OR

function getUI() {
  if (condition) return <h1>Hello</h1>;
}
function App() {
  return getUI();
}
```

Examples of **correct** code for this rule:

```jsx
function App() {
  return <div />;
}

// OR

let ui = <div />;
function App() {
  return ui;
}

// OR

function getUI() {
  if (condition) return <h1>Hello</h1>;
  return null;
}
function App() {
  return getUI();
}
```
