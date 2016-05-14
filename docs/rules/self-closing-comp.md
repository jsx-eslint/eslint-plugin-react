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

It takes an option as the second parameter, which corresponding what components tags should be self-closed when this is possible.

```js
...
"self-closing-comp": [<enabled>, 'all'|'component'|'html'>]
...
```

### `all`

All tags, including custom components and html components should be self-closed.

The following patterns are considered warnings:

```js
var HelloJohn = <Hello name="John"></Hello>;

var contentContainer = <div className="content"></div>;
```

The following patterns are not considered warnings:

```js
var HelloJohn = <Hello name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>;

var contentContainer = <div className="content" />;

var contentContainer = <div className="content"><div /></div>;
```

### `component`

Only custom components tags should be self-closed. This is the default option.

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

Only html components tags should be self-closed.

The following patterns are considered warnings:

```js
var contentContainer = <div className="content"></div>;
```

The following patterns are not considered warnings:

```js
var HelloJohn = <Hello name="John"></Hello>;

var contentContainer = <div className="content" />;

var contentContainer = <div className="content"><div /></div>;
```
