ESLint-plugin-React
===================

[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Build Status][appveyor-image]][appveyor-url] [![Dependency Status][deps-image]][deps-url] [![Coverage Status][coverage-image]][coverage-url] [![Code Climate][climate-image]][climate-url]

React specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
$ npm install eslint
```

If you installed `ESLint` globally, you have to install React plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-react
```

# Configuration

Add `plugins` section and specify ESLint-plugin-React as a plugin.

```json
{
  "plugins": [
    "react"
  ]
}
```

You can also specify some settings that will be shared across all the plugin rules.

```js
{
  "settings": {
    "react": {
      "pragma": "React" // Pragma to use, default to "React"
    }
  }
}
```

If it is not already the case you must also configure `ESLint` to support JSX.

With ESLint 1.x.x:

```json
{
  "ecmaFeatures": {
    "jsx": true
  }
}
```

With ESLint 2.x.x:

```json
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
```

Finally, enable all of the rules that you would like to use.

```json
{
  "rules": {
    "react/display-name": 1,
    "react/forbid-prop-types": 1,
    "react/jsx-boolean-value": 1,
    "react/jsx-closing-bracket-location": 1,
    "react/jsx-curly-spacing": 1,
    "react/jsx-equals-spacing": 1,
    "react/jsx-handler-names": 1,
    "react/jsx-indent-props": 1,
    "react/jsx-indent": 1,
    "react/jsx-key": 1,
    "react/jsx-max-props-per-line": 1,
    "react/jsx-no-bind": 1,
    "react/jsx-no-duplicate-props": 1,
    "react/jsx-no-literals": 1,
    "react/jsx-no-undef": 1,
    "react/jsx-pascal-case": 1,
    "react/jsx-quotes": 1,
    "react/jsx-sort-prop-types": 1,
    "react/jsx-sort-props": 1,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/no-danger": 1,
    "react/no-deprecated": 1,
    "react/no-did-mount-set-state": 1,
    "react/no-did-update-set-state": 1,
    "react/no-direct-mutation-state": 1,
    "react/no-is-mounted": 1,
    "react/no-multi-comp": 1,
    "react/no-set-state": 1,
    "react/no-string-refs": 1,
    "react/no-unknown-property": 1,
    "react/prefer-es6-class": 1,
    "react/prop-types": 1,
    "react/react-in-jsx-scope": 1,
    "react/require-extension": 1,
    "react/self-closing-comp": 1,
    "react/sort-comp": 1,
    "react/wrap-multilines": 1
  }
}
```

# List of supported rules

* [display-name](docs/rules/display-name.md): Prevent missing `displayName` in a React component definition
* [forbid-prop-types](docs/rules/forbid-prop-types.md): Forbid certain propTypes
* [jsx-boolean-value](docs/rules/jsx-boolean-value.md): Enforce boolean attributes notation in JSX (fixable)
* [jsx-closing-bracket-location](docs/rules/jsx-closing-bracket-location.md): Validate closing bracket location in JSX
* [jsx-curly-spacing](docs/rules/jsx-curly-spacing.md): Enforce or disallow spaces inside of curly braces in JSX attributes (fixable)
* [jsx-equals-spacing](docs/rules/jsx-equals-spacing.md): Enforce or disallow spaces around equal signs in JSX attributes
* [jsx-handler-names](docs/rules/jsx-handler-names.md): Enforce event handler naming conventions in JSX
* [jsx-indent-props](docs/rules/jsx-indent-props.md): Validate props indentation in JSX
* [jsx-indent](docs/rules/jsx-indent.md): Validate JSX indentation
* [jsx-key](docs/rules/jsx-key.md): Validate JSX has key prop when in array or iterator
* [jsx-max-props-per-line](docs/rules/jsx-max-props-per-line.md): Limit maximum of props on a single line in JSX
* [jsx-no-bind](docs/rules/jsx-no-bind.md): Prevent usage of `.bind()` and arrow functions in JSX props
* [jsx-no-duplicate-props](docs/rules/jsx-no-duplicate-props.md): Prevent duplicate props in JSX
* [jsx-no-literals](docs/rules/jsx-no-literals.md): Prevent usage of unwrapped JSX strings
* [jsx-no-undef](docs/rules/jsx-no-undef.md): Disallow undeclared variables in JSX
* [jsx-pascal-case](docs/rules/jsx-pascal-case.md): Enforce PascalCase for user-defined JSX components
* [jsx-quotes](docs/rules/jsx-quotes.md): Enforce quote style for JSX attributes
* [jsx-sort-prop-types](docs/rules/jsx-sort-prop-types.md): Enforce propTypes declarations alphabetical sorting
* [jsx-sort-props](docs/rules/jsx-sort-props.md): Enforce props alphabetical sorting
* [jsx-uses-react](docs/rules/jsx-uses-react.md): Prevent React to be incorrectly marked as unused
* [jsx-uses-vars](docs/rules/jsx-uses-vars.md): Prevent variables used in JSX to be incorrectly marked as unused
* [no-danger](docs/rules/no-danger.md): Prevent usage of dangerous JSX properties
* [no-deprecated](docs/rules/no-deprecated.md): Prevent usage of deprecated methods
* [no-did-mount-set-state](docs/rules/no-did-mount-set-state.md): Prevent usage of `setState` in `componentDidMount`
* [no-did-update-set-state](docs/rules/no-did-update-set-state.md): Prevent usage of `setState` in `componentDidUpdate`
* [no-direct-mutation-state](docs/rules/no-direct-mutation-state.md): Prevent direct mutation of `this.state`
* [no-is-mounted](docs/rules/no-is-mounted.md): Prevent usage of `isMounted`
* [no-multi-comp](docs/rules/no-multi-comp.md): Prevent multiple component definition per file
* [no-set-state](docs/rules/no-set-state.md): Prevent usage of `setState`
* [no-string-refs](docs/rules/no-string-refs.md): Prevent using string references in `ref` attribute.
* [no-unknown-property](docs/rules/no-unknown-property.md): Prevent usage of unknown DOM property (fixable)
* [prefer-es6-class](docs/rules/prefer-es6-class.md): Enforce ES5 or ES6 class for React Components
* [prop-types](docs/rules/prop-types.md): Prevent missing props validation in a React component definition
* [react-in-jsx-scope](docs/rules/react-in-jsx-scope.md): Prevent missing `React` when using JSX
* [require-extension](docs/rules/require-extension.md): Restrict file extensions that may be required
* [self-closing-comp](docs/rules/self-closing-comp.md): Prevent extra closing tags for components without children
* [sort-comp](docs/rules/sort-comp.md): Enforce component methods order
* [wrap-multilines](docs/rules/wrap-multilines.md): Prevent missing parentheses around multilines JSX (fixable)

