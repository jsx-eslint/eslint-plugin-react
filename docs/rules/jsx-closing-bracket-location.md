# Validate closing bracket location in JSX (jsx-closing-bracket-location)

Enforce the closing bracket location for JSX multiline elements.

## Rule Details

This rule checks all JSX multiline elements and verifies the location of the closing bracket. By default this one must be aligned with the opening tag.

The following patterns are considered warnings:

```jsx
<Hello
  lastName="Smith"
  firstName="John" />;

<Hello
  lastName="Smith"
  firstName="John"
  />;
```

The following patterns are not considered warnings:

```jsx
<Hello firstName="John" lastName="Smith" />;

<Hello
  firstName="John"
  lastName="Smith"
/>;
```

## Rule Options

```js
...
"jsx-closing-bracket-location": [<enabled>, { "location": <string> }]
...
```

### `location`

Enforced location for the closing bracket.

* `tag-aligned`: must be aligned with the opening tag.
* `after-props`: must be placed right after the last prop.
* `props-aligned`: must be aligned with the last prop.

Default to `tag-aligned`.

The following patterns are considered warnings:

```jsx
// [1, {location: 'tag-aligned'}]
<Hello 
  firstName="John"
  lastName="Smith"
  />;

// [1, {location: 'after-props'}]
<Hello 
  firstName="John"
  lastName="Smith"
  />;

// [1, {location: 'props-aligned'}]
<Hello 
  firstName="John"
  lastName="Smith" />;
```

The following patterns are not considered warnings:

```jsx
// [1, {location: 'tag-aligned'}]
<Hello
  firstName="John"
  lastName="Smith"
/>;

// [1, {location: 'after-props'}]
<Hello 
  firstName="John"
  lastName="Smith" />;

// [1, {location: 'props-aligned'}]
<Hello 
  firstName="John"
  lastName="Smith"
  />;
```

## When not to use

If you are not using JSX then you can disable this rule.
