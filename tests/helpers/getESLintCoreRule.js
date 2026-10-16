'use strict';

// eslint-disable-next-line import/no-unresolved
const getESLintCoreRule = (ruleId) => require('eslint/use-at-your-own-risk').builtinRules.get(ruleId);

module.exports = getESLintCoreRule;
