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
```json
...
"react/jsx-no-target-blank": [<enabled>, { "allowReferrer": <allow-referrer>, "enforceDynamicLinks": <enforce> }]
...
```

* allow-referrer: optional boolean. If `true` does not require `noreferrer`. Defaults to `false`.
* enabled: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* enforce: optional string, 'always' or 'never'

### `enforceDynamicLinks`

#### always

`{"enforceDynamicLinks": "always"}` enforces the rule if the href is a dynamic link (default)

When {"enforceDynamicLinks": "always"} is set, the following patterns are considered errors:

```jsx
var Hello = <a target='_blank' href="http://example.com/"></a>
var Hello = <a target='_blank' href={dynamicLink}></a>
```

The following patterns are **not** considered errors:

```jsx
var Hello = <p target="_blank"></p>
var Hello = <a target="_blank" rel="noopener noreferrer" href="http://example.com"></a>
var Hello = <a target="_blank" href="relative/path/in/the/host"></a>
var Hello = <a target="_blank" href="/absolute/path/in/the/host"></a>
var Hello = <a></a>
```

#### never

`{"enforceDynamicLinks": "never"}` does not enforce the rule if the href is a dynamic link

When {"enforceDynamicLinks": "never"} is set, the following patterns are **not** considered errors:

```jsx
var Hello = <a target='_blank' href={dynamicLink}></a>
```

### Custom link components

This rule supports the ability to use custom components for links, such as `<Link />` which is popular in libraries like `react-router`, `next.js` and `gatsby`. To enable this, define your custom link components in the global [shared settings](https://github.com/yannickcr/eslint-plugin-react/blob/master/README.md#configuration) under the `linkComponents` configuration area. Once configured, this rule will check those components as if they were `<a />` elements.

The following patterns are considered errors:

```jsx
var Hello = <Link target="_blank" to="http://example.com/"></Link>
var Hello = <Link target="_blank" to={dynamicLink}></Link>
```

The following patterns are **not** considered errors:

```jsx
var Hello = <Link target="_blank" rel="noopener noreferrer" to="http://example.com"></Link>
var Hello = <Link target="_blank" to="relative/path/in/the/host"></Link>
var Hello = <Link target="_blank" to="/absolute/path/in/the/host"></Link>
var Hello = <Link />
```

## When To Override It
For links to a trusted host (e.g. internal links to your own site, or links to a another host you control, where you can be certain this security vulnerability does not exist), you may want to keep the HTTP Referer header for analytics purposes.

## When Not To Use It

If you do not have any external links, you can disable this rule.
