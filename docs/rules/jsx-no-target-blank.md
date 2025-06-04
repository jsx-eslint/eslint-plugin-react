# Disallow `target="_blank"` attribute without `rel="noreferrer"` (`react/jsx-no-target-blank`)

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When creating a JSX element with an `a` tag, the link is often desired to open in a new tab using the `target='_blank'` attribute. Using this attribute unaccompanied by `rel='noreferrer'`, however, is a severe security vulnerability (see [noreferrer docs](https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer) and [noopener docs](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener) for more details).
This rule requires that you accompany `target='_blank'` attributes with `rel='noreferrer'`.

## Rule Details

This rule aims to prevent user generated link hrefs and form actions from creating security vulnerabilities by requiring `rel='noreferrer'` for external link hrefs and form actions, and optionally any dynamically generated link hrefs and form actions.

## Rule Options

```js
...
"react/jsx-no-target-blank": [<enabled>, {
  "allowReferrer": <allow-referrer>,
  "enforceDynamicLinks": <enforce>,
  "warnOnSpreadAttributes": <warn>,
  "links": <boolean>,
  "forms": <boolean>,
}]
...
```

- `enabled`: for enabling the rule.
- `allowReferrer`: optional boolean. If `true` does not require `noreferrer` (i. e. `noopener` alone is enough, this leaves IE vulnerable). Defaults to `false`.
- `enforceDynamicLinks`: optional string, `'always'` or `'never'`.
- `warnOnSpreadAttributes`: optional boolean. Defaults to `false`.
- `links`: prevent usage of unsafe `target='_blank'` inside links, defaults to `true`.
- `forms`: prevent usage of unsafe `target='_blank'` inside forms, defaults to `false`.

### `enforceDynamicLinks`

#### always

`{"enforceDynamicLinks": "always"}` enforces the rule if the href is a dynamic link (default)

Examples of **incorrect** code for this rule, when configured with `{ "enforceDynamicLinks": "always" }`:

```jsx
var Hello = <a target='_blank' href="https://example.com/"></a>
var Hello = <a target='_blank' href={dynamicLink}></a>
```

Examples of **correct** code for this rule:

```jsx
var Hello = <p target="_blank"></p>
var Hello = <a target="_blank" rel="noreferrer" href="https://example.com"></a>
var Hello = <a target="_blank" rel="noopener noreferrer" href="https://example.com"></a>
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
  href: "https://example.com",
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

### `links` / `forms`

When option `forms` is set to `true`, the following is considered an error:

```jsx
var Hello = <form target="_blank" action="https://example.com/"></form>;
```

When option `links` is set to `true`, the following is considered an error:

```jsx
var Hello = <a target='_blank' href="https://example.com/"></form>
```

### Custom link components

This rule supports the ability to use custom components for links, such as `<Link />` which is popular in libraries like `react-router`, `next.js` and `gatsby`. To enable this, define your custom link components in the global [shared settings](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/README.md#configuration) under the `linkComponents` configuration area. Once configured, this rule will check those components as if they were `<a />` elements.

Examples of **incorrect** code for this rule:

```jsx
var Hello = <Link target="_blank" to="https://example.com/"></Link>
var Hello = <Link target="_blank" to={dynamicLink}></Link>
```

Examples of **correct** code for this rule:

```jsx
var Hello = <Link target="_blank" rel="noopener noreferrer" to="https://example.com"></Link>
var Hello = <Link target="_blank" to="relative/path/in/the/host"></Link>
var Hello = <Link target="_blank" to="/absolute/path/in/the/host"></Link>
var Hello = <Link />
```

### Custom form components

This rule supports the ability to use custom components for forms. To enable this, define your custom form components in the global [shared settings](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/README.md#configuration) under the `formComponents` configuration area. Once configured, this rule will check those components as if they were `<form />` elements.

## When To Override It

Modern browsers (Chrome ≥ 88, Edge ≥ 88, Firefox ≥ 79 and Safari ≥ 12.2) automatically imply `rel="noopener"`. Therefore, this rule is no longer needed if legacy browsers are not supported. See <https://web.dev/external-anchors-use-rel-noopener/> and <https://caniuse.com/mdn-html_elements_a_implicit_noopener> for more details.

For links to a trusted host (e.g. internal links to your own site, or links to another host you control, where you can be certain this security vulnerability does not exist), you may want to keep the HTTP Referer header for analytics purposes.

If you do not support Internet Explorer (any version), Chrome < 49, Opera < 36, Firefox < 52, desktop Safari < 10.1 or iOS Safari < 10.3, you may set `allowReferrer` to `true`, keep the HTTP Referer header and only add `rel="noopener"` to your links.

## When Not To Use It

You can disable this rule if you do not have any external links or forms.
