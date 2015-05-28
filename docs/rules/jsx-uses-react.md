# Prevent React to be incorrectly marked as unused (jsx-uses-react)

JSX expands to a call to `React.createElement`, a file which includes `React`
but only uses JSX should consider the `React` variable as used.

If you are using the @jsx pragma this rule will mark the designated variable and not the `React` one.

This rule has no effect if the `no-unused-vars` rule is not enabled.


## Rule Details

The following patterns are considered warnings:

```js
var React = require('react');

// nothing to do with React
```

```js
/** @jsx Foo */
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

The following patterns are not considered warnings:

```js
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

```js
/** @jsx Foo */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```


## Rule Options

```js
...
"jsx-uses-react": [<enabled>, { "pragma": <string> }]
...
```

### `pragma`

As an alternative to specifying the above pragma in each source file, you can specify
this configuration option:

```js
var Foo = require('Foo');

var Hello = <div>Hello {this.props.name}</div>;
```


## When Not To Use It

If you are not using JSX, if React is declared as global variable or if you do not use the `no-unused-vars` rule then you can disable this rule.
