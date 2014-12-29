ESLint-plugin-React
===================

[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url] [![Coverage Status][coverage-image]][coverage-url] [![Code Climate][climate-image]][climate-url]

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
    "react/wrap-multilines": 1,
    "react/self-closing-comp": 1
  }
}
```

# List of supported rules

* [no-multi-comp](docs/rules/no-multi-comp.md): Prevent multiple component definition per file
* [prop-types](docs/rules/prop-types.md): Prevent missing propTypes in a React component definition
* [display-name](docs/rules/display-name.md): Prevent missing displayName in a React component definition
* [wrap-multilines](docs/rules/wrap-multilines.md): Prevent missing parentheses around multilines JSX
* [self-closing-comp](docs/rules/self-closing-comp.md): Prevent extra closing tags for components without children

## To Do

* no-deprecated: Prevent usage of deprecated methods ([React 0.12 Updated API](http://facebook.github.io/react/blog/2014/10/28/react-v0.12.html#new-terminology-amp-updated-apis))
* no-classic: Prevent usage of "classic" methods ([#2700](https://github.com/facebook/react/pull/2700))
* [Implement rules from David Chang's React Style Guide](https://reactjsnews.com/react-style-guide-patterns-i-like)

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

