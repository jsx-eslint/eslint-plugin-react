# Enforces consistent naming for boolean props (react/boolean-prop-naming)

Allows you to enforce a consistent naming pattern for props which expect a boolean value.

> **Note**: You can provide types in runtime types using [PropTypes] and/or
statically using [TypeScript] or [Flow]. This rule will validate your prop types
regardless of how you define them.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createReactClass({
  propTypes: {
    enabled: PropTypes.bool
  },
  render: function() { return <div />; };
});
```

```jsx
type Props = {
  enabled: boolean
}
const Hello = (props: Props) => <div />;
```

Examples of **correct** code for this rule:

```jsx
var Hello = createReactClass({
  propTypes: {
    isEnabled: PropTypes.bool
  },
  render: function() { return <div />; };
});
```
```jsx
type Props = {
  isEnabled: boolean
}
const Hello = (props: Props) => <div />
```

## Rule Options

```js
...
"react/boolean-prop-naming": [<enabled>, {
  "propTypeNames": Array<string>,
  "rule": <string>,
  "message": <string>,
  "validateNested": <boolean>
}]
...
```

### `propTypeNames`

The list of prop type names that are considered to be booleans. By default this is set to `['bool']` but you can include other custom types like so:

```jsx
"react/boolean-prop-naming": ["error", { "propTypeNames": ["bool", "mutuallyExclusiveTrueProps"] }]
```

### `rule`

The RegExp pattern to use when validating the name of the prop. The default value for this option is set to: `"^(is|has)[A-Z]([A-Za-z0-9]?)+"` to enforce `is` and `has` prefixes.

For supporting "is" and "has" naming (default):

- isEnabled
- isAFK
- hasCondition
- hasLOL

```jsx
"react/boolean-prop-naming": ["error", { "rule": "^(is|has)[A-Z]([A-Za-z0-9]?)+" }]
```

For supporting "is" naming:

- isEnabled
- isAFK

```jsx
"react/boolean-prop-naming": ["error", { "rule": "^is[A-Z]([A-Za-z0-9]?)+" }]
```

### `message`

The custom message to display upon failure to match the rule. This overrides the default message.

If you choose to use a custom message, you have access to two template variables.

* `propName` – the name of the prop that does not match the pattern
* `pattern` – the pattern against which all prop names are tested

For example, if a prop is named `something`, and if the rule's pattern is set to `"^(is|has)[A-Z]([A-Za-z0-9]?)+"`, you could set the custom message as follows:

```js
message: 'It is better if your prop ({{ propName }}) matches this pattern: ({{ pattern }})'
```

And the failure would look like so:

```
It is better if your prop (something) matches this pattern: (^is[A-Z]([A-Za-z0-9]?)+)
```

### `validateNested`

This value is boolean. It tells if nested props should be validated as well. By default this is set to false but you can change it to true, to validate deeper layers of object:

```jsx
"react/boolean-prop-naming": ["error", { "validateNested": true }]
```

[PropTypes]: https://reactjs.org/docs/typechecking-with-proptypes.html
[TypeScript]: http://www.typescriptlang.org/
[Flow]: https://flow.org/
