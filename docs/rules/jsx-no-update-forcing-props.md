# Prevent setting a prop that would force component to update (react/jsx-no-update-forcing-props)

Warns you if you have passed a prop with a value that will be [referentially unequal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Identity_strict_equality_()) on each render. This is bad for performance, as it will result in the garbage collector being invoked way more than is necessary. It may also cause unnecessary re-renders if a brand new object or function is passed as a prop to a component that uses reference equality check on the prop to determine if it should update.

## Rule details

Examples of **incorrect** code for this rule:

```jsx
<Foo bar={{ key: 'value' }} />
```

```jsx
<Foo bar={[1, 2, 3]} />
```

```jsx
<Foo bar={new Date()} />
```

```jsx
<Foo bar={() => console.log('Hello!'))} />
```

```jsx
<Foo bar={function() { alert("1337") }} />
```

```jsx
<Foo bar={Symbol('Hi')} />
```

Examples of **correct** code for this rule:

```jsx
var bar = { key: 'value' };
<Foo bar={bar} />
```

```jsx
var bar = [1, 2, 3];
<Foo bar={bar} />
```

etc., etc.


## Rule Options

```js
...
"react/jsx-no-update-forcing-props": [<enabled>, { "functions": <boolean> }]
...
```

### `objectExpressions`

When `false` the rule will not allow objects as prop values.

Defaults to `false`.

### `arrayExpressions`

When `false` the rule will not allow arrays as prop values.

Defaults to `false`.

### `functionExpressions`

When `false` the rule will not allow functions as prop values.

Defaults to `false`.

### `arrowFunctionExpressions`

When `false` the rule will not allow arrow functions as prop values.

Defaults to `false`.

### `newExpressions`

When `false` the rule will not allow constructor expressions as prop values.

Defaults to `false`.

### `callExpressions`

When `false` the rule will not allow function calls as prop values.

Defaults to `false`.

### `ignoreRefs`

When `false` the rule will not allow any of the above in `ref` props as well.

Defaults to `true`.
