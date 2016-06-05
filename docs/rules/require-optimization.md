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
"require-optimization": [<enabled>]
...
```

### Example

```js
...
"require-optimization": 2
...
```
