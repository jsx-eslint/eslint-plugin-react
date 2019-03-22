# Disallow padding blank lines in a jsx element (react/jsx-no-padded-children)

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule will disallow padding blank lines in the start and end of a jsx element.

The following patterns are considered warnings:

```jsx
var Hello = <div>
  test

</div>;
```

```jsx
var Hello = <div>
  
  
  <Foo />
</div>;
```

The following patterns are **not** considered warnings:

```jsx
var Hello = <div> {'test'} </div>;
```

```jsx
var Hello = <div>
  {'test'}
</div>;
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of padding blank lines in jsx element.
