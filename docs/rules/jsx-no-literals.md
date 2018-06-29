# Prevent usage of string literals in JSX (react/jsx-no-literals)

There are a couple of scenarios where you want to avoid string literals in JSX.  Either to enforce consistency and reducing strange behaviour, or for enforcing that literals aren't kept in JSX so they can be translated.

## Rule Details

In JSX when using a literal string you can wrap it in a JSX container `{'TEXT'}`. This rules by default requires that you wrap all literal strings.
Prevents any odd artifacts of highlighters if your unwrapped string contains an enclosing character like `'` in contractions and enforces consistency.

The following patterns are considered warnings:

```jsx
var Hello = <div>test</div>;
```

The following patterns are **not** considered warnings:

```jsx
var Hello = <div>{'test'}</div>;
```

### Options

There is only one option:

* `noStrings` - Enforces no string literals used as children, wrapped or unwrapped.

To use, you can specify like the following:

```js
"react/jsx-no-literals": [<enabled>, {"noStrings": true}]
```

In this configuration, the following are considered warnings:

```jsx
var Hello = <div>test</div>;
```

```jsx
var Hello = <div>{'test'}</div>;
```

The following are **not** considered warnings:

```jsx
// When using something like `react-intl`
var Hello = <div><Text {...message} /></div>
```

```jsx
// When using something similar to Rails translations
var Hello = <div>{translate('my.translation.key')}</div>
```

## When Not To Use It

If you do not want to enforce any style JSX literals, then you can disable this rule.
