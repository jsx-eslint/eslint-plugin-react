# Do not allow constructor in React components (react/no-constructor-in-component)

In most cases, we don't need a constructor in React Components instead we can use a static propTypes property to pass props in a component. This rule does not allow you to use a constructor in components.

## Rule Details

Will enforce not to use a constructor for React Components.

The following patterns are considered bad:
```jsx
  class OneComponent extends Component {
    constructor(props) {
      super(props);
    }
  }
```

The following patterns are **not** considered bad:
```jsx
  class OneComponent extends Component {
    static propTypes = {}
    state = {}
  }
```
