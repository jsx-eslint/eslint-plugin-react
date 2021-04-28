# Prevent usage of string literals in JSX (react/jsx-no-literals)

There are a few scenarios where you want to avoid string literals in JSX. You may want to enforce consistency, reduce syntax highlighting issues, or ensure that strings are part of a translation system.

## Rule Details

By default this rule requires that you wrap all literal strings in a JSX container `{'TEXT'}`.

Examples of **incorrect** code for this rule:

```jsx
var Hello = <div>test</div>;
```

Examples of **correct** code for this rule:

```jsx
var Hello = <div>{'test'}</div>;
```

```jsx
var Hello = <div>
  {'test'}
</div>;
```

## Rule Options

The supported options are:

* `noStrings` (default: `false`) - Enforces no string literals used as children, wrapped or unwrapped.
* `allowedStrings` - An array of unique string values that would otherwise warn, but will be ignored.
* `ignoreProps` (default: `false`) - When `true` the rule ignores literals used in props, wrapped or unwrapped.
* `noAttributeStrings` (default: `false`) - Enforces no string literals used in attributes when set to `true`.

To use, you can specify as follows:

```js
"react/jsx-no-literals": [<enabled>, {"noStrings": true, "allowedStrings": ["allowed"], "ignoreProps": false, "noAttributeStrings": true }]
```

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
var Hello = <div>test</div>;
```

```jsx
var Hello = <div>{'test'}</div>;
```

```jsx
var Hello = <div>
  {'test'}
</div>;
```

```jsx
var Hello = <div>
<img alt="test"> </img>
</div>;
```

```jsx
var Hello = <div class='xx' />;
```

```jsx
var Hello = <div class={'xx'} />;
```

```jsx
var Hello = <div class={`xx`} />;
```

Examples of **correct** code for this rule:

```jsx
// When using something like `react-intl`
var Hello = <div><Text {...message} /></div>
```

```jsx
// When using something similar to Rails translations
var Hello = <div>{translate('my.translation.key')}</div>
```

```jsx
// an allowed string
var Hello = <div>allowed</div>
```

```jsx
// an allowed string surrounded by only whitespace
var Hello = <div>
  allowed
</div>;
```

```jsx
// a string value stored within a variable used as an attribute's value
var Hello = <div>
<img alt={imageDescription} {...props} />
</div>;
```

```jsx
// spread props object
var Hello = <Text {...props} />
```

```jsx
// use variable for prop values
var Hello = <div class={xx} />
```

```jsx
// cache
class Comp1 extends Component {
  asdf() {}

  render() {
    return (
      <div onClick={this.asdf}>
        {'asdjfl'}
        test
        {'foo'}
      </div>
    );
  }
}
```

## When Not To Use It

If you do not want to enforce any style JSX literals, then you can disable this rule.
