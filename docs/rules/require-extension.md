# Restrict file extensions that may be required (require-extension)

`require()` statements should generally not include a file extension as there is a well defined mechanism for resolving a module ID to a specific file. This rule inspects the module ID being required and creates a warning if the ID contains a '.jsx' file extension.

Note: this rule does not prevent required files from containing these extensions, it merely prevents the extension from being included in the `require()` statement.

## Rule Details

The following patterns are considered warnings:

```js
var index = require('./index.jsx');

// When [1, {extensions: ['.js']}]
var index = require('./index.js');
```

The following patterns are not considered warnings:

```js
var index = require('./index');

var eslint = require('eslint');
```

## Rule Options

The set of forbidden extensions is configurable. By default '.jsx' is blocked. If you wanted to forbid both '.jsx' and '.js', the configuration would be:

```js
"rules": {
  "react/require-extension": [1, { "extensions": [".js", ".jsx"] }],
}
```

To configure WebPack to resolve '.jsx' add the following to `webpack.config.js`:

```js
resolve: {
    extensions: ["", ".js", ".jsx"]
  },
```

## When Not To Use It

If you have file in your project with a '.jsx' file extension and do not have `require()` configured to automatically resolve '.jsx' files.
