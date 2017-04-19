# Prevent adjacent inline elements not separated by whitespace. (no-adjacent-inline-elements)

Adjacent inline elements not separated by whitespace will bump up against each
other when viewed in an unstyled manner, which usually isn't desirable.

## Rule Details

The following patterns are considered warnings:

```jsx
<div><a></a><a></a></div>
<div><a></a><span></span></div>

React.createElement("div", undefined, [React.createElement("a"), React.createElement("span")]);
```

The following patterns are not considered warnings:

```jsx
<div><div></div><div></div></div>
<div><a></a> <a></a></div>

React.createElement("div", undefined, [React.createElement("a"), " ", React.createElement("a")]);
```
