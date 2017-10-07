# Prevent usage of shouldComponentUpdate when extending React.PureComponent (react/no-redundant-should-component-update)

Warns if you have `shouldComponentUpdate` defined when defining a component that extends React.PureComponent.
While having `shouldComponentUpdate` will still work, it becomes pointless to extend PureComponent.

## Rule Details

The following patterns are considered warnings:

```jsx
class Foo extends React.PureComponent {
  shouldComponentUpdate() {
    // do check
  }

  render() {
    return <div>Radical!</div>
  }
}

function Bar() {
  return class Baz extends React.PureComponent {
    shouldComponentUpdate() {
      // do check
    }

    render() {
      return <div>Groovy!</div>
    }
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class Foo extends React.Component {
  shouldComponentUpdate() {
    // do check
  }

  render() {
    return <div>Radical!</div>
  }
}

function Bar() {
  return class Baz extends React.Component {
    shouldComponentUpdate() {
      // do check
    }

    render() {
      return <div>Groovy!</div>
    }
  }
}

class Qux extends React.PureComponent {
  render() {
    return <div>Tubular!</div>
  }
}
```
