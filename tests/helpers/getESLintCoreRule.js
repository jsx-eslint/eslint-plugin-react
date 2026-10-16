'use strict';

const getESLintCoreRule = (ruleId) => require('eslint/use-at-your-own-risk').builtinRules.get(ruleId);

module.exports = getESLintCoreRule;
