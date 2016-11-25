# Prevent usage of Array index in keys

Warn if an element uses an Array index in its `key`.

The `key` is used by React to [identify which items have changed, are added, or are removed and should be stable](https://facebook.github.io/react/docs/lists-and-keys.html#keys).

It's a bad idea to use the array index since it doesn't uniquely identify your elements. In cases where the array is sorted or an element is added to the beginning of the array, the index will be changed even though the element representing that index may be the same. This results in in unnecessary renders.

## Rule Details

The following patterns are considered warnings:

```jsx
things.map((thing, index) => (
  <Hello key={index} />
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

things.findIndex((thing, index) => {
  otherThings.push(<Hello key={index} />);
});
```

The following patterns are not considered warnings:

```jsx
things.map((thing) => (
  <Hello key={thing.id} />
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

things.findIndex((thing) => {
  otherThings.push(<Hello key={thing.id} />);
});
```
