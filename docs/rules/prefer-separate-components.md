# Report usages of class methods besides render returning JSX (react/prefer-separate-components)

If component functions other than `render` are returning JSX, they should be moved into separate components.

## Rule Details

The following patterns are considered warnings:

```jsx
class Foo extends React.Component {
  renderBar() {
    return <span>bar</span>;
  }
  render() {
    return (
      <div>
        foo
        {this.renderBar()}
      </div>
    );
  }
}

class Foo extends React.Component {
  renderBar() {
    return React.createElement('span', null, 'bar');
  }
  render() {
    return React.createElement(
      'div',
      null,
      'foo',
      this.renderBar()
    );
  }
}

class Foo extends React.Component {
  renderBars() {
    const bars = ['bar', 'bar', 'bar'];
    return bars.map((bar) => <span>{bar}</span>);
  }
  render() {
    return (
      <div>
        foo
        {this.renderBars()}
      </div>
    );
  }
}

class Foo extends React.Component {
  renderBars() {
    const bars = ['bar', 'bar', 'bar'];
    return bars.map((bar) => React.createElement('span', null, bar));
  }
  render() {
    return React.createElement(
      'div',
      null,
      'foo',
      this.renderBars()
    );
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class Foo extends React.Component {
  render() {
    return <div>foo</div>;
  }
}

class Foo extends React.Component {
  render() {
    return React.createElement('div', null, 'foo');
  }
}

createReactClass({
  render() {
    return <div>foo</div>;
  }
});

createReactClass({
  render() {
    return React.createElement('div', null, 'foo');
  }
});
```
