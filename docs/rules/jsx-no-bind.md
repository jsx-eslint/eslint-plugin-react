# No `.bind()` or Arrow Functions in JSX Props (react/jsx-no-bind)

A `bind` call or [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) in a JSX prop will create a brand new function on every single render. This is bad for performance, as it may cause unnecessary re-renders if a brand new function is passed as a prop to a component that uses reference equality check on the prop to determine if it should update.

Note that this behavior is different for `ref` props, which is a special case in React that **does not** cause re-renders when a brand new function is passed.  See [`ignore-refs`](#ignorerefs) below for more information.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<Foo onClick={this._handleClick.bind(this)}></Foo>
```
```jsx
<Foo onClick={() => console.log('Hello!')}></Foo>
```
```jsx
function onClick() { console.log('Hello!'); }
<Foo onClick={onClick} />
```

Examples of **correct** code for this rule:
```jsx
<Foo onClick={this._handleClick}></Foo>
```

## Rule Options

```js
"react/jsx-no-bind": [<enabled>, {
  "ignoreDOMComponents": <boolean> || false,
  "ignoreRefs": <boolean> || false,
  "allowArrowFunctions": <boolean> || false,
  "allowFunctions": <boolean> || false,
  "allowBind": <boolean> || false
}]
```

### `ignoreDOMComponents`

Examples of **correct** code for this rule, when `ignoreDOMComponents` is `true`:

```jsx
<div onClick={this._handleClick.bind(this) />
<span onClick={() => console.log("Hello!")} />
<button type="button" onClick={function() { alert("1337") }} />
```

### `ignoreRefs`

Refs are a special-case that do not behave like other props. Sending a new function in on ever render will **not** cause re-renders like it could with any other prop.

However, there is a [caveat with callback refs](https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs):
> If the ref callback is defined as an inline function, it will get called twice during updates, first with null and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the ref callback as a bound method on the class, but note that it shouldn’t matter in most cases.

You can also avoid this behavior using [`createRef`](https://reactjs.org/docs/react-api.html#reactcreateref) or [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) (or [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) if you have custom logic).

If you are using a simple setter (as shown below) then you may not need this rule to fire for `ref`s, and can disable it specifically for refs with `ignoreRefs`.

Examples of **correct** code for this rule, when `ignoreRefs` is `true`:

```jsx
<Foo ref={ref => { this._div = ref; }} />
<Foo ref={this._refCallback.bind(this)} />
```

### `allowArrowFunctions`

Examples of **correct** code for this rule, when `allowArrowFunctions` is `true`:

```jsx
<Foo onClick={() => alert("1337")} />
```

### `allowFunctions`

Examples of **correct** code for this rule, when `allowFunctions` is `true`:

```jsx
<Foo onClick={function () { alert("1337") }} />
```

```jsx
function onClick() { alert("1337"); }
<Foo onClick={onClick} />
```

### `allowBind`

Examples of **correct** code for this rule, when `allowBind` is `true`:

```jsx
<Foo onClick={this._handleClick.bind(this)} />
```

## Protips

### Lists of Items

A common use case of `bind` in render is when rendering a list, to have a separate callback per list item:

```jsx
var List = createReactClass({
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

```jsx
var List = createReactClass({
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

var ListItem = createReactClass({
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

Unfortunately [React ES6 classes](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes) do not autobind their methods like components created with the older `createReactClass` syntax. There are several approaches to binding methods for ES6 classes. A basic approach is to just manually bind the methods in the constructor:

```jsx
class Foo extends React.Component {
  constructor(...args) {
    super(...args);
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

### React Hooks

Functional components are often used alongside hooks, and the most trivial case would occur if your callback is completely independent from your state. In this case, the solution is as simple as moving the callback out of your component:

```jsx
const onClick = () => {
  console.log("Independent callback");
};
const Button = () => {
  return (
    <button type="button" onClick={onClick}>Label</button>
  );
};
```

Otherwise, the idiomatic way to avoid redefining callbacks on every render would be to memoize them using the [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) hook:

```jsx
const Button = () => {
  const [text, setText] = useState("Before click");
  const onClick = useCallback(() => {
    setText("After click");
  }, [setText]); // Array of dependencies for which the memoization should update
  return (
    <button type="button" onClick={onClick}>{text}</button>
  );
};
```

## When Not To Use It

If you do not use JSX or do not want to enforce that `bind` or arrow functions are not used in props, then you can disable this rule.
