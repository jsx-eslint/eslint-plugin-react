# Prevent usage of ReactDOM methods from React object

In React 0.14, several methods moved from 'react' to the separate 'react-dom' and 'react-dom-server' packages, and accessing these methods via 'react' is now deprecated. This rule warns if the moved methods are accessed on an object called `React`.

## Rule Details

The following patterns are considered warnings:

```js
var root = document.getElementById('root');
React.render(<MyComponent />, root);

React.unmountComponentAtNode(root);

React.findDOMNode(this.refs.foo);

React.renderToString(<MyComponent />);

React.renderToStaticMarkup(<MyComponent />);
```

The following patterns are not considered warnings:

```js
var root = document.getElementById('root');
ReactDOM.render(<MyComponent />, root);

ReactDOM.unmountComponentAtNode(root);

ReactDOM.findDOMNode(this.refs.foo);

ReactDOMServer.renderToString(<MyComponent />);

ReactDOMServer.renderToStaticMarkup(<MyComponent />);
```
