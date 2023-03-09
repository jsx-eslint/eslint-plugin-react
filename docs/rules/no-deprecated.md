# Disallow usage of deprecated methods (`react/no-deprecated`)

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

<!-- end auto-generated rule header -->

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

// React 18 deprecations
import { render } from 'react-dom';
ReactDOM.render(<div></div>, container);

import { hydrate } from 'react-dom';
ReactDOM.hydrate(<div></div>, container);

import {unmountComponentAtNode} from 'react-dom';
ReactDOM.unmountComponentAtNode(container);

import { renderToNodeStream } from 'react-dom/server';
ReactDOMServer.renderToNodeStream(element);
```

Examples of **correct** code for this rule:

```jsx
// when React < 18
ReactDOM.render(<MyComponent />, root);

// when React is < 0.14
ReactDOM.findDOMNode(this.refs.foo);

import { PropTypes } from 'prop-types';

UNSAFE_componentWillMount() { }
UNSAFE_componentWillReceiveProps() { }
UNSAFE_componentWillUpdate() { }

ReactDOM.createPortal(child, container);

import { createRoot } from 'react-dom/client';
const root = createRoot(container);
root.unmount();

import { hydrateRoot } from 'react-dom/client';
const root = hydrateRoot(container, <App/>);
```
