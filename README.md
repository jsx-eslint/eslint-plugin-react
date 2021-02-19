ESLint-plugin-React
===================

[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url] [![Coverage Status][coverage-image]][coverage-url] [![Code Climate][climate-image]][climate-url] [![Tidelift][tidelift-image]][tidelift-url]

React specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally. (Note that locally, per project, is strongly preferred)

```sh
$ npm install eslint --save-dev
```

If you installed `ESLint` globally, you have to install React plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-react --save-dev
```

# Configuration

Use [our preset](#recommended) to get reasonable defaults:

```json
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ]
```

You should also specify settings that will be shared across all the plugin rules. ([More about eslint shared settings](https://eslint.org/docs/user-guide/configuring#adding-shared-settings))

```json5
{
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
                                         // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "fragment": "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                           // default to latest and warns if missing
                           // It will default to "detect" in the future
      "flowVersion": "0.53" // Flow version
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"}
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {"name": "Link", "linkAttribute": "to"}
    ]
  }
}
```

If you do not use a preset you will need to specify individual rules and add extra configuration.

Add "react" to the plugins section.

```json
{
  "plugins": [
    "react"
  ]
}
```

Enable JSX support.

With ESLint 2+

```json
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
```

Enable the rules that you would like to use.

```json
  "rules": {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  }
