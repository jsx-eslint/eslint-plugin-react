# Prefer exact proptype definitions (react/prefer-exact-props)

Recommends options to ensure only exact prop definitions are used when writing components. This recommends solutions for PropTypes or for Flow types.

In React, you can define prop types for components using propTypes. Such an example is below:

```jsx
class Foo extends React.Component {
  render() {
    return <p>{this.props.bar}</p>;
  }
}

Foo.propTypes = {
  bar: PropTypes.string
};
```

The problem with this is that the consumer of the component could still pass in extra props. There could even be a typo for expected props. In order to prevent those situations, one could use the npm package [prop-types-exact](https://www.npmjs.com/package/prop-types-exact) to warn when unexpected props are passed to the component.

One can also define props for a component using Flow types. Such an example is below:

```jsx
class Foo extends React.Component {
  props: {
    bar: string
  }

  render() {
    return <p>{this.props.bar}</p>;
  }
}
```

In this case, one could instead enforce only the exact props being used by using exact type objects, like below:

```jsx
class Foo extends React.Component {
  props: {|
    bar: string
  }|

  render() {
    return <p>{this.props.bar}</p>;
  }
}
```

See the [Flow docs](https://flow.org/en/docs/types/objects/#toc-exact-object-types) on exact object types for more information.

## Rule Details

This rule will only produce errors for prop types when combined with the appropriate entries in `propWrapperFunctions`. For example:

```json
{
  "settings": {
    "propWrapperFunctions": [
      {"property": "exact", "exact": true}
    ]
  }
}
```

The following patterns are considered warnings:

```jsx
  class Component extends React.Component {
    render() {
      return <div />;
    }
  }
  Component.propTypes = {
    foo: PropTypes.string
  };
```

```jsx
  class Component extends React.Component {
    static propTypes = {
      foo: PropTypes.string
    }
    render() {
      return <div />;
    }
  }
```

```jsx
  class Component extends React.Component {
    props: {
      foo: string
    }
    render() {
      return <div />;
    }
  }
```

```jsx
  function Component(props: { foo: string }) {
    return <div />;
  }
```

```jsx
  type Props = {
    foo: string
  }
  function Component(props: Props) {
    return <div />;
  }
```

The following patterns are **not** considered warnings:

```jsx
  type Props = {|
    foo: string
  |}
  function Component(props: Props) {
    return <div />;
  }
```

```jsx
  import exact from 'prop-types-exact';
  class Component extends React.Component {
    render() {
      return <div />;
    }
  }
  Component.propTypes = exact({
    foo: PropTypes.string
  });
```

## When Not To Use It

If you aren't concerned about extra props being passed to a component or potential spelling errors for existing props aren't a common nuisance, then you can leave this rule off.
