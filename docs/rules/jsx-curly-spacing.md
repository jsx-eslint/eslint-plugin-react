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

```jsx
<Hello name={ firstname } />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
```

The following patterns are not warnings:

```jsx
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
<Hello name={
  firstname
} />;
```

#### always

When `"always"` is used, the following patterns are considered warnings:

```jsx
<Hello name={firstname} />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
```

The following patterns are not warnings:

```jsx
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

```jsx
<Hello name={ firstname } />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello name={
  firstname
} />;
```

The following patterns are not warnings:

```jsx
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
```

When `"always"` is used and `allowMultiline` is `false`, the following patterns are considered warnings:

```jsx
<Hello name={firstname} />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello name={
  firstname
} />;
```

The following patterns are not warnings:

```jsx
<Hello name={ firstname } />;
<Hello name={ {firstname: 'John', lastname: 'Doe'} } />;
```

#### Granular spacing controls

You can specify an additional `spacing` property that is an object with the following possible values:

```json
"jsx-curly-spacing": [2, "always", {"spacing": {
  "objectLiterals": "never"
}}]
```

* `objectLiterals`: This controls different spacing requirements when the value inside the jsx curly braces is an object literal.

All spacing options accept either the string `"always"` or the string `"never"`. Note that the default value for all "spacing" options matches the first "always"/"never" option provided.

When `"always"` is used but `objectLiterals` is `"never"`, the following pattern is not considered a warning:

```jsx
<App blah={ 3 } foo={{ bar: true, baz: true }} />;
```

When `"never"` is used and `objectLiterals` is `"always"`, the following pattern is not considered a warning:

```jsx
<App blah={3} foo={ {bar: true, baz: true} } />;
```

Please note that spacing of the object literal curly braces themselves is controlled by the built-in [`object-curly-spacing`](http://eslint.org/docs/rules/object-curly-spacing) rule.

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency around the spacing inside of JSX attributes.
