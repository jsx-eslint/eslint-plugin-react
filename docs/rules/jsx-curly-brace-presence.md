# Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes (`react/jsx-curly-brace-presence`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule allows you to enforce curly braces or disallow unnecessary curly braces in JSX props and/or children.

For situations where JSX expressions are unnecessary, please refer to [the React doc](https://facebook.github.io/react/docs/jsx-in-depth.html) and [this page about JSX gotchas](https://github.com/facebook/react/blob/v15.4.0-rc.3/docs/docs/02.3-jsx-gotchas.md#html-entities).

## Rule Details

By default, this rule will check for and warn about unnecessary curly braces in both JSX props and children. For the sake of backwards compatibility, prop values that are JSX elements are not considered by default.

You can pass in options to enforce the presence of curly braces on JSX props, children, JSX prop values that are JSX elements, or any combination of the three. The same options are available for not allowing unnecessary curly braces as well as ignoring the check.

**Note**: it is _highly recommended_ that you configure this rule with an object, and that you set "propElementValues" to "always". The ability to omit curly braces around prop values that are JSX elements is obscure, and intentionally undocumented, and should not be relied upon.

## Rule Options

```js
...
"react/jsx-curly-brace-presence": [<enabled>, { "props": <string>, "children": <string>, "propElementValues": <string>, "unwrapTemplateLiterals": <boolean> }]
...
```

or alternatively

```js
...
"react/jsx-curly-brace-presence": [<enabled>, <string>]
...
```

### Valid options for `<string>`

They are `always`, `never` and `ignore` for checking on JSX props and children.

- `always`: always enforce curly braces inside JSX props, children, and/or JSX prop values that are JSX Elements
- `never`: never allow unnecessary curly braces inside JSX props, children, and/or JSX prop values that are JSX Elements
- `ignore`: ignore the rule for JSX props, children, and/or JSX prop values that are JSX Elements

If passed in the option to fix, this is how a style violation will get fixed

- `always`: wrap a JSX attribute in curly braces/JSX expression and/or a JSX child the same way but also with double quotes
- `never`: get rid of curly braces from a JSX attribute and/or a JSX child

- All fixing operations use double quotes.

### `unwrapTemplateLiterals`

- `true`: unwrap template literals that only have a single expression inside of them.
  Since template literals return strings, this may cause changes in semantics, or type errors.
- `false` (default): do not unwrap template literals that only have a single expression inside of them.

## Examples

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

Examples of **incorrect** code for this rule, when configured with `{ props: "always", children: "always", "propElementValues": "always" }`:

```jsx
<App prop=<div /> />;
```

They can be fixed to:

```jsx
<App prop={<div />} />;
```

Examples of **incorrect** code for this rule, when configured with `{ props: "never", children: "never", "propElementValues": "never" }`:

```jsx
<App prop={<div />} />;
```

They can be fixed to:

```jsx
<App prop=<div /> />;
```

### Alternative syntax

The options are also `always`, `never`, and `ignore` for the same meanings.

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

- If the rule is set to get rid of unnecessary curly braces and the template literal inside a JSX expression has no expression, it will throw a warning and be fixed with double quotes. For example:

```jsx
<App prop={`Hello world`}>{`Hello world`}</App>;
```

will be warned and fixed to:

```jsx
<App prop="Hello world">Hello world</App>;
```

- If the rule is set to enforce curly braces and the strings have quotes, it will be fixed with double quotes for JSX children and the normal way for JSX attributes. Also, double quotes will be escaped in the fix.

For example:

```jsx
<App prop='Hello "foo" world'>Hello 'foo' "bar" world</App>;
```

will warned and fixed to:

```jsx
<App prop={"Hello \"foo\" world"}>{"Hello 'foo' \"bar\" world"}</App>;
```

- If the rule is set to get rid of unnecessary curly braces(JSX expression) and there are characters that need to be escaped in its JSX form, such as quote characters, [forbidden JSX text characters](https://facebook.github.io/jsx/), escaped characters and anything that looks like HTML entity names, the code will not be warned because the fix may make the code less readable.

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
