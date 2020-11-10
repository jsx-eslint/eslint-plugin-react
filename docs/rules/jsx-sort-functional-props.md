# Enforce spread parameters of functional components to be sorted alphabetically (react/jsx-sort-functional-props)

Some developers prefer to sort spread `{ one, two ... }` declarations alphabetically to be able to find necessary declarations easier at a later time. Others feel that it adds complexity and becomes a burden to maintain.

## Rule Details

This rule checks all functional components and verifies that their spread props declarations are sorted alphabetically. The default configuration of the rule is case-sensitive.

Examples of **incorrect** code for this rule:

```jsx
// as short arrow function declarations
const First = ({ one, two, three }) => {
  return <div />;
};
const First = ({ One, two, Three }) => {
  return <div />;
};

// as full function declarations
function First({ one, two, three }) {
  return <div />;
}
function First({ One, Txo, two }) {
  return <div />;
}
```

Examples of **correct** code for this rule:

```jsx
// as short arrow function declarations
const First = ({ one, three, two }) => {
  return <div />;
};

const Second = ({ One, Three, Two }) => {
  return <div />;
};

const Third = ({ One, two, West }) => {
  return <div />;
};

// as full function declarations
function Fourth({ one, three, two }) {
  return <div />;
}

function Fifth({ One, Three, Two }) {
  return <div />;
}

function Sixth({ tWO, two, Two }) {
  return <div />;
}
```

## Rule Options

```js
...
"react/jsx-sort-functional-props": [<enabled>, {
  "ignoreCase": <boolean>,
}]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the spread properties order.

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing spread declarations of your components isn't a part of your coding standards, then you can leave this rule off.
