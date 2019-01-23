# Enforce shorthand or standard form for React fragments (react/jsx-fragments)

In JSX, a React fragment is created either with `<React.Fragment>...</React.Fragment>`, or, using the shorthand syntax, `<>...</>`. This rule allows you to enforce one way or the other.

Support for fragments was added in React v16.2, so the rule will warn on either of these forms if an older React version is specified in [shared settings][shared_settings].

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Options

```js
...
"react/jsx-fragments": [<enabled>, <mode>]
...
```

### `syntax` mode

This is the default mode. It will enforce the shorthand syntax for React fragments, with one exception. [Keys or attributes are not supported by the shorthand syntax][short_syntax], so the rule will not warn on standard-form fragments that use those.

The following pattern is considered a warning:

```jsx
<React.Fragment><Foo /></React.Fragment>
```

The following patterns are **not** considered warnings:

```jsx
<><Foo /></>
```

```jsx
<React.Fragment key="key"><Foo /></React.Fragment>
```

### `element` mode

This mode enforces the standard form for React fragments.

The following pattern is considered a warning:

```jsx
<><Foo /></>
```

The following patterns are **not** considered warnings:

```jsx
<React.Fragment><Foo /></React.Fragment>
```

```jsx
<React.Fragment key="key"><Foo /></React.Fragment>
```

[fragments]: https://reactjs.org/docs/fragments.html
[shared_settings]: /README.md#configuration
[short_syntax]: https://reactjs.org/docs/fragments.html#short-syntax
