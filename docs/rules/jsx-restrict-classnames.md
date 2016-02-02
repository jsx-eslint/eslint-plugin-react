# Restrict classNames or classNames prefixes. (jsx-restrict-classnames)

This rule prevents react components from using a pre-defined set of restricted classnames, or classnames which
start with a certian prefix.

## Rule Details

This rule is off by default.

Consider you have setup a set of restrict classnames in your `eslintrc`.

```js
"rules": {
    "react/jsx-restrict-classnames": [2, [{
      "className": "grid",
      "isPrefix": false,
      "message": "Prefer using <Grid/> component instead of grid class"
    },{
      "className": "js-",
      "isPrefix": true,
      "message": "className should not have a js- prefix"
    },{
      "className": "btn",
      "isPrefix": false,
      "message": "Prefer using <Button/> component instead of btn class"
    }]]
  },

```

The following patterns are considered warnings:
```js
<div className="btn grid js-grid">Hello!<div>
```

## Rule Options

```js
...
"jsx-restrict-classnames": [<enabled>, [{
  "className": [<string>],
  "isPrefix": [<boolean>],
  "message": [<string>]
}]]
...
```
Rule options take an array of objects of type `{"className", "isPrefix", "message"}`

### `className`

The className string or a className prefix string that needs to be restricted. When passing in a prefix string, set the isPrefix option to `true`, to do a prefix check.

### `isPrefix`

When set to `true` checks if the className startsWith the specific restricted className.

### `message`

The error message to be shown in case the component uses a restricted set of classname/classname prefixes.

## When not to use

If you do not want to restricting any classNames you can disable this rule.
