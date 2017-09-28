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
    _.assign(this.props, {foo: 'bar'});
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
  "disabledMethods": <array<string>>,
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

### `allowableArrayMutations`

When `allowArrayMutation: true` the rule specifies specific [array mutations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Mutator_methods) of props to allow. Mutations not listed will remain as warnings.

You must used this option in conjunction with `allowArrayMutation`. You should only use this option if you have a prop that contains an object with methods that conflict with array mutation methods.

### `disabledMethods`

By default, this is set to: `['Object.assign', 'Object.defineProperty', 'Object.defineProperties', 'Reflect.defineProperty', 'Reflect.deleteProperty', 'Reflect.set', '_.fill', '_.reverse', '_.assign', '_.extend', '_.assignIn', '_.assignInWith', '_.extendWith', '_.assignWith', '_.defaults', '_.defaultsDeep', '_.merge', '_.mergeWith', '_.set', '_.setWith']`. This contains language built-ins that can mutate objects (see: [`Object` methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/object#Methods_of_the_Object_constructor) and [`Reflect` mutation methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Reflects/Reflect#Methods)) as well as methods on [lodash](https://lodash.com) that will mutate either arrays or objects. You can override this with your own set of object/method pairs.

**NOTE**: if you set this option, the defaults are overridden. It's a good idea to add at least the language defaults listed above to your configuration.

If set to an empty array, the following patterns are considered okay and do not cause warnings:

```jsx
Object.assign(this.props, {foo: true})
Object.defineProperty(this.props.foo, 'bar')
Object.defineProperties(this.props.foo, [{foo: {value: 'bar'}}])
Reflect.set(this.props.foo, 'bar, true)
Reflect.defineProperty(this.props.foo, 'bar')
Reflect.deleteProperty(this.props.foo, 'bar')
_.assign(this.props, {foo: 'bar'})
_.fill(this.props.list, 'foo')
// many more lodash methods
```

