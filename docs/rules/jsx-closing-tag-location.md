# Enforce closing tag location for multiline JSX (`react/jsx-closing-tag-location`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce the closing tag location for multiline JSX elements.

## Rule Details

This rule checks all JSX multiline elements with children (non-self-closing) and verifies the location of the closing tag. The expectation is that the closing tag is aligned with the opening tag on its own line.

Examples of **incorrect** code for this rule:

```jsx
<Hello>
  marklar
  </Hello>
```

```jsx
<Hello>
  marklar</Hello>
```

Examples of **correct** code for this rule:

```jsx
<Hello>
  marklar
</Hello>
```

```jsx
<Hello>marklar</Hello>
```

## When Not To Use It

If you do not care about closing tag JSX alignment then you can disable this rule.
