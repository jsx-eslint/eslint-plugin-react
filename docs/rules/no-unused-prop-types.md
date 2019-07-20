# Prevent definitions of unused prop types (react/no-unused-prop-types)

Warns you if you have defined a prop type but it is never being used anywhere.

## Rule Details

The following patterns are considered warnings:

```jsx
var Hello = createReactClass({
  propTypes: {
    name: PropTypes.string
  },
  render: function() {
    return <div>Hello Bob</div>;
  }
});

var Hello = createReactClass({
  propTypes: {
    firstname: PropTypes.string.isRequired,
    middlename: PropTypes.string.isRequired, // middlename is never used below
    lastname: PropTypes.string.isRequired
  },
  render: function() {
    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
  }
});
```

The following patterns are **not** considered warnings:

```jsx
var Hello = createReactClass({
  propTypes: {
    name: PropTypes.string
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
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

### False positives SFC
For components with Stateless Functional Components (often used as helper render methods);
SFC is a function that takes prop(s) as an argument and returns a JSX expression.
Even if this function gets called from a component the props that are only used inside SFC would not be considered used by a component.

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
