# Prevent problem with children and props.dangerouslySetInnerHTML (react/no-danger-with-children)

This rule helps prevent problems caused by using children and the dangerouslySetInnerHTML prop at the same time.
React will throw a warning if this rule is ignored.

## Rule Details

The following patterns are considered warnings:

```jsx
<div dangerouslySetInnerHTML={{ __html: "HTML" }}>
  Children
</div>

<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
  Children
</Hello>

```

```js
React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } }, "Children");

React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } }, "Children");
```

The following patterns are **not** considered warnings:

```jsx
<div dangerouslySetInnerHTML={{ __html: "HTML" }} />

<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />

<div>
  Children
</div>

<Hello>
  Children
</Hello>

```

```js
React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });

React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });

React.createElement("div", {}, "Children");

React.createElement("Hello", {}, "Children");
```

