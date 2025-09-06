# react/jsx-no-literals

📝 Disallow usage of string literals in JSX.

<!-- end auto-generated rule header -->

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

- `noStrings` (default: `false`) - Enforces no string literals used as children, wrapped or unwrapped.
- `allowedStrings` - An array of unique string values that would otherwise warn, but will be ignored.
- `ignoreProps` (default: `false`) - When `true` the rule ignores literals used in props, wrapped or unwrapped.
- `noAttributeStrings` (default: `false`) - Enforces no string literals used in attributes when set to `true`.
- `restrictedAttributes` - An array of unique attribute names where string literals should be restricted. Only the specified attributes will be checked for string literals when this option is used. **Note**: When `noAttributeStrings` is `true`, this option is ignored at the root level.
- `elementOverrides` - An object where the keys are the element names and the values are objects with the same options as above. This allows you to specify different options for different elements.

### `elementOverrides`

The `elementOverrides` option allows you to specify different options for different elements. This is useful when you want to enforce different rules for different elements. For example, you may want to allow string literals in `Button` elements, but not in the rest of your application.

The element name only accepts component names.
HTML element tag names are not supported. Component names are case-sensitive and should exactly match the name of the component as it is used in the JSX.
It can also be the name of a compound component (ie. `Modal.Button`).

Specifying options creates a new context for the rule, so the rule will only apply the new options to the specified element and its children (if `applyToNestedElements` is `true` - see below).
This means that the root rule options will not apply to the specified element.

In addition to the options above (`noStrings`, `allowedStrings`, `noAttributeStrings` and `ignoreProps`), you can also specify the the following options that are specific to `elementOverrides`:

- `allowElement` (default: `false`) - When `true` the rule will allow the specified element to have string literals as children, wrapped or unwrapped without warning.
- `applyToNestedElements` (default: `true`) - When `false` the rule will not apply the current options set to nested elements. This is useful when you want to apply the rule to a specific element, but not to its children.

**Note**: As this rule has no way of differentiating between different componets with the same name, it is recommended to use this option with specific components that are unique to your application.

#### `elementOverrides` Examples

The following are **correct** examples that demonstrate how to use the `elementOverrides` option:

```js
// "react/jsx-no-literals": [<enabled>, {"elementOverrides": { "Button": {"allowElement": true} }}]

var Hello = <div>{'test'}</div>;
var World = <Button>test</Button>;
```

```js
// "react/jsx-no-literals": [<enabled>, {"elementOverrides": { "Text": {"allowElement": true} }}]

var World = <Text>Hello <a href="a">world</a></Text>;
```

```js
// "react/jsx-no-literals": [<enabled>, {"elementOverrides": { "Text": {"allowElement": true, "applyToNestedElements": false} }}]

var linkText = 'world';
var World = <Text>Hello <a href="a">{linkText}</a></Text>;
```

```js
// "react/jsx-no-literals": [<enabled>, {"noStrings": true, "elementOverrides": { "Button": {"noStrings": false} }}]
// OR
// "react/jsx-no-literals": [<enabled>, {"noStrings": true, "elementOverrides": { "Button": {} }}]

var test = 'test'
var Hello = <div>{test}</div>;
var World = <Button>{'test'}</Button>;
```

## Examples

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
