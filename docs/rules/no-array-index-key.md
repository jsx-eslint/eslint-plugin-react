# Prevent usage of Array index in keys

Warn if an element uses an Array index in its `key`.

The `key` is used by React to [identify which items have changed, are added, or are removed and should be stable](https://facebook.github.io/react/docs/lists-and-keys.html#keys).

## Rule Details

The following patterns are considered warnings:

```jsx
things.map((thing, index) => (
  <Hello key={index} />
));
```

The following patterns are not considered warnings:

```jsx
things.map((thing) => (
  <Hello key={thing.id} />
));
```