```

# List of supported rules

<!-- AUTO-GENERATED-CONTENT:START (BASIC_RULES) -->
* [react/boolean-prop-naming](docs/rules/boolean-prop-naming.md): Enforces consistent naming for boolean props
* [react/button-has-type](docs/rules/button-has-type.md): Forbid "button" element without an explicit "type" attribute
* [react/default-props-match-prop-types](docs/rules/default-props-match-prop-types.md): Enforce all defaultProps are defined and not "required" in propTypes.
* [react/destructuring-assignment](docs/rules/destructuring-assignment.md): Enforce consistent usage of destructuring assignment of props, state, and context
* [react/display-name](docs/rules/display-name.md): Prevent missing displayName in a React component definition
* [react/forbid-component-props](docs/rules/forbid-component-props.md): Forbid certain props on components
* [react/forbid-dom-props](docs/rules/forbid-dom-props.md): Forbid certain props on DOM Nodes
* [react/forbid-elements](docs/rules/forbid-elements.md): Forbid certain elements
* [react/forbid-foreign-prop-types](docs/rules/forbid-foreign-prop-types.md): Forbid using another component's propTypes
* [react/forbid-prop-types](docs/rules/forbid-prop-types.md): Forbid certain propTypes
* [react/function-component-definition](docs/rules/function-component-definition.md): Standardize the way function component get defined (fixable)
* [react/no-access-state-in-setstate](docs/rules/no-access-state-in-setstate.md): Reports when this.state is accessed within setState
* [react/no-adjacent-inline-elements](docs/rules/no-adjacent-inline-elements.md): Prevent adjacent inline elements not separated by whitespace.
* [react/no-array-index-key](docs/rules/no-array-index-key.md): Prevent usage of Array index in keys
* [react/no-children-prop](docs/rules/no-children-prop.md): Prevent passing of children as props.
* [react/no-danger](docs/rules/no-danger.md): Prevent usage of dangerous JSX props
* [react/no-danger-with-children](docs/rules/no-danger-with-children.md): Report when a DOM element is using both children and dangerouslySetInnerHTML
* [react/no-deprecated](docs/rules/no-deprecated.md): Prevent usage of deprecated methods
* [react/no-did-mount-set-state](docs/rules/no-did-mount-set-state.md): Prevent usage of setState in componentDidMount
* [react/no-did-update-set-state](docs/rules/no-did-update-set-state.md): Prevent usage of setState in componentDidUpdate
* [react/no-direct-mutation-state](docs/rules/no-direct-mutation-state.md): Prevent direct mutation of this.state
* [react/no-find-dom-node](docs/rules/no-find-dom-node.md): Prevent usage of findDOMNode
* [react/no-is-mounted](docs/rules/no-is-mounted.md): Prevent usage of isMounted
* [react/no-multi-comp](docs/rules/no-multi-comp.md): Prevent multiple component definition per file
* [react/no-redundant-should-component-update](docs/rules/no-redundant-should-component-update.md): Flag shouldComponentUpdate when extending PureComponent
* [react/no-render-return-value](docs/rules/no-render-return-value.md): Prevent usage of the return value of React.render
* [react/no-set-state](docs/rules/no-set-state.md): Prevent usage of setState
* [react/no-string-refs](docs/rules/no-string-refs.md): Prevent string definitions for references and prevent referencing this.refs
* [react/no-this-in-sfc](docs/rules/no-this-in-sfc.md): Report "this" being used in stateless components
* [react/no-typos](docs/rules/no-typos.md): Prevent common typos
* [react/no-unescaped-entities](docs/rules/no-unescaped-entities.md): Detect unescaped HTML entities, which might represent malformed tags
* [react/no-unknown-property](docs/rules/no-unknown-property.md): Prevent usage of unknown DOM property (fixable)
* [react/no-unsafe](docs/rules/no-unsafe.md): Prevent usage of unsafe lifecycle methods
* [react/no-unused-prop-types](docs/rules/no-unused-prop-types.md): Prevent definitions of unused prop types
* [react/no-unused-state](docs/rules/no-unused-state.md): Prevent definition of unused state fields
* [react/no-will-update-set-state](docs/rules/no-will-update-set-state.md): Prevent usage of setState in componentWillUpdate
* [react/prefer-es6-class](docs/rules/prefer-es6-class.md): Enforce ES5 or ES6 class for React Components
* [react/prefer-read-only-props](docs/rules/prefer-read-only-props.md): Require read-only props. (fixable)
* [react/prefer-stateless-function](docs/rules/prefer-stateless-function.md): Enforce stateless components to be written as a pure function
* [react/prop-types](docs/rules/prop-types.md): Prevent missing props validation in a React component definition
* [react/react-in-jsx-scope](docs/rules/react-in-jsx-scope.md): Prevent missing React when using JSX
* [react/require-default-props](docs/rules/require-default-props.md): Enforce a defaultProps definition for every prop that is not a required prop.
* [react/require-optimization](docs/rules/require-optimization.md): Enforce React components to have a shouldComponentUpdate method
* [react/require-render-return](docs/rules/require-render-return.md): Enforce ES5 or ES6 class for returning value in render function
* [react/self-closing-comp](docs/rules/self-closing-comp.md): Prevent extra closing tags for components without children (fixable)
* [react/sort-comp](docs/rules/sort-comp.md): Enforce component methods order
* [react/sort-prop-types](docs/rules/sort-prop-types.md): Enforce propTypes declarations alphabetical sorting
* [react/state-in-constructor](docs/rules/state-in-constructor.md): State initialization in an ES6 class component should be in a constructor
* [react/static-property-placement](docs/rules/static-property-placement.md): Defines where React component static properties should be positioned.
* [react/style-prop-object](docs/rules/style-prop-object.md): Enforce style prop value is an object
* [react/void-dom-elements-no-children](docs/rules/void-dom-elements-no-children.md): Prevent passing of children to void DOM elements (e.g. `<br />`).
<!-- AUTO-GENERATED-CONTENT:END -->

## JSX-specific rules

<!-- AUTO-GENERATED-CONTENT:START (JSX_RULES) -->
* [react/jsx-boolean-value](docs/rules/jsx-boolean-value.md): Enforce boolean attributes notation in JSX (fixable)
* [react/jsx-child-element-spacing](docs/rules/jsx-child-element-spacing.md): Ensures inline tags are not rendered without spaces between them
* [react/jsx-closing-bracket-location](docs/rules/jsx-closing-bracket-location.md): Validate closing bracket location in JSX (fixable)
* [react/jsx-closing-tag-location](docs/rules/jsx-closing-tag-location.md): Validate closing tag location for multiline JSX (fixable)
* [react/jsx-curly-brace-presence](docs/rules/jsx-curly-brace-presence.md): Disallow unnecessary JSX expressions when literals alone are sufficient or enfore JSX expressions on literals in JSX children or attributes (fixable)
* [react/jsx-curly-newline](docs/rules/jsx-curly-newline.md): Enforce consistent line breaks inside jsx curly (fixable)
* [react/jsx-curly-spacing](docs/rules/jsx-curly-spacing.md): Enforce or disallow spaces inside of curly braces in JSX attributes (fixable)
* [react/jsx-equals-spacing](docs/rules/jsx-equals-spacing.md): Disallow or enforce spaces around equal signs in JSX attributes (fixable)
* [react/jsx-filename-extension](docs/rules/jsx-filename-extension.md): Restrict file extensions that may contain JSX
* [react/jsx-first-prop-new-line](docs/rules/jsx-first-prop-new-line.md): Ensure proper position of the first property in JSX (fixable)
* [react/jsx-fragments](docs/rules/jsx-fragments.md): Enforce shorthand or standard form for React fragments (fixable)
* [react/jsx-handler-names](docs/rules/jsx-handler-names.md): Enforce event handler naming conventions in JSX
* [react/jsx-indent](docs/rules/jsx-indent.md): Validate JSX indentation (fixable)
* [react/jsx-indent-props](docs/rules/jsx-indent-props.md): Validate props indentation in JSX (fixable)
* [react/jsx-key](docs/rules/jsx-key.md): Report missing `key` props in iterators/collection literals
* [react/jsx-max-depth](docs/rules/jsx-max-depth.md): Validate JSX maximum depth
* [react/jsx-max-props-per-line](docs/rules/jsx-max-props-per-line.md): Limit maximum of props on a single line in JSX (fixable)
* [react/jsx-newline](docs/rules/jsx-newline.md): Enforce a new line after jsx elements and expressions (fixable)
* [react/jsx-no-bind](docs/rules/jsx-no-bind.md): Prevents usage of Function.prototype.bind and arrow functions in React component props
* [react/jsx-no-comment-textnodes](docs/rules/jsx-no-comment-textnodes.md): Comments inside children section of tag should be placed inside braces
* [react/jsx-no-constructed-context-values](docs/rules/jsx-no-constructed-context-values.md): Prevents JSX context provider values from taking values that will cause needless rerenders.
* [react/jsx-no-duplicate-props](docs/rules/jsx-no-duplicate-props.md): Enforce no duplicate props
* [react/jsx-no-literals](docs/rules/jsx-no-literals.md): Prevent using string literals in React component definition
* [react/jsx-no-script-url](docs/rules/jsx-no-script-url.md): Forbid `javascript:` URLs
* [react/jsx-no-target-blank](docs/rules/jsx-no-target-blank.md): Forbid `target="_blank"` attribute without `rel="noreferrer"`
* [react/jsx-no-undef](docs/rules/jsx-no-undef.md): Disallow undeclared variables in JSX
* [react/jsx-no-useless-fragment](docs/rules/jsx-no-useless-fragment.md): Disallow unnecessary fragments (fixable)
* [react/jsx-one-expression-per-line](docs/rules/jsx-one-expression-per-line.md): Limit to one expression per line in JSX (fixable)
* [react/jsx-pascal-case](docs/rules/jsx-pascal-case.md): Enforce PascalCase for user-defined JSX components
* [react/jsx-props-no-multi-spaces](docs/rules/jsx-props-no-multi-spaces.md): Disallow multiple spaces between inline JSX props (fixable)
* [react/jsx-props-no-spreading](docs/rules/jsx-props-no-spreading.md): Prevent JSX prop spreading
* [react/jsx-sort-default-props](docs/rules/jsx-sort-default-props.md): Enforce default props alphabetical sorting
* [react/jsx-sort-props](docs/rules/jsx-sort-props.md): Enforce props alphabetical sorting (fixable)
* [react/jsx-space-before-closing](docs/rules/jsx-space-before-closing.md): Validate spacing before closing bracket in JSX (fixable)
* [react/jsx-tag-spacing](docs/rules/jsx-tag-spacing.md): Validate whitespace in and around the JSX opening and closing brackets (fixable)
* [react/jsx-uses-react](docs/rules/jsx-uses-react.md): Prevent React to be marked as unused
* [react/jsx-uses-vars](docs/rules/jsx-uses-vars.md): Prevent variables used in JSX to be marked as unused
* [react/jsx-wrap-multilines](docs/rules/jsx-wrap-multilines.md): Prevent missing parentheses around multilines JSX (fixable)
<!-- AUTO-GENERATED-CONTENT:END -->

## Other useful plugins

- Rules of Hooks: [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks)
- JSX accessibility: [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)
- React Native: [eslint-plugin-react-native](https://github.com/Intellicode/eslint-plugin-react-native)

# Shareable configurations

## Recommended

This plugin exports a `recommended` configuration that enforces React good practices.

To enable this configuration use the `extends` property in your `.eslintrc` config file:

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"]
}
```

