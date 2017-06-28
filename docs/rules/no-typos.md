# Prevents common casing typos (react/no-typos)

Ensure no casing typos were made declaring static class properties

## Rule Details

This rule checks whether the declared static class properties related to React components
do not contain any typos. It currently makes sure that the following class properties have
no casing typos:

* propTypes
* contextTypes
* childContextTypes
* defaultProps

The following patterns are considered warnings:

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
```

The following patterns are not considered warnings:

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
```
