/**
 * @fileoverview have all the JSX props aligned with the first one
 * @author Quentin Cuvillier
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function (context) {
  return {
    JSXOpeningElement: function (node) {
      var props = {};

      node.attributes.forEach(function(decl) {
        var line = decl.loc.start.line;
        if (props[line]) {
          props[line].push(decl);
        } else {
          props[line] = [decl];
        }
      });

      // If there's only 1 line of props
      // then they are aligned.
      if (Object.keys(props).length === 1) {
        return;
      }

      // if it's multiline, and there's one on
      // the first line then they have to be unaligned.
      if (props['1']) {
        context.report(props['1'][0], 'unaligned prop');
      }

      // If multiline and no props on first line
      // then they need to be at most 1 prop per line.
      for (var line in props) {
        if (props[line].length > 1) {
          context.report(props[line][0], 'unaligned prop');
          break;
        }
      }
    }
  };
};

module.exports.schema = [{type: 'object'}];
