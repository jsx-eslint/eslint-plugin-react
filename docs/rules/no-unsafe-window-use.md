# Prevent unsafe window use (react/no-unsafe-window-use)

Rendering React apps in Node environments has become popular with the light of tools like [Gatsby][gatsby] and [Next.js][nextjs]. But in these environments, things that we are used to in the web, like `window`, are not available.

[gatsby]: http://gatsbyjs.org/
[nextjs]: https://nextjs.org/

## Rule Details

The purpose of this rule is to prevent common errors related to the unsafe use of the `window` on apps intended to be rendered in environments other than the browser.

The following patterns are considered warnings:

```js
window.bar = "baz"
```

```js
if (typeof window !== 'undefined') {
} else {
  window.bar = "baz"
}
```

```js
function bar() {
  window.something()
}
```

```js
class Test {
  handle() {
    window.bar = "baz"
  }
}
```

```jsx
class Test extends React.Component {
  render() {
    window.bar = "baz"
    return <button onClick={this.handleClick} />
  }
};
```

```jsx
class Test extends React.Component {
  handleClick() {
    window.bar = "baz"
  }
  render() {
    this.handleClick()
    return <button onClick={this.handleClick} />
  }
};
```

```jsx
class Test extends React.Component {
  handleClick() {
    window.bar = "baz"
  }
  otherHandler() {
    this.handleClick()
  }
  render() {
    this.otherHandler()
    return <button onClick={this.otherHandler} />
  }
};
```

```jsx
function Test() {
  function handleClick() {
    window.bar = "baz"
  }
  handleClick()
  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  )
}
```

```jsx
function Test() {
  function handleClick() {
    window.bar = "baz"
  }
  function otherHandler() {
    handleClick()
  }
  otherHandler()
  return (
    <button onClick={otherHandler}>
      Click me!
    </button>
  )
}
```

```jsx
class Test extends React.Component {
  constructor() {
    super()
    window.bar = "baz"
  }
  render() {
    return <div />
  }
};
```

```jsx
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.handler()
  }
  handler() {
    window.bar = "baz"
  }
  render() {
    return <div />
  }
};
```

The following patterns are **not** considered warnings:

```js
if (typeof window !== 'undefined') {
  console.log(window)
}
```

```js
typeof window !== "undefined" ? doSomething(window) : null
```

```js
typeof window !== "undefined" && doSomething(window)
```

```jsx
// Can use handler and window inside componentDidUpdate, componentDidMount and, componentWillUnmount

class Test extends React.Component {
  handleClick() {
    window.bar = "baz"
  }
  componentDidUpdate() {
    window.bar = "baz"
    this.handleClick()
  }
  componentDidMount() {
    window.bar = "baz"
    this.handleClick()
  }
  componentWillUnmount() {
    window.bar = "baz"
    this.handleClick()
  }
  render() {
    return <button onClick={this.handleClick} />
  }
};
```

```jsx
// Can use handler and window inside useEffect, useLayoutEffect and, useCallback.
function Test() {
  function handleClick() {
    window.bar = "baz"
  }
  useEffect(() => {
    window.bar = "baz"
    handleClick()
  })
  useLayoutEffect(() => {
    window.bar = "baz"
    handleClick()
  })
  const callback = useCallback(() => {
    window.bar = "baz"
    handleClick()
  }, [])
  return (
    <div>
      <button onClick={handleClick}>
        Click me!
      </button>
      <button onClick={callback}>
        Click me 2!
      </button>
    </div>
  )
}
```

```jsx
// It is safe to use guarded handlers
class Test extends React.Component {
  handleClick() {
    if (typeof window !== 'undefined') {
      window.bar = "baz"
    }
  }
  render() {
    this.handleClick()
    return <button onClick={this.handleClick} />
  }
};
```

```jsx
// It is safe to use guarded handlers
function Test() {
  function handleClick() {
    if (typeof window !== 'undefined') {
      window.bar = "baz"
    }
  }
  handleClick()
  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  )
}
```

```jsx
// Can use handler in other handlers as long as none of them is called directly.
class Test extends React.Component {
  handleClick() {
    window.bar = "baz"
  }
  otherHandler() {
    this.handleClick()
  }
  render() {
    return <button onClick={this.otherHandler} />
  }
};
```

```jsx
// Can use handler in other handlers as long as none of them is called directly.
function Test() {
  const handleClick = () => {
    window.bar = "baz"
  }
  const otherHandler = () => {
    handleClick()
  }
  return (
    <button onClick={otherHandler}>
      Click me!
    </button>
  )
}
```

## When not to use

If your app will be rendered only on the frontend you can disable this rule.