# Prevent usage of findDOMNode (react/no-find-dom-node)

Facebook will eventually deprecate `findDOMNode` as it blocks certain improvements in React in the future.

It is recommended to use callback refs instead. See [Dan Abramov comments and examples](https://github.com/yannickcr/eslint-plugin-react/issues/678#issue-165177220).

## Rule Details

The following patterns are considered warnings:

```jsx
class MyComponent extends Component {
  componentDidMount() {
    findDOMNode(this).scrollIntoView();
  }
  render() {
    return <div />
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class MyComponent extends Component {
  componentDidMount() {
    this.node.scrollIntoView();
  }
  render() {
    return <div ref={node => this.node = node} />
  }
}
```
