# Prevents common typos (react/no-typos)

Ensure no casing typos were made declaring static class properties and lifecycle methods.
Checks that declared `propTypes`, `contextTypes` and `childContextTypes` is supported by [react-props](https://github.com/facebook/prop-types)

## Rule Details

This rule checks whether the declared static class properties and lifecycle methods related to React components do not contain any typos.

It makes sure that the following class properties have
no casing typos:

* propTypes
* contextTypes
* childContextTypes
* defaultProps

and the following react lifecycle methods:

* getDerivedStateFromProps
* componentWillMount
* UNSAFE_componentWillMount
* componentDidMount
* componentWillReceiveProps
* UNSAFE_componentWillReceiveProps
* shouldComponentUpdate
* componentWillUpdate
* UNSAFE_componentWillUpdate
* getSnapshotBeforeUpdate
* componentDidUpdate
* componentDidCatch
* componentWillUnmount
* render


Examples of **incorrect** code for this rule:

```js
class MyComponent extends React.Component {
  static PropTypes = {}
}

class MyComponent extends React.Component {
  static proptypes = {}
}

class MyComponent extends React.Component {
  static ContextTypes = {}
}

class MyComponent extends React.Component {
  static contexttypes = {}
}

class MyComponent extends React.Component {
  static ChildContextTypes = {}
}

class MyComponent extends React.Component {
  static childcontexttypes = {}
}

class MyComponent extends React.Component {
  static DefaultProps = {}
}

class MyComponent extends React.Component {
  static defaultprops = {}
}

class MyComponent extends React.Component {
  componentwillMount() {}
}

class MyComponent extends React.Component {
  ComponentWillReceiveProps() {}
}

class MyComponent extends React.Component {
  componentdidupdate() {}
}

class MyComponent extends React.Component {
  static propTypes = {
    a: PropTypes.typo
  }
}

class MyComponent extends React.Component {
  getDerivedStateFromProps() {}
}
```

Examples of **correct** code for this rule:

```js
class MyComponent extends React.Component {
  static propTypes = {}
}

class MyComponent extends React.Component {
  static contextTypes = {}
}

class MyComponent extends React.Component {
  static childContextTypes = {}
}

class MyComponent extends React.Component {
  static defaultProps = {}
}

class MyComponent extends React.Component {
  componentWillMount() {}
}

class MyComponent extends React.Component {
  componentWillReceiveProps() {}
}

class MyComponent extends React.Component {
  componentDidUpdate() {}
}

class MyComponent extends React.Component {
  static propTypes = {
    a: PropTypes.bool.isRequired
  }
}
```
