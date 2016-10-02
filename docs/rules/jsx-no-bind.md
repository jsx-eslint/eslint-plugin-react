# No `.bind()` or Arrow Functions in JSX Props (jsx-no-bind)

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

## Rule Options

```js
"jsx-no-bind": [<enabled>, {
  "ignoreRefs": <boolean> || false,
  "allowArrowFunctions": <boolean> || false,
  "allowBind": <boolean> || false
}]
```

### `ignoreRefs`

When `true` the following are not considered warnings:

```jsx
<div ref={c => this._div = c} />
<div ref={this._refCallback.bind(this)} />
```

### `allowArrowFunctions`

When `true` the following is not considered a warning:

```jsx
<div onClick={() => alert("1337")} />
```

### `allowBind`

When `true` the following is not considered a warning:

```jsx
<div onClick={this._handleClick.bind(this)} />
```

## Protips

### Lists of Items

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

### ES6 Classes

Unfortunately [React ES6 classes](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes) do not autobind their methods like components created with the older `React.createClass` syntax. There are several approaches to binding methods for ES6 classes. A basic approach is to just manually bind the methods in the constructor:

```js
class Foo extends React.Component {
  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
  }
  render() {
    return (
      <div onClick={this._onClick}>
        Hello!
      </div>
    );
  }
  _onClick() {
    // Do whatever you like, referencing "this" as appropriate
  }
}
```

A more sophisticated approach would be to use something like an [autobind ES7 decorator](https://www.npmjs.com/package/core-decorators#autobind) or [property initializers](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding).

## When Not To Use It

If you do not use JSX or do not want to enforce that `bind` or arrow functions are not used in props, then you can disable this rule.
