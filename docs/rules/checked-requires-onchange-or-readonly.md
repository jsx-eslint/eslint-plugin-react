# Enforce using `onChange` or `readonly` attribute when `checked` is used (`react/checked-requires-onchange-or-readonly`)

<!-- end auto-generated rule header -->

This rule enforces `onChange` or `readonly` attribute for `checked` property of input elements.

It also warns when `checked` and `defaultChecked` properties are used together.

## Rule Details

Example of **incorrect** code for this rule:

```jsx
<input type="checkbox" checked />
<input type="checkbox" checked defaultChecked />
<input type="radio" checked defaultChecked />

React.createElement('input', { checked: false });
React.createElement('input', { type: 'checkbox', checked: true });
React.createElement('input', { type: 'checkbox', checked: true, defaultChecked: true });
```

Example of **correct** code for this rule:

```jsx
<input type="checkbox" checked onChange={() => {}} />
<input type="checkbox" checked readOnly />
<input type="checkbox" checked onChange readOnly />
<input type="checkbox" defaultChecked />

React.createElement('input', { type: 'checkbox', checked: true, onChange() {} });
React.createElement('input', { type: 'checkbox', checked: true, readOnly: true });
React.createElement('input', { type: 'checkbox', checked: true, onChange() {}, readOnly: true });
React.createElement('input', { type: 'checkbox', defaultChecked: true });
```

## Rule Options

```js
"react/checked-requires-onchange-or-readonly": [<enabled>, {
  "ignoreMissingProperties": <boolean>,
  "ignoreExclusiveCheckedAttribute": <boolean>
}]
```
