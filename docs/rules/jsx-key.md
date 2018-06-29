# Detect missing `key` prop (react/jsx-key)

Warn if an element that likely requires a `key` prop--namely, one present in an
array literal or an arrow function expression.

## Rule Details

The following patterns are considered warnings:

```jsx
[<Hello />, <Hello />, <Hello />];

data.map(x => <Hello>{x}</Hello>);

<Hello {...{ key: id, id, caption }} />
```

In the last example the key is being spread, which is currently possible, but discouraged in favor of the statically provided key.

The following patterns are **not** considered warnings:

```jsx
[<Hello key="first" />, <Hello key="second" />, <Hello key="third" />];

data.map((x, i) => <Hello key={i}>{x}</Hello>);

<Hello key={id} {...{ id, caption }} />
```

## When not to use

If you are not using JSX then you can disable this rule.

Also, if you have some prevalent situation where you use arrow functions to
return JSX that will not be held in an iterable, you may want to disable this
rule.
