2.7.1 / 2015-07-16
==================

* update peerDependencies requirements ([#154][])
* update codebase for ESLint v1.0.0
* change oneOfType to actually keep the child types ([#148][] @CalebMorris)
* documentation improvements ([#147][] @lencioni)

[#154]: https://github.com/yannickcr/eslint-plugin-react/issues/154
[#148]: https://github.com/yannickcr/eslint-plugin-react/issues/148
[#147]: https://github.com/yannickcr/eslint-plugin-react/pull/147

2.7.0 / 2015-07-11
==================

* add no-danger rule ([#138][] @scothis)
* add jsx-curly-spacing rule ([#142][])
* fix properties limitations on prop types ([#139][])
* fix component detection ([#144][])

[#138]: https://github.com/yannickcr/eslint-plugin-react/pull/138
[#142]: https://github.com/yannickcr/eslint-plugin-react/issues/142
[#139]: https://github.com/yannickcr/eslint-plugin-react/issues/139
[#144]: https://github.com/yannickcr/eslint-plugin-react/issues/144

2.6.4 / 2015-07-02
==================

* fix simple destructuring handling ([#137][])

[#137]: https://github.com/yannickcr/eslint-plugin-react/issues/137

2.6.3 / 2015-06-30
==================

* fix ignore option for prop-types rule ([#135][])
* fix nested props destructuring ([#136][])

[#135]: https://github.com/yannickcr/eslint-plugin-react/issues/135
[#136]: https://github.com/yannickcr/eslint-plugin-react/issues/136

2.6.2 / 2015-06-28
==================

* fix props validation when using a prop as an object key ([#132][])

[#132]: https://github.com/yannickcr/eslint-plugin-react/issues/132

2.6.1 / 2015-06-28
==================

* fix crash in prop-types when encountering an empty variable declaration ([#130][])

[#130]: https://github.com/yannickcr/eslint-plugin-react/issues/130

2.6.0 / 2015-06-28
==================

* update dependencies
* add support for nested prop types ([#62][] [#105][] @Cellule)
* add require-extension rule ([#117][] @scothis)
* add support for computed string format in prop-types ([#127][] @Cellule)
* add ES6 methods to sort-comp default configuration ([#97][] [#122][])
* add support for props destructuring directly on the this keyword
* add acceptTranspilerName option to display-name rule ([#75][])
* add schema to validate rules options
* fix test command for Windows ([#114][] @Cellule)
* fix detection of missing displayName and propTypes when ecmaFeatures.jsx is false ([#119][] @rpl)
* fix prop-types destructuring with properties as string ([#118][] @Cellule)
* fix jsx-sort-prop-types support for keys as string ([#123][] @Cellule)
* fix crash if a ClassProperty has only one token ([#125][])
* fix invalid class property handling in jsx-sort-prop-types ([#129][])

[#62]: https://github.com/yannickcr/eslint-plugin-react/issues/62
[#105]: https://github.com/yannickcr/eslint-plugin-react/issues/105
[#114]: https://github.com/yannickcr/eslint-plugin-react/pull/114
[#117]: https://github.com/yannickcr/eslint-plugin-react/pull/117
[#119]: https://github.com/yannickcr/eslint-plugin-react/pull/119
[#118]: https://github.com/yannickcr/eslint-plugin-react/issues/118
[#123]: https://github.com/yannickcr/eslint-plugin-react/pull/123
[#125]: https://github.com/yannickcr/eslint-plugin-react/issues/125
[#127]: https://github.com/yannickcr/eslint-plugin-react/pull/127
[#97]: https://github.com/yannickcr/eslint-plugin-react/issues/97
[#122]: https://github.com/yannickcr/eslint-plugin-react/issues/122
[#129]: https://github.com/yannickcr/eslint-plugin-react/issues/129
[#75]: https://github.com/yannickcr/eslint-plugin-react/issues/75

2.5.2 / 2015-06-14
==================

* fix regression in jsx-uses-vars with babel-eslint ([#110][])

[#110]: https://github.com/yannickcr/eslint-plugin-react/issues/110

2.5.1 / 2015-06-14
==================

* update dependencies
* fix prop-types crash when propTypes definition is invalid ([#95][])
* fix jsx-uses-vars for ES6 classes ([#96][])
* fix hasOwnProperty that is taken for a prop ([#102][])
* documentation improvements ([#99][] @morenoh149)

[#95]: https://github.com/yannickcr/eslint-plugin-react/issues/95
[#96]: https://github.com/yannickcr/eslint-plugin-react/issues/96
[#102]: https://github.com/yannickcr/eslint-plugin-react/issues/102
[#99]: https://github.com/yannickcr/eslint-plugin-react/pull/99

2.5.0 / 2015-06-04
==================

* update dependencies
* add option to make wrap-multilines more granular ([#94][] @PiPeep)
* documentation improvements ([#92][] [#93][] @lencioni)

[#94]: https://github.com/yannickcr/eslint-plugin-react/pull/94
[#92]: https://github.com/yannickcr/eslint-plugin-react/pull/92
[#93]: https://github.com/yannickcr/eslint-plugin-react/pull/93

2.4.0 / 2015-05-30
==================

* update dependencies
* add pragma option to jsx-uses-react ([#82][] @dominicbarnes)
* add context props to sort-comp ([#89][] @zertosh)
* fix itemID in no-unknown-property rule ([#85][] @cody)
* fix license field in package.json ([#90][] @zertosh)
* fix usage of contructor in sort-comp options ([#88][])
* documentation improvement ([#91][] @matthewwithanm)

[#82]: https://github.com/yannickcr/eslint-plugin-react/pull/82
[#89]: https://github.com/yannickcr/eslint-plugin-react/pull/89
[#85]: https://github.com/yannickcr/eslint-plugin-react/pull/85
[#90]: https://github.com/yannickcr/eslint-plugin-react/pull/90
[#88]: https://github.com/yannickcr/eslint-plugin-react/issues/88
[#91]: https://github.com/yannickcr/eslint-plugin-react/pull/91

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
