# Validate JSX maximum depth (react/jsx-max-depth)

This option validates a specific depth for JSX.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<App>
  <Foo>
    <Bar>
      <Baz />
    </Bar>
  </Foo>
</App>

```

## Rule Options

It takes an option as the second parameter which can be a positive number for depth count.

```js
...
"react/jsx-max-depth": [<enabled>, { "max": <number> }]
...
```

Examples of **incorrect** code for this rule:

```jsx
// [2, { "max": 1 }]
<App>
  <Foo>
    <Bar />
  </Foo>
</App>

// [2, { "max": 1 }]
const foobar = <Foo><Bar /></Foo>;
<App>
  {foobar}
</App>

// [2, { "max": 2 }]
<App>
  <Foo>
    <Bar>
      <Baz />
    </Bar>
  </Foo>
</App>
```

Examples of **correct** code for this rule:

```jsx

// [2, { "max": 1 }]
<App>
  <Hello />
</App>

// [2,{ "max": 2 }]
<App>
  <Foo>
    <Bar />
  </Foo>
</App>

// [2, { "max": 3 }]
<App>
  <Foo>
    <Bar>
      <Baz />
    </Bar>
  </Foo>
</App>
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
