# Forbid certain props on Components (forbid-component-props)

This rule prevents passing of [props that add lots of complexity](https://medium.com/brigade-engineering/don-t-pass-css-classes-between-components-e9f7ab192785) (`className`, `style`) to components.

By default, this rule only applies to Components (e.g. `<Foo />`) and not DOM nodes (e.g. `<div />`), however the behavior can be changed.

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

The following patterns are not considered warnings:

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
"forbid-component-props": [<enabled>, { "forbid": [<string>|<object>], "defaultAllowOnComponents": <bool>, "defaultAllowOnDOM": <bool>}]
...
```

### `defaultAllowOnComponents`

Defaults to allowing forbidden properties on Components.  Disabled by default.

### `defaultAllowOnDOM`

Defaults to allowing forbidden properties on DOM nodes.  Enabled by default.

### `forbid`

An array of strings, with the names of props that are forbidden. The default value of this option is `['className', 'style']`.

If you'd like to customize the behavior of the checking, you can also pass an object in the following format:
```js
{
    forbid: [
        "style", // default behavior
        {
            property: <string>, // the name of the property, e.g. 'className'
            allowOnDOM: <bool>, // whether to apply this rule to DOM nodes - default true unless defaultAllowOnDOM is set to false
            allowOnComponents: <bool>, // whether to apply this rule to Componetns - default false unless defaultAllowOnComponents is set to true,
            forbid: <array>, // an array of strings to forbid this property on, whether allowOnDOM or allowOrComponents is true or not
            allow: <array>, // an array of strings to allow this property on, whether allowOnDOM or allowOrComponents is false or not
        }
    ]
}
```

## Examples

#### Prevent the `style` property from being used on Components:
```js
{
    forbid: [ "style" ],
}
```

#### Prevent the `style` property from being used on DOM nodes only:
```js
{
    forbid: [ "style" ],
    defaultAllowOnComponents: true,
    defaultAllowOnDOM: false,
}
```


#### Prevent the `style` property from being used everywhere:

```js
{
    forbid: [ "style" ],
    defaultAllowOnDOM: false
}
```

#### Prevent the `style` property from being used everywhere, but still allow classNames on DOM nodes:
```js
{
    forbid: [ "className", {
        property: "style",
        allowOnDOM: false
    }],
}
```

#### Prevent the `className` property from being used everywhere, but allow it on `i` tags
```js
{
    forbid: [{
        property: "className",
        allowOnDOM: false,
        allow: ['i']
    }],
}
```

#### Prevent the `className` property from being used on div tags only
```js
{
    forbid: [{
        property: "className",
        allowOnDOM: true, // default, not necessary
        forbid: ['div']
    }],
}
```