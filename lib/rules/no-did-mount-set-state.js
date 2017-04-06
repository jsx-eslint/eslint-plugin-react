/**
 * @fileoverview Prevent usage of setState in componentDidMount
 * @author Yannick Croissant
 */
'use strict';

var makeNoMethodSetStateRule = require('../util/makeNoSetStateRule');

module.exports = makeNoMethodSetStateRule('componentDidMount');
