ESLint-plugin-React
===================

React specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

    npm install eslint@es6jsx

ESLint-plugin-React requires `ESLint` with JSX support which is only available on the `es6jsx` branch for now.

If you installed `ESLint` globally, you have to install React plugin globally too. Otherwise, install it locally.

    $ npm install eslint-plugin-react

# Configuration

Add `plugins` section and specify ESLint-plugin-React as a plugin.

```json
{
  "plugins": [
    "react"
  ]
}
```

If it is not already the case you must also configure `ESLint` to support ECMAScript 6 and JSX.

```json
{
  "settings": {
    "ecmascript": 6,
    "jsx": true
  }
}
```

Finally, enable all of the rules that you would like to use.

```json
{
  "rules": {
    "react/no-multi-comp": 1,
    "react/prop-types": 1,
    "react/display-name": 1,
    "react/wrap-multilines": 1
  }
}
```

# List of supported rules

* [no-multi-comp](docs/rules/no-multi-comp.md): Prevent multiple component definition per file
* [prop-types](docs/rules/prop-types.md): Prevent missing propTypes in a React component definition
* [display-name](docs/rules/display-name.md): Prevent missing displayName in a React component definition
* [wrap-multilines](docs/rules/wrap-multilines.md): Prevent missing parentheses around multilines JSX

## To Do

* no-deprecated: Prevent usage of deprecated methods ([React 0.12 Updated API](http://facebook.github.io/react/blog/2014/10/28/react-v0.12.html#new-terminology-amp-updated-apis))
* no-classic: Prevent usage of "classic" methods ([#2700](https://github.com/facebook/react/pull/2700))
* [Implement rules from David Chang's React Style Guide](https://reactjsnews.com/react-style-guide-patterns-i-like)

[Any rule idea is welcome !](https://github.com/yannickcr/eslint-plugin-react/issues)

# License

ESLint-plugin-React is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
