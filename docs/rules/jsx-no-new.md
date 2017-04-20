# Prevent instantiation of classes in JSX attributes (jsx-no-new)

Instantiating a class in the `render` method of a React component means that a brand new instance will be created every single time the component is re-rendered. This is bad for performance, as it will result in the garbage collector being invoked way more than is necessary.

## Rule Details

The following patterns are considered warnings:
```jsx
<Foo bar={new HelloWorld()} />
<Foo bar={new HelloWorld()}></Foo>
```

The following patterns are not considered warnings:
```jsx
<Foo bar={helloWorld} />
<Foo bar={helloWorld}></Foo>
```

## When Not To Use It

If you do not use JSX or do not want to enforce that new classes are instantiated in props, then you can disable this rule.
