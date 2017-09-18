# Prevent ignored data-* and aria-* attributes (react/jsx-no-uppercase-data-aria-attributes)

In React, all `aria-*` and `data-*` DOM attribute keys should be lowercase. Otherwise, they will be ignored by React.

## Rule Details

The following patterns are considered errors:

```jsx
var Hello = <a data-popOver={true} href="http://example.com/"></a>
var Hello = <input aria-describedBy="error-message"/>
```

The following patterns are not considered errors:

```jsx
var Hello = <a data-pop-over={true} href="http://example.com/"></a>
var Hello = <input aria-describedby="error-message"/>
```

## When Not To Use It

If you are not using React, you can disable this rules
