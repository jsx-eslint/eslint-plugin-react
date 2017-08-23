# Prevent usage of unsafe `target='_blank'` (react/jsx-no-target-blank)

When creating a JSX element that has an `a` tag, it is often desired to have
the link open in a new tab using the `target='_blank'` attribute. Using this
attribute unaccompanied by `rel='noopener'` or `rel='noreferrer'`, however,
is a severe security vulnerability ([see here for more details](https://mathiasbynens.github.io/rel-noopener))
This rule requires that you accompany all `target='_blank'` attributes with
`rel='noopener'` or `rel='noreferrer'`.

## Rule Details

The following patterns are considered errors:

```jsx
var Hello = <a target='_blank' href="http://example.com/"></a>
```

The following patterns are not considered errors:

```jsx
var Hello = <p target='_blank'></p>
var Hello = <a target='_blank' rel='noopener' href="http://example.com"></a>
var Hello = <a target='_blank' rel='noreferrer' href="http://example.com"></a>
var Hello = <a target='_blank' rel='noopener noreferrer' href="http://example.com"></a>
var Hello = <a target='_blank' href="relative/path/in/the/host"></a>
var Hello = <a target='_blank' href="/absolute/path/in/the/host"></a>
var Hello = <a></a>
```

## When Not To Use It

If you do not have any external links, you can disable this rule
