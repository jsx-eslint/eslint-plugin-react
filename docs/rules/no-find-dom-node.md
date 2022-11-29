# Disallow usage of findDOMNode (`react/no-find-dom-node`)

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

<!-- end auto-generated rule header -->

Facebook will eventually deprecate `findDOMNode` as it blocks certain improvements in React in the future.

It is recommended to use callback refs instead. See [Dan Abramov comments and examples](https://github.com/jsx-eslint/eslint-plugin-react/issues/678#issue-165177220).

## Rule Details

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

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
