# Disallow extra lines around jsx elements (react/jsx-newline)


## Rule Details

This is a stylistic rule intended to make JSX code more readable by remove the ambiguity they create around whether those line breaks are intended to render.


The following patterns are considered warnings:

```jsx
return (

  <button/>

)
```

```jsx

return(

<div>

  <Button>{data.label}</Button>

  {showSomething === true && <Something />}

</div>
)
```

The following patterns are **not** considered warnings:


```jsx
return (
  <button/>
)
```

```jsx

return(
<div>
  <Button>{data.label}</Button>
  {showSomething === true && <Something />}
</div>
)
```