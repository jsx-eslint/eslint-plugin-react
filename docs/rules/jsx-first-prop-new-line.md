# Configure the position of the first property (react/jsx-first-prop-new-line)

Ensure correct position of the first property.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line. However, fix does not include indentation. Please rerun lint to correct those errors.

## Rule Details

This rule checks whether the first property of all JSX elements is correctly placed. There are the possible configurations:

* `always`: The first property should always be placed on a new line.
* `never` : The first property should never be placed on a new line, e.g. should always be on the same line as the Component opening tag.
* `multiline`: The first property should always be placed on a new line when the JSX tag takes up multiple lines.
* `multiline-multiprop`: The first property should always be placed on a new line if the JSX tag takes up multiple lines and there are multiple properties. This is the `default` value.

Examples of **incorrect** code for this rule, when configured with `"always"`:

```jsx
<Hello personal={true} />

<Hello personal={true}
    foo="bar"
/>
```

Examples of **correct** code for this rule, when configured with `"always"`:

```jsx
<Hello
    personal />

<Hello
    personal
/>
```

Examples of **incorrect** code for this rule, when configured with `"never"`:

```jsx
<Hello
    personal />

<Hello
    personal
/>
```

Examples of **correct** code for this rule, when configured with `"never"`:

```jsx
<Hello personal={true} />

<Hello personal={true}
    foo="bar"
/>
```

Examples of **incorrect** code for this rule, when configured with `"multiline"`:

```jsx
<Hello personal
    prop />
```

```jsx
<Hello foo={{
}} />
```

Examples of **correct** code for this rule, when configured with `"multiline"`:

```jsx
<Hello personal={true} />

<Hello
    personal={true}
    foo="bar"
/>
```

Examples of **incorrect** code for this rule, when configured with `"multiline-multiprop"`:

```jsx
<Hello foo={{
    }}
    bar />
```

Examples of **correct** code for this rule, when configured with `"multiline-multiprop"`:

```jsx
<Hello foo={{
}} />

<Hello
    foo={{
    }}
    bar
/>
```

## Rule Options

```jsx
"react/jsx-first-prop-new-line": `"always" | "never" | "multiline" | "multiline-multiprop"`
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
