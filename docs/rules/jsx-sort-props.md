# Enforce props alphabetical sorting (react/jsx-sort-props)

Some developers prefer to sort props names alphabetically to be able to find necessary props easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule checks all JSX components and verifies that all props are sorted alphabetically. A spread attribute resets the verification. The default configuration of the rule is case-sensitive.

Examples of **incorrect** code for this rule:

```jsx
<Hello lastName="Smith" firstName="John" />;
```

Examples of **correct** code for this rule:

```jsx
<Hello firstName="John" lastName="Smith" />;
<Hello tel={5555555} {...this.props} firstName="John" lastName="Smith" />;
```

## Rule Options

```js
...
"react/jsx-sort-props": [<enabled>, {
  "callbacksLast": <boolean>,
  "shorthandFirst": <boolean>,
  "shorthandLast": <boolean>,
  "ignoreCase": <boolean>,
  "noSortAlphabetically": <boolean>,
  "reservedFirst": <boolean>|<array<string>>,
}]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the props order.

Examples of **correct** code for this rule

```jsx
<Hello name="John" Number="2" />;
```

### `callbacksLast`

When `true`, callbacks must be listed after all other props, even if `shorthandLast` is set :

```jsx
<Hello tel={5555555} onClick={this._handleClick} />
```

### `shorthandFirst`

When `true`, short hand props must be listed before all other props, but still respecting the alphabetical order:

```jsx
<Hello active validate name="John" tel={5555555} />
```

### `shorthandLast`

When `true`, short hand props must be listed after all other props (unless `callbacksLast` is set), but still respecting the alphabetical order:

```jsx
<Hello name="John" tel={5555555} active validate />
```

### `noSortAlphabetically`

When `true`, alphabetical order is **not** enforced:

```jsx
<Hello tel={5555555} name="John" />
```

### `reservedFirst`

This can be a boolean or an array option.

When `reservedFirst` is defined, React reserved props (`children`, `dangerouslySetInnerHTML` - **only for DOM components**, `key`, and `ref`) must be listed before all other props, but still respecting the alphabetical order:

```jsx
<Hello key={0} ref="John" name="John">
  <div dangerouslySetInnerHTML={{__html: 'ESLint Plugin React!'}} ref="dangerDiv" />
</Hello>
```

If given as an array, the array's values will override the default list of reserved props. **Note**: the values in the array may only be a **subset** of React reserved props.

With `reservedFirst: ["key"]`, the following will **not** warn:

```jsx
<Hello key={'uuid'} name="John" ref="ref" />
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing props isn't a part of your coding standards, then you can leave this rule off.
