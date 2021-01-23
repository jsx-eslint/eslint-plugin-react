# Enforce PascalCase for user-defined JSX components (react/jsx-pascal-case)

Enforces coding style that user-defined JSX components are defined and referenced in PascalCase.

Note that since React's JSX uses the upper vs. lower case convention to distinguish between local component classes and HTML tags this rule will not warn on components that start with a lower case letter.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<Test_component />
```

```jsx
<TEST_COMPONENT />
```

Examples of **correct** code for this rule:

```jsx
<div />
```

```jsx
<TestComponent />
```

```jsx
<TestComponent>
  <div />
</TestComponent>
```

```jsx
<CSSTransitionGroup />
```

## Rule Options

```js
...
"react/jsx-pascal-case": [<enabled>, { allowAllCaps: <allowAllCaps>, ignore: <ignore> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `allowAllCaps`: optional boolean set to `true` to allow components name in all caps (default to `false`).
* `ignore`: optional string-array of component names to ignore during validation (supports [minimatch](https://github.com/isaacs/minimatch)-style globs).

### `allowAllCaps`

Examples of **correct** code for this rule, when `allowAllCaps` is `true`:

```jsx
<ALLOWED />
<TEST_COMPONENT />
```

## When Not To Use It

If you are not using JSX.
