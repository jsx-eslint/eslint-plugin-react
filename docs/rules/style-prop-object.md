# Enforce style prop value being an object (react/style-prop-object)

Require that the value of the prop `style` be an object or a variable that is
an object.

## Rule Details

The following patterns are considered warnings:

```jsx
<div style="color: 'red'" />

<div style={true} />

<Hello style={true} />

const styles = true;
<div style={styles} />
```

```js
React.createElement("div", { style: "color: 'red'" });

React.createElement("div", { style: true });

React.createElement("Hello", { style: true });

const styles = true;
React.createElement("div", { style: styles });
```


The following patterns are **not** considered warnings:

```jsx
<div style={{ color: "red" }} />

<Hello style={{ color: "red" }} />

const styles = { color: "red" };
<div style={styles} />
```

```js
React.createElement("div", { style: { color: 'red' }});

React.createElement("Hello", { style: { color: 'red' }});

const styles = { height: '100px' };
React.createElement("div", { style: styles });
```
