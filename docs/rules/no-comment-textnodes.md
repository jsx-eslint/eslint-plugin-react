# Prevent comments from being inserted as text nodes (no-comment-textnodes)

This rule prevents comment strings (e.g. beginning with `//` or `/*`) from being accidentally
injected as a text node in JSX statements.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return (
      <div>// empty div</div>
    );
  }
});

var Hello = React.createClass({
  render: function() {
    return (
      <div>
        /* empty div */
      </div>
    );
  }
});
```

The following patterns are not considered warnings:

```js
var Hello = React.createClass({
  displayName: 'Hello',
  render: function() {
    return <div>{/* empty div */}</div>;
  }
});

var Hello = React.createClass({
  displayName: 'Hello',
  render: function() {
    return <div /* empty div */></div>;
  }
});

var Hello = React.createClass({
  displayName: 'Hello',
  render: function() {
    return <div className={'foo' /* temp class */}</div>;
  }
});
```

## Legitimate uses

It's possible you may want to legitimately output comment start characters (`//` or `/*`)
in a JSX text node. In which case, you can do the following:

```js
var Hello = React.createClass({
  render: function() {
    return (
      <div>{'/* This will be output as a text node */'}</div>
    );
  }
});
```
