# Enforce quote style for JSX attributes (jsx-quotes)

**Deprecation notice**: This rule is deprecated and has been replaced by the ESLint [jsx-quotes](http://eslint.org/docs/rules/jsx-quotes) rule added in ESLint `v1.4.0`.

Enforces coding style that JSX attributes are delimited with single or double quotes.

It takes an option as the second parameter which can be `"double"` or `"single"` for double-quotes or single-quotes respectively. There is no default.

```js
var HelloJohn = <Hello name="John" />;
var HelloJohn = <Hello name='John' />;
```

The third parameter enables an exception to the rule to allow you to use alternative quotes to get around to impossibility to use escaping in JSX attributes. This option can have the value `"avoid-escape"` and is off by default.

```js
[2, "single", "avoid-escape"]
```

## Rule Details

This rule will throw warnings when the wrong type of quote is used.

The following patterns are considered warnings:

```js
// When [1, "double"]
var HelloJohn = <Hello name='John' />;

// When [1, "single"]
var HelloJohn = <Hello name="John" />;

// When [1, "double", "avoid-escape"]
var HelloJohn = <Hello name='John' />;

// When [1, "single", "avoid-escape"]
var HelloJohn = <Hello name="John" />;
```

The follow patterns are not considered warnings:

```js
// When [1, "double"]
var HelloJohn = <Hello name="John" />;

// When [1, "single"]
var HelloJohn = <Hello name='John' />;

// When [1, "double", "avoid-escape"]
var HelloJohn = <Hello name='John "FooBar" Smith' />;

// When [1, "single", "avoid-escape"]
var HelloJohn = <Hello name="John 'FooBar' Smith" />;
```
