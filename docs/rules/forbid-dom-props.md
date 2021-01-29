# Forbid certain props on DOM Nodes (react/forbid-dom-props)

This rule prevents passing of props to elements. This rule only applies to DOM Nodes (e.g. `<div />`) and not Components (e.g. `<Component />`).
The list of forbidden props can be customized with the `forbid` option.

## Rule Details

This rule checks all JSX elements and verifies that no forbidden props are used
on DOM Nodes. This rule is off by default.

Examples of **incorrect** code for this rule:

```jsx
// [1, { "forbid": ["id"] }]
<div id='Joe' />
```

```jsx
// [1, { "forbid": ["style"] }]
<div style={{color: 'red'}} />
```

Examples of **correct** code for this rule:

```jsx
// [1, { "forbid": ["id"] }]
<Hello id='foo' />
```

```jsx
// [1, { "forbid": ["id"] }]
<Hello id={{color: 'red'}} />
```

## Rule Options

```js
...
"react/forbid-dom-props": [<enabled>, { "forbid": [<string>|<object>] }]
...
```

### `forbid`

An array of strings, with the names of props that are forbidden. The default value of this option `[]`.
Each array element can either be a string with the property name or object specifying the property name and an optional
custom message:

```js
{
  "propName": "someProp",
  "message": "Avoid using someProp"
}
```

### Related rules

- [forbid-component-props](./forbid-component-props.md)
