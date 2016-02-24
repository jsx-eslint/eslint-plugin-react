# Prevent usage of unknown DOM property (no-unknown-property)

In JSX all DOM properties and attributes should be camelCased to be consistent with standard JavaScript style. This can be a possible source of error if you are used to writing plain HTML.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

The following patterns are considered warnings:

```js
var React = require('react');

var Hello = <div class="hello">Hello World</div>;
```

The following patterns are not considered warnings:

```js
var React = require('react');

var Hello = <div className="hello">Hello World</div>;
```

## When Not To Use It

If you are not using JSX you can disable this rule.
