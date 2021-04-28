# Enforce event handler naming conventions in JSX (react/jsx-handler-names)

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
  "checkInlineFunction": <boolean>
}]
...
```

* `eventHandlerPrefix`: Prefix for component methods used as event handlers. Defaults to `handle`
* `eventHandlerPropPrefix`: Prefix for props that are used as event handlers. Defaults to `on`
* `checkLocalVariables`: Determines whether event handlers stored as local variables are checked. Defaults to `false`
* `checkInlineFunction`: Determines whether event handlers set as inline functions are checked. Defaults to `false`

## When Not To Use It

If you are not using JSX, or if you don't want to enforce specific naming conventions for event handlers.
