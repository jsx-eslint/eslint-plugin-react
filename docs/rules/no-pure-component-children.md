# Prevent using React.PureComponent with children (react/no-pure-component-children)

Warns if you have defined children PropTypes when defining a component that extends React.PureComponent.
Children props are almost never equal, and when they're not, React.PureComponent performs worse than React.Component.

## Rule Details

The following patterns are considered warnings:

```jsx
class Foo extends React.PureComponent {
  render() {
    return <div>Radical!</div>
  }
}

Foo.propTypes = {
  children: PropTypes.node,
};

class Bar extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return <div>Groovy!</div>
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class Foo extends React.Component {
  render() {
    return <div>Radical!</div>
  }
}

Foo.propTypes = {
  children: PropTypes.node,
};

class Bar extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return <div>Groovy!</div>
  }
}
```
