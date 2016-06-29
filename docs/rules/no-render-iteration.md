# Prevent usage of iteration in React render functions (no-render-iteration)

> In order to keep your render functions concise and easily readable, you may prefer to remove iteration from inside of the render method and instead call other functions which do that iteration.

## Rule Details

This rule will warn you if you Array.prototype.map in render functions.

The following pattern is considered warning:

```js
class Hello extends React.Component {
  render() {
    <ul>  
      {
        this.props.items.map(item => {
          return <MyListItem item={item} />
        })
      }
    </ul>
  }
}
```

The following patterns are not considered warning:

```js
class Hello extends React.Component {
  render() {
    <ul>  
      {this.renderListItems()}
    </ul>
  },

  renderListItems() {
    return this.props.items.map(item => {
      return <MyListItem item={item} />
    });
  }
}
```
