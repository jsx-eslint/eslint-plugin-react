# Disallow creating unstable components inside components (`react/no-unstable-nested-components`)

<!-- end auto-generated rule header -->

Creating components inside components (nested components) will cause React to throw away the state of those nested components on each re-render of their parent.

React reconciliation performs element type comparison with [reference equality](https://reactjs.org/docs/reconciliation.html#elements-of-different-types). The reference to the same element changes on each re-render when defining components inside the render block. This leads to complete recreation of the current node and all its children. As a result the virtual DOM has to do extra unnecessary work and [possible bugs are introduced](https://codepen.io/ariperkkio/pen/vYLodLB).

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
  return <SomeComponent footer={<div />} />;
}
```

⚠️ WARNING ⚠️:

Creating nested but memoized components is currently not detected by this rule but should also be avoided.
If the `useCallback` or `useMemo` hook has no dependency, you can safely move the component definition out of the render function.
If the hook does have dependencies, you should refactor the code so that you're able to move the component definition out of the render function.
If you want React to throw away the state of the nested component, use a [`key`](https://reactjs.org/docs/lists-and-keys.html#keys) instead.

```jsx
function Component() {
  // No ESLint warning but `MemoizedNestedComponent` should be moved outside of `Component`.
  const MemoizedNestedComponent = React.useCallback(() => <div />, []);

  return (
    <div>
      <MemoizedNestedComponent />
    </div>
  );
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
  {
    "allowAsProps": true | false,
    "customValidators": [] /* optional array of validators used for propTypes validation */
  }
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
