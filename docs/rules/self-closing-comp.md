# Prevent extra closing tags for components without children (self-closing-comp)

Components without children can be self-closed to avoid unnecessary extra closing tag.

## Rule Details

The following patterns are considered warnings:

```js
var HelloJohn = <Hello name="John"></Hello>;
```

The following patterns are not considered warnings:

```js
var contentContainer = <div className="content"></div>;

var HelloJohn = <Hello name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>;
```

## Rule Options

The rule can take one argument to select types of tags, which should be self-closed when this is possible. By default only custom components tags should be self-closed.

```js
...
"self-closing-comp": ["error", {
  "component": true,
  "html": false
}]
...
```

### `component`

When `true`, custom components tags should be self-closed.

The following patterns are considered warnings:

```js
var HelloJohn = <Hello name="John"></Hello>;
```

The following patterns are not considered warnings:

```js
var contentContainer = <div className="content"></div>;

var HelloJohn = <Hello name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>;
```

### `html`

When `true`, html components tags should be self-closed.

The following patterns are considered warnings:

```js
var contentContainer = <div className="content"></div>;
```

The following patterns are not considered warnings:

```js
var contentContainer = <div className="content" />;

var contentContainer = <div className="content"><div /></div>;
```
