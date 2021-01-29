# Prevent usage of Array index in keys (react/no-array-index-key)

Warn if an element uses an Array index in its `key`.

The `key` is used by React to [identify which items have changed, are added, or are removed and should be stable](https://facebook.github.io/react/docs/lists-and-keys.html#keys).

It's a bad idea to use the array index since it doesn't uniquely identify your elements. In cases where the array is sorted or an element is added to the beginning of the array, the index will be changed even though the element representing that index may be the same. This results in unnecessary renders.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
things.map((thing, index) => (
  <Hello key={index} />
));

things.map((thing, index) => (
  React.cloneElement(thing, { key: index })
));

things.forEach((thing, index) => {
  otherThings.push(<Hello key={index} />);
});

things.filter((thing, index) => {
  otherThings.push(<Hello key={index} />);
});

things.some((thing, index) => {
  otherThings.push(<Hello key={index} />);
});

things.every((thing, index) => {
  otherThings.push(<Hello key={index} />);
});

things.find((thing, index) => {
  otherThings.push(<Hello key={index} />);
});

things.findIndex((thing, index) => {
  otherThings.push(<Hello key={index} />);
});

things.reduce((collection, thing, index) => (
  collection.concat(<Hello key={index} />)
), []);

things.reduceRight((collection, thing, index) => (
  collection.concat(<Hello key={index} />)
), []);

React.Children.map(this.props.children, (child, index) => (
  React.cloneElement(child, { key: index })
))

Children.forEach(this.props.children, (child, index) => (
  React.cloneElement(child, { key: index })
))
```

Examples of **correct** code for this rule:

```jsx
things.map((thing) => (
  <Hello key={thing.id} />
));

things.map((thing) => (
  React.cloneElement(thing, { key: thing.id })
));

things.forEach((thing) => {
  otherThings.push(<Hello key={thing.id} />);
});

things.filter((thing) => {
  otherThings.push(<Hello key={thing.id} />);
});

things.some((thing) => {
  otherThings.push(<Hello key={thing.id} />);
});

things.every((thing) => {
  otherThings.push(<Hello key={thing.id} />);
});

things.find((thing) => {
  otherThings.push(<Hello key={thing.id} />);
});

things.findIndex((thing) => {
  otherThings.push(<Hello key={thing.id} />);
});

things.reduce((collection, thing) => (
  collection.concat(<Hello key={thing.id} />)
), []);

things.reduceRight((collection, thing) => (
  collection.concat(<Hello key={thing.id} />)
), []);
```

## When Not To Use It

If there is nothing unique about the items, for example [you are breaking an array down in to chunks](https://github.com/yannickcr/eslint-plugin-react/issues/1123), then you may want to disable this rule with an override.
