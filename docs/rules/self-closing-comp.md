# Prevent extra closing tags for components without children (self-closing-comp)

Components without children can be self-closed to avoid unnecessary extra closing tag.

## Rule Details

The following patterns are considered warnings:

```js
var HelloJohn = <Hello name="John"></Hello>;
```

The following patterns are not considered warnings:

```js
var contentContainer = <div className="content"></div>;

var HelloJohn = <Hello name="John" />;

var Profile = <Hello name="John"><img src="picture.png" /></Hello>; 
```
