# Prevent usage of the return value of React.render (react/no-render-return-value)

> `ReactDOM.render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a [callback ref](http://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute) to the root element.

Source: [ReactDOM documentation](https://facebook.github.io/react/docs/react-dom.html#render)

## Rule Details

This rule will warn you if you try to use the `ReactDOM.render()` return value.

The following pattern is considered a warning:

```jsx
const inst = ReactDOM.render(<App />, document.body);
doSomethingWithInst(inst);
```

The following patterns are not considered warnings:

```jsx
ReactDOM.render(<App ref={doSomethingWithInst} />, document.body);

ReactDOM.render(<App />, document.body, doSomethingWithInst);
```
