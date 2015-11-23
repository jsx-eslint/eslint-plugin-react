# Enforce event handler naming conventions in JSX (jsx-handler-names)

Ensures that any component or prop methods used to handle events are correctly prefixed.

## Rule Details

The following patterns are considered warnings:

```js
<MyComponent handleChange={this.handleChange} />
```

```js
<MyComponent onChange={this.componentChanged} />
```

The following patterns are not considered warnings:

```js
<MyComponent onChange={this.handleChange} />
```

```js
<MyComponent onChange={this.props.onFoo} />
```

## Rule Options

```js
...
"jsx-handler-names": [<enabled>, {
  "eventHandlerPrefix": <eventHandlerPrefix>,
  "eventHandlerPropPrefix": <eventHandlerPropPrefix>
}]
...
```

* `eventHandlerPrefix`: Prefix for component methods used as event handlers. Defaults to `handle`
* `eventHandlerPropPrefix`: Prefix for props that are used as event handlers. Defaults to `on`

## When Not To Use It

If you are not using JSX, or if you don't want to enforce specific naming conventions for event handlers.