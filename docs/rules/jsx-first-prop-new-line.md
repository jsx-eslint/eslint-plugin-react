# Configure the position of the first property (jsx-first-prop-new-line)

Ensure correct position of the first property.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule checks whether the first property of all JSX elements is correctly placed. There are three possible configurations:
* `always`: The first property should always be placed on a new line.
* `never` : The first property should never be placed on a new line, e.g. should always be on the same line as the Component opening tag.
* `multiline`: The first property should always be placed on a new line when the JSX tag takes up multiple lines.
* `multiline-multiprop`: The first property should always be placed on a new line if the JSX tag takes up multiple lines and there are multiple properties.

In order to utilise autofix, please specify the indentation style as an additional argument in your configuration:

```json
"jsx-first-prop-new-line": ["always", 2]
```

The following patterns are considered warnings when configured `"always"`:

```jsx
<Hello personal={true} />

<Hello personal={true}
    foo="bar"
/>
```

The following patterns are not considered warnings when configured `"always"`:

```jsx
<Hello
    personal />

<Hello
    personal
/>
```

The following patterns are considered warnings when configured `"never"`:

```jsx
<Hello
    personal />

<Hello
    personal
/>
```

The following patterns are not considered warnings when configured `"never"`:

```jsx
<Hello personal={true} />

<Hello personal={true}
    foo="bar"
/>
```

The following patterns are considered warnings when configured `"multiline"`:

```jsx
<Hello personal
    prop />
```

```jsx
<Hello foo={{
}} />
```

The following patterns are not considered warnings when configured `"multiline"`:

```jsx
<Hello personal={true} />

<Hello
    personal={true}
    foo="bar"
/>
```

The following patterns are considered warnings when configured `"multiline-multiprop"`:

```jsx
<Hello foo={{
    }}
    bar />
```

The following patterns are not considered warnings when configured `"multiline-multiprop"`:

```jsx
<Hello foo={{
}} />

<Hello
    foo={{
    }}
    bar
/>
```

## When not to use

If you are not using JSX then you can disable this rule.
