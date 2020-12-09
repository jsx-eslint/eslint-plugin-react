# Ensure destructuring and symmetric naming of useState hook value and setter variables (react/hook-use-state)

## Rule Details

This rule checks whether the value and setter variables destructured from a `React.useState()` call are named symmetrically.

Examples of **incorrect** code for this rule:

```js
import React from 'react';
export default function useColor() {
  // useState call is not destructured into value + setter pair
  const useStateResult = React.useState();
  return useStateResult;
}
```

```js
import React from 'react';
export default function useColor() {
  // useState call is destructured into value + setter pair, but identifier
  // names do not follow the [thing, setThing] naming convention
  const [color, updateColor] = React.useState();
  return useStateResult;
}
```

Examples of **correct** code for this rule:

```js
import React from 'react';
export default function useColor() {
  // useState call is destructured into value + setter pair whose identifiers
  // follow the [thing, setThing] naming convention
  const [color, setColor] = React.useState();
  return [color, setColor];
}
```

```js
import React from 'react';
export default function useColor() {
  // useState result is directly returned
  return React.useState();
}
```
