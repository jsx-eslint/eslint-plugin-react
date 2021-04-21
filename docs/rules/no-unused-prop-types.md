# Prevent definitions of unused propTypes (react/no-unused-prop-types)

Warns if a prop with a defined type isn't being used.

> **Note**: You can provide types in runtime types using [PropTypes] and/or
statically using [TypeScript] or [Flow]. This rule will validate your prop types
regardless of how you define them.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
class Hello extends React.Component {
  render() {
    return <div>Hello Bob</div>;
  }
});

Hello.propTypes = {
  name: PropTypes.string
},
```

```jsx
type Props = {
  firstname: string,
  middlename: string, // middlename is never used by the Hello component
  lastname: string
}

class Hello extends React.Component<Props> {
  render() {
    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
  }
}
```

```jsx
type Props = {
  firstname: string;
  lastname: string;  // lastname isn't used by the Hello component
};

class Hello extends React.Component<Props> {
  render() {
    return <div>Hello {this.props.firstname}</div>;
  }
}

class Greetings extends React.Component<Props> {
  render() {
    return <div>Greetings  {this.props.firstname} {this.props.lastname}</div>;
  }
}
```

Examples of **correct** code for this rule:

```jsx
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
};

Hello.propTypes: {
  name: PropTypes.string
},
```

## Rule Options

This rule can take one argument to ignore some specific props during validation.

```js
...
"react/no-unused-prop-types": [<enabled>, { ignore: <ignore>, customValidators: <customValidator>, skipShapeProps: <skipShapeProps> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `ignore`: optional array of props name to ignore during validation.
* `customValidators`: optional array of validators used for propTypes validation.
* `skipShapeProps`: In some cases it is impossible to accurately detect whether or not a `PropTypes.shape`'s values are being used. Setting this option to `true` will skip validation of `PropTypes.shape` (`true` by default).

## Known Issues/Limitations

- [False Positives: SFC (helper render methods)](#false-positives-sfc)

### False Positives SFC

Stateless Function Components (SFCs) accept props as an argument and return a JSX expression.
Even if the function gets called from a component, the props that are only used inside the component are not be considered used by a component.

Triggers false positive:

```js
function AComponent(props) {
  function helperRenderer(aProp) { // is considered SFC
    return (
      <span>{aProp}{props.bProp}</span>
    );
  }

  return (
    <div>
      {helperRenderer(props.aProp)}
    </div>
  );
}

AComponent.propTypes = {
  aProp: PropTypes.string,
  bProp: PropTypes.string // bProp is defined but never used
};
```
A suggested fix is to assign a bProp to a variable outside of the SFC.

```js
function AComponent(props) {
  const { bProp } = props
  function helperRenderer(aProp) { // is considered SFC
    return (
      <span>{aProp}{bProp}</span>
    );
  }

  return (
    <div>
      {helperRenderer(props.aProp)}
    </div>
  );
}

AComponent.propTypes = {
  aProp: PropTypes.string,
  bProp: PropTypes.string
};
```

[PropTypes]: https://reactjs.org/docs/typechecking-with-proptypes.html
[TypeScript]: http://www.typescriptlang.org/
[Flow]: https://flow.org/
