# Forbid certain props on Components (react/forbid-component-props)

By default this rule prevents passing of [props that add lots of complexity](https://medium.com/brigade-engineering/don-t-pass-css-classes-between-components-e9f7ab192785) (`className`, `style`) to Components. This rule only applies to Components (e.g. `<Foo />`) and not DOM nodes (e.g. `<div />`). The list of forbidden props can be customized with the `forbid` option.

## Rule Details

This rule checks all JSX elements and verifies that no forbidden props are used
on Components. This rule is off by default.

The following patterns are considered warnings:

```jsx
<Hello className='foo' />
```

```jsx
<Hello style={{color: 'red'}} />
```

The following patterns are **not** considered warnings:

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
Each array element can either be a string with the property name or object specifying the property name and a component whitelist:

```js
{
  "propName": "someProp",
  "allowedFor": [SomeComponent, AnotherComponent]
}
```


### Related rules

- [forbid-dom-props](./forbid-dom-props.md)
