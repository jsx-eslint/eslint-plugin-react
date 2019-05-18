# Enforces where React component static properties should be positioned. (react/static-property-placement)

This rule allows you to enforce where `childContextTypes`, `contextTypes`, `contextType`, `defaultProps`, `displayName`,
and `propTypes` are declared in an ES6 class.


## Rule Details

By default, this rule will check for and warn about declaring any of the above properties outside of the class body.

The three key options are `static public field`, `static getter`, and `property assignment`.

### When `static public field` is enabled (default):

Examples of **incorrect** code for this rule:

```js
class MyComponent extends React.Component {
  static get childContextTypes() { /*...*/ }
  static get contextTypes() { /*...*/ }
  static get contextType() { /*...*/ }
  static get displayName() { /*...*/ }
  static get defaultProps() { /*...*/ }
  static get propTypes() { /*...*/ }
}
```

```js
class MyComponent extends React.Component { /*...*/ }
MyComponent.childContextTypes = { /*...*/ };
MyComponent.contextTypes = { /*...*/ };
MyComponent.contextType = { /*...*/ };
MyComponent.displayName = "Hello";
MyComponent.defaultProps = { /*...*/ };
MyComponent.propTypes = { /*...*/ };
```

Examples of **correct** code for this rule:

```js
class MyComponent extends React.Component {
  static childContextTypes = { /*...*/ };
  static contextTypes = { /*...*/ };
  static contextType = { /*...*/ };
  static displayName = "Hello";
  static defaultProps = { /*...*/ };
  static propTypes = { /*...*/ };
}
```

### When `static getter` is enabled:

Examples of **incorrect** code for this rule:

```js
class MyComponent extends React.Component {
  static childContextTypes = { /*...*/ };
  static contextTypes = { /*...*/ };
  static contextType = { /*...*/ };
  static displayName = "Hello";
  static defaultProps = { /*...*/ };
  static propTypes = { /*...*/ };
}
```

```js
class MyComponent extends React.Component { /*...*/ }
MyComponent.childContextTypes = { /*...*/ };
MyComponent.contextTypes = { /*...*/ };
MyComponent.contextType = { /*...*/ };
MyComponent.displayName = "Hello";
MyComponent.defaultProps = { /*...*/ };
MyComponent.propTypes = { /*...*/ };
```

Examples of **correct** code for this rule:

```js
class MyComponent extends React.Component {
  static get childContextTypes() { /*...*/ }
  static get contextTypes() { /*...*/ }
  static get contextType() { /*...*/ }
  static get displayName() { /*...*/ }
  static get defaultProps() { /*...*/ }
  static get propTypes() { /*...*/ }
}
```

### When `property assignment` is enabled:

Examples of **incorrect** code for this rule:

```js
class MyComponent extends React.Component {
  static childContextTypes = { /*...*/ };
  static contextTypes = { /*...*/ };
  static contextType = { /*...*/ };
  static displayName = "Hello";
  static defaultProps = { /*...*/ };
  static propTypes = { /*...*/ };
}
```

```js
class MyComponent extends React.Component {
  static get childContextTypes() { /*...*/ }
  static get contextTypes() { /*...*/ }
  static get contextType() { /*...*/ }
  static get displayName() { /*...*/ }
  static get defaultProps() { /*...*/ }
  static get propTypes() { /*...*/ }
}
```

Examples of **correct** code for this rule:

```js
class MyComponent extends React.Component { /*...*/ }
MyComponent.childContextTypes = { /*...*/ };
MyComponent.contextTypes = { /*...*/ };
MyComponent.contextType = { /*...*/ };
MyComponent.displayName = "Hello";
MyComponent.defaultProps = { /*...*/ };
MyComponent.propTypes = { /*...*/ };
```

### Options

```
...
"react/static-property-placement": [<enabled>]  // `static public field` enabled
...
```

or alternatively:

```
...
"react/static-property-placement": [<enabled>, <string>]
...
```

or alternatively:

```
...
"react/static-property-placement": [<enabled>, <string>, {
  childContextTypes: <string>,
  contextTypes: <string>,
  contextType: <string>,
  defaultProps: <string>,
  displayName: <string>,
  propTypes: <string>,
}]
...
```
The `<string>` value must be one these options:
* `static public field`
* `static getter`
* `property assignment`

The `options` schema defined above allows you to specify different rules for the different property fields available.

##### Example configuration:
_This is only an example, we do not recommend this as a configuration._
```
...
"react/static-property-placement": ["warn", "property assignment", {
  childContextTypes: "static getter",
  contextTypes: "static public field",
  contextType: "static public field",
  displayName: "static public field",
}]
...
```

Based on the above configuration:
* `defaultProps` and `propTypes` will both enforce the `property assignment` rule.
* `childContextTypes` will enforce the `static getter` rule.
* `contextTypes`, `contextType`, and `displayName` will  enforce the `static public field` rule.

## When Not To Use It

If you have no placement preference for React's static class properties.

