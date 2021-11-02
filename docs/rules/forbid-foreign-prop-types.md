# Forbid foreign propTypes (react/forbid-foreign-prop-types)

This rule forbids using another component's prop types unless they are explicitly imported/exported. This allows people who want to use [babel-plugin-transform-react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types) to remove propTypes from their components in production builds, to do so safely.

In order to ensure that imports are explicitly exported it is recommended to use the ["named" rule in eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md) in conjunction with this rule.

## Rule Details

This rule checks all objects and ensures that the `propTypes` property is not used.

Examples of **incorrect** code for this rule:

```js
import SomeComponent from './SomeComponent';
SomeComponent.propTypes;

var { propTypes } = SomeComponent;

SomeComponent['propTypes'];
```

Examples of **correct** code for this rule:

```js
import SomeComponent, {propTypes as someComponentPropTypes} from './SomeComponent';
```

## When Not To Use It

This rule aims to make a certain production optimization, removing prop types, less prone to error. This rule may not be relevant to you if you do not wish to make use of this optimization.

If you are writing a higher-order component that hoists the wrapped component's propTypes, you might want to disable this rule.
