ESLint-plugin-React
===================

[![Join the chat at https://gitter.im/yannickcr/eslint-plugin-react](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yannickcr/eslint-plugin-react?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url] [![Coverage Status][coverage-image]][coverage-url] [![Code Climate][climate-image]][climate-url]

React specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

    npm install eslint

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

If it is not already the case you must also configure `ESLint` to support JSX.

```json
{
  "ecmaFeatures": {
    "jsx": true
  }
}
```

Finally, enable all of the rules that you would like to use.

```json
{
  "rules": {
    "react/display-name": 1,
    "react/jsx-boolean-value": 1,
    "react/jsx-quotes": 1,
    "react/jsx-no-undef": 1,
    "react/jsx-sort-props": 1,
    "react/jsx-sort-prop-types": 1,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/no-did-mount-set-state": 1,
    "react/no-did-update-set-state": 1,
    "react/no-multi-comp": 1,
    "react/no-unknown-property": 1,
    "react/prop-types": 1,
    "react/react-in-jsx-scope": 1,
    "react/self-closing-comp": 1,
    "react/sort-comp": 1,
    "react/wrap-multilines": 1
  }
}
```

# List of supported rules

* [display-name](docs/rules/display-name.md): Prevent missing displayName in a React component definition
* [jsx-boolean-value](docs/rules/jsx-boolean-value.md): Enforce boolean attributes notation in JSX
* [jsx-quotes](docs/rules/jsx-quotes.md): Enforce quote style for JSX attributes
* [jsx-no-undef](docs/rules/jsx-no-undef.md): Disallow undeclared variables in JSX
* [jsx-sort-props](docs/rules/jsx-sort-props.md): Enforce props alphabetical sorting
* [jsx-sort-prop-types](docs/rules/jsx-sort-prop-types.md): Enforce propTypes declarations alphabetical sorting
* [jsx-uses-react](docs/rules/jsx-uses-react.md): Prevent React to be incorrectly marked as unused
* [jsx-uses-vars](docs/rules/jsx-uses-vars.md): Prevent variables used in JSX to be incorrectly marked as unused
* [no-did-mount-set-state](docs/rules/no-did-mount-set-state.md): Prevent usage of setState in componentDidMount
* [no-did-update-set-state](docs/rules/no-did-update-set-state.md): Prevent usage of setState in componentDidUpdate
* [no-multi-comp](docs/rules/no-multi-comp.md): Prevent multiple component definition per file
* [no-unknown-property](docs/rules/no-unknown-property.md): Prevent usage of unknown DOM property
* [prop-types](docs/rules/prop-types.md): Prevent missing props validation in a React component definition
* [react-in-jsx-scope](docs/rules/react-in-jsx-scope.md): Prevent missing React when using JSX
* [self-closing-comp](docs/rules/self-closing-comp.md): Prevent extra closing tags for components without children
* [sort-comp](docs/rules/sort-comp.md): Enforce component methods order
* [wrap-multilines](docs/rules/wrap-multilines.md): Prevent missing parentheses around multilines JSX

## To Do

* no-deprecated: Prevent usage of deprecated methods ([React 0.12 Updated API](http://facebook.github.io/react/blog/2014/10/28/react-v0.12.html#new-terminology-amp-updated-apis))
* no-classic: Prevent usage of "classic" methods ([#2700](https://github.com/facebook/react/pull/2700))
* [Implement relevant rules from David Chang's React Style Guide](https://reactjsnews.com/react-style-guide-patterns-i-like)
* [Implement relevant rules from John Cobb's best practices and conventions](http://web-design-weekly.com/2015/01/29/opinionated-guide-react-js-best-practices-conventions/)
* [Implement relevant rules from Alexander Early's tips and best practices](http://aeflash.com/2015-02/react-tips-and-best-practices.html)

[Any rule idea is welcome !](https://github.com/yannickcr/eslint-plugin-react/issues)

# License

ESLint-plugin-React is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).


[npm-url]: https://npmjs.org/package/eslint-plugin-react
[npm-image]: http://img.shields.io/npm/v/eslint-plugin-react.svg?style=flat-square

[travis-url]: https://travis-ci.org/yannickcr/eslint-plugin-react
[travis-image]: http://img.shields.io/travis/yannickcr/eslint-plugin-react/master.svg?style=flat-square

[deps-url]: https://david-dm.org/yannickcr/eslint-plugin-react
[deps-image]: https://img.shields.io/david/dev/yannickcr/eslint-plugin-react.svg?style=flat-square

[coverage-url]: https://coveralls.io/r/yannickcr/eslint-plugin-react?branch=master
[coverage-image]: http://img.shields.io/coveralls/yannickcr/eslint-plugin-react/master.svg?style=flat-square

[climate-url]: https://codeclimate.com/github/yannickcr/eslint-plugin-react
[climate-image]: http://img.shields.io/codeclimate/github/yannickcr/eslint-plugin-react.svg?style=flat-square

[status-url]: https://github.com/yannickcr/eslint-plugin-react/pulse
[status-image]: http://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat-square
