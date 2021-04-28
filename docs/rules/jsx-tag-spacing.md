# Validate whitespace in and around the JSX opening and closing brackets (react/jsx-tag-spacing)

Enforce or forbid spaces after the opening bracket, before the closing bracket, before the closing bracket of self-closing elements, and between the angle bracket and slash of JSX closing or self-closing elements.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule checks the whitespace inside and surrounding the JSX syntactic elements.

This rule takes one argument, an object with 4 possible keys: `closingSlash`, `beforeSelfClosing`, `afterOpening`, and `beforeClosing`. Each key can receive the value `"allow"` to disable that specific check.

The default values are:

```json
{
  "closingSlash": "never",
  "beforeSelfClosing": "always",
  "afterOpening": "never",
  "beforeClosing": "allow"
}
```

The options for each sub-option are documented in the following subsections.

### `closingSlash`

This check can be set to `"always"`, `"never"` or `"allow"` (to disable it).

If it is `"never"`, the check warns whenever a space is separating the two characters in the JSX tokens `</` and `/>`. If it is `"always"` then it warns whenever a space is missing separating the mentioned two characters. The default value of this check is `"never"`.

Examples of **incorrect** code for this rule, when configured with `{ "closingSlash": "never" }`:

```jsx
<App/ >
<input/
>
<Provider>< /Provider>
```

Examples of **correct** code for this rule, when configured with `{ "closingSlash": "never" }`:

```jsx
<App/>
<input/>
<Provider></Provider>
```

Examples of **incorrect** code for this rule, when configured with `{ "closingSlash": "always" }`:

```jsx
<Hello/>
<Goodbye></Goodbye>
```

Examples of **correct** code for this rule, when configured with `{ "closingSlash": "always" }`:

```jsx
<Hello/ >
<Goodbye>< /Goodbye>
```

### `beforeSelfClosing`

This check can be set to `"always"`, `"never"` or `"allow"` (to disable it).

If it is `"always"`, the check warns whenever a space is missing before the closing bracket. If `"never"` then it warns if a space is present before the closing bracket. The default value of this check is `"always"`.

Examples of **incorrect** code for this rule, when configured with `{ "beforeSelfClosing": "always" }`:

```jsx
<Hello/>
<Hello firstname="John"/>
```

Examples of **correct** code for this rule, when configured with `{ "beforeSelfClosing": "always" }`:

```jsx
<Hello />
<Hello firstName="John" />
<Hello
  firstName="John"
  lastName="Smith"
/>
```

Examples of **incorrect** code for this rule, when configured with `{ "beforeSelfClosing": "never" }`:

```jsx
<Hello />
<Hello firstName="John" />
```

Examples of **correct** code for this rule, when configured with `{ "beforeSelfClosing": "never" }`:

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

Examples of **incorrect** code for this rule, when configured with `{ "afterOpening": "always" }`:

```jsx
<Hello></Hello>
<Hello firstname="John"/>
<Hello
  firstName="John"
  lastName="Smith"
/>
```

Examples of **correct** code for this rule, when configured with `{ "afterOpening": "always" }`:

```jsx
< Hello></ Hello>
< Hello firstName="John"/>
<
  Hello
  firstName="John"
  lastName="Smith"
/>
```

Examples of **incorrect** code for this rule, when configured with `{ "afterOpening": "never" }`:

```jsx
< Hello></ Hello>
< Hello firstName="John"/>
<
  Hello
  firstName="John"
  lastName="Smith"
/>
```

Examples of **correct** code for this rule, when configured with `{ "afterOpening": "never" }`:

```jsx
<Hello></Hello>
<Hello firstname="John"/>
<Hello
  firstName="John"
  lastName="Smith"
/>
```

Examples of **incorrect** code for this rule, when configured with `{ "afterOpening": "allow-multiline" }`:

```jsx
< Hello></ Hello>
< Hello firstName="John"/>
< Hello
  firstName="John"
  lastName="Smith"
/>
```

Examples of **correct** code for this rule, when configured with `{ "afterOpening": "allow-multiline" }`:

```jsx
<Hello></Hello>
<Hello firstName="John"/>
<
  Hello
  firstName="John"
  lastName="Smith"
/>
```

### `beforeClosing`

This check can be set to `"always"`, `"never"`, or `"allow"` (to disable it).

If it is `"always"` the check warns whenever whitespace is missing before the closing bracket of a JSX opening element or whenever a space is missing before the closing bracket closing element. If `"never"`, then it warns if a space is present before the closing bracket of either a JSX opening element or closing element. This rule will never warn for self closing JSX elements. The default value of this check is `"allow"`.

Examples of **incorrect** code for this rule, when configured with `{ "beforeClosing": "always" }`:

```jsx
<Hello></Hello>
<Hello></Hello >
<Hello ></Hello>
```

Examples of **correct** code for this rule, when configured with `{ "beforeClosing": "always" }`:

```jsx
<Hello ></Hello >
<Hello
  firstName="John"
>
</Hello >
```

Examples of **incorrect** code for this rule, when configured with `{ "beforeClosing": "never" }`:

```jsx
<Hello ></Hello>
<Hello></Hello >
<Hello ></Hello >
```

Examples of **correct** code for this rule, when configured with `{ "beforeClosing": "never" }`:

```jsx
<Hello></Hello>
<Hello
  firstName="John"
>
</Hello>
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing in or around JSX brackets.
