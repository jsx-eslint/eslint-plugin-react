# Prevent definitions of unused prop types (no-unused-prop-types)

Warns you if you have defined a prop type but it is never being used anywhere.

## Rule Details

The following patterns are considered warnings:

```jsx
var Hello = React.createClass({
  propTypes: {
    name: React.PropTypes.string
  },
  render: function() {
    return <div>Hello Bob</div>;
  }
});

var Hello = React.createClass({
  propTypes: {
    firstname: React.PropTypes.string.isRequired,
    middlename: React.PropTypes.string.isRequired, // middlename is never used below
	lastname: React.PropTypes.string.isRequired
  },
  render: function() {
    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
  }
});
```

The following patterns are not considered warnings:

```jsx
var Hello = React.createClass({
  propTypes: {
    name: React.PropTypes.string
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

## Rule Options

This rule can take one argument to ignore some specific props during validation.

```
...
"no-unused-prop-types": [<enabled>, { customValidators: <customValidator>, skipShapeProps: <skipShapeProps> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `customValidators`: optional array of validators used for propTypes validation.
* `skipShapeProps`: In some cases it is impossible to accurately detect whether or not a `React.PropTypes.shape`'s values are being used. Setting this option to `true` will skip validation of `PropTypes.shape` (`true` by default).

## Caveats

This rule does not track component props as they move from function to function or during variable renaming (such as in the event of prop object destructuring assignments). As such, it's prone to false positives in situations where the prop use cannot be accurately detected.

## About component detection

For this rule to work we need to detect React components, this could be very hard since components could be declared in a lot of ways.

For now we should detect components created with:

* `React.createClass()`
* an ES6 class that inherit from `React.Component` or `Component`
* a stateless function that return JSX or the result of a `React.createElement` call.
