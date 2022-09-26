# Enforces that every addEventListener has a matching removeEventListener in the return statement of the same useEffect block (`react/ensure-matching-remove-event-listener`)

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/jsx-eslint/eslint-plugin-react#shareable-configurations): `all`.

When adding "eventListeners" at the mounting phase of a component, sometimes developers forget to remove the "eventListener" in the cleanup function of the useEffect block. This can cause memory leaks in the react application:

> **Console error**: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

## Rule Details

This rule aims at reminding developers to add the corrisponding removeEventListener in the useEffect block of React components.

Examples of **incorrect** code for this rule:

```jsx
// Missing a matching removeEventListener.
useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
        doThis();
    };
}, [])
```

```jsx
// Missing a cleanup function for the addEventListener.
useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
}, [])
```

Examples of **correct** code for this rule:

```jsx
useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
        window.removeEventListener("keydown", handleUserKeyPress);
    };
}, []);
```

## When Not To Use It

You don't need this rules if you want to allow developers to not remove eventListeners added in the DOM.
