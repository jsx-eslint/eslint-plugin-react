# Prevent guarding with length truthiness in JSX (react/jsx-no-length-truthiness)

Flags all instances of checking `.length` truthiness in JSX.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

It is a common pattern to render something or nothing using `&&` as a guard:

```jsx
<div>{showHeader && <Header />} ... </div>
```

A common mistake is to use array length naïvely for this:

```jsx
<div>{posts.length && posts.map(p => ...)}</div>
```

The above code will render a presumably unwanted `0` when the array is empty. This rule checks for such erroneous use, and fixes it to the correct boolean check:

```jsx
<div>{posts.length > 0 && posts.map(p => ...)}</div>
```
