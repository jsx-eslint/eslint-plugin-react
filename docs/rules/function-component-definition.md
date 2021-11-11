# Enforce a specific function type for function components (react/function-component-definition)

This option enforces a specific function type for function components.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule is aimed to enforce consistent function types for function components. By default it prefers function declarations for named components and function expressions for unnamed components.

Examples of **incorrect** code for this rule:

```jsx
// function expression for named component
var Component = function (props) {
  return <div>{props.content}</div>;
};

// arrow function for named component
var Component = (props) => {
  return <div>{props.content}</div>;
};

// arrow function for unnamed component
function getComponent() {
  return (props) => {
    return <div>{props.content}</div>;
  };
}
```

## Rule Options

This rule takes an options object as a second parameter where the preferred function type for components can be specified.
The first property of the options object is `"namedComponents"` which can be `"function-declaration"`, `"function-expression"`, `"arrow-function"`, or an array containing any of those, and has `'function-declaration'` as its default.
The second property is `"unnamedComponents"` that can be either `"function-expression"`, `"arrow-function"`, or an array containing any of those, and has `'function-expression'` as its default.

```js
...
"react/function-component-definition": [<enabled>, {
  "namedComponents": "function-declaration" | "function-expression" | "arrow-function" | Array<"function-declaration" | "function-expression" | "arrow-function">,
  "unnamedComponents": "function-expression" | "arrow-function" | Array<"function-expression" | "arrow-function">
}]
...
```

Examples of **incorrect** code for this rule:

```jsx
// only function declarations for named components
// [2, { "namedComponents": "function-declaration" }]
var Component = function (props) {
  return <div />;
};

var Component = (props) => {
  return <div />;
};

// only function expressions for named components
// [2, { "namedComponents": "function-expression" }]
function Component (props) {
  return <div />;
};

var Component = (props) => {
  return <div />;
};

// only arrow functions for named components
// [2, { "namedComponents": "arrow-function" }]
function Component (props) {
  return <div />;
};

var Component = function (props) {
  return <div />;
};

// only function expressions for unnamed components
// [2, { "unnamedComponents": "function-expression" }]
function getComponent () {
  return (props) => {
    return <div />;
  };
}

// only arrow functions for unnamed components
// [2, { "unnamedComponents": "arrow-function" }]
function getComponent () {
  return function (props) {
    return <div />;
  };
}

```

Examples of **correct** code for this rule:

```jsx

// only function declarations for named components
// [2, { "namedComponents": "function-declaration" }]
function Component (props) {
  return <div />;
}

// only function expressions for named components
// [2, { "namedComponents": "function-expression" }]
var Component = function (props) {
  return <div />;
};

// only arrow functions for named components
// [2, { "namedComponents": "arrow-function" }]
var Component = (props) => {
  return <div />;
};

// only function expressions for unnamed components
// [2, { "unnamedComponents": "function-expression" }]
function getComponent () {
  return function (props) {
    return <div />;
  };
}

// only arrow functions for unnamed components
// [2, { "unnamedComponents": "arrow-function" }]
function getComponent () {
  return (props) => {
    return <div />;
  };
}

```

## Unfixable patterns

There is one unfixable pattern in JavaScript.

It has to do with the fact that this is valid syntax:

```js
export default function getComponent () {
  return <div />;
}
```

While these are not:

```js
export default var getComponent = () => {
  return <div />;
}

export default var getComponent = function () {
  return <div />;
}
```

These patterns have to be manually fixed.

## Heads up, TypeScript users

Note that the autofixer is somewhat constrained for TypeScript users.

The following patterns can **not** be autofixed in TypeScript:

```tsx
// function expressions and arrow functions that have type annotations cannot be autofixed to function declarations
// [2, { "namedComponents": "function-declaration" }]
var Component: React.FC<Props> = function (props) {
  return <div />;
};

var Component: React.FC<Props> = (props) => {
  return <div />;
};

// function components with one unconstrained type parameter cannot be autofixed to arrow functions because the syntax conflicts with jsx
// [2, { "namedComponents": "arrow-function" }]
function Component<T>(props: Props<T>) {
  return <div />;
};

var Component = function <T>(props: Props<T>) {
  return <div />;
};

// [2, { "unnamedComponents": "arrow-function" }]
function getComponent() {
  return function <T>(props: Props<T>) => {
    return <div />;
  }
}
```

Type parameters do not produce syntax conflicts if either there are multiple type parameters or, if there is only one constrained type parameter.

The following patterns can be autofixed in TypeScript:

```tsx
// autofix to function expression with type annotation
// [2, { "namedComponents": "function-expression" }]
var Component: React.FC<Props> = (props) => {
  return <div />;
};

// autofix to arrow function with type annotation
// [2, { "namedComponents": "function-expression" }]
var Component: React.FC<Props> = function (props) {
  return <div />;
};

// autofix to named arrow function with one constrained type parameter
// [2, { "namedComponents": "arrow-function" }]
function Component<T extends {}>(props: Props<T>) {
  return <div />;
}

var Component = function <T extends {}>(props: Props<T>) {
  return <div />;
};

// autofix to named arrow function with multiple type parameters
// [2, { "namedComponents": "arrow-function" }]
function Component<T1, T2>(props: Props<T1, T2>) {
  return <div />;
}

var Component = function <T1, T2>(props: Props<T2>) {
  return <div />;
};

// autofix to unnamed arrow function with one constrained type parameter
// [2, { "unnamedComponents": "arrow-function" }]
function getComponent() {
  return function <T extends {}> (props: Props<T>) => {
    return <div />;
  };
}

// autofix to unnamed arrow function with multiple type parameters
// [2, { "unnamedComponents": "arrow-function" }]
function getComponent() {
  return function <T1, T2>(props: Props<T1, T2>) => {
    return <div />;
  }
}

```

## When Not To Use It

If you are not interested in consistent types of function components.
