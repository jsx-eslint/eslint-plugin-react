# Disallow unused React elements  (react/no-unused-elements)

An unused React element indicates a logic error.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div />;
```

```js
React.createElement('div');
```

Examples of **correct** code for this rule:

```js
return <div />;
```

```js
const partial = <div />;
```
