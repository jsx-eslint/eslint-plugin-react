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
"react/jsx-no-target-blank": [<enabled>, { "enforceDynamicLinks": <enforce> }]
...
```

* enabled: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* enforce: optional string, 'always' or 'never'
* Link components can be something other than an `<a>`, see [shared settings](https://github.com/yannickcr/eslint-plugin-react/blob/master/README.md#configuration) for `linkComponents` configuration)

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

### Link components

Link components can be something other than an `<a>`, see [shared settings](https://github.com/yannickcr/eslint-plugin-react/blob/master/README.md#configuration) for `linkComponents` configuration)

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

## When Not To Use It

If you do not have any external links, you can disable this rule
