# Prevent usage of deprecated methods (react/no-deprecated)

Several methods are deprecated between React versions. This rule will warn you if you try to use a deprecated method. Use the [shared settings](/README.md#configuration) to specify the React version.

## Rule Details

The following patterns are considered warnings:

```jsx
React.render(<MyComponent />, root);

React.unmountComponentAtNode(root);

React.findDOMNode(this.refs.foo);

React.renderToString(<MyComponent />);

React.renderToStaticMarkup(<MyComponent />);

React.createClass({ /* Class object */ });

const propTypes = {
  foo: PropTypes.bar,
};

import React, { PropTypes } from 'react';
```

The following patterns are not considered warnings:

```jsx
ReactDOM.render(<MyComponent />, root);

// When [1, {"react": "0.13.0"}]
ReactDOM.findDOMNode(this.refs.foo);

import { PropTypes } from 'prop-types';
```
