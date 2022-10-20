# Disallow multiple spaces between inline JSX props (`react/jsx-props-no-multi-spaces`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforces that there is exactly one space between all attributes and after tag name and the first attribute in the same line.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<App  spacy />
```

```jsx
<App too  spacy />
```

```jsx
<App
  prop1='abc'

  prop2='def' />
```

Examples of **correct** code for this rule:

```jsx
<App cozy />
```

```jsx
<App very cozy />
```

```jsx
<App
  prop1='abc'
  prop2='def' />
```

## When Not To Use It

If you are not using JSX or don't care about the space between two props in the same line.

If you have enabled the core rule `no-multi-spaces` with eslint >= 3, you don't need this rule.
