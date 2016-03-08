# Enforce stateless React Components to be written as a pure function (prefer-stateless-function)

Stateless functional components are more simple than class based components and will benefit from future React performance optimizations specific to these components.

## Rule Details

This rule will check your class based React components for

* lifecycle methods: `state`, `getInitialState`, `getChildContext`, `componentWillMount`, `componentDidMount`, `componentWillReceiveProps`, `shouldComponentUpdate`, `componentWillUpdate`, `componentDidUpdate` and `componentWillUnmount`
* usage of `this.setState`
* presence of `ref` attribute in JSX

If none of these 3 elements are found then the rule warn you to write this component as a pure function.

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

```js
class Hello extends React.Component {
  sayHello() {
    alert(`Hello ${this.props.name}`)
  }
  render() {
    return <div onClick={this.sayHello}>Hello {this.props.name}</div>;
  }
}
```

The following patterns are not considered warnings:

```js
const Foo = function(props) {
  return <div>{props.foo}</div>;
};
```

```js
class Foo extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div>{this.props.foo}</div>;
  }
}
```
