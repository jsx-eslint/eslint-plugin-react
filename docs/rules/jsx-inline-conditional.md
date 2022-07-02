# Enforce JSX inline conditional as a ternary (react/jsx-inline-conditional)

This rule helps avoid common rendering bugs where the left side of an inline conditional is falsy (e.g. zero) and renders the value of the condition (e.g. `0`) instead of nothing. See the note in the [official React docs](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator).

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.
Fixer will fix whitespace and tabs indentation.

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

Examples of **incorrect** code for this rule:

```jsx
<div>
  {someCondition && <SomeComponent />}
</div>
<div>
  {someCondition || someOtherCondition && <SomeComponent />}
</div>
```

Examples of **correct** code for this rule:

```jsx
<div>
  {someCondition ? <SomeComponent /> : null}
</div>
// --
<div>
  {someCondition || someOtherCondition ? <SomeComponent /> : null}
</div>
```
