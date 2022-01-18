# Prevent usage of invalid attributes (react/no-invalid-html-attribute)

Some HTML elements have a specific set of valid values for some attributes.
For instance the elements: `a`, `area`, `link`, or `form` all have an attribute called `rel`.
There is a fixed list of values that have any meaning for this attribute on these tags (see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)).
To help with minimizing confusion while reading code, only the appropriate values should be on each attribute.

## Rule Details

This rule aims to remove invalid attribute values.

## Rule Options
The options is a list of attributes to check. Defaults to `["rel"]`.

## When Not To Use It

When you don't want to enforce attribute value correctness.
