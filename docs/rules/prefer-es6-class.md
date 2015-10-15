ES6 class bodies are more terse than traditional object literals. Methods do not require a `function` keyword and no commas are needed to separate them. This refactoring looks as such:

Invalid:

```js
var ExampleComponent = React.createClass({
 render: function() { 
  return <div onClick={this._handleClick}>Hello, world.</div>;
 },
 _handleClick: function() {
  console.log(this);
 }
});
```

Valid:

```js
class ExampleComponent extends React.Component {
 render() { 
  return <div onClick={this._handleClick}>Hello, world.</div>;
 }
 _handleClick() {
  console.log(this);
 }
}
```