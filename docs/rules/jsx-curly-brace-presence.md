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
"react/jsx-curly-brace-presence": [<enabled>, { "props": <string>, "children": <string> }]
...
```

or alternatively

```js
...
"react/jsx-curly-brace-presence": [<enabled>, <string>]
...
```

### Valid options for <string>

They are `always`, `never` and `ignore` for checking on JSX props and children.

* `always`: always enforce curly braces inside JSX props or/and children
* `never`: never allow unnecessary curly braces inside JSX props or/and children
* `ignore`: ignore the rule for JSX props or/and children

If passed in the option to fix, this is how a style violation will get fixed

* `always`: wrap a JSX attribute in curly braces/JSX expression and/or a JSX child the same way but also with double quotes
* `never`: get rid of curly braces from a JSX attribute and/or a JSX child

- All fixing operations use double quotes.

For examples:

Examples of **incorrect** code for this rule, when configured with `{ props: "always", children: "always" }`:

```jsx
<App>Hello world</App>;
<App prop='Hello world'>{'Hello world'}</App>;
```

They can be fixed to:

```jsx
<App>{"Hello world"}</App>;
<App prop={"Hello world"}>{'Hello world'}</App>;
```

Examples of **incorrect** code for this rule, when configured with `{ props: "never", children: "never" }`:

```jsx
<App>{'Hello world'}</App>;
<App prop={'Hello world'} attr={"foo"} />;
```

They can be fixed to:

```jsx
<App>Hello world</App>;
<App prop="Hello world" attr="foo" />;
```

### Alternative syntax

The options are also `always`, `never` and `ignore` for the same meanings.

In this syntax, only a string is provided and the default will be set to that option for checking on both JSX props and children.

For examples:

Examples of **incorrect** code for this rule, when configured with `"always"`:

```jsx
<App>Hello world</App>;
<App prop='Hello world' attr="foo">Hello world</App>;
```

They can be fixed to:
```jsx
<App>{"Hello world"}</App>;
<App prop={"Hello world"} attr={"foo"}>{"Hello world"}</App>;
```

Examples of **incorrect** code for this rule, when configured with `"never"`:

```jsx
<App prop={'foo'} attr={"bar"}>{'Hello world'}</App>;
```

It can fixed to:

```jsx
<App prop="foo" attr="bar">Hello world</App>;
```

## Edge cases

The fix also deals with template literals, strings with quotes, and strings with escapes characters.

* If the rule is set to get rid of unnecessary curly braces and the template literal inside a JSX expression has no expression, it will throw a warning and be fixed with double quotes. For example:

```jsx
<App prop={`Hello world`}>{`Hello world`}</App>;
```

will be warned and fixed to:

```jsx
<App prop="Hello world">Hello world</App>;
```

* If the rule is set to enforce curly braces and the strings have quotes, it will be fixed with double quotes for JSX children and the normal way for JSX attributes. Also, double quotes will be escaped in the fix.

For example:


```jsx
<App prop='Hello "foo" world'>Hello 'foo' "bar" world</App>;
```

will warned and fixed to:

```jsx
<App prop={"Hello \"foo\" world"}>{"Hello 'foo' \"bar\" world"}</App>;
```

* If the rule is set to get rid of unnecessary curly braces(JSX expression) and there are characters that need to be escaped in its JSX form, such as quote characters, [forbidden JSX text characters](https://facebook.github.io/jsx/), escaped characters and anything that looks like HTML entity names, the code will not be warned because the fix may make the code less readable.

Examples of **correct** code for this rule, even when configured with `"never"`:

```jsx
<Color text={"\u00a0"} />
<App>{"Hello \u00b7 world"}</App>;
<style type="text/css">{'.main { margin-top: 0; }'}</style>;
/**
 * there's no way to inject a whitespace into jsx without a container so this
 * will always be allowed.
 */
<App>{' '}</App>
<App>{'     '}</App>
<App>{/* comment */ <Bpp />}</App> // the comment makes the container necessary 
```

## When Not To Use It

You should turn this rule off if you are not concerned about maintaining consistency regarding the use of curly braces in JSX props and/or children as well as the use of unnecessary JSX expressions.
