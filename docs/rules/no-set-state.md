# Prevent usage of setState (react/no-set-state)

When using an architecture that separates your application state from your UI components (e.g. Flux), it may be desirable to forbid the use of local component state. This rule is especially helpful in read-only applications (that don't use forms), since local component state should rarely be necessary in such cases.

## Rule Details

The following patterns are considered warnings:

```jsx
var Hello = createReactClass({
  getInitialState: function() {
    return {
      name: this.props.name
    };
  },
  handleClick: function() {
    this.setState({
      name: this.props.name.toUpperCase()
    });
  },
  render: function() {
    return <div onClick={this.handleClick.bind(this)}>Hello {this.state.name}</div>;
  }
});
```

The following patterns are **not** considered warnings:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div onClick={this.props.handleClick}>Hello {this.props.name}</div>;
  }
});
```

## Rule Options

```js
"react/no-set-state": [<enabled>, {"in": <array>}]
```
### `in`

Will give warning for the usage of `setState` in the functions whose name is present in the array.
When the `in` is not specified it will consider the usage of `setState` anywhere as warning.


The following example will give warning for the usage of `setState` in constructor.
```
no-set-state: [2, {in: ['constructor']}]
```
```jsx
  class Hello extends React.Component {
    constructor(props){
      super(props)
      this.setState({
        name: props.name.toUpperCase()
      });
    }
    render() {
      return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
    }
  };
```

The following example will give warning for the usage of setState in somemethod only and will not throw warning for constructor.

```
no-set-state: [2, {in: ['somemethod']}]
```
```jsx
  class Hello extends React.Component {
    constructor(props){
      super(props)
      this.setState({
        name: props.name.toUpperCase()
      });
    }
    somemethod = () => {
      this.setState({
        name: props.name.toUpperCase()
      });
    }
    render() {
      return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
    }
  };
```
