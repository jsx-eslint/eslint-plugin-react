# Prevent usage of deprecated methods (react/no-deprecated)

Several methods are deprecated between React versions. This rule will warn you if you try to use a deprecated method. Use the [shared settings](/README.md#configuration) to specify the React version.

## Rule Details

Examples of **incorrect** code for this rule:

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

//Any factories under React.DOM
React.DOM.div();

import React, { PropTypes } from 'react';

// old lifecycles (since React 16.9)
componentWillMount() { }
componentWillReceiveProps() { }
componentWillUpdate() { }
```

Examples of **correct** code for this rule:

```jsx
ReactDOM.render(<MyComponent />, root);

// When [1, {"react": "0.13.0"}]
ReactDOM.findDOMNode(this.refs.foo);

import { PropTypes } from 'prop-types';

UNSAFE_componentWillMount() { }
UNSAFE_componentWillReceiveProps() { }
UNSAFE_componentWillUpdate() { }
```
