# Enforce no padding lines between tags for React Components (`react/padding-lines-between-tags`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Require or disallow newlines between sibling tags in React.

## Rule Details Options

```json
{
  "padding-line-between-tags": [
    "error",
    [{ "blankLine": "always", "prev": "*", "next": "*" }]
  ]
}
```

This rule requires blank lines between each sibling HTML tag by default.

A configuration is an object which has 3 properties; `blankLine`, `prev` and `next`. For example, `{ blankLine: "always", prev: "br", next: "div" }` means “one or more blank lines are required between a `br` tag and a `div` tag.” You can supply any number of configurations. If a tag pair matches multiple configurations, the last matched configuration will be used.

- `blankLine` is one of the following:
  - `always` requires one or more blank lines.
  - `never` disallows blank lines.
  - `consistent` requires or disallows a blank line based on the first sibling element.
- `prev` any tag name without brackets.
- `next` any tag name without brackets.

### Disallow blank lines between all tags

`{ blankLine: 'never', prev: '*', next: '*' }`

<eslint-code-block fix :rules="{'padding-line-between-tags': ['error', [
  { blankLine: 'never', prev: '*', next: '*' }
]]}">

```react
<App>
  <div>
    <div></div>
    <div>
    </div>
    <div />
  </div>
</App>
```

</eslint-code-block>

### Require newlines after `<br>`

`{ blankLine: 'always', prev: 'br', next: '*' }`

<eslint-code-block fix :rules="{'react/padding-line-between-tags': ['error', [
  { blankLine: 'always', prev: 'br', next: '*' }
]]}">

```react
<App>
  <div>
    <ul>
      <li>
      </li>
      <br />

      <li>
      </li>
    </ul>
  </div>
</App>
```

</eslint-code-block>

### Require newlines between `<br>` and `<img>`

`{ blankLine: 'always', prev: 'br', next: 'img' }`

<eslint-code-block fix :rules="{'react/padding-line-between-tags': ['error', [
{ blankLine: 'always', prev: 'br', next: 'img' },
{ blankLine: 'always', prev: 'li', next: 'li' },
]]}">

```react
<App>
  <div>
    <ul>
      <li>
      </li>
      <li>
      </li>
      <br />
      <img />
      <li>
      </li>
    </ul>
  </div>
</App>
```

```react [Fixed]
<App>
  <div>
    <ul>
      <li>
      </li>

      <li>
      </li>
      <br />

      <img />
      <li>
      </li>
    </ul>
  </div>
</App>
```

</eslint-code-block>

### Require consistent newlines

`{ blankLine: 'consistent', prev: '*', next: '*' }`

<eslint-code-block fix :rules="{'react/padding-line-between-tags': ['error', [
  { blankLine: 'consistent', prev: '*', next: '*' }
]]}">

```react
<App>
  <div>
    <ul>
      <li />
      <li />
      <li />
    </ul>

    <div />

    <div />
  </div>
</App>
```

</eslint-code-block>

## When Not To Use It

If you are not using React.
