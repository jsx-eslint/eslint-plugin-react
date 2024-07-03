# Enforce closing tag location for multiline JSX (`react/jsx-closing-tag-location`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce the closing tag location for multiline JSX elements.

## Rule Details

This rule checks all JSX multiline elements with children (non-self-closing) and verifies the location of the closing tag. The expectation is that the closing tag is aligned with the opening tag on its own line.

Examples of **incorrect** code for this rule:

```jsx
<Hello>
  marklar
  </Hello>
```

```jsx
<Hello>
  marklar</Hello>
```

Examples of **correct** code for this rule:

```jsx
<Hello>
  marklar
</Hello>
```

```jsx
<Hello>marklar</Hello>
```

## Rule Options

There is one way to configure this rule.

The configuration is a string shortcut corresponding to the `location` values specified below. If omitted, it defaults to `"tag-aligned"`.

```js
"react/jsx-closing-tag-location": <enabled> // -> [<enabled>, "tag-aligned"]
"react/jsx-closing-tag-location": [<enabled>, "<location>"]
```

### `location`

Enforced location for the closing tag.

- `tag-aligned`: must be aligned with the opening tag.
- `line-aligned`: must be aligned with the line containing the opening tag.

Defaults to `tag-aligned`.

For backward compatibility, you may pass an object `{ "location": <location> }` that is equivalent to the first string shortcut form.

Examples of **incorrect** code for this rule:

```jsx
// 'jsx-closing-tag-location': 1
// 'jsx-closing-tag-location': [1, 'tag-aligned']
// 'jsx-closing-tag-location': [1, {"location":'tag-aligned'}]
<Say
  firstName="John"
  lastName="Smith">
  Hello
  </Say>;

// 'jsx-closing-tag-location': [1, 'tag-aligned']
// 'jsx-closing-tag-location': [1, {"location":'tag-aligned'}]
const App = <Bar>
  Foo
</Bar>;


// 'jsx-closing-tag-location': [1, 'line-aligned']
// 'jsx-closing-tag-location': [1, {"location":'line-aligned'}]
const App = <Bar>
  Foo
            </Bar>;


```

Examples of **correct** code for this rule:

```jsx
// 'jsx-closing-tag-location': 1
// 'jsx-closing-tag-location': [1, 'tag-aligned']
// 'jsx-closing-tag-location': [1, {"location":'tag-aligned'}]
<Say
  firstName="John"
  lastName="Smith">
  Hello
</Say>;

// 'jsx-closing-tag-location': [1, 'tag-aligned']
// 'jsx-closing-tag-location': [1, {"location":'tag-aligned'}]
const App = <Bar>
  Foo
            </Bar>;

// 'jsx-closing-tag-location': [1, 'line-aligned']
// 'jsx-closing-tag-location': [1, {"location":'line-aligned'}]
const App = <Bar>
  Foo
</Bar>;

```

## When Not To Use It

If you do not care about closing tag JSX alignment then you can disable this rule.
