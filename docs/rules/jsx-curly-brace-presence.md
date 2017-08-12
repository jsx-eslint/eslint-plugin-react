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

They are `always`, `always,single`, `always,double`, `always,orignal`, `never` and `ignore` for checking on JSX props and children.

* `always`: always enforce curly braces inside JSX props or/and children and fix with double quotes inside the generated JSX expressions
* `always,single`: always enforce curly braces and fix with single quotes
* `always,double`: always enforce curly braces and fix with double quotes
* `always,original`: always enforce curly braces and fix with original quotes(default to double quotes for JSX children)
* `never`: never allow unnecessary curly braces inside JSX props or/and children
* `ignore`: ignore the rule for JSX props or/and children

For examples:

When `{ props: "always", children: "always" }` is set, the following patterns will be given warnings.

```jsx
<App>Hello world</App>;
<App prop='Hello world'>{'Hello world'}</App>;
```

They can be fixed to:

```jsx
<App>{"Hello world"}</App>;
<App prop={"Hello world"}>{"Hello world"}</App>;
```

They will be fixed with single, double or original quotes based on the option you passed in. The default is double.

When `{ props: "never", children: "never" }` is set, the following patterns will be given warnings.

```jsx
<App>{'Hello world'}</App>;
<App prop={'Hello world'} />;
```

They can be fixed to:

```jsx
<App>Hello world</App>;
<App prop='Hello world' />;
```

### Alternative syntax

The options are also `always`, `always,single`, `always,double`, `always,orignal`, `never` and `ignore` for the same meanings.

In this syntax, only a string is provided and the default will be set to that option for checking on both JSX props and children.

For examples:

When `'always'` is set, the following patterns will be given warnings.

```jsx
<App>Hello world</App>;
<App prop='Hello world'>Hello world</App>;
```

They can be fixed to:
```jsx
<App>{"Hello world"}</App>;
<App prop={"Hello world"}>{"Hello world"}</App>;
```

If `'always,single'` is passed, they can be fixed to:

```jsx
<App>{'Hello world'}</App>;
<App prop={'Hello world'}>{'Hello world'}</App>;
```

When `'never'` is set, the following pattern will be given warnings.

```jsx
<App prop={'foo'}>{'Hello world'}</App>;
```

It can fixed to:

```jsx
<App prop='foo'>Hello world</App>;
```

## Edge cases

The fix also deals with template literals, strings with quotes and strings with escapes characters.

* If the rule is set to get rid of unnecessary curly braces and the template literal inside a JSX expression has no expression, it will throw a warning and be fixed with double quotes. For example:

```jsx
<App prop={`Hello world`}>Hello world</App>;
```

will be warned and fixed to:

```jsx
<App prop="Hello world">Hello world</App>;
```

* If the rule is set to enforce curly braces and the strings have quotes, it will be fixed with original quotes for JSX attributes and double for JSX children. For example:


```jsx
<App prop='Hello "foo" world'>Hello 'foo' "bar" world</App>;
```

will warned and fixed to:

```jsx
<App prop={'Hello "foo" world'}>{"Hello 'foo' \"bar\" world"}</App>;
```

* If the rule is set to get rid of unnecessary curly braces and the strings have escaped characters, it will not warn or fix for JSX children because JSX expressions are necessary in this case. For instance:

The following pattern will not be given a warning even if `'never'` is passed.

```jsx
<App>{"Hello \u00b7 world"}</App>;
```

## When Not To Use It

You should turn this rule off if you are not concerned about maintaining consistency regarding the use of curly braces in JSX props and/or children as well as the use of unnecessary JSX expressions.
