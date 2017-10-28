# Prevent extra closing tags for components without children (react/self-closing-comp)

Components without children can be self-closed to avoid unnecessary extra closing tag.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

The following patterns are considered warnings:

```jsx
var HelloJohn = <Hello name="John"></Hello>;
```

The following patterns are **not** considered warnings:

```jsx
var contentContainer = <div className="content"></div>;

var intentionalSpace = <div>{' '}</div>;

var HelloJohn = <Hello name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>;

var HelloSpace = <Hello>{' '}</Hello>;
```

## Rule Options

The rule can take one argument to select types of tags, which should be self-closed when this is possible. By default custom components tags and html tags should be self-closed.

```js
...
"react/self-closing-comp": ["error", {
  "component": true,
  "html": true
}]
...
```

### `component`

When `true`, custom components tags should be self-closed.

The following patterns are considered warnings:

```jsx
var HelloJohn = <Hello name="John"></Hello>;
```

The following patterns are **not** considered warnings:

```jsx
var contentContainer = <div className="content"></div>;

var intentionalSpace = <div>{' '}</div>;

var HelloJohn = <Hello name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>;
```

### `html`

When `true`, html components tags should be self-closed.

The following patterns are considered warnings:

```jsx
var contentContainer = <div className="content"></div>;
```

The following patterns are **not** considered warnings:

```jsx
var contentContainer = <div className="content" />;

var contentContainer = <div className="content"><div /></div>;

var intentionalSpace = <div>{' '}</div>;
```
