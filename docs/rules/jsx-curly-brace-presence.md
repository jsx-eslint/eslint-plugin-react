# Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children. (react/jsx-curly-brace-presence)

This rule allows you to enforce curly braces or disallow unnecessary curly braces in JSX props and/or children.

For situations where JSX expressions are unnecessary, please refer to [the React doc](https://facebook.github.io/react/docs/jsx-in-depth.html) and [this page about JSX gotchas](https://github.com/facebook/react/blob/v15.4.0-rc.3/docs/docs/02.3-jsx-gotchas.md#html-entities).

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line

## Rule Details

By default, this rule will check for and warn about unnecessary curly braces in both JSX props and children.

You can pass in options to enforce the presence of curly braces on JSX props or children or both. The same options are available for not allowing unnecessary curly braces as well as ignoring the check.

## Rule Options

```js
...
"react/forbid-elements": [<enabled>, { "props": <string>, "children": <string> }]
...
```

or alternatively

```js
...
"react/forbid-elements": [<enabled>, <string>]
...
```

### Valid options for <string>

They are `always`, `never` and `ignore` for checking on JSX props and children.

* `always`: always enforce curly braces inside JSX props or/and children
* `never`: never allow unnecessary curly braces inside JSX props or/and children
* `ignore`: ignore the rule for JSX props or/and children

For examples:

When `{ props: "always", children: "always" }` is set, the following patterns will be given warnings.

```jsx
<App>Hello world</App>;
<App prop='Hello world'>{'Hello world'}</App>;
```

The following patterns won't.

```jsx
<App>{'Hello world'}</App>;
<App prop={'Hello world'}>{'Hello world'}</App>;
```

When `{ props: "never", children: "never" }` is set, the following patterns will be given warnings.

```jsx
<App>{'Hello world'}</App>;
<App prop={'Hello world'} />;
```

If passed in the option to fix, they will be corrected to

```jsx
<App>Hello world</App>;
<App prop='Hello world' />;
```

### Alternative syntax

The options are also `always`, `ignore` and `ignore` for the same meanings.

If only a string is provided, the default will be set to that option for checking on both JSX props and children.

For examples:

When `'always'` is set, the following patterns will be given warnings.

```jsx
<App>Hello world</App>;
<App prop='Hello world'>Hello world</App>;
```

And the following will pass.

```jsx
<App>{'Hello world'}</App>;
<App prop={'Hello world'}>{'Hello world'}</App>;
```

## When Not To Use It

You should turn this rule off if you are not concerned about maintaining consistency regarding the use of curly braces in JSX props and/or children as well as the use of unnecessary JSX expressions.
