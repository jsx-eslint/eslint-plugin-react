# No Array or Object Allocation in JSX Props (react/jsx-no-allocation-in-props)

An array literal `[]` or an object literal `{}` in a JSX prop will create a brand new object on every single render. This is bad for performance, as it will result in the garbage collector being invoked way more than is necessary. It may also cause unnecessary re-renders if a brand new object is passed as a prop to a component that uses reference equality check on the prop to determine if it should update.

## Rule Details

The following patterns are considered warnings:

```jsx
<Foo bar={[1, 2, 3]}></Foo>
```
```jsx
<Foo bar={{ foo: 1 }}></Foo>
```

## Rule Options

```js
"react/jsx-no-allocation-in-props": [<enabled>, {
  "ignoreDOMComponents": <boolean> || false
}]
```

### `ignoreDOMComponents`

When `true` the following is **not** considered a warning:

```jsx
<div style={{ foo: 1 }} />
```

## When Not To Use It

If you do not use JSX or do not want to enforce that array/object allocations don't occur in props, then you can disable this rule.
