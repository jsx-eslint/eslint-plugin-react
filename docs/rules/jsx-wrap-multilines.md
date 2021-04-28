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

Examples of **incorrect** code for this rule, when configured with `parens` or `parens-new-line`:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>
      <p>Hello {this.props.name}</p>
    </div>;
  }
});
```

Examples of **incorrect** code for this rule, when configured with `parens-new-line`:

```jsx
var Hello = createReactClass({
  render: function() {
    return (<div>
      <p>Hello {this.props.name}</p>
    </div>);
  }
});
```

Examples of **correct** code for this rule:

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

Examples of **incorrect** code for this rule, when configured with `{ declaration: "parens" }`:

```jsx
var hello = <div>
  <p>Hello</p>
</div>;
```

Examples of **correct** code for this rule, when configured with `{ declaration: "parens" }`:

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

Examples of **incorrect** code for this rule, when configured with `{ declaration: "parens-new-line" }`:

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

Examples of **correct** code for this rule, when configured with `{ declaration: "parens-new-line" }`.

```jsx
var hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

### `assignment`

Examples of **incorrect** code for this rule, when configured with `{ assignment: "parens" }`.

```jsx
var hello;
hello = <div>
  <p>Hello</p>
</div>;
```


Examples of **correct** code for this rule, when configured with `{ assignment: "parens" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ assignment: "parens-new-line" }`.

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

Examples of **correct** code for this rule, when configured with `{ assignment: "parens-new-line" }`.

```jsx
var hello;
hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

### `return`

Examples of **incorrect** code for this rule, when configured with `{ return: "parens" }`.

```jsx
function hello() {
  return <div>
    <p>Hello</p>
  </div>;
}
```

Examples of **correct** code for this rule, when configured with `{ return: "parens" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ return: "parens-new-line" }`.

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

Examples of **correct** code for this rule, when configured with `{ return: "parens-new-line" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ arrow: "parens" }`.

```jsx
var hello = () => <div>
  <p>World</p>
</div>;
```


Examples of **correct** code for this rule, when configured `{ arrow: "parens" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ arrow: "parens-new-line" }`.

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

Examples of **correct** code for this rule, when configured with `{ arrow: "parens-new-line" }`.

```jsx
var hello = () => (
  <div>
    <p>World</p>
  </div>
);
```

### `condition`

Examples of **incorrect** code for this rule, when configured with `{ condition: "parens" }`.

```jsx
<div>
  {foo ? <div>
      <p>Hello</p>
    </div> : null}
</div>
```


Examples of **correct** code for this rule, when configured with `{ condition: "parens" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ condition: "parens-new-line" }`.

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

Examples of **correct** code for this rule, when configured with `{ condition: "parens-new-line" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ logical: "parens" }`.

```jsx
<div>
  {foo &&
    <div>
      <p>Hello World</p>
    </div>
  }
</div>
```

Examples of **correct** code for this rule, when configured with `{ logical: "parens" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ logical: "parens-new-line" }`.

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

Examples of **correct** code for this rule, when configured with `{ logical: "parens-new-line" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ prop: "parens" }`.

```jsx
<div foo={<div>
    <p>Hello</p>
  </div>}>
  <p>Hello</p>
</div>;
```

Examples of **correct** code for this rule, when configured with `{ prop: "parens" }`.

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

Examples of **incorrect** code for this rule, when configured with `{ prop: "parens-new-line" }`.

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

Examples of **correct** code for this rule, when configured with `{ prop: "parens-new-line" }`.

```jsx
<div foo={(
  <div>
    <p>Hello</p>
  </div>
)}>
  <p>Hello</p>
</div>;
```
