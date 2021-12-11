# Prevents initialising useState with undefined (react/no-undefined-initial-state)

Some developers consider explicitly setting undefined to be a a bad idea and prefer to only allow JavaScript itself to set undefined values. This rule is aimed at reinforcing this idea via not allowing useState to be initialised with undefined.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
const [state, setState] = useState();
const [state, setState] = useState(undefined);
```

Examples of **correct** code for this rule:

```jsx
const [state, setState] = useState(null);
const [state, setState] = useState(true);
const [state, setState] = useState({});
```
