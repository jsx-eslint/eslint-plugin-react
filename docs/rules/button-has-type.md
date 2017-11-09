# Prevent usage of `button` elements without an explicit `type` attribute (react/button-has-type)

The default value of `type` attribute for `button` HTML element is `"submit"` which is often not the desired behavior and may lead to unexpected page reloads.
This rules enforces an explicit `type` attribute for all the `button` elements.

## Rule Details

The following patterns are considered errors:

```jsx
var Hello = <button>Hello</button>
```

The following patterns are **not** considered errors:

```jsx
var Hello = <span>Hello</span>
var Hello = <button type="button">Hello</button>
var Hello = <button type="submit">Hello</button>
var Hello = <button type="reset">Hello</button>
```

## When Not To Use It

If you use only `"submit"` buttons, you can disable this rule
