# react/jsx-handler-names

📝 Enforce event handler naming conventions in JSX.

<!-- end auto-generated rule header -->

Ensures that any component or prop methods used to handle events are correctly prefixed.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<MyComponent handleChange={this.handleChange} />
```

```jsx
<MyComponent onChange={this.componentChanged} />
```

Examples of **correct** code for this rule:

```jsx
<MyComponent onChange={this.handleChange} />
```

```jsx
<MyComponent onChange={this.props.onFoo} />
```

## Rule Options

```js
...
"react/jsx-handler-names": [<enabled>, {
  "eventHandlerPrefix": <eventHandlerPrefix>,
  "eventHandlerPropPrefix": <eventHandlerPropPrefix>,
  "checkLocalVariables": <boolean>,
  "checkInlineFunction": <boolean>,
  "ignoreComponentNames": Array<string>
}]
...
```

- `eventHandlerPrefix`: Prefix for component methods used as event handlers. Defaults to `handle`
- `eventHandlerPropPrefix`: Prefix for props that are used as event handlers. Defaults to `on`
- `checkLocalVariables`: Determines whether event handlers stored as local variables are checked. Defaults to `false`
- `checkInlineFunction`: Determines whether event handlers set as inline functions are checked. Defaults to `false`
- `ignoreComponentNames`: Array of glob strings, when matched with component name, ignores the rule on that component. Defaults to `[]`. Supports namespaced component names (e.g., `A.TestComponent`, `A.MyLib*`)

## When Not To Use It

If you are not using JSX, or if you don't want to enforce specific naming conventions for event handlers.
