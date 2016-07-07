# Enforce React components to have a shouldComponentUpdate method (require-optimization)

This rule prevents you from creating React components without declaring a `shouldComponentUpdate` method.

## Rule Details

The following patterns are considered warnings:

```js
class YourComponent extends React.Component {

}
```

```js
React.createClass({
});
```

The following patterns are not considered warnings:

```js
class YourComponent extends React.Component {
	shouldComponentUpdate () {
		return false;
	}
}
```

```js
React.createClass({
	shouldComponentUpdate: function () {
		return false;
	}
});
```

```js
React.createClass({
	mixins: [PureRenderMixin]
});
```

```js
@reactMixin.decorate(PureRenderMixin)
React.createClass({

});
```

## Rule Options

```js
...
"require-optimization": [<enabled>, { allowDecorators: [<allowDecorator>] }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `allowDecorators`: optional array of decorators names to allow validation.


### `allowDecorators`

Sets the allowed names of decorators. If the variable is present in the chain of decorators, it validates

The following patterns are not warnings:

```js
// ['pureRender']
@pureRender
class Hello extends React.Component {}
```

### Example

```js
...
"require-optimization": [2, {allowDecorators: ['customDecorators']}]
...
```
