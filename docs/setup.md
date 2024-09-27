In order to use the react eslint plugin do the following...

1. At the root of your project type <code>npm install --save-dev eslint-plugin-react</code>
2. Check your package.json 'devDependencies' for the following entries (version numbers may vary, but it's important that **the eslint version matches the peerDependency version in eslint-plugin-react**)...
<pre>
  "devDependencies": {
    "eslint": "^7.3.1",
    "eslint-plugin-react": "^7.10.3"
  }
</pre>
3. If configuring using package.json add the following under 'eslintConfig'...
<pre>
  "eslintConfig": {
    "plugins": [
      "react"
    ]
   }
</pre>
Else, in your eslint configuration file (.eslintrc) add the following...
<pre>
  {
    "plugins": [
      "react"
    ]
  }
</pre>
4. Configure the rules you want to use according to the [rules docs](/docs/rules). Here's a sample of some of mine...
<pre>
  "eslintConfig": {
    "rules": {
      "no-unused-vars": 2,
      "react/jsx-uses-vars": 2,
      "react/require-extensions": 0,
      "react/jsx-sort-prop-types": 0,
      "react/prop-types": [2, {
        "ignore": ["children"],
        "skipUndeclared": false
      }]
    }
   }
</pre>

<i>You can read more about configuring ESLint plugins at http://eslint.org/docs/user-guide/configuring#configuring-plugins</i>
