# Prevent extra closing tags for components without children (react/self-closing-comp)

Components without children can be self-closed to avoid unnecessary extra closing tag.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var HelloJohn = <Hello name="John"></Hello>;

var HelloJohnCompound = <Hello.Compound name="John"></Hello.Compound>;
```

Examples of **correct** code for this rule:

```jsx
var contentContainer = <div className="content"></div>;

var intentionalSpace = <div>{' '}</div>;

var HelloJohn = <Hello name="John" />;

var HelloJohnCompound = <Hello.Compound name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>;

var ProfileCompound = <Hello.Compound name="John"><img src="picture.png" /></Hello.Compound>;

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

Examples of **incorrect** code for this rule:

```jsx
var HelloJohn = <Hello name="John"></Hello>;
```

Examples of **correct** code for this rule:

```jsx
var contentContainer = <div className="content"></div>;

var intentionalSpace = <div>{' '}</div>;

var HelloJohn = <Hello name="John" />;

var HelloJohnCompound = <Hello.Compound name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>;

var ProfileCompound = <Hello.Compound name="John"><img src="picture.png" /></Hello.Compound>;
```

### `html`

When `true`, html components tags should be self-closed.

Examples of **incorrect** code for this rule:

```jsx
var contentContainer = <div className="content"></div>;
```

Examples of **correct** code for this rule:

```jsx
var contentContainer = <div className="content" />;

var contentContainer = <div className="content"><div /></div>;

var intentionalSpace = <div>{' '}</div>;
```
