# Enforce style prop value being an object (react/style-prop-object)

Require that the value of the prop `style` be an object or a variable that is
an object.

## Rule Details

Examples of **incorrect** code for this rule:

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


Examples of **correct** code for this rule:

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
## Rule Options

```js
...
"react/style-prop-object": [<enabled>, {
  "allow": [<string>]
}]
...
```

### `allow`
A list of elements that are allowed to have a non-object value in their style attribute. The default value is `[]`.

#### Example
```js
{
  "allow": ["MyComponent"]
}
```
Examples of **incorrect** code for this rule:
```js
<Hello style="a string">
React.createElement(Hello, { style: "some styling" });
```

Examples of **correct** code for this rule:
```js
<MyComponent style="a string">
React.createElement(MyComponent, { style: "some styling" });
```
