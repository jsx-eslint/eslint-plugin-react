# Spread Operator Position (jsx-spread-operator-position)

Ensure correct position when using the spread operator in JSX.

## Rule Details

This rule ensures the position of spread operator when using it to pass props in JSX components. Only is enabled when using the spread operator.
* `begin`: The first property is always be the spread operator.
* `end` : The last property is always the spread operator.

The following patterns are considered warnings when configured `"begin"`:

```js
<Hello prop1 {...this.props} />
```

The following patterns are not considered warnings when configured `"begin"`:

```js
<Hello {...this.props} />

<Hello {...this.props} prop1 />

<Hello prop1 />
```

The following patterns are considered warnings when configured `"end"`:

```js
<Hello {...this.props} prop1 />
```

The following patterns are not considered warnings when configured `"end"`:

```js
<Hello {...this.props} />

<Hello prop1 {...this.props} />

<Hello prop1 />
```

## When not to use

If you are not using JSX then you can disable this rule.
