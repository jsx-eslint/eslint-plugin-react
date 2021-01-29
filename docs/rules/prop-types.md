# Prevent missing props validation in a React component definition (react/prop-types)

Defining types for component props improves reusability of your components by
validating received data. It can warn other developers if they make a mistake while reusing the component with improper data type.

> **Note**: You can provide types in runtime types using [PropTypes] and/or
statically using [TypeScript] or [Flow]. This rule will validate your prop types
regardless of how you define them.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
function Hello({ name }) {
  return <div>Hello {name}</div>;
  // 'name' is missing in props validation
}

var Hello = createReactClass({
  propTypes: {
    firstname: PropTypes.string.isRequired
  },
  render: function() {
    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
    // 'lastname' type is missing in props validation
  }
});

// Or in ES6
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
    // 'lastname' type is missing in props validation
  }
}
Hello.propTypes = {
  firstname: PropTypes.string.isRequired
}
```

In TypeScript:

```tsx
interface Props {
  age: number
}
function Hello({ name }: Props) {
  return <div>Hello {name}</div>;
  // 'name' type is missing in props validation
}
```

Examples of **correct** code for this rule:

```jsx
function Hello({ name }) {
  return <div>Hello {name}</div>;
}
Hello.propTypes = {
  name: PropTypes.string.isRequired
}

var Hello = createReactClass({
  propTypes: {
    name: PropTypes.string.isRequired,
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  },
});

// Or in ES6:
class HelloEs6 extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
HelloEs6.propTypes = {
  name: PropTypes.string.isRequired,
};

// ES6 + Public Class Fields (draft: https://tc39.github.io/proposal-class-public-fields/)
class HelloEs6WithPublicClassField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  }
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

In TypeScript:

```tsx
// destructured default prop values

function Foo({ bar = "" }): JSX.Element {
  return <div>{bar}</div>;
}

function Foo({ bar = "" as string }): JSX.Element {
  return <div>{bar}</div>;
}
```

In Flow:

```tsx
type Props = {
  name: string
}
class Hello extends React.Component<Props> {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

Examples of **correct** code for this rule:

```jsx
function Hello() {
  return <div>Hello World</div>;
}

// Referencing an external object disable the rule for the component
function Hello({ name }) {
  return <div>Hello {name}</div>;
}
Hello.propTypes = myPropTypes;
```

## Rule Options

This rule can take one argument to ignore some specific props during validation.

```js
...
"react/prop-types": [<enabled>, { ignore: <ignore>, customValidators: <customValidator>, skipUndeclared: <skipUndeclared> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `ignore`: optional array of props name to ignore during validation.
* `customValidators`: optional array of validators used for propTypes validation.
* `skipUndeclared`: optional boolean to only error on components that have a propTypes block declared.

### As for "exceptions"

It would seem that some common properties such as `props.children` or `props.className`
(and alike) need to be treated as exceptions.

As it aptly noticed in
[#7](https://github.com/yannickcr/eslint-plugin-react/issues/7)

> Why should children be an exception?
> Most components don't need `this.props.children`, so that makes it extra important
to document `children` in the prop types.

Generally, you should use `PropTypes.node` or static type `React.Node` for
`children`. It accepts anything that can be rendered: numbers, strings, elements
or an array containing these types.

Since 2.0.0 children is no longer ignored for props validation.

## About component detection

For this rule to work we need to detect React components, this could be very hard since components could be declared in a lot of ways.

For now we should detect components created with:

* a function that return JSX or the result of a `React.createElement` call.
* `createReactClass()`
* an ES6 class that inherit from `React.Component` or `Component`

[PropTypes]: https://reactjs.org/docs/typechecking-with-proptypes.html
[TypeScript]: http://www.typescriptlang.org/
[Flow]: https://flow.org/
