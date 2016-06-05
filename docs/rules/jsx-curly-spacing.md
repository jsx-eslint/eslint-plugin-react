# Enforce or disallow spaces inside of curly braces in JSX attributes. (jsx-curly-spacing)

While formatting preferences are very personal, a number of style guides require or disallow spaces between curly braces.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to maintain consistency around the spacing inside of JSX attributes.

It either requires or disallows spaces between those braces and the values inside of them.

### Options

There are two main options for the rule:

* `"always"` enforces a space inside of curly braces
* `"never"` disallows spaces inside of curly braces (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"jsx-curly-spacing": [2, "always"]
```

#### never

When `"never"` is set, the following patterns are considered warnings:

```js
<Hello name={ firstname } />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
```

The following patterns are not warnings:

```js
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
<Hello name={
  firstname
} />;
```

#### always

When `"always"` is used, the following patterns are considered warnings:

```js
<Hello name={firstname} />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
```

The following patterns are not warnings:

```js
<Hello name={ firstname } />;
<Hello name={ {firstname: 'John', lastname: 'Doe'} } />;
<Hello name={
  firstname
} />;
```

#### Braces spanning multiple lines

By default, braces spanning multiple lines are allowed with either setting. If you want to disallow them you can specify an additional `allowMultiline` property with the value `false`:

```json
"jsx-curly-spacing": [2, "never", {"allowMultiline": false}]
```

When `"never"` is used and `allowMultiline` is `false`, the following patterns are considered warnings:

```js
<Hello name={ firstname } />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello name={
  firstname
} />;
```

The following patterns are not warnings:

```js
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
```

When `"always"` is used and `allowMultiline` is `false`, the following patterns are considered warnings:

```js
<Hello name={firstname} />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello name={
  firstname
} />;
```

The following patterns are not warnings:

```js
<Hello name={ firstname } />;
<Hello name={ {firstname: 'John', lastname: 'Doe'} } />;
```

#### Alternative

When setting the `alternative` option to `true` you must collapse the curly braces:

```json
"jsx-curly-spacing": [2, "always", {"alternative": true}]
```

When `"always"` is used and `alternative` is `true`, the following pattern is not warnings:

```js
<App foo={{ bar: true, baz: true }} />;
```

When `"always"` is used and `alternative` is `true`, the following pattern is considered warnings:

```js
<App foo={ {bar: true, baz: true} } />;
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency around the spacing inside of JSX attributes.
