# react/jsx-no-nullish-key

📝 Disallow literal `null` or `undefined` as `key` prop values.

⚠️ This rule _warns_ in the ☑️ `recommended` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

<!-- end auto-generated rule header -->

Using a literal `null` or `undefined` as a `key` prop is technically valid — React accepts both — but almost always indicates a missing or incomplete key. In a list, every element would share the same key value, causing duplicate key conflicts.

This rule only checks for **textual literals**: `key={null}` and `key={undefined}`. It does not flag variables or expressions whose value may be null or undefined at runtime (e.g. `key={item.id}` where `item.id` is `string | null`).

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
data.map((x) => <Hello key={null}>{x}</Hello>);
```

```jsx
data.map((x) => <Hello key={undefined}>{x}</Hello>);
```

Examples of **correct** code for this rule:

```jsx
data.map((x) => <Hello key={x.id}>{x}</Hello>);
```

```jsx
data.map((x) => <Hello key={`item-${x.id}`}>{x}</Hello>);
```

```jsx
// Variables are not flagged, even if their type includes null or undefined
const id: string | null = item.id;
data.map((x) => <Hello key={id}>{x}</Hello>);
```

## When Not To Use It

If you are not using JSX then you can disable this rule.

If you intentionally use `key={null}` or `key={undefined}` to opt out of keying an element in a context where a key would otherwise be expected, you can also disable this rule.
