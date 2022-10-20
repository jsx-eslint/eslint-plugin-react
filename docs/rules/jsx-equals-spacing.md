# Enforce or disallow spaces around equal signs in JSX attributes (`react/jsx-equals-spacing`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Some style guides require or disallow spaces around equal signs.

## Rule Details

This rule will enforce consistency of spacing around equal signs in JSX attributes, by requiring or disallowing one or more spaces before and after `=`.

## Rule Options

There are two options for the rule:

- `"always"` enforces spaces around the equal sign
- `"never"` disallows spaces around the equal sign (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"react/jsx-equals-spacing": [2, "always"]
```

### never

Examples of **incorrect** code for this rule, when configured with `"never"`:

```jsx
<Hello name = {firstname} />;
<Hello name ={firstname} />;
<Hello name= {firstname} />;
```

Examples of **correct** code for this rule, when configured with `"never"`:

```jsx
<Hello name={firstname} />;
<Hello name />;
<Hello {...props} />;
```

### always

Examples of **incorrect** code for this rule, when configured with `"always"`:

```jsx
<Hello name={firstname} />;
<Hello name ={firstname} />;
<Hello name= {firstname} />;
```

Examples of **correct** code for this rule, when configured with `"always"`:

```jsx
<Hello name = {firstname} />;
<Hello name />;
<Hello {...props} />;
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing around equal signs in JSX attributes.