See [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending configuration files.

The rules enabled in this configuration are:

* [react/display-name](docs/rules/display-name.md)
* [react/jsx-key](docs/rules/jsx-key.md)
* [react/jsx-no-comment-textnodes](docs/rules/jsx-no-comment-textnodes.md)
* [react/jsx-no-duplicate-props](docs/rules/jsx-no-duplicate-props.md)
* [react/jsx-no-target-blank](docs/rules/jsx-no-target-blank.md)
* [react/jsx-no-undef](docs/rules/jsx-no-undef.md)
* [react/jsx-uses-react](docs/rules/jsx-uses-react.md)
* [react/jsx-uses-vars](docs/rules/jsx-uses-vars.md)
* [react/no-children-prop](docs/rules/no-children-prop.md)
* [react/no-danger-with-children](docs/rules/no-danger-with-children.md)
* [react/no-deprecated](docs/rules/no-deprecated.md)
* [react/no-direct-mutation-state](docs/rules/no-direct-mutation-state.md)
* [react/no-find-dom-node](docs/rules/no-find-dom-node.md)
* [react/no-is-mounted](docs/rules/no-is-mounted.md)
* [react/no-render-return-value](docs/rules/no-render-return-value.md)
* [react/no-string-refs](docs/rules/no-string-refs.md)
* [react/no-unescaped-entities](docs/rules/no-unescaped-entities.md)
* [react/no-unknown-property](docs/rules/no-unknown-property.md)
* [react/prop-types](docs/rules/prop-types.md)
* [react/react-in-jsx-scope](docs/rules/react-in-jsx-scope.md)
* [react/require-render-return](docs/rules/require-render-return.md)

## All

This plugin also exports an `all` configuration that includes every available rule.
This pairs well with the `eslint:all` rule.

```json
{
  "plugins": [
    "react"
  ],
  "extends": ["eslint:all", "plugin:react/all"]
}
```

**Note**: These configurations will import `eslint-plugin-react` and enable JSX in [parser options](http://eslint.org/docs/user-guide/configuring#specifying-parser-options).

# License

ESLint-plugin-React is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).


[npm-url]: https://npmjs.org/package/eslint-plugin-react
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-react.svg

[travis-url]: https://travis-ci.org/yannickcr/eslint-plugin-react
[travis-image]: https://img.shields.io/travis/yannickcr/eslint-plugin-react/master.svg

[deps-url]: https://david-dm.org/yannickcr/eslint-plugin-react
[deps-image]: https://img.shields.io/david/dev/yannickcr/eslint-plugin-react.svg

[coverage-url]: https://coveralls.io/r/yannickcr/eslint-plugin-react?branch=master
[coverage-image]: https://img.shields.io/coveralls/yannickcr/eslint-plugin-react/master.svg

[climate-url]: https://codeclimate.com/github/yannickcr/eslint-plugin-react
[climate-image]: https://img.shields.io/codeclimate/maintainability/yannickcr/eslint-plugin-react.svg

[status-url]: https://github.com/yannickcr/eslint-plugin-react/pulse
[status-image]: https://img.shields.io/github/last-commit/yannickcr/eslint-plugin-react.svg

[tidelift-url]: https://tidelift.com/subscription/pkg/npm-eslint-plugin-react?utm_source=npm-eslint-plugin-react&utm_medium=referral&utm_campaign=readme
[tidelift-image]: https://tidelift.com/badges/github/yannickcr/eslint-plugin-react?style=flat
