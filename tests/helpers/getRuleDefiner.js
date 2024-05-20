'use strict';

const eslint = require('eslint');

// `ruleTester` is a RuleTester instance
const getRuleDefiner = (ruleTester) => (typeof Symbol !== 'undefined' && Symbol.for && ruleTester[Symbol.for('react.RuleTester.RuleDefiner')])
    || ruleTester.linter
    || eslint.linter
    || eslint.Linter;

module.exports = getRuleDefiner;
