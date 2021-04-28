# Prevent usage of `button` elements without an explicit `type` attribute (react/button-has-type)

The default value of `type` attribute for `button` HTML element is `"submit"` which is often not the desired behavior and may lead to unexpected page reloads.
This rules enforces an explicit `type` attribute for all the `button` elements and checks that its value is valid per spec (i.e., is one of `"button"`, `"submit"`, and `"reset"`).

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = <button>Hello</button>
var Hello = <button type="foo">Hello</button>
var Hello = <button type={foo}>Hello</button>

var Hello = React.createElement('button', {}, 'Hello')
var Hello = React.createElement('button', {type: 'foo'}, 'Hello')
```

Examples of **correct** code for this rule:

```jsx
var Hello = <span>Hello</span>
var Hello = <span type="foo">Hello</span>
var Hello = <button type="button">Hello</button>
var Hello = <button type="submit">Hello</button>
var Hello = <button type="reset">Hello</button>
var Hello = <button type={condition ? "button" : "submit"}>Hello</button>

var Hello = React.createElement('span', {}, 'Hello')
var Hello = React.createElement('span', {type: 'foo'}, 'Hello')
var Hello = React.createElement('button', {type: 'button'}, 'Hello')
var Hello = React.createElement('button', {type: 'submit'}, 'Hello')
var Hello = React.createElement('button', {type: 'reset'}, 'Hello')
var Hello = React.createElement('button', {type: condition ? 'button' : 'submit'}, 'Hello')
```

## Rule Options

```js
...
"react/button-has-type": [<enabled>, {
  "button": <boolean>,
  "submit": <boolean>,
  "reset": <boolean>
}]
...
```

You can forbid particular type attribute values by passing `false` as corresponding option (by default all of them are `true`).

Examples of **incorrect** code for this rule, when configured with `{ "reset": false }`:

```jsx
var Hello = <button type="reset">Hello</button>
var Hello = <button type={condition ? "button" : "reset"}>Hello</button>

var Hello = React.createElement('button', {type: 'reset'}, 'Hello')
var Hello = React.createElement('button', {type: condition ? "button" : "reset"}, 'Hello')
```

## When Not To Use It

If you use only `"submit"` buttons, you can disable this rule
