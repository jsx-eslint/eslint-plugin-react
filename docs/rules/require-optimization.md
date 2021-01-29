# Enforce React components to have a shouldComponentUpdate method (react/require-optimization)

This rule prevents you from creating React components without declaring a `shouldComponentUpdate` method.

## Rule Details

Examples of **incorrect** code for this rule:

```js
class YourComponent extends React.Component {

}
```

```js
createReactClass({
});
```

Examples of **correct** code for this rule:

```js
class YourComponent extends React.Component {
	shouldComponentUpdate () {
		return false;
	}
}
```

```js
createReactClass({
	shouldComponentUpdate: function () {
		return false;
	}
});
```

```js
createReactClass({
	mixins: [PureRenderMixin]
});
```

```js
@reactMixin.decorate(PureRenderMixin)
createReactClass({

});
```

## Rule Options

```js
...
"react/require-optimization": [<enabled>, { allowDecorators: [<allowDecorator>] }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `allowDecorators`: optional array of decorators names to allow validation.


### `allowDecorators`

Sets the allowed names of decorators. If the variable is present in the chain of decorators, it validates

Examples of **correct** code for this rule:

```js
// ['pureRender']
@pureRender
class Hello extends React.Component {}
```

### Example

```js
...
"react/require-optimization": [2, {allowDecorators: ['customDecorators']}]
...
```