## React Native

If you're searching for React Native specific linting rules, check out [eslint-plugin-react-native](https://github.com/Intellicode/eslint-plugin-react-native).

# License

ESLint-plugin-React is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).


[npm-url]: https://npmjs.org/package/eslint-plugin-react
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-react.svg

[travis-url]: https://travis-ci.org/yannickcr/eslint-plugin-react
[travis-image]: https://img.shields.io/travis/yannickcr/eslint-plugin-react/master.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSItMTQyLjUgLTE0Mi41IDI4NSAyODUiPjxjaXJjbGUgcj0iMTQxLjciIGZpbGw9IiNERDQ4MTQiLz48ZyBpZD0iYSIgZmlsbD0iI0ZGRiI%2BPGNpcmNsZSBjeD0iLTk2LjQiIHI9IjE4LjkiLz48cGF0aCBkPSJNLTQ1LjYgNjguNGMtMTYuNi0xMS0yOS0yOC0zNC00Ny44IDYtNSA5LjgtMTIuMyA5LjgtMjAuNnMtMy44LTE1LjctOS44LTIwLjZjNS0xOS44IDE3LjQtMzYuNyAzNC00Ny44bDEzLjggMjMuMkMtNDYtMzUuMi01NS4zLTE4LjctNTUuMyAwYzAgMTguNyA5LjMgMzUuMiAyMy41IDQ1LjJ6Ii8%2BPC9nPjx1c2UgeGxpbms6aHJlZj0iI2EiIHRyYW5zZm9ybT0icm90YXRlKDEyMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNhIiB0cmFuc2Zvcm09InJvdGF0ZSgyNDApIi8%2BPC9zdmc%2B

[appveyor-url]: https://ci.appveyor.com/project/yannickcr/eslint-plugin-react
[appveyor-image]: https://img.shields.io/appveyor/ci/yannickcr/eslint-plugin-react/master.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48ZyBmaWxsPSIjMUJBMUUyIiB0cmFuc2Zvcm09InNjYWxlKDgpIj48cGF0aCBkPSJNMCAyLjI2NWw2LjUzOS0uODg4LjAwMyA2LjI4OC02LjUzNi4wMzd6Ii8%2BPHBhdGggZD0iTTYuNTM2IDguMzlsLjAwNSA2LjI5My02LjUzNi0uODk2di01LjQ0eiIvPjxwYXRoIGQ9Ik03LjMyOCAxLjI2MWw4LjY3LTEuMjYxdjcuNTg1bC04LjY3LjA2OXoiLz48cGF0aCBkPSJNMTYgOC40NDlsLS4wMDIgNy41NTEtOC42Ny0xLjIyLS4wMTItNi4zNDV6Ii8%2BPC9nPjwvc3ZnPg==

[deps-url]: https://david-dm.org/yannickcr/eslint-plugin-react
[deps-image]: https://img.shields.io/david/dev/yannickcr/eslint-plugin-react.svg

[coverage-url]: https://coveralls.io/r/yannickcr/eslint-plugin-react?branch=master
[coverage-image]: https://img.shields.io/coveralls/yannickcr/eslint-plugin-react/master.svg

[climate-url]: https://codeclimate.com/github/yannickcr/eslint-plugin-react
[climate-image]: https://img.shields.io/codeclimate/github/yannickcr/eslint-plugin-react.svg

[status-url]: https://github.com/yannickcr/eslint-plugin-react/pulse
[status-image]: https://img.shields.io/badge/status-maintained-brightgreen.svg
