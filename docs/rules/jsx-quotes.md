# Enforce quote style for JSX attributes (jsx-quotes)

Enforces coding style that JSX attributes are delimited with single or double quotes.

It takes an option as the second parameter which can be `"double"` or `"single"` for double-quotes or single-quotes respectively. There is no default.

```js
var HelloJohn = <Hello name="John" />;
var HelloJohn = <Hello name='John' />;
```

The third parameter enables an exception to the rule to avoid escaping quotes. For example, when `"single"` is the standard, this option allows the use of double quotes to avoid escaping single quotes. This option can have the value `"avoid-escape"` and is off by default.

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
