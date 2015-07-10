# Enforce or disallow spaces inside of curly braces in JSX attributes. (jsx-curly-spacing)

While formatting preferences are very personal, a number of style guides require or disallow spaces between curly braces.

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
<Hello name={
  firstname
} />;
```

The following patterns are not warnings:

```js
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
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

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency around the spacing inside of JSX attributes.

