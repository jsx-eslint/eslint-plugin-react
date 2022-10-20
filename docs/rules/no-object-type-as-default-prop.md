# Disallow usage of referential-type variables as default param in functional component (`react/no-object-type-as-default-prop`)

<!-- end auto-generated rule header -->

Warns if in a functional component, an object type value (such as array/object literal/function/etc) is used as default prop, to prevent potential unnecessary rerenders, and performance regressions.

## Rule Details

Certain values (like arrays, objects, functions, etc) are compared by identity instead of by value. This means that, for example, whilst two empty arrays conceptually represent the same value - JavaScript semantics dictate that they are distinct and unequal as they represent two distinct values.

When using object destructuring syntax you can set the default value for a given property if it does not exist. If you set the default value to one of the values that is compared by identity, it will mean that each time the destructure is evaluated the JS engine will create a new, distinct value in the destructured variable.

In the context of a React functional component's props argument this means for each render, the property has a new, distinct value. When this value is passed to a hook as a dependency or passed into a child component as a property React will see this as a new value - meaning that a hook will be re-evaluated, or a memoized component will rerender.

This obviously destroys any performance benefits you get from memoization. Additionally, in certain circumstances this can cause infinite rerender loops, which can often be hard to debug.

It's worth noting that primitive literal values (`string`, `number`, `boolean`, `null`, and `undefined`) can be considered to be compared "by value", or alternatively, as always having the same identity (every `3` is the same exact `3`). Thus, it's safe for those to be inlined as a default value.

To fix the violations, the easiest way is to use a referencing variable in module scope instead of using the literal values, e.g:

```jsx
const emptyArray = [];

function Component({
  items = emptyArray,
}) {}
```

Examples of ***invalid*** code for this rule:

```jsx
function Component({
  items = [],
}) {}

const Component = ({
  items = {},
}) => {}

const Component = ({
  items = () => {},
}) => {}
```

Examples of ***valid*** code for this rule:

```jsx
const emptyArray = [];

function Component({
  items = emptyArray,
}) {}

const emptyObject = {};
const Component = ({
  items = emptyObject,
}) => {}

const noopFunc = () => {};
const Component = ({
  items = noopFunc,
}) => {}

// primitives are all compared by value, so are safe to be inlined
function Component({
  num = 3,
  str = 'foo',
  bool = true,
}) {}
```
