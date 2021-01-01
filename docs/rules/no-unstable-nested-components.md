# Prevent creating unstable components inside components (react/no-unstable-nested-components)

Creating components inside components without memoization leads to unstable components. The nested component and all its children are recreated during each re-render. Given stateful children of the nested component will lose their state on each re-render.

React reconcilation performs element type comparison with [reference equality](https://github.com/facebook/react/blob/v16.13.1/packages/react-reconciler/src/ReactChildFiber.js#L407). The reference to the same element changes on each re-render when defining components inside the render block. This leads to complete recreation of the current node and all its children. As a result the virtual DOM has to do extra unnecessary work and [possible bugs are introduced](https://codepen.io/ariperkkio/pen/vYLodLB).

## Rule Details

The following patterns are considered warnings:

```jsx
function Component() {
  function UnstableNestedComponent() {
    return <div />;
  }

  return (
    <div>
      <UnstableNestedComponent />
    </div>
  );
}
```

```jsx
function SomeComponent({ footer: Footer }) {
  return (
    <div>
      <Footer />
    </div>
  );
}

function Component() {
  return (
    <div>
      <SomeComponent footer={() => <div />} />
    </div>
  );
}
```

```jsx
class Component extends React.Component {
  render() {
    function UnstableNestedComponent() {
      return <div />;
    }

    return (
      <div>
        <UnstableNestedComponent />
      </div>
    );
  }
}
```

The following patterns are **not** considered warnings:

```jsx
function OutsideDefinedComponent(props) {
  return <div />;
}

function Component() {
  return (
    <div>
      <OutsideDefinedComponent />
    </div>
  );
}
```

```jsx
function Component() {
  const MemoizedNestedComponent = React.useCallback(() => <div />, []);

  return (
    <div>
      <MemoizedNestedComponent />
    </div>
  );
}
```

```jsx
function Component() {
  return (
    <SomeComponent footer={<div />} />
  )
}
```

By default component creation is allowed inside component props only if prop name starts with `render`. See `allowAsProps` option for disabling this limitation completely.

```jsx
function SomeComponent(props) {
  return <div>{props.renderFooter()}</div>;
}

function Component() {
  return (
    <div>
      <SomeComponent renderFooter={() => <div />} />
    </div>
  );
}
```

## Rule Options

```js
...
"react/no-unstable-nested-components": [
  "off" | "warn" | "error",
  { "allowAsProps": true | false }
]
...
```

You can allow component creation inside component props by setting `allowAsProps` option to true. When using this option make sure you are **calling** the props in the receiving component and not using them as elements.

The following patterns are **not** considered warnings:

```jsx
function SomeComponent(props) {
  return <div>{props.footer()}</div>;
}

function Component() {
  return (
    <div>
      <SomeComponent footer={() => <div />} />
    </div>
  );
}
```

## When Not To Use It

If you are not interested in preventing bugs related to re-creation of the nested components or do not care about optimization of virtual DOM.
