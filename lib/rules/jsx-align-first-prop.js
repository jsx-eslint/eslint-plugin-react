/**
 * @fileoverview have all the JSX props aligned with the first one
 * @author Quentin Cuvillier
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function (context) {

  var config = context.options[0] || {};
  var strict = config.strict || false;

  return {
    JSXOpeningElement: function (node) {
      if (node.attributes.lenght === 0) {
        return;
      }

      var props = {};

      node.attributes.forEach(function(decl) {
        var line = decl.loc.start.line;
        if (props[line]) {
          props[line].push(decl);
        } else {
          props[line] = [decl];
        }
      });

      var linesOfProps = Object.keys(props).length;
      var firstLineProps = props['1'];

      // If strict option and there's only 1 line of props
      // and it's not the first line, then it's considered unaligned
      if (strict && linesOfProps === 1 && !firstLineProps) {
        context.report(props[Object.keys(props)[0]][0], 'unaligned prop');
      }

      // If there's only 1 line of props then they are aligned.
      if (linesOfProps === 1) {
        return;
      }

      // if it's multiline, and there is one on
      // the first line then they have to be unaligned.
      if (firstLineProps) {
        context.report(firstLineProps[0], 'unaligned prop');
      }

      // If multiline then they need to be at most 1 prop per line.
      for (var line in props) {
        if (props[line].length > 1) {
          context.report(props[line][0], 'unaligned prop');
          break;
        }
      }
    }
  };
};

module.exports.schema = [{
  type: 'object',
  properties: {
    strict: {
      type: 'boolean'
    }
  }
}];
