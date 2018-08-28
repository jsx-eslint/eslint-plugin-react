# Prevent usage of unsafe `target='_blank'` (react/jsx-no-target-blank)

When creating a JSX element that has an `a` tag, it is often desired to have
the link open in a new tab using the `target='_blank'` attribute. Using this
attribute unaccompanied by `rel='noreferrer noopener'`, however, is a severe
security vulnerability ([see here for more details](https://mathiasbynens.github.io/rel-noopener))
This rules requires that you accompany `target='_blank'` attributes with `rel='noreferrer noopener'`.

## Rule Details

This rule aims to prevent user generated links from creating security vulnerabilities by requiring
`rel='noreferrer noopener'` for external links, and optionally any dynamically generated links.

## Rule Options

There are two main options for the rule:

* `{"enforceDynamicLinks": "always"}` enforces the rule if the href is a dynamic link (default)
* `{"enforceDynamicLinks": "never"}` does not enforce the rule if the href is a dynamic link


### always (default)

When {"enforceDynamicLinks": "always"} is set, the following patterns are considered errors:

```jsx
var Hello = <a target='_blank' href="http://example.com/"></a>
var Hello = <a target='_blank' href={ dynamicLink }></a>
```

The following patterns are **not** considered errors:

```jsx
var Hello = <p target='_blank'></p>
var Hello = <a target='_blank' rel='noopener noreferrer' href="http://example.com"></a>
var Hello = <a target='_blank' href="relative/path/in/the/host"></a>
var Hello = <a target='_blank' href="/absolute/path/in/the/host"></a>
var Hello = <a></a>
```

### never

When {"enforceDynamicLinks": "never"} is set, the following patterns are **not** considered errors:

```jsx
var Hello = <a target='_blank' href={ dynamicLink }></a>
```

## When Not To Use It

If you do not have any external links, you can disable this rule
