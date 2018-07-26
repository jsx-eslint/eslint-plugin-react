# Prevent passing of children as props (react/no-children-prop)

Children should always be actual children, not passed in as a prop.

When using JSX, the children should be nested between the opening and closing
tags. When not using JSX, the children should be passed as additional
arguments to `React.createElement`.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div children='Children' />

<MyComponent children={<AnotherComponent />} />
<MyComponent children={['Child 1', 'Child 2']} />

React.createElement("div", { children: 'Children' })
```

Examples of **correct** code for this rule:

```jsx
<div>Children</div>

<MyComponent>Children</MyComponent>

<MyComponent>
  <span>Child 1</span>
  <span>Child 2</span>
</MyComponent>

React.createElement("div", {}, 'Children')
React.createElement("div", 'Child 1', 'Child 2')
```

## Rule Options

```js
"react/no-children-prop": [<enabled>, {
  "allowFunctions": <boolean> || false
}]
```

### `allowFunctions`

When `true`, and passing a function as `children`, it must be in prop position and not child position.

The following patterns are considered warnings:

```jsx
<MyComponent>{data => data.value}</MyComponent>
React.createElement(MyComponent, {}, data => data.value)
```

The following are **not** considered warnings:

```jsx
<MyComponent children={data => data.value} />
React.createElement(MyComponent, { children: data => data.value })
```
