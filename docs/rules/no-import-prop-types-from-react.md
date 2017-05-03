# No import of propTypes from react package (no-import-prop-types-from-react)

This rule forbids using propTypes from react package, since is deprecated in 15.5

## Rule Details

This rule checks all imports and ensures that the `propTypes` property is not from react package

The following patterns are considered warnings:

```js
import { react, propTypes } from "react";
```

```js
import { react, propTypes as fooPropTypes } from "react";
```

The following patterns are not considered warnings:

```js
import { propTypes } from "./SomeComponent";
```

```js
import { propTypes } from "prop-types";
```

## When not to use

When using react < 15.5
