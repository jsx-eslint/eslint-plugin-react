# Prefer function components over class components (react/prefer-function-component)

This rule prevents the use of class components.

Since the addition of hooks, it has been possible to write stateful React components
using only functions. Mixing both class and function components in a code base adds unnecessary hurdles for sharing reusable logic.

By default, class components that use `componentDidCatch` are enabled because there is currently no hook alternative for React. This option is configurable via `allowComponentDidCatch`.

## Rule Details

This rule will flag any React class components that don't use `componentDidCatch`.

Examples of **incorrect** code for this rule:

```jsx
import { Component } from 'react';

class Foo extends Component {
  render() {
    return <div>{this.props.foo}</div>;
  }
}
```

Examples of **correct** code for this rule:

```jsx
const Foo = function (props) {
  return <div>{props.foo}</div>;
};
```

```jsx
const Foo = ({ foo }) => <div>{foo}</div>;
```

## Rule Options

```js
...
"prefer-function-component": [<enabled>, { "allowComponentDidCatch": <allowComponentDidCatch> }]
...
```

- `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
- `allowComponentDidCatch`: optional boolean set to `true` if you would like to ignore class components using `componentDidCatch` (default to `true`).

### `allowComponentDidCatch`

When `true` (the default) the rule will ignore components that use `componentDidCatch`

Examples of **correct** code for this rule:

```jsx
import { Component } from 'react';

class Foo extends Component {
  componentDidCatch(error, errorInfo) {
    logErrorToMyService(error, errorInfo);
  }

  render() {
    return <div>{this.props.foo}</div>;
  }
}
```

When `false` the rule will also flag components that use `componentDidCatch`

Examples of **incorrect** code for this rule:

```jsx
import { Component } from 'react';

class Foo extends Component {
  componentDidCatch(error, errorInfo) {
    logErrorToMyService(error, errorInfo);
  }

  render() {
    return <div>{this.props.foo}</div>;
  }
}
```

### Related rules

- [prefer-stateless-function](./prefer-stateless-function)
