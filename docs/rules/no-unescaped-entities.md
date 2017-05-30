# Prevent invalid characters from appearing in markup (react/no-unescaped-entities)

This rule prevents characters that you may have meant as JSX escape characters
from being accidentally injected as a text node in JSX statements.

For example, if one were to misplace their closing `>` in a tag:

```jsx
<MyComponent
  name="name"
  type="string"
  foo="bar">  {/* oops! */}
  x="y">
  Body Text
</MyComponent>
```

The body text of this would render as `x="y"> Body Text`, which is probably not
what was intended. This rule requires that these special characters are
escaped if they appear in the body of a tag.

Another example is when one accidentally includes an extra closing brace.

```jsx
<MyComponent>{'Text'}}</MyComponent>
```

The extra brace will be rendered, and the body text will be `Text}`.

This rule will also check for `"` and `'`, which might be accidentally included
when the closing `>` is in the wrong place.

```jsx
<MyComponent
  a="b">  {/* oops! */}
  c="d"
  Intended body text
</MyComponent>
```

The preferred way to include one of these characters is to use the HTML escape code.

- `>` can be replaced with `&gt;`
- `"` can be replaced with `&quot;`, `&ldquo;` or `&rdquo;`
- `'` can be replaced with `&apos;`, `&lsquo;` or `&rsquo;`
- `}` can be replaced with `&#125;`

Alternatively, you can include the literal character inside a subexpression
(such as `<div>{'>'}</div>`.

The characters `<` and `{` should also be escaped, but they are not checked by this
rule because it is a syntax error to include those tokens inside of a tag.

## Rule Details

The following patterns are considered warnings:

```jsx
<div> > </div>
```

The following patterns are not considered warnings:

```jsx
<div> &gt; </div>
```

```jsx
<div> {'>'} </div>
```
