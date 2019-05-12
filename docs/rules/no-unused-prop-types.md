# Prevent definitions of unused propTypes (react/no-unused-prop-types)

Warns if a propType isn't being used.

## Rule Details

The following patterns are considered warnings:

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
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
  }
}

Hello.propTypes: {
  firstname: PropTypes.string.isRequired,
  middlename: PropTypes.string.isRequired, // middlename is never used above
  lastname: PropTypes.string.isRequired
},
```

The following patterns are **not** considered warnings:

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
"react/no-unused-prop-types": [<enabled>, { customValidators: <customValidator>, skipShapeProps: <skipShapeProps> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
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
