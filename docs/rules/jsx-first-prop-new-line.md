# Configure the position of the first property (jsx-first-prop-new-line)

Ensure correct position of the first property.

## Rule Details

This rule checks whether the first property of all JSX elements is correctly placed. There are three possible configurations:
* `always`: The first property should always be placed on a new line.
* `never` : The first property should never be placed on a new line, e.g. should always be on the same line as the Component opening tag.
* `multiline`: The first property should always be placed on a new line when the properties are spread over multiple lines.

The following patterns are considered warnings when configured `"always"`:

```js
<Hello personal={true} />

<Hello personal={true}
    foo="bar"
/>
```

The following patterns are not considered warnings when configured `"always"`:

```js
<Hello
    personal />

<Hello
    personal
/>
```

The following patterns are considered warnings when configured `"never"`:

```js
<Hello
    personal />

<Hello
    personal
/>
```

The following patterns are not considered warnings when configured `"never"`:

```js
<Hello personal={true} />

<Hello personal={true}
    foo="bar"
/>
```

The following patterns are considered warnings when configured `"multiline"`:

```js
<Hello personal
    prop />
```

The following patterns are not considered warnings when configured `"multiline"`:

```js
<Hello personal={true} />

<Hello
    personal={true}
    foo="bar"
/>
```

## When not to use

If you are not using JSX then you can disable this rule.
