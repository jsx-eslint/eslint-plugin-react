# Prevent missing props validation in a React component definition (react/prop-types)

PropTypes improve the reusability of your component by validating the received data.

It can warn other developers if they make a mistake while reusing the component with improper data type.

## Rule Details

The following patterns are considered warnings:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

var Hello = createReactClass({
  propTypes: {
    firstname: PropTypes.string.isRequired
  },
  render: function() {
    return <div>Hello {this.props.firstname} {this.props.lastname}</div>; // lastname type is not defined in propTypes
  }
});

function Hello({ name }) {
  return <div>Hello {name}</div>;
}
```

Examples of correct usage without warnings:

```jsx
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

The following patterns are **not** considered warnings:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>Hello World</div>;
  }
});

var Hello = createReactClass({
  propTypes: {
    name: PropTypes.string.isRequired
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

// Referencing an external object disable the rule for the component
var Hello = createReactClass({
  propTypes: myPropTypes,
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

function Hello({ name }) {
  return <div>Hello {name}</div>;
}
Hello.propTypes = {
  name: PropTypes.string.isRequired,
};
```

## Rule Options

This rule can take one argument to ignore some specific props during validation.

```js
...
"react/prop-types": [<enabled>, { ignore: <ignore>, customValidators: <customValidator> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `ignore`: optional array of props name to ignore during validation.
* `customValidators`: optional array of validators used for propTypes validation.
* `skipUndeclared`: only error on components that have a propTypes block declared

### As for "exceptions"

It would seem that some common properties such as `props.children` or `props.className`
(and alike) need to be treated as exceptions.

As it aptly noticed in
[#7](https://github.com/yannickcr/eslint-plugin-react/issues/7)

> Why should children be an exception?
> Most components don't need `this.props.children`, so that makes it extra important
to document `children` in the propTypes.

Generally, you should use `PropTypes.node` for `children`. It accepts
anything that can be rendered: numbers, strings, elements or an array containing
these types.

Since 2.0.0 children is no longer ignored for props validation.

## About component detection

For this rule to work we need to detect React components, this could be very hard since components could be declared in a lot of ways.

For now we should detect components created with:

* `createReactClass()`
* an ES6 class that inherit from `React.Component` or `Component`
* a stateless function that return JSX or the result of a `React.createElement` call.
