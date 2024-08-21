# Disallow certain props on components (`react/forbid-component-props`)

<!-- end auto-generated rule header -->

By default this rule prevents passing of [props that add lots of complexity](https://medium.com/brigade-engineering/don-t-pass-css-classes-between-components-e9f7ab192785) (`className`, `style`) to Components. This rule only applies to Components (e.g. `<Foo />`) and not DOM nodes (e.g. `<div />`). The list of forbidden props can be customized with the `forbid` option.

## Rule Details

This rule checks all JSX elements and verifies that no forbidden props are used
on Components. This rule is off by default.

Examples of **incorrect** code for this rule:

```jsx
<Hello className='foo' />
```

```jsx
<Hello style={{color: 'red'}} />
```

Examples of **correct** code for this rule:

```jsx
<Hello name='Joe' />
```

```jsx
<div className='foo' />
```

```jsx
<div style={{color: 'red'}} />
```

## Rule Options

```js
...
"react/forbid-component-props": [<enabled>, { "forbid": [<string>|<object>] }]
...
```

### `forbid`

An array specifying the names of props that are forbidden. The default value of this option is `['className', 'style']`.
Each array element can either be a string with the property name or object specifying the property name or glob string, an optional
custom message, and a component allowlist:

```js
{
  "propName": "someProp",
  "allowedFor": ["SomeComponent", "AnotherComponent"],
  "message": "Avoid using someProp except SomeComponent and AnotherComponent"
}
```

Use `disallowedFor` as an exclusion list to warn on props for specific components. `disallowedFor` must have at least one item.

```js
{
  "propName": "someProp",
  "disallowedFor": ["SomeComponent", "AnotherComponent"],
  "message": "Avoid using someProp for SomeComponent and AnotherComponent"
}
```

For `propNamePattern` glob string patterns:

```js
{
  "propNamePattern": '**-**',
  "allowedFor": ['div'],
  "message": "Avoid using kebab-case except div"
}
```

```js
{
  "propNamePattern": '**-**',
  "allowedForPatterns": ["*Component"],
  "message": "Avoid using kebab-case except components that match the `*Component` pattern"
}
```

Use `allowedForPatterns` for glob string patterns:

```js
{
  "propName": "someProp",
  "allowedForPatterns": ["*Component"],
  "message": "Avoid using `someProp` except components that match the `*Component` pattern"
}
```

Use `disallowedForPatterns` for glob string patterns:

```js
{
  "propName": "someProp",
  "disallowedForPatterns": ["*Component"],
  "message": "Avoid using `someProp` for components that match the `*Component` pattern"
}
```

Combine several properties to cover more cases:

```js
{
  "propName": "someProp",
  "allowedFor": ['div'],
  "allowedForPatterns": ["*Component"],
  "message": "Avoid using `someProp` except `div` and components that match the `*Component` pattern"
}
```

### Related rules

- [forbid-dom-props](./forbid-dom-props.md)
