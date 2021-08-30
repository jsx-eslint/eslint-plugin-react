# Disallow unnecessary fragments (react/jsx-no-useless-fragment)

A fragment is redundant if it contains only one child, or if it is the child of a html element, and is not a [keyed fragment](https://reactjs.org/docs/fragments.html#keyed-fragments).

**Fixable:** This rule is sometimes automatically fixable using the `--fix` flag on the command line.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<>{foo}</>

<><Foo /></>

<p><>foo</></p>

<></>

<Fragment>foo</Fragment>

<React.Fragment>foo</React.Fragment>

<section>
  <>
    <div />
    <div />
  </>
</section>
```

Examples of **correct** code for this rule:

```jsx
<>
  <Foo />
  <Bar />
</>

<>foo {bar}</>

<> {foo}</>

const cat = <>meow</>

<SomeComponent>
  <>
    <div />
    <div />
  </>
</SomeComponent>

<Fragment key={item.id}>{item.value}</Fragment>
```

### `allowExpressions`

When `true` single expressions in a fragment will be allowed. This is useful in
places like Typescript where `string` does not satisfy the expected return type
of `JSX.Element`. A common workaround is to wrap the variable holding a string
in a fragment and expression.

Examples of **correct** code for the rule, when `"allowExpressions"` is `true`:

```jsx
<>{foo}</>

<>
  {foo}
</>
```
