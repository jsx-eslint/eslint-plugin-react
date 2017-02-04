# Warn for use of `ref` prop (jsx-no-ref)

Warn if an custom element uses a `ref` prop, as this is considered a smell of
non-declarative React component design.  Note that this does rule does _not_
warn a ref attribute is added to a standard HTML tag, like `<input>`.

## Rule Details

The following patterns are considered warnings:

```jsx
<App ref={someRef} />

<App foo={bar} ref={someRef} />
```

The following patterns are not considered warnings:

```jsx
<input ref="message" type="text" />

<div ref="contrived"></div>
```

## When not to use

If you are not using JSX then you can disable this rule.
