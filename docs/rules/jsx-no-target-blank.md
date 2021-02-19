# Prevent usage of unsafe `target='_blank'` (react/jsx-no-target-blank)

When creating a JSX element that has an `a` tag, it is often desired to have the link open in a new tab using the `target='_blank'` attribute. Using this attribute unaccompanied by `rel='noreferrer'`, however, is a severe security vulnerability ([see here for more details](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener))
This rules requires that you accompany `target='_blank'` attributes with `rel='noreferrer'`.

## Rule Details

This rule aims to prevent user generated links from creating security vulnerabilities by requiring `rel='noreferrer'` for external links, and optionally any dynamically generated links.

## Rule Options
```json
...
"react/jsx-no-target-blank": [<enabled>, { "allowReferrer": <allow-referrer>, "enforceDynamicLinks": <enforce> }]
...
```

* allow-referrer: optional boolean. If `true` does not require `noreferrer`. Defaults to `false`.
* enabled: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* enforceDynamicLinks: optional string, 'always' or 'never'
* warnOnSpreadAttributes: optional boolean. Defaults to `false`.

### `enforceDynamicLinks`

#### always

`{"enforceDynamicLinks": "always"}` enforces the rule if the href is a dynamic link (default)

Examples of **incorrect** code for this rule, when configured with `{ "enforceDynamicLinks": "always" }`:

```jsx
var Hello = <a target='_blank' href="http://example.com/"></a>
var Hello = <a target='_blank' href={dynamicLink}></a>
```

Examples of **correct** code for this rule:

```jsx
var Hello = <p target="_blank"></p>
var Hello = <a target="_blank" rel="noreferrer" href="http://example.com"></a>
var Hello = <a target="_blank" rel="noopener noreferrer" href="http://example.com"></a>
var Hello = <a target="_blank" href="relative/path/in/the/host"></a>
var Hello = <a target="_blank" href="/absolute/path/in/the/host"></a>
var Hello = <a></a>
```

#### never

`{"enforceDynamicLinks": "never"}` does not enforce the rule if the href is a dynamic link

Examples of **correct** code for this rule, when configured with `{ "enforceDynamicLinks": "never" }`:

```jsx
var Hello = <a target='_blank' href={dynamicLink}></a>
```

### `warnOnSpreadAttributes`

Spread attributes are a handy way of passing programmatically-generated props to components, but may contain unsafe props e.g.

```jsx
const unsafeProps = {
  href: "http://example.com",
  target: "_blank",
};

<a {...unsafeProps}></a>
```

Defaults to false. If false, this rule will ignore all spread attributes. If true, this rule will treat all spread attributes as if they contain an unsafe combination of props, unless specifically overridden by props _after_ the last spread attribute prop e.g. the following would not be violations:

```jsx
<a {...unsafeProps} rel="noreferrer"></a>
<a {...unsafeProps} target="_self"></a>
<a {...unsafeProps} href="/some-page"></a>
```

### Custom link components

This rule supports the ability to use custom components for links, such as `<Link />` which is popular in libraries like `react-router`, `next.js` and `gatsby`. To enable this, define your custom link components in the global [shared settings](https://github.com/yannickcr/eslint-plugin-react/blob/master/README.md#configuration) under the `linkComponents` configuration area. Once configured, this rule will check those components as if they were `<a />` elements.

Examples of **incorrect** code for this rule:

```jsx
var Hello = <Link target="_blank" to="http://example.com/"></Link>
var Hello = <Link target="_blank" to={dynamicLink}></Link>
```

Examples of **correct** code for this rule:

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
