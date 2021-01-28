# Prevent react contexts from taking non-stable values (react/jsx-no-constructed-context-values)

This rule prevents non-stable values (i.e. object identities) from being used as a value for `Context.Provider`.

## Rule Details

One way to resolve this issue may be to wrap the value in a `useMemo()`. If it's a function then `useCallback()` can be used as well.

If you _expect_ the context to be rerun on each render, then consider adding a comment/lint supression explaining why.

## Examples

Examples of **incorrect** code for this rule:

```
return (
    <SomeContext.Provider value={{foo: 'bar'}}>
        ...
    </SomeContext.Provider>
)
```

Examples of **correct** code for this rule:

```
const foo = useMemo(() => ({foo: 'bar'}), []);
return (
    <SomeContext.Provider value={foo}>
        ...
    </SomeContext.Provider>
)
```

## Legitimate Uses
React Context, and all its child nodes and Consumers are rerendered whenever the value prop changes. Because each Javascript object carries its own *identity*, things like object expressions (`{foo: 'bar'}`) or function expressions get a new identity on every run through the component. This makes the context think it has gotten a new object and can cause needless rerenders and unintended consequences.

This can be a pretty large performance hit because not only will it cause the context providers and consumers to rerender with all the elements in its subtree, the processing for the tree scan react does to render the provider and find consumers is also wasted.
