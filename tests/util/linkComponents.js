'use strict';

const assert = require('assert');
const linkComponentsUtil = require('../../lib/util/linkComponents');

describe('linkComponentsFunctions', () => {
  describe('getLinkComponents', () => {
    it('returns a default map of components', () => {
      const context = {};
      assert.deepStrictEqual(linkComponentsUtil.getLinkComponents(context), new Map([
        ['a', 'href'],
      ]));
    });

    it('returns a map of components', () => {
      const linkComponents = [
        'Hyperlink',
        {
          name: 'Link',
          linkAttribute: 'to',
        },
      ];
      const context = {
        settings: {
          linkComponents,
        },
      };
      assert.deepStrictEqual(linkComponentsUtil.getLinkComponents(context), new Map([
        ['a', 'href'],
        ['Hyperlink', 'href'],
        ['Link', 'to'],
      ]));
    });
  });
});
