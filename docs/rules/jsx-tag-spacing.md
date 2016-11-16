# Validate whitespace in and around the JSX opening and closing brackets (jsx-tag-spacing)

Enforce or forbid spaces after the opening bracket, before the closing bracket of self-closing elements, and between the angle bracket and slash of JSX closing or self-closing elements.

## Rule Details

This rule checks the whitespace inside and surrounding the JSX syntactic elements.

This rule takes one argument, an object with 3 possible keys: `closingSlash`, `beforeSelfClosing` and `afterOpening`. Each key can receive the value `"allow"` to disable that specific check.

The default values are:

```json
{
  "closingSlash": "never",
  "beforeSelfClosing": "always",
  "afterOpening": "never"
}
```

The options for each sub-option are documented in the following subsections.

### `closingSlash`

This check can be set to `"always"`, `"never"` or `"allow"` (to disable it).

If it is `"never"`, the check warns whenever a space is separating the two characters in the JSX tokens `</` and `/>`. If it is `"always"` then it warns whenever a space is missing separating the mentioned two characters. The default value of this check is `"never"`.

The following patterns are considered warnings when configured `"never"`:

```jsx
<App/ >
<input/
>
<Provider>< /Provider>
```

The following patterns are not considered warnings when configured `"never"`:

```jsx
<App/>
<input/>
<Provider></Provider>
```

The following patterns are considered warnings when configured `"always"`:

```jsx
<Hello/>
<Goodbye></Goodbye>
```

The following patterns are not considered warnings when configured `"always"`:

```jsx
<Hello/ >
<Goodbye>< /Goodbye>
```

### `beforeSelfClosing`

This check can be set to `"always"`, `"never"` or `"allow"` (to disable it).

If it is `"always"`, the check warns whenever a space is missing before the closing bracket. If `"never"` then it warns if a space is present before the closing bracket. The default value of this check is `"always"`.

The following patterns are considered warnings when configured `"always"`:

```jsx
<Hello/>
<Hello firstname="John"/>
```

The following patterns are not considered warnings when configured `"always"`:

```jsx
<Hello />
<Hello firstName="John" />
<Hello
  firstName="John"
  lastName="Smith"
/>
```

The following patterns are considered warnings when configured `"never"`:

```jsx
<Hello />
<Hello firstName="John" />
```

The following patterns are not considered warnings when configured `"never"`:

```jsx
<Hello/>
<Hello firstname="John"/>
<Hello
  firstName="John"
  lastName="Smith"
/>
```

### `afterOpening`

This check can be set to `"always"`, `"never"`, `"allow-multiline"` or `"allow"` (to disable it).

If it is `"always"`, the check warns whenever a space is missing after the opening bracket of either a JSX opening element or closing element. If `"never"` then it warns if a space is present after the opening bracket of either a JSX opening element or closing element. If `"allow-multiline"` then it behaves like `"never"`, but allows if the separator includes a newline character. The default value of this check is `"never"`.

The following patterns are considered warnings when configured `"always"`:

```jsx
<Hello></Hello>
<Hello firstname="John"/>
<Hello
  firstName="John"
  lastName="Smith"
/>
```

The following patterns are not considered warnings when configured `"always"`:

```jsx
< Hello></ Hello>
< Hello firstName="John"/>
<
  Hello
  firstName="John"
  lastName="Smith"
/>
```

The following patterns are considered warnings when configured `"never"`:

```jsx
< Hello></ Hello>
< Hello firstName="John"/>
<
  Hello
  firstName="John"
  lastName="Smith"
/>
```

The following patterns are not considered warnings when configured `"never"`:

```jsx
<Hello></Hello>
<Hello firstname="John"/>
<Hello
  firstName="John"
  lastName="Smith"
/>
```

The following patterns are considered warnings when configured `"allow-multiline"`:

```jsx
< Hello></ Hello>
< Hello firstName="John"/>
< Hello
  firstName="John"
  lastName="Smith"
/>
```

The following patterns are not considered warnings when configured `"allow-multiline"`:

```jsx
<Hello></Hello>
<Hello firstName="John"/>
<
  Hello
  firstName="John"
  lastName="Smith"
/>
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing in or around JSX brackets.
