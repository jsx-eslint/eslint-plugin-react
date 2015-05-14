2.3.0 / 2015-05-14
==================

* update dependencies
* add sort-comp rule ([#39][])
* fix quoted propTypes in ES6 ([#77][])
* add allow-in-func option to no-did-mount-set-state ([#56][])
* improve errors locations for prop-types

[#39]: https://github.com/yannickcr/eslint-plugin-react/issues/39
[#77]: https://github.com/yannickcr/eslint-plugin-react/issues/77
[#56]: https://github.com/yannickcr/eslint-plugin-react/issues/56

2.2.0 / 2015-04-22
==================
* add jsx-sort-prop-types rule ([#38][] @AlexKVal)
* fix variables marked as used when a prop has the same name ([#69][] @burnnat)
* documentation improvements ([#71][] @AlexKVal)

[#38]: https://github.com/yannickcr/eslint-plugin-react/issues/38
[#69]: https://github.com/yannickcr/eslint-plugin-react/pull/69
[#71]: https://github.com/yannickcr/eslint-plugin-react/pull/71

2.1.1 / 2015-04-17
==================
* add support for classes static properties ([#43][])
* add tests for the babel-eslint parser
* add ESLint as peerDependency ([#63][] @AlexKVal)
* documentation improvements ([#55][] @AlexKVal, [#60][] @chriscalo)

[#43]: https://github.com/yannickcr/eslint-plugin-react/issues/43
[#63]: https://github.com/yannickcr/eslint-plugin-react/pull/63
[#55]: https://github.com/yannickcr/eslint-plugin-react/pull/55
[#60]: https://github.com/yannickcr/eslint-plugin-react/pull/60

2.1.0 / 2015-04-06
==================
* update jsx-sort-props to reset the alphabetical verification on spread ([#47][] @zertosh)
* update jsx-uses-vars to be enabled by default ([#49][] @banderson)
* add jsx-boolean-value rule ([#11][])
* add support for static methods in display-name and prop-types ([#48][])
* fix describing comment for hasSpreadOperator() method ([#53][] @AlexKVal)

[#47]: https://github.com/yannickcr/eslint-plugin-react/pull/47
[#49]: https://github.com/yannickcr/eslint-plugin-react/pull/49
[#11]: https://github.com/yannickcr/eslint-plugin-react/issues/11
[#48]: https://github.com/yannickcr/eslint-plugin-react/issues/48
[#53]: https://github.com/yannickcr/eslint-plugin-react/pull/53

2.0.2 / 2015-03-31
==================
* fix ignore rest spread when destructuring props ([#46][])
* fix component detection in prop-types and display-name ([#45][])
* fix spread handling in jsx-sort-props ([#42][] @zertosh)

[#46]: https://github.com/yannickcr/eslint-plugin-react/issues/46
[#45]: https://github.com/yannickcr/eslint-plugin-react/issues/45
[#42]: https://github.com/yannickcr/eslint-plugin-react/pull/42

2.0.1 / 2015-03-30
==================
* fix props detection when used in an object ([#41][])

[#41]: https://github.com/yannickcr/eslint-plugin-react/issues/41

2.0.0 / 2015-03-29
==================
* update dependencies
* add jsx-sort-props rule ([#16][])
* add no-unknown-property rule ([#28][])
* add ignore option to prop-types rule
* breaking in prop-types the children prop is no longer ignored
* fix components are now detected when using ES6 classes ([#24][])
* fix prop-types now return the right line/column ([#33][])
* fix props are now detected when destructuring ([#27][])
* fix only check for computed property names in prop-types ([#36][] @burnnat)

[#16]: https://github.com/yannickcr/eslint-plugin-react/issues/16
[#28]: https://github.com/yannickcr/eslint-plugin-react/issues/28
[#24]: https://github.com/yannickcr/eslint-plugin-react/issues/24
[#33]: https://github.com/yannickcr/eslint-plugin-react/issues/33
[#27]: https://github.com/yannickcr/eslint-plugin-react/issues/27
[#36]: https://github.com/yannickcr/eslint-plugin-react/pull/36


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
