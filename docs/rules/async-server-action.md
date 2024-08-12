# Require functions with the `use server` directive to be async (`react/async-server-action`)

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Require Server Actions (functions with the `use server` directive) to be async, as mandated by the `use server` [spec](https://react.dev/reference/react/use-server).

This must be the case even if the function does not use `await` or `return` a promise.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<form
  action={() => {
    'use server';
    ...
  }}
>
  ...
</form>
```

```jsx
function action() {
  'use server';
  ...
}
```

Examples of **correct** code for this rule:

```jsx
<form
  action={async () => {
    'use server';
    ...
  }}
>
  ...
</form>
```

```jsx
async function action() {
  'use server';
  ...
}
```

## When Not To Use It

If you are not using React Server Components.
