1.6.1 / 2015-03-25
==================
* update jsx-quotes documentation
* fix jsx-no-undef with babel-eslint ([#30][])
* fix jsx-quotes on Literal childs ([#29][])

[#30]: https://github.com/yannickcr/eslint-plugin-react/issues/30
[#29]: https://github.com/yannickcr/eslint-plugin-react/issues/29

1.6.0 / 2015-03-22
==================
* update dependencies
* add jsx-no-undef rule
* add jsx-quotes rule ([#12][]) 
* add @jsx pragma support ([#23][])
* fix react-in-jsx-scope in Node.js env
* fix usage of propTypes with an external object ([#9][])
* allow this.getState references (not calls) in lifecycle methods ([#22][] @benmosher)

[#12]: https://github.com/yannickcr/eslint-plugin-react/issues/12
[#23]: https://github.com/yannickcr/eslint-plugin-react/issues/23
[#9]: https://github.com/yannickcr/eslint-plugin-react/issues/9
[#22]: https://github.com/yannickcr/eslint-plugin-react/pull/22

1.5.0 / 2015-03-14
==================
* add jsx-uses-vars rule
* fix jsx-uses-react for ESLint 0.17.0

1.4.1 / 2015-03-03
==================
* fix this.props.children marked as missing in props validation ([#7][])
* fix usage of this.props without property ([#8][])

[#7]: https://github.com/yannickcr/eslint-plugin-react/issues/7
[#8]: https://github.com/yannickcr/eslint-plugin-react/issues/8

1.4.0 / 2015-02-24
==================
* update prop-types to check props usage insead of propTypes presence ([#4][])
* add react-in-jsx-scope rule ([#5][] @glenjamin)
* add jsx-uses-react rule ([#6][] @glenjamin)

[#4]: https://github.com/yannickcr/eslint-plugin-react/issues/4
[#5]: https://github.com/yannickcr/eslint-plugin-react/pull/5
[#6]: https://github.com/yannickcr/eslint-plugin-react/pull/6

1.3.0 / 2015-02-24
==================
* update dependencies
* add no-did-mount-set-state rule
* add no-did-update-set-state rule

1.2.2 / 2015-02-09
==================
* update dependencies
* fix childs detection in self-closing-comp ([#3][])

[#3]: https://github.com/yannickcr/eslint-plugin-react/issues/3

1.2.1 / 2015-01-29
==================
* update Readme
* update dependencies
* update wrap-multilines and self-closing-comp rules for ESLint 0.13.0

1.2.0 / 2014-12-29
==================
* add self-closing-comp rule
* fix display-name and prop-types rules

1.1.0 / 2014-12-28
==================
 * add display-name rule
 * add wrap-multilines rule
 * add rules documentation
 * add rules tests

1.0.0 / 2014-12-16
==================
 * first revision
