/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */
'use strict';

var makeNoMethodSetStateRule = require('../util/makeNoSetStateRule');

module.exports = makeNoMethodSetStateRule('componentWillUpdate');
