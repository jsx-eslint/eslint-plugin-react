'use strict';

const assert = require('assert');
const linkComponentsUtil = require('../../lib/util/linkComponents');

describe('linkComponentsFunctions', () => {
  describe('getLinkComponents', () => {
    it('returns a default map of components', () => {
      const context = {};
      assert.deepStrictEqual(linkComponentsUtil.getLinkComponents(context), new Map([
        ['a', ['href']],
      ]));
    });

    it('returns a map of components', () => {
      const linkComponents = [
        'Hyperlink',
        {
          name: 'Link',
          linkAttribute: 'to',
        },
        {
          name: 'Link2',
          linkAttribute: ['to1', 'to2'],
        },
      ];
      const context = {
        settings: {
          linkComponents,
        },
      };
      assert.deepStrictEqual(linkComponentsUtil.getLinkComponents(context), new Map([
        ['a', ['href']],
        ['Hyperlink', ['href']],
        ['Link', ['to']],
        ['Link2', ['to1', 'to2']],
      ]));
    });
  });

  describe('getFormComponents', () => {
    it('returns a default map of components', () => {
      const context = {};
      assert.deepStrictEqual(linkComponentsUtil.getFormComponents(context), new Map([
        ['form', ['action']],
      ]));
    });

    it('returns a map of components', () => {
      const formComponents = [
        'Form',
        {
          name: 'MyForm',
          formAttribute: 'endpoint',
        },
        {
          name: 'MyForm2',
          formAttribute: ['endpoint1', 'endpoint2'],
        },
      ];
      const context = {
        settings: {
          formComponents,
        },
      };
      assert.deepStrictEqual(linkComponentsUtil.getFormComponents(context), new Map([
        ['form', ['action']],
        ['Form', ['action']],
        ['MyForm', ['endpoint']],
        ['MyForm2', ['endpoint1', 'endpoint2']],
      ]));
    });
  });
});
