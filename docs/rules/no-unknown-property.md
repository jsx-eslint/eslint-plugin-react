# Disallow usage of unknown DOM property (react/no-unknown-property)

💼 This rule is enabled in the following [configs](https://github.com/jsx-eslint/eslint-plugin-react#shareable-configurations): `all`, `recommended`.

🔧 This rule is automatically fixable using the `--fix` [flag](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) on the command line.

In JSX most DOM properties and attributes should be camelCased to be consistent with standard JavaScript style. This can be a possible source of error if you are used to writing plain HTML.
Only `data-*` and `aria-*` attributes are usings hyphens and lowercase letters in JSX.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var React = require('react');

var Hello = <div class="hello">Hello World</div>;
var Alphabet = <div abc="something">Alphabet</div>;

// Invalid aria-* attribute
var IconButton = <div aria-foo="bar" />;
```

Examples of **correct** code for this rule:

```jsx
var React = require('react');

var Hello = <div className="hello">Hello World</div>;
var Button = <button disabled>Cannot click me</button>;
var Img = <img src={catImage} alt="A cat sleeping on a keyboard" />;

// aria-* attributes
var IconButton = <button aria-label="Close" onClick={this.close}>{closeIcon}</button>;

// data-* attributes
var Data = <div data-index={12}>Some data</div>;

// React components are ignored
var MyComponent = <App class="foo-bar"/>;
var AnotherComponent = <Foo.bar for="bar" />;

// Custom web components are ignored
var MyElem = <div class="foo" is="my-elem"></div>;
var AtomPanel = <atom-panel class="foo"></atom-panel>;
```

## Rule Options

```js
...
"react/no-unknown-property": [<enabled>, { ignore: <ignore> }]
...
```

- `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
- `ignore`: optional array of property and attribute names to ignore during validation.

If you are using a library that passes something as a prop to JSX elements, it is recommended to add those props to the ignored properties.

For example, if you use [emotion](https://emotion.sh/docs/introduction) and its [`css` prop](https://emotion.sh/docs/css-prop)),
add the following to your `.eslintrc` config file:

```js
...
"react/no-unknown-property": ['error', { ignore: ['css'] }]
...
```

Now, the following code passes:

```jsx
var StyledDiv = <div css={{ color: 'pink' }}></div>;
```

## When Not To Use It

If you are not using JSX you can disable this rule.
