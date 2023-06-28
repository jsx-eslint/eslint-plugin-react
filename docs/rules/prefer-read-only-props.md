# Enforce that props are read-only (`react/prefer-read-only-props`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Using Flow, one can define types for props. This rule enforces that prop types are read-only (covariant).

## Rule Details

Examples of **incorrect** code for this rule:

In Flow:

```jsx
type Props = {
  name: string,
}
class Hello extends React.Component<Props> {
  render () {
    return <div>Hello {this.props.name}</div>;
  }
}

function Hello(props: {-name: string}) {
  return <div>Hello {props.name}</div>;
}

const Hello = (props: {|name: string|}) => (
  <div>Hello {props.name}</div>
);
```

In TypeScript:

```tsx
type Props = {
  name: string;
}
class Hello extends React.Component<Props> {
  render () {
    return <div>Hello {this.props.name}</div>;
  }
}

interface Props {
  name: string;
}
class Hello extends React.Component<Props> {
  render () {
    return <div>Hello {this.props.name}</div>;
  }
}
```

Examples of **correct** code for this rule:

In Flow:

```jsx
type Props = {
  +name: string,
}
class Hello extends React.Component<Props> {
  render () {
    return <div>Hello {this.props.name}</div>;
  }
}

function Hello(props: {+name: string}) {
  return <div>Hello {props.name}</div>;
}

const Hello = (props: {|+name: string|}) => (
  <div>Hello {props.name}</div>
);
```

In TypeScript:

```tsx
type Props = {
  readonly name: string;
}
class Hello extends React.Component<Props> {
  render () {
    return <div>Hello {this.props.name}</div>;
  }
}

interface Props {
  readonly name: string;
}
class Hello extends React.Component<Props> {
  render () {
    return <div>Hello {this.props.name}</div>;
  }
}
```
