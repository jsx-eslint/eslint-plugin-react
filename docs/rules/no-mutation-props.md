# Prevent mutation of this.props (no-mutation-props)

NEVER mutate `this.props`, as all React components must act like pure functions with respect to their props. 
Treat `this.props` as if it were immutable. More info available at [props-are-read-only](https://facebook.github.io/react/docs/components-and-props.html#props-are-read-only)

## Rule Details

This rule is aimed to forbid the use of mutating `this.props`.

The following patterns are considered warnings:

```jsx
var Hello = React.createClass({
  render: function() {
    this.props.name = this.props.name.toUpperCase();
    return <div>Hello {this.props.name}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    const {list} = this.props;
    list.push(2);
    return <div>{list.length} things</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    const [firstThing] = this.props.list;
    firstThing.foo = 'bar';
    return <div>{firstThing.foo}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    delete this.props.foo;
    return <div>{Object.keys(this.props).length} props</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    Object.assign(this.props.foo, {bar: 'baz'});
    return <div>{this.props.foo.bar}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    Object.defineProperty(this.props, 'foo');
    return <div>{this.props.foo}</div>;
  }
});

var Hello = React.createClass({
  render: function() {
    this.props.foo++;
    return <div>{this.props.foo}</div>;
  }
});
```

## Rule Options

```js
...
"react/no-mutation-props": [<enabled>, {
  "allowArrayMutations": <boolean>,
  "allowableArrayMutations": <array<string>>,
  "allowObjectStatics": <boolean>,
  "allowableObjectStatics": <array<string>>,
}]
...
```

### `allowArrayMutations`

When `true` the rule ignores [array mutation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Mutator_methods) of props.

You should only use this option if you have a prop that contains an object with methods that conflict with array mutation methods.

The following patterns are considered okay and do not cause warnings:

```jsx
this.props.list.push(1)
```

### `allowablArrayMutations`

When `allowArrayMutation: true` the rule specifies specific [array mutations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Mutator_methods) of props to allow. Mutations not listed will remain as warnings.

You must used this option in conjunction with `allowArrayMutation`. You should only use this option if you have a prop that contains an object with methods that conflict with array mutation methods.

### `allowObjectStatics`

When `true` the rule ignores [`Object` methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/object#Methods_of_the_Object_constructor) that can mutation props.

You should only use this option if you've overridden the language built-in `Object`.

The following patterns are considered okay and do not cause warnings:

```jsx
Object.assign(this.props, {foo: true})
Object.defineProperty(this.props.foo, 'bar')
Object.defineProperties(this.props.foo, [{foo: {value: 'bar'}}])
```

### `allowableObjectStatics`

When `allowObjectStatics: true` the rule specifies specific [`Object` methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/object#Methods_of_the_Object_constructor) of `Object` to allow. Mutation methods not listed will remain as warnings.

You must used this option in conjunction with `allowObjectStatics`. You should only use this option if you've overridden the language built-in `Object`.

### `allowReflectStatics`

When `true`, will allow [`Reflect` mutation methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Reflects/Reflect#Methods) of props that are objects.  

You should only use this option if you've overridden the language built-in `Reflect`.

The following patterns are considered okay and do not cause warnings:

```jsx
Reflect.set(this.props.foo, 'bar, true)
Reflect.defineProperty(this.props.foo, 'bar')
Reflect.deleteProperty(this.props.foo, 'bar')
```

### `allowableReflectStatics`

When `allowObjectStatics: true` the rule specifies a whitelist of specified [`Reflect` mutation methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect#Methods). Mutation methods not listed will remain as warnings.

You must used this option in conjunction with `allowReflectStatics`. You should only use this option if you've overridden the language built-in `Reflect`.

