# Disallow JSX props spreading (react/jsx-props-no-spreading)

Enforces that there is no spreading for any JSX attribute. This enhances readability of code by being more explicit about what props are received by the component. It is also good for maintainability by avoiding passing unintentional extra props and allowing react to emit warnings when invalid HTML props are passed to HTML elements.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<App {...props} />
<MyCustomComponent {...props} some_other_prop={some_other_prop} />
<img {...props} />
```

Examples of **correct** code for this rule:

```jsx
const {src, alt} = props;
const {one_prop, two_prop} = otherProps;
<MyCustomComponent one_prop={one_prop} two_prop={two_prop} />
<img src={src} alt={alt} />
```

## Rule Options

```js
...
"react/jsx-props-no-spreading": [<enabled>, {
    "html": "ignore" | "enforce",
    "custom": "ignore" | "enforce",
    "explicitSpread": "ignore" | "enforce",
    "exceptions": [<string>]
}]
...
```

### html

`html` set to `ignore` will ignore all html jsx tags like `div`, `img` etc. Default is set to `enforce`.

Examples of **correct** code for this rule, when `html` is set to `ignore`:

```jsx
<img {...props} />
```

Examples of **incorrect** code for this rule, when `html` is set to `ignore`:

```jsx
<MyCustomComponent {...props} />
```

### custom

`custom` set to `ignore` will ignore all custom jsx tags like `App`, `MyCustomComponent` etc. Default is set to `enforce`.

Examples of **correct** code for this rule, when `custom` is set to `ignore`:

```jsx
<MyCustomComponent {...props} />
```

Examples of **incorrect** code for this rule, when `custom` is set to `ignore`:

```jsx
<img {...props} />
```

### explicitSpread

`explicitSpread` set to `ignore` will ignore spread operators that are explicilty listing all object properties within that spread. Default is set to `enforce`.

Examples of **correct** code for this rule, when `explicitSpread` is set to `ignore`:

```jsx
<img {...{ prop1, prop2, prop3 }} />
```

### exceptions

An "exception" will always flip the resulting html or custom setting for that component - ie, html set to `ignore`, with an exception of `div` will enforce on an `div`; custom set to `enforce` with an exception of `Foo` will ignore `Foo`.

```js
{ "exceptions": ["Image", "img"] }
```

Examples of **correct** code for this rule:

```jsx
const {src, alt} = props;
<Image {...props} />
<img {...props} />
```

Examples of **incorrect** code for this rule:

```jsx
<MyCustomComponent {...props} />
```

```js
{ "html": "ignore", "exceptions": ["MyCustomComponent", "img"] }
```

Examples of **correct** code for this rule:

```jsx
const {src, alt} = props;
const {one_prop, two_prop} = otherProps;
<img src={src} alt={alt} />
<MyCustomComponent {...otherProps} />
```

Examples of **incorrect** code for this rule:

```jsx
<img {...props} />
```

## When Not To Use It

If you are not using JSX or have lots of props to be passed or the props spreading is used inside HOC.
