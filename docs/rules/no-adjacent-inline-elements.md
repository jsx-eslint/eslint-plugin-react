# Prevent adjacent inline elements not separated by whitespace. (react/no-adjacent-inline-elements)

Adjacent inline elements not separated by whitespace will bump up against each
other when viewed in an unstyled manner, which usually isn't desirable.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div><a></a><a></a></div>
<div><a></a><span></span></div>

React.createElement("div", undefined, [React.createElement("a"), React.createElement("span")]);
```

Examples of **correct** code for this rule:

```jsx
<div><div></div><div></div></div>
<div><a></a> <a></a></div>

React.createElement("div", undefined, [React.createElement("a"), " ", React.createElement("a")]);
```
