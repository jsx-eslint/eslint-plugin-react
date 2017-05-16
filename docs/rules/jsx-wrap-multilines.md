# Prevent missing parentheses around multiline JSX (jsx-wrap-multilines)

Wrapping multiline JSX in parentheses can improve readability and/or convenience.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule optionally takes a second parameter in the form of an object, containing places to apply the rule. By default, all the syntax listed below will be checked, but these can be explicitly disabled. Any syntax type missing in the object will follow the default behavior (become enabled).

There are the possible syntax available:

* `declaration`
* `assignment`
* `return`
* `arrow`

The following patterns are considered warnings:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>
      <p>Hello {this.props.name}</p>
    </div>;
  }
});
```

The following patterns are not considered warnings:

```jsx
var singleLineJSX = <p>Hello</p>

var Hello = createReactClass({
  render: function() {
    return (
      <div>
        <p>Hello {this.props.name}</p>
      </div>
    );
  }
});
```

The following patterns are considered warnings when configured `{declaration: true}`.

```jsx
var hello = <div>
  <p>Hello</p>
</div>;
```

The following patterns are not considered warnings when configured `{declaration: true}`.

```jsx
var hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

The following patterns are considered warnings when configured `{assignment: true}`.

```jsx
var hello;
hello = <div>
  <p>Hello</p>
</div>;
```

The following patterns are not considered warnings when configured `{assignment: true}`.

```jsx
var hello;
hello = (
  <div>
    <p>Hello</p>
  </div>
);
```
The following patterns are considered warnings when configured `{return: true}`.

```jsx
function hello() {
  return <div>
    <p>Hello</p>
  </div>;
}
```

The following patterns are not considered warnings when configured `{return: true}`.

```jsx
function hello() {
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}
```
The following patterns are considered warnings when configured `{arrow: true}`.

```jsx
var hello = () => <div>
  <p>World</p>
</div>;
```

The following patterns are not considered warnings when configured `{arrow: true}`.

```jsx
var hello = () => (
  <div>
    <p>World</p>
  </div>
);
```
