# Enforce or disallow spaces inside of curly braces in JSX attributes and expressions. (react/jsx-curly-spacing)

While formatting preferences are very personal, a number of style guides require or disallow spaces between curly braces.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to maintain consistency around the spacing inside of JSX attributes and expressions inside element children.

It either requires or disallows spaces between those braces and the values inside of them.

## Rule Options

There are two main options for the rule:

* `{"when": "always"}` enforces a space inside of curly braces
* `{"when": "never"}` disallows spaces inside of curly braces (default)

There are also two properties that allow specifying how the rule should work with the attributes (`attributes`) and the expressions (`children`). The possible values are:

* `true` enables checking for the spacing using the options (default for `attributes`), e.g. `{"attributes": false}` disables checking the attributes
* `false` disables checking for the spacing (default for `children`, for backward compatibility), e.g. `{"children": true}` enables checking the expressions
* an object containing options that override the global options, e.g. `{"when": "always", "children": {"when": "never"}}` enforces a space inside attributes, but disallows spaces inside expressions

### never

Examples of **incorrect** code for this rule, when configured with `{ "when": "never" }`:

```jsx
<Hello name={ firstname } />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
```

Examples of **correct** code for this rule:

```jsx
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
<Hello name={
  firstname
} />;
<Hello>{firstname}</Hello>;
<Hello>{ firstname }</Hello>;
<Hello>{
  firstname
}</Hello>;
```

Examples of **incorrect** code for this rule, when configured with `{ "when": "never", "children": true }`:

```jsx
<Hello name={ firstname } />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello>{ firstname }</Hello>;
```

Examples of **correct** code for this rule:

```jsx
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
<Hello name={
  firstname
} />;
<Hello>{firstname}</Hello>;
<Hello>{
  firstname
}</Hello>;
```

### always

Examples of **incorrect** code for this rule, when configured with `{ "when": "always" }`:

```jsx
<Hello name={firstname} />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
```

Examples of **correct** code for this rule:

```jsx
<Hello name={ firstname } />;
<Hello name={ {firstname: 'John', lastname: 'Doe'} } />;
<Hello name={
  firstname
} />;
<Hello>{ firstname }</Hello>;
<Hello>{firstname}</Hello>;
<Hello>{
  firstname
}</Hello>;
```

Examples of **incorrect** code for this rule, when configured with `{ "when": "always", "children": true }`:

```jsx
<Hello name={firstname} />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello>{firstname}</Hello>;
```

Examples of **correct** code for this rule:

```jsx
<Hello name={ firstname } />;
<Hello name={ {firstname: 'John', lastname: 'Doe'} } />;
<Hello name={
  firstname
} />;
<Hello>{ firstname }</Hello>;
<Hello>{
  firstname
}</Hello>;
```

### Braces spanning multiple lines

By default, braces spanning multiple lines are allowed with either setting. If you want to disallow them you can specify an additional `allowMultiline` property with the value `false`:

```json
"react/jsx-curly-spacing": [2, {"when": "never", "allowMultiline": false}]
```

Examples of **incorrect** code for this rule, when configured with `"never"` and `"allowMultiline": false`:

```jsx
<Hello name={ firstname } />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello name={
  firstname
} />;
```

Examples of **correct** code for this rule:

```jsx
<Hello name={firstname} />;
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />;
<Hello>{firstname}</Hello>;
<Hello>{ firstname }</Hello>;
<Hello>{
  firstname
}</Hello>;
```

Examples of **incorrect** code for this rule, when configured with `"always"` and `"allowMultiline": false`:

```jsx
<Hello name={firstname} />;
<Hello name={ firstname} />;
<Hello name={firstname } />;
<Hello name={
  firstname
} />;
```

Examples of **correct** code for this rule:

```jsx
<Hello name={ firstname } />;
<Hello name={ {firstname: 'John', lastname: 'Doe'} } />;
<Hello>{firstname}</Hello>;
<Hello>{ firstname }</Hello>;
<Hello>{
  firstname
}</Hello>;
```

Examples of **incorrect** code for this rule, when configured with `{ "when": "never", "attributes": { "allowMultiline": false }, "children": true }`:

```jsx
<Hello name={ firstname } />;
<Hello name={
  firstname
} />;
<Hello>{ firstname }</Hello>;
```

Examples of **correct** code for this rule:

```jsx
<Hello name={firstname} />;
<Hello>{firstname}</Hello>;
<Hello>{
  firstname
}</Hello>;
```

### Granular spacing controls

You can specify an additional `spacing` property that is an object with the following possible values:

```json
"react/jsx-curly-spacing": [2, {"when": "always", "spacing": {
  "objectLiterals": "never"
}}]
```

* `objectLiterals`: This controls different spacing requirements when the value inside the jsx curly braces is an object literal.

All spacing options accept either the string `"always"` or the string `"never"`. Note that the default value for all "spacing" options matches the first "always"/"never" option provided.

Examples of **correct** code for this rule, when configured with `"always"` and `{ "objectLiterals": "never" }`:

```jsx
<App blah={ 3 } foo={{ bar: true, baz: true }} />;
```

Examples of **correct** code for this rule, when configured with `"never"` and `{ "objectLiterals": "always" }`:

```jsx
<App blah={3} foo={ {bar: true, baz: true} } />;
```

Please note that spacing of the object literal curly braces themselves is controlled by the built-in [`object-curly-spacing`](http://eslint.org/docs/rules/object-curly-spacing) rule.

### Shorthand options

To preserve backward compatibility, two additional options are supported:

```json
"react/jsx-curly-spacing": [2, "always"]
```

which is a shorthand for

```json
"react/jsx-curly-spacing": [2, {"when": "always"}]
```

and

```json
"react/jsx-curly-spacing": [2, "never"]
```

which is a shorthand for

```json
"react/jsx-curly-spacing": [2, {"when": "never"}]
```

When using the shorthand options, only attributes will be checked. To specify other options, use another argument:

```json
"react/jsx-curly-spacing": [2, "never", {
  "allowMultiline": false,
  "spacing": {"objectLiterals": "always"}
}]
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency around the spacing inside of JSX attributes or expressions.
