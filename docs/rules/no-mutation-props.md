# Prevent mutation of this.props (no-mutation-props)

NEVER mutate `this.props`, as all React components must act like pure functions with respect to their props. 
Treat `this.props` as if it were immutable. More info available at [https://facebook.github.io/react/docs/components-and-props.html#props-are-read-only](https://facebook.github.io/react/docs/components-and-props.html#props-are-read-only)

## Rule Details

This rule is aimed to forbid the use of mutating `this.props`.

The following patterns are considered warnings:

```jsx
var Hello = React.createClass({
  render: function() {
    this.props.name = this.props.name.toUpperCase();
    return <div>Hello {this.props.name}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    const {list} = this.props;
    list.push(2);
    return <div>{list.length} things</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    const [firstThing] = this.props.list;
    firstThing.foo = 'bar';
    return <div>{firstThing.foo}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    delete this.props.foo;
    return <div>{Object.keys(this.props).length} props</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    Object.assign(this.props.foo, {bar: 'baz'});
    return <div>{this.props.foo.bar}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    Object.defineProperty(this.props, 'foo');
    return <div>{this.props.foo}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    this.props.foo++;
    return <div>{this.props.foo}</div>;
  }
});
```
