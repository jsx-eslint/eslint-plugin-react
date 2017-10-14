# Prevent missing parentheses around multiline JSX (react/jsx-wrap-multilines)

Wrapping multiline JSX in parentheses can improve readability and/or convenience.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule optionally takes a second parameter in the form of an object, containing places to apply the rule. By default, all the syntax listed below will be checked except the conditions out of declaration or assignment, logical expressions and JSX attributes, but these can be explicitly disabled. Any syntax type missing in the object will follow the default behavior displayed below.

```json
{
  "declaration": "parens",
  "assignment": "parens",
  "return": "parens",
  "arrow": "parens",
  "condition": "ignore",
  "logical": "ignore",
  "prop": "ignore"
}
```

Note: conditions are checked by default in declarations or assignments.

The following patterns are considered warnings when using `parens` or `parens-new-line`:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>
      <p>Hello {this.props.name}</p>
    </div>;
  }
});
```

The following patterns are considered warnings when using `parens-new-line`:

```jsx
var Hello = createReactClass({
  render: function() {
    return (<div>
      <p>Hello {this.props.name}</p>
    </div>);
  }
});
```

The following patterns are **not** considered warnings:

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

### `declaration`

The following patterns are considered warnings when configured `{declaration: "parens"}`.

```jsx
var hello = <div>
  <p>Hello</p>
</div>;
```


The following patterns are **not** considered warnings when configured `{declaration: "parens"}`.

```jsx
var hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

```jsx
var hello = (<div>
  <p>Hello</p>
</div>);
```

The following patterns are considered warnings when configured `{declaration: "parens-new-line"}`.

```jsx
var hello = <div>
  <p>Hello</p>
</div>;
```

```jsx
var hello = (<div>
  <p>Hello</p>
</div>);
```

The following patterns are **not** considered warnings when configured `{declaration: "parens-new-line"}`.

```jsx
var hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

### `assignment`

The following patterns are considered warnings when configured `{assignment: "parens"}`.

```jsx
var hello;
hello = <div>
  <p>Hello</p>
</div>;
```


The following patterns are **not** considered warnings when configured `{assignment: "parens"}`.

```jsx
var hello;
hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

```jsx
var hello;
hello = (<div>
  <p>Hello</p>
</div>);
```

The following patterns are considered warnings when configured `{assignment: "parens-new-line"}`.

```jsx
var hello;
hello = <div>
  <p>Hello</p>
</div>;
```

```jsx
var hello;
hello = (<div>
  <p>Hello</p>
</div>);
```

The following patterns are **not** considered warnings when configured `{assignment: "parens-new-line"}`.

```jsx
var hello;
hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

### `return`

The following patterns are considered warnings when configured `{return: "parens"}`.

```jsx
function hello() {
  return <div>
    <p>Hello</p>
  </div>;
}
```

The following patterns are **not** considered warnings when configured `{return: "parens"}`.

```jsx
function hello() {
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}
```

```jsx
function hello() {
  return (<div>
    <p>Hello</p>
  </div>);
}
```

The following patterns are considered warnings when configured `{return: "parens-new-line"}`.

```jsx
function hello() {
  return <div>
    <p>Hello</p>
  </div>;
}
```

```jsx
function hello() {
  return (<div>
    <p>Hello</p>
  </div>);
}
```

The following patterns are **not** considered warnings when configured `{return: "parens-new-line"}`.

```jsx
function hello() {
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}
```

### `arrow`

The following patterns are considered warnings when configured `{arrow: "parens"}`.

```jsx
var hello = () => <div>
  <p>World</p>
</div>;
```


The following patterns are **not** considered warnings when configured `{arrow: "parens"}`.

```jsx
var hello = () => (
  <div>
    <p>World</p>
  </div>
);
```

```jsx
var hello = () => (<div>
  <p>World</p>
</div>);
```

The following patterns are considered warnings when configured `{arrow: "parens-new-line"}`.

```jsx
var hello = () => <div>
  <p>World</p>
</div>;
```

```jsx
var hello = () => (<div>
  <p>World</p>
</div>);
```

The following patterns are **not** considered warnings when configured `{arrow: "parens-new-line"}`.

```jsx
var hello = () => (
  <div>
    <p>World</p>
  </div>
);
```

### `condition`

The following patterns are considered warnings when configured `{condition: "parens"}`.

```jsx
<div>
  {foo ? <div>
      <p>Hello</p>
    </div> : null}
</div>
```


The following patterns are **not** considered warnings when configured `{condition: "parens"}`.

```jsx
<div>
  {foo ? (<div>
      <p>Hello</p>
  </div>) : null}
</div>
```

```jsx
<div>
  {foo ? (
    <div>
      <p>Hello</p>
    </div>
  ): null}
</div>
```

The following patterns are considered warnings when configured `{condition: "parens-new-line"}`.

```jsx
<div>
  {foo ? <div>
      <p>Hello</p>
    </div> : null}
</div>
```

```jsx
<div>
  {foo ? (<div>
      <p>Hello</p>
  </div>) : null}
</div>
```

The following patterns are **not** considered warnings when configured `{condition: "parens-new-line"}`.

```jsx
<div>
  {foo ? (
    <div>
      <p>Hello</p>
    </div>
  ): null}
</div>
```

### `logical`

The following patterns are considered warnings when configured `{logical: "parens"}`.

```jsx
<div>
  {foo &&
    <div>
      <p>Hello World</p>
    </div>
  }
</div>
```

The following patterns are **not** considered warnings when configured `{logical: "parens"}`.

```jsx
<div>
  {foo &&
    (<div>
      <p>Hello World</p>
    </div>)
  }
</div>
```

```jsx
<div>
  {foo && (
    <div>
      <p>Hello World</p>
    </div>
  )}
</div>
```

The following patterns are considered warnings when configured `{logical: "parens-new-line"}`.

```jsx
<div>
  {foo &&
    <div>
      <p>Hello World</p>
    </div>
  }
</div>
```

```jsx
<div>
  {foo &&
    (<div>
      <p>Hello World</p>
    </div>)
  }
</div>
```

The following patterns are **not** considered warnings when configured `{logical: "parens-new-line"}`.

```jsx
<div>
  {foo && (
    <div>
      <p>Hello World</p>
    </div>
  )}
</div>
```

### `prop`

The following patterns are considered warnings when configured `{prop: "parens"}`.

```jsx
<div foo={<div>
    <p>Hello</p>
  </div>}>
  <p>Hello</p>
</div>;
```

The following patterns are **not** considered warnings when configured `{prop: "parens"}`.

```jsx
<div foo={(<div>
    <p>Hello</p>
  </div>)}>
  <p>Hello</p>
</div>;
```

```jsx
<div foo={(
  <div>
    <p>Hello</p>
  </div>
)}>
  <p>Hello</p>
</div>;
```

The following patterns are considered warnings when configured `{prop: "parens-new-line"}`.

```jsx
<div foo={<div>
    <p>Hello</p>
  </div>}>
  <p>Hello</p>
</div>;
```

```jsx
<div foo={(<div>
    <p>Hello</p>
  </div>)}>
  <p>Hello</p>
</div>;
```

The following patterns are **not** considered warnings when configured `{prop: "parens-new-line"}`.

```jsx
<div foo={(
  <div>
    <p>Hello</p>
  </div>
)}>
  <p>Hello</p>
</div>;
```
