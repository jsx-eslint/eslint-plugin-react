# Disallow missing `key` props in iterators/collection literals (`react/jsx-key`)

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

<!-- end auto-generated rule header -->

Warn if an element that likely requires a `key` prop--namely, one present in an
array literal or an arrow function expression.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
[<Hello />, <Hello />, <Hello />];
```

```jsx
data.map(x => <Hello>{x}</Hello>);
```

```jsx
Array.from([1, 2, 3], (x) => <Hello>{x}</Hello>);
```

```jsx
<Hello {...{ key: id, id, caption }} />
```

In the last example the key is being spread, which is currently possible, but discouraged in favor of the statically provided key.

Examples of **correct** code for this rule:

```jsx
[<Hello key="first" />, <Hello key="second" />, <Hello key="third" />];
```

```jsx
data.map((x) => <Hello key={x.id}>{x}</Hello>);
```

```jsx
Array.from([1, 2, 3], (x) => <Hello key={x}>{x}</Hello>);
```

```jsx
<Hello key={id} {...{ id, caption }} />
```

## Rule Options

```js
...
"react/jsx-key": [<enabled>, { "checkFragmentShorthand": <boolean> }]
...
```

### `checkFragmentShorthand` (default: `false`)

When `true` the rule will check if usage of the [shorthand fragment syntax][short_syntax] requires a key. This option was added to avoid a breaking change and will be the default in the next major version.

Examples of **incorrect** code for this rule:

```jsx
[<></>, <></>, <></>];
```

```jsx
data.map(x => <>{x}</>);
```

### `checkKeyMustBeforeSpread` (default: `false`)

When `true` the rule will check if key prop after spread to avoid [createElement fallback](https://github.com/facebook/react/issues/20031#issuecomment-710346866).

Examples of **incorrect** code for this rule:

```jsx
<span {...spread} key={"key-after-spread"} />;
```

### `warnOnDuplicates` (default: `false`)

When `true` the rule will check for any duplicate key prop values.

Examples of **incorrect** code for this rule:

```jsx
const spans = [
    <span key="notunique"/>,
    <span key="notunique"/>,
];
```

## When Not To Use It

If you are not using JSX then you can disable this rule.

Also, if you have some prevalent situation where you use arrow functions to
return JSX that will not be held in an iterable, you may want to disable this
rule.

[short_syntax]: https://reactjs.org/docs/fragments.html#short-syntax
