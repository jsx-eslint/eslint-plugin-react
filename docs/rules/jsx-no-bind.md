# No `.bind()` or arrow functions in JSX props

A `bind` call or [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) in a JSX prop will create a brand new function on every single render. This is bad for performance, as it will result in the garbage collector being invoked way more than is necessary.

## Rule Details

The following patterns are considered warnings:

```js
<div onClick={this._handleClick.bind(this)}></div>
```
```js
<div onClick={() => console.log('Hello!'))}></div>
```

The following patterns are not considered warnings:
```js
<div onClick={this._handleClick}></div>
```

## Protip

A common use case of `bind` in render is when rendering a list, to have a separate callback per list item:

```js
var List = React.createClass({
  render() {
    return (
      <ul>
        {this.props.items.map(item =>
          <li key={item.id} onClick={this.props.onItemClick.bind(null, item.id)}>
            ...
          </li>
        )}
      </ul>
    );
  }
});
```

Rather than doing it this way, pull the repeated section into its own component:

```js
var List = React.createClass({
  render() {
    return (
      <ul>
        {this.props.items.map(item =>
          <ListItem key={item.id} item={item} onItemClick={this.props.onItemClick} />
        )}
      </ul>
    );
  }
});

var ListItem = React.createClass({
  render() {
    return (
        <li onClick={this._onClick}>
          ...
        </li>
    );
  },
  _onClick() {
    this.props.onItemClick(this.props.item.id);
  }
});
```

This will speed up rendering, as it avoids the need to create new functions (through `bind` calls) on every render.

## When Not To Use It

If you do not want to enforce that `bind` or arrow functions are not used in props, then you can disable this rule.
