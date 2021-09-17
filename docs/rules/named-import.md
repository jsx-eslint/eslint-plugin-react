# Enforce or prohibit named imports from React (react/named-import)

Prohibit the use of named imports from React, so it's visible in code that it's React and not custom code; or enforce the use of named imports from React, to avoid needing the `React` default import. This rule also creates consistency inside a codebase because it enforces or prohibits the use of specified named imports.

## Rule Details

### Options

This rule has two different modes: 'import' and 'property', which can be set using the first argument. The second arguments accepts an object where the keys are equal to React named exports, and their value overrides the default mode

```
"react/named-import": [<enabled>, 'import' | 'property', {}]
```

By default the rule is set to `import` with an empty object, which means that all of React's named exports will have the rule applied.



Example configurations:

```javascript
// import
{
   "rules": {
    "react/named-import": ["error", "import", {
      "Component": "property",
      "useState": "property"
    }]
  }
}
// property
{
  "rules": {
    "react/named-import": ["error", "property", {
      "Component": "import",
      "useState": "import"
    }]
  }
}
```

The following patterns are considered warnings:

```jsx
const [loading, setLoading] = React.useState(false);

// ['property', {}]
import React, { Component } from 'react';

// ['property', {'useState': 'import' }]
const [loading, setLoading] = React.useState(false);

// ['import', {}]
const [loading, setLoading] = React.useState(false);

// ['import', {'useState': 'property' }]
import React, { useState } from 'react';

```

The following patterns are **not** considered warnings:

```jsx
import React, { useState } from 'react';

// ['property', {}]
import React from 'react';

const [loading, setLoading] = React.useState(false);

// ['property', {'useState': 'import' }]
import { useState } from 'react';

// ['import', {}]
import React, { useState } from 'react';

const [loading, setLoading] = useState(false);

// ['import', {'useState': 'property' }]
const [loading, setLoading] = React.useState(false);

```
