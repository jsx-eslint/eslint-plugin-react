# Disallow && condition inside JSX Embed. (react/jsx-embed-condition)

This rule disallows use of `&&` inside JSX Embeds to avoid conditional numbers from being rendered.

## Why?

The Official React docs warns against using `&&` in inline JSX embed expressions. The reason behind this is explained well in the [Official React docs](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator).
Imagine having a var `x` with a possible value of `1` or `0`. If you write `{x && <div />}`, it'll render `<div />` when `x` is `1` but instead of rendering
nothing when `x` is `0`, it'll render `0` literal. This can lead to hard to figure out bugs, especially in React Native.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div>
  {x && <MyProfile />}
</div>
<div>
  {x || y && <strong>Hello</strong>}
</div>
```

Examples of **correct** code for this rule:

```jsx
<div>
  {x ? <MyProfile /> : null}
</div>
// --
<div>
  {x || y ? <strong>Hello</strong> : null}
</div>
```
