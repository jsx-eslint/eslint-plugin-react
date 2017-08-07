Work in progress

```jsx
  <MyComponent someProp={'foo'} />
```

should be

```jsx
  <MyComponent someProp='foo' />
```

and

```jsx
  <MyTextBox autocomplete={true} />
```

should be

```jsx
  <MyTextBox autocomplete />
```

and

```jsx
  <MyComponent>{'Foo'}</MyComponent>
```

should be

```jsx
  <MyComponent>Foo</MyComponent>
```

but

```jsx
  <MyComponent>{'First \u00b7 Second'}</MyComponent>
```

is ok because it contains escaped characters.

References:
https://facebook.github.io/react/docs/jsx-in-depth.html
https://github.com/facebook/react/blob/v15.4.0-rc.3/docs/docs/02.3-jsx-gotchas.md#html-entities
