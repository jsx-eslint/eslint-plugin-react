# Prevent usage of random value for `key` prop (jsx-no-random-key)

Warn if a `key` prop has random value.

Keys should be stable, predictable, and unique. Unstable keys (like those produced by Math.random()) will cause many component instances and DOM nodes to be unnecessarily recreated, which can cause performance degradation and lost state in child components. See [details](https://reactjs.org/docs/reconciliation.html#tradeoffs)

## Rule Details

The following patterns are considered warnings:

```jsx
[<App key={nanoid()}/>, <App key={nanoid()}/>, <App key={nanoid()}/>];

data.map(x => { 
  return (
    <App key={nanoid()}>
      {x}
    </App>
  )
});
```

The following patterns are **not** considered warnings:

```jsx
[<App key="first" />, <App key="second" />, <App key="third" />];

data.map((x, i) => { 
  return <App key={i} /> 
});

data.map(item => { 
  return (
    <App key={item.id}>
      {item.title}
    </App>
  )
});
```

## When Not To Use It

If you are not using JSX then you can disable this rule.

## Resources
- [Official React documentation about key prop](https://reactjs.org/docs/lists-and-keys.html#keys)
