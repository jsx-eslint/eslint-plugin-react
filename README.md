# `eslint-plugin-react` <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

===================

[![github actions][actions-image]][actions-url]
[![Maintenance Status][status-image]][status-url]
[![NPM version][npm-image]][npm-url]
[![Tidelift][tidelift-image]][tidelift-url]

React specific linting rules for `eslint`

## Installation

```sh
npm install eslint eslint-plugin-react --save-dev
```

It is also possible to install ESLint globally rather than locally (using npm install eslint --global). However, this is not recommended, and any plugins or shareable configs that you use must be installed locally in either case.

## Configuration

Use [our preset](#recommended) to get reasonable defaults:

```json
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ]
```

If you are using the [new JSX transform from React 17](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#removing-unused-react-imports), extend [`react/jsx-runtime`](https://github.com/jsx-eslint/eslint-plugin-react/blob/c8917b0885094b5e4cc2a6f613f7fb6f16fe932e/index.js#L163-L176) in your eslint config (add `"plugin:react/jsx-runtime"` to `"extends"`) to disable the relevant rules.

You should also specify settings that will be shared across all the plugin rules. ([More about eslint shared settings](https://eslint.org/docs/user-guide/configuring/configuration-files#adding-shared-settings))

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
                           // It will default to "latest" and warn if missing, and to "detect" in the future
      "flowVersion": "0.53" // Flow version
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"},
        // for rules that check exact prop wrappers
        {"property": "forbidExtraProps", "exact": true}
    ],
    "componentWrapperFunctions": [
        // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
        "observer", // `property`
        {"property": "styled"}, // `object` is optional
        {"property": "observer", "object": "Mobx"},
        {"property": "observer", "object": "<pragma>"} // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    "formComponents": [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      "CustomForm",
      {"name": "Form", "formAttribute": "endpoint"}
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

With `eslint` 2+

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

## List of supported rules

✔: Enabled in the [`recommended`](#recommended) configuration.\
🔧: Fixable with [`eslint --fix`](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems).\
💡: Provides editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- AUTO-GENERATED-CONTENT:START (BASIC_RULES) -->
| ✔ | 🔧 | 💡 | Rule | Description |
| :---: | :---: | :---: | :--- | :--- |
|  |  |  | [react/boolean-prop-naming](docs/rules/boolean-prop-naming.md) | Enforces consistent naming for boolean props |
|  |  |  | [react/button-has-type](docs/rules/button-has-type.md) | Disallow usage of `button` elements without an explicit `type` attribute |
|  |  |  | [react/default-props-match-prop-types](docs/rules/default-props-match-prop-types.md) | Enforce all defaultProps have a corresponding non-required PropType |
|  | 🔧 |  | [react/destructuring-assignment](docs/rules/destructuring-assignment.md) | Enforce consistent usage of destructuring assignment of props, state, and context |
| ✔ |  |  | [react/display-name](docs/rules/display-name.md) | Disallow missing displayName in a React component definition |
|  |  |  | [react/forbid-component-props](docs/rules/forbid-component-props.md) | Disallow certain props on components |
|  |  |  | [react/forbid-dom-props](docs/rules/forbid-dom-props.md) | Disallow certain props on DOM Nodes |
|  |  |  | [react/forbid-elements](docs/rules/forbid-elements.md) | Disallow certain elements |
|  |  |  | [react/forbid-foreign-prop-types](docs/rules/forbid-foreign-prop-types.md) | Disallow using another component's propTypes |
|  |  |  | [react/forbid-prop-types](docs/rules/forbid-prop-types.md) | Disallow certain propTypes |
|  | 🔧 |  | [react/function-component-definition](docs/rules/function-component-definition.md) | Enforce a specific function type for function components |
|  |  | 💡 | [react/hook-use-state](docs/rules/hook-use-state.md) | Ensure destructuring and symmetric naming of useState hook value and setter variables |
|  |  |  | [react/iframe-missing-sandbox](docs/rules/iframe-missing-sandbox.md) | Enforce sandbox attribute on iframe elements |
|  |  |  | [react/no-access-state-in-setstate](docs/rules/no-access-state-in-setstate.md) | Disallow when this.state is accessed within setState |
|  |  |  | [react/no-adjacent-inline-elements](docs/rules/no-adjacent-inline-elements.md) | Disallow adjacent inline elements not separated by whitespace. |
|  |  |  | [react/no-array-index-key](docs/rules/no-array-index-key.md) | Disallow usage of Array index in keys |
|  | 🔧 |  | [react/no-arrow-function-lifecycle](docs/rules/no-arrow-function-lifecycle.md) | Lifecycle methods should be methods on the prototype, not class fields |
| ✔ |  |  | [react/no-children-prop](docs/rules/no-children-prop.md) | Disallow passing of children as props |
|  |  |  | [react/no-danger](docs/rules/no-danger.md) | Disallow usage of dangerous JSX properties |
| ✔ |  |  | [react/no-danger-with-children](docs/rules/no-danger-with-children.md) | Disallow when a DOM element is using both children and dangerouslySetInnerHTML |
| ✔ |  |  | [react/no-deprecated](docs/rules/no-deprecated.md) | Disallow usage of deprecated methods |
|  |  |  | [react/no-did-mount-set-state](docs/rules/no-did-mount-set-state.md) | Disallow usage of setState in componentDidMount |
|  |  |  | [react/no-did-update-set-state](docs/rules/no-did-update-set-state.md) | Disallow usage of setState in componentDidUpdate |
| ✔ |  |  | [react/no-direct-mutation-state](docs/rules/no-direct-mutation-state.md) | Disallow direct mutation of this.state |
| ✔ |  |  | [react/no-find-dom-node](docs/rules/no-find-dom-node.md) | Disallow usage of findDOMNode |
|  | 🔧 |  | [react/no-invalid-html-attribute](docs/rules/no-invalid-html-attribute.md) | Disallow usage of invalid attributes |
| ✔ |  |  | [react/no-is-mounted](docs/rules/no-is-mounted.md) | Disallow usage of isMounted |
|  |  |  | [react/no-multi-comp](docs/rules/no-multi-comp.md) | Disallow multiple component definition per file |
|  |  |  | [react/no-namespace](docs/rules/no-namespace.md) | Enforce that namespaces are not used in React elements |
|  |  |  | [react/no-redundant-should-component-update](docs/rules/no-redundant-should-component-update.md) | Disallow usage of shouldComponentUpdate when extending React.PureComponent |
| ✔ |  |  | [react/no-render-return-value](docs/rules/no-render-return-value.md) | Disallow usage of the return value of ReactDOM.render |
|  |  |  | [react/no-set-state](docs/rules/no-set-state.md) | Disallow usage of setState |
| ✔ |  |  | [react/no-string-refs](docs/rules/no-string-refs.md) | Disallow using string references |
|  |  |  | [react/no-this-in-sfc](docs/rules/no-this-in-sfc.md) | Disallow `this` from being used in stateless functional components |
|  |  |  | [react/no-typos](docs/rules/no-typos.md) | Disallow common typos |
| ✔ |  |  | [react/no-unescaped-entities](docs/rules/no-unescaped-entities.md) | Disallow unescaped HTML entities from appearing in markup |
| ✔ | 🔧 |  | [react/no-unknown-property](docs/rules/no-unknown-property.md) | Disallow usage of unknown DOM property |
|  |  |  | [react/no-unsafe](docs/rules/no-unsafe.md) | Disallow usage of unsafe lifecycle methods |
|  |  |  | [react/no-unstable-nested-components](docs/rules/no-unstable-nested-components.md) | Disallow creating unstable components inside components |
|  |  |  | [react/no-unused-class-component-methods](docs/rules/no-unused-class-component-methods.md) | Disallow declaring unused methods of component class |
|  |  |  | [react/no-unused-prop-types](docs/rules/no-unused-prop-types.md) | Disallow definitions of unused propTypes |
|  |  |  | [react/no-unused-state](docs/rules/no-unused-state.md) | Disallow definitions of unused state |
|  |  |  | [react/no-will-update-set-state](docs/rules/no-will-update-set-state.md) | Disallow usage of setState in componentWillUpdate |
|  |  |  | [react/prefer-es6-class](docs/rules/prefer-es6-class.md) | Enforce ES5 or ES6 class for React Components |
|  |  |  | [react/prefer-exact-props](docs/rules/prefer-exact-props.md) | Prefer exact proptype definitions |
|  | 🔧 |  | [react/prefer-read-only-props](docs/rules/prefer-read-only-props.md) | Enforce that props are read-only |
|  |  |  | [react/prefer-stateless-function](docs/rules/prefer-stateless-function.md) | Enforce stateless components to be written as a pure function |
| ✔ |  |  | [react/prop-types](docs/rules/prop-types.md) | Disallow missing props validation in a React component definition |
| ✔ |  |  | [react/react-in-jsx-scope](docs/rules/react-in-jsx-scope.md) | Disallow missing React when using JSX |
|  |  |  | [react/require-default-props](docs/rules/require-default-props.md) | Enforce a defaultProps definition for every prop that is not a required prop |
|  |  |  | [react/require-optimization](docs/rules/require-optimization.md) | Enforce React components to have a shouldComponentUpdate method |
| ✔ |  |  | [react/require-render-return](docs/rules/require-render-return.md) | Enforce ES5 or ES6 class for returning value in render function |
|  | 🔧 |  | [react/self-closing-comp](docs/rules/self-closing-comp.md) | Disallow extra closing tags for components without children |
|  |  |  | [react/sort-comp](docs/rules/sort-comp.md) | Enforce component methods order |
|  |  |  | [react/sort-prop-types](docs/rules/sort-prop-types.md) | Enforce propTypes declarations alphabetical sorting |
|  |  |  | [react/state-in-constructor](docs/rules/state-in-constructor.md) | Enforce class component state initialization style |
|  |  |  | [react/static-property-placement](docs/rules/static-property-placement.md) | Enforces where React component static properties should be positioned. |
|  |  |  | [react/style-prop-object](docs/rules/style-prop-object.md) | Enforce style prop value is an object |
|  |  |  | [react/void-dom-elements-no-children](docs/rules/void-dom-elements-no-children.md) | Disallow void DOM elements (e.g. `<img />`, `<br />`) from receiving children |
<!-- AUTO-GENERATED-CONTENT:END -->

### JSX-specific rules

<!-- AUTO-GENERATED-CONTENT:START (JSX_RULES) -->
| ✔ | 🔧 | 💡 | Rule | Description |
| :---: | :---: | :---: | :--- | :--- |
|  | 🔧 |  | [react/jsx-boolean-value](docs/rules/jsx-boolean-value.md) | Enforce boolean attributes notation in JSX |
|  |  |  | [react/jsx-child-element-spacing](docs/rules/jsx-child-element-spacing.md) | Enforce or disallow spaces inside of curly braces in JSX attributes and expressions |
|  | 🔧 |  | [react/jsx-closing-bracket-location](docs/rules/jsx-closing-bracket-location.md) | Enforce closing bracket location in JSX |
|  | 🔧 |  | [react/jsx-closing-tag-location](docs/rules/jsx-closing-tag-location.md) | Enforce closing tag location for multiline JSX |
|  | 🔧 |  | [react/jsx-curly-brace-presence](docs/rules/jsx-curly-brace-presence.md) | Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes |
|  | 🔧 |  | [react/jsx-curly-newline](docs/rules/jsx-curly-newline.md) | Enforce consistent linebreaks in curly braces in JSX attributes and expressions |
|  | 🔧 |  | [react/jsx-curly-spacing](docs/rules/jsx-curly-spacing.md) | Enforce or disallow spaces inside of curly braces in JSX attributes and expressions |
|  | 🔧 |  | [react/jsx-equals-spacing](docs/rules/jsx-equals-spacing.md) | Enforce or disallow spaces around equal signs in JSX attributes |
|  |  |  | [react/jsx-filename-extension](docs/rules/jsx-filename-extension.md) | Disallow file extensions that may contain JSX |
|  | 🔧 |  | [react/jsx-first-prop-new-line](docs/rules/jsx-first-prop-new-line.md) | Enforce proper position of the first property in JSX |
|  | 🔧 |  | [react/jsx-fragments](docs/rules/jsx-fragments.md) | Enforce shorthand or standard form for React fragments |
|  |  |  | [react/jsx-handler-names](docs/rules/jsx-handler-names.md) | Enforce event handler naming conventions in JSX |
|  | 🔧 |  | [react/jsx-indent](docs/rules/jsx-indent.md) | Enforce JSX indentation |
|  | 🔧 |  | [react/jsx-indent-props](docs/rules/jsx-indent-props.md) | Enforce props indentation in JSX |
| ✔ |  |  | [react/jsx-key](docs/rules/jsx-key.md) | Disallow missing `key` props in iterators/collection literals |
|  |  |  | [react/jsx-max-depth](docs/rules/jsx-max-depth.md) | Enforce JSX maximum depth |
|  | 🔧 |  | [react/jsx-max-props-per-line](docs/rules/jsx-max-props-per-line.md) | Enforce maximum of props on a single line in JSX |
|  | 🔧 |  | [react/jsx-newline](docs/rules/jsx-newline.md) | Require or prevent a new line after jsx elements and expressions. |
|  |  |  | [react/jsx-no-bind](docs/rules/jsx-no-bind.md) | Disallow `.bind()` or arrow functions in JSX props |
| ✔ |  |  | [react/jsx-no-comment-textnodes](docs/rules/jsx-no-comment-textnodes.md) | Disallow comments from being inserted as text nodes |
|  |  |  | [react/jsx-no-constructed-context-values](docs/rules/jsx-no-constructed-context-values.md) | Disallows JSX context provider values from taking values that will cause needless rerenders |
| ✔ |  |  | [react/jsx-no-duplicate-props](docs/rules/jsx-no-duplicate-props.md) | Disallow duplicate properties in JSX |
|  | 🔧 |  | [react/jsx-no-leaked-render](docs/rules/jsx-no-leaked-render.md) | Disallow problematic leaked values from being rendered |
|  |  |  | [react/jsx-no-literals](docs/rules/jsx-no-literals.md) | Disallow usage of string literals in JSX |
|  |  |  | [react/jsx-no-script-url](docs/rules/jsx-no-script-url.md) | Disallow usage of `javascript:` URLs |
| ✔ | 🔧 |  | [react/jsx-no-target-blank](docs/rules/jsx-no-target-blank.md) | Disallow `target="_blank"` attribute without `rel="noreferrer"` |
| ✔ |  |  | [react/jsx-no-undef](docs/rules/jsx-no-undef.md) | Disallow undeclared variables in JSX |
|  | 🔧 |  | [react/jsx-no-useless-fragment](docs/rules/jsx-no-useless-fragment.md) | Disallow unnecessary fragments |
|  | 🔧 |  | [react/jsx-one-expression-per-line](docs/rules/jsx-one-expression-per-line.md) | Require one JSX element per line |
|  |  |  | [react/jsx-pascal-case](docs/rules/jsx-pascal-case.md) | Enforce PascalCase for user-defined JSX components |
|  | 🔧 |  | [react/jsx-props-no-multi-spaces](docs/rules/jsx-props-no-multi-spaces.md) | Disallow multiple spaces between inline JSX props |
|  |  |  | [react/jsx-props-no-spreading](docs/rules/jsx-props-no-spreading.md) | Disallow JSX prop spreading |
|  |  |  | [react/jsx-sort-default-props](docs/rules/jsx-sort-default-props.md) | Enforce defaultProps declarations alphabetical sorting |
|  | 🔧 |  | [react/jsx-sort-props](docs/rules/jsx-sort-props.md) | Enforce props alphabetical sorting |
|  | 🔧 |  | [react/jsx-space-before-closing](docs/rules/jsx-space-before-closing.md) | Enforce spacing before closing bracket in JSX. ❌ This rule is deprecated. |
|  | 🔧 |  | [react/jsx-tag-spacing](docs/rules/jsx-tag-spacing.md) | Enforce whitespace in and around the JSX opening and closing brackets |
| ✔ |  |  | [react/jsx-uses-react](docs/rules/jsx-uses-react.md) | Disallow React to be incorrectly marked as unused |
| ✔ |  |  | [react/jsx-uses-vars](docs/rules/jsx-uses-vars.md) | Disallow variables used in JSX to be incorrectly marked as unused |
|  | 🔧 |  | [react/jsx-wrap-multilines](docs/rules/jsx-wrap-multilines.md) | Disallow missing parentheses around multiline JSX |
<!-- AUTO-GENERATED-CONTENT:END -->

### Other useful plugins

- Rules of Hooks: [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks)
- JSX accessibility: [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)
- React Native: [eslint-plugin-react-native](https://github.com/Intellicode/eslint-plugin-react-native)

## Shareable configurations

### Recommended

This plugin exports a `recommended` configuration that enforces React good practices.

To enable this configuration use the `extends` property in your `.eslintrc` config file:

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"]
}
```

See [`eslint` documentation](https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files) for more information about extending configuration files.

### All

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

**Note**: These configurations will import `eslint-plugin-react` and enable JSX in [parser options](https://eslint.org/docs/user-guide/configuring/language-options#specifying-parser-options).

## License

`eslint-plugin-react` is licensed under the [MIT License](https://opensource.org/licenses/mit-license.php).

[npm-url]: https://npmjs.org/package/eslint-plugin-react
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-react.svg

[status-url]: https://github.com/jsx-eslint/eslint-plugin-react/pulse
[status-image]: https://img.shields.io/github/last-commit/jsx-eslint/eslint-plugin-react.svg

[tidelift-url]: https://tidelift.com/subscription/pkg/npm-eslint-plugin-react?utm_source=npm-eslint-plugin-react&utm_medium=referral&utm_campaign=readme
[tidelift-image]: https://tidelift.com/badges/package/npm/eslint-plugin-react?style=flat

[package-url]: https://npmjs.org/package/eslint-plugin-react
[npm-version-svg]: https://versionbadg.es/jsx-eslint/eslint-plugin-react.svg

[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/jsx-eslint/eslint-plugin-react
[actions-url]: https://github.com/jsx-eslint/eslint-plugin-react/actions
