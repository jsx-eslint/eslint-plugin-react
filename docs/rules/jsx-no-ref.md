# Warn for use of `ref` prop (jsx-no-ref)

Flag use of `ref` attributes in custom JSX component tags, as this can be a
smell of non-declarative React component design.

Please consult the React docs for [guidance on proper use of the `ref` attribute
in custom components](https://facebook.github.io/react/docs/refs-and-the-dom.html#when-to-use-refs)
for more information.

Note that this rule does _not_ flag when a `ref` attribute appears in built-in
component tags, like `<input />` or `<button />`.


## Rule Details

Identifies the following patterns as warnings:

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
