# Enforce props alphabetical sorting (jsx-sort-props)

Some developers prefer to sort props names alphabetically to be able to find necessary props easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all JSX components and verifies that all props are sorted alphabetically. A spread attribute resets the verification. This rule is off by default.
The default configuration of the rule is case-sensitive.

The following patterns are considered warnings:

```js
<Hello lastName="Smith" firstName="John" />;
```

The following patterns are considered okay and do not cause warnings:

```js
<Hello firstName="John" lastName="Smith" />;
<Hello tel={5555555} {...this.props} firstName="John" lastName="Smith" />;
```

## Rule Options

```js
...
"jsx-sort-props": [<enabled>, { "ignoreCase": <boolean> }]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the props order.

The following patterns are considered okay and do not cause warnings:

```js
<Hello name="John" Number="2" />;
```

### `callbacksLast`

When `true`, callbacks must be listed after all other props:

```js
<Hello tel={5555555} onClick={this._handleClick} />
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing props isn't a part of your coding standards, then you can leave this rule off.
