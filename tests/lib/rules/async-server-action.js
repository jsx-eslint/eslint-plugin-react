/**
 * @fileoverview Require functions with the `use server` directive to be async
 * @author Jorge Zreik
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/async-server-action');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('async-server-action', rule, {
  valid: parsers.all([
    {
      code: `
        async function addToCart(data) {
          'use server';
        }
      `,
    },
    {
      code: `
        async function requestUsername(formData) {
          'use server';
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        async function addToCart(data) {
          "use server";
        }
      `,
    },
    {
      code: `
        async function requestUsername(formData) {
          "use server";
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        function addToCart(data) {
          console.log("test");
          'use server';
        }
      `,
    },
    {
      code: `
        function requestUsername(formData) {
          const username = formData.get('username');
          'use server';
        }
      `,
    },
    {
      code: `
        function addToCart(data) {
          console.log("use server");
        }
      `,
    },
    {
      code: `
        function requestUsername(formData) {
          console.log("use server");
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        const addToCart = async (data) => {
          'use server';
        }
      `,
    },
    {
      code: `
        const requestUsername = async (formData) => {
          'use server';
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        const addToCart = async (data) => {
          "use server";
        }
      `,
    },
    {
      code: `
        const requestUsername = async (formData) => {
          "use server";
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        const addToCart = (data) => {
          console.log("test");
          'use server';
        }
      `,
    },
    {
      code: `
        const requestUsername = (formData) => {
          const username = formData.get('username');
          'use server';
        }
      `,
    },
    {
      code: `
        const addToCart = (data) => {
          console.log("use server");
        }
      `,
    },
    {
      code: `
        const requestUsername = (formData) => {
          console.log("use server");
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        const addToCart = async function (data) {
          'use server';
        }
      `,
    },
    {
      code: `
        const requestUsername = async function (formData) {
          'use server';
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        const addToCart = async function (data) {
          "use server";
        }
      `,
    },
    {
      code: `
        const requestUsername = async function (formData) {
          "use server";
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        const addToCart = function (data) {
          console.log("test");
          'use server';
        }
      `,
    },
    {
      code: `
        const requestUsername = function (formData) {
          const username = formData.get('username');
          'use server';
        }
      `,
    },
    {
      code: `
        const addToCart = function (data) {
          console.log("use server");
        }
      `,
    },
    {
      code: `
        const requestUsername = function (formData) {
          console.log("use server");
          const username = formData.get('username');
        }
      `,
    },
    {
      code: `
        async function addToCart(data) {
          \`use server\`;
        }
      `,
    },
    {
      code: `
        function addToCart(data) {
          \`use server\`;
        }
      `,
    },
    {
      code: `
        const addToCart = async (data) => {
          \`use server\`;
        }
      `,
    },
    {
      code: `
        const addToCart = (data) => {
          \`use server\`;
        }
      `,
    },
    {
      code: `
        const addToCart = async function (data) {
          \`use server\`;
        }
      `,
    },
    {
      code: `
        const addToCart = function (data) {
          \`use server\`;
        }
      `,
    },
    {
      code: `
        const addToCart = async function* (data) {
          'use server';
        }
      `,
    },
    {
      code: `
        const addToCart = async function* (data) {
          "use server";
        }
      `,
    },
    {
      code: `
        const addToCart = function* (data) {
          'use server';
        }
      `,
    },
    {
      code: `
        const addToCart = function* (data) {
          "use server";
        }
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        function addToCart(data) {
          'use server';
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        async function addToCart(data) {
          'use server';
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        function requestUsername(formData) {
          'use server';
          const username = formData.get('username');
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        async function requestUsername(formData) {
          'use server';
          const username = formData.get('username');
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        function addToCart(data) {
          "use server";
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        async function addToCart(data) {
          "use server";
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        function requestUsername(formData) {
          "use server";
          const username = formData.get('username');
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        async function requestUsername(formData) {
          "use server";
          const username = formData.get('username');
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const addToCart = (data) => {
          'use server';
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const addToCart = async (data) => {
          'use server';
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const requestUsername = (formData) => {
          'use server';
          const username = formData.get('username');
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const requestUsername = async (formData) => {
          'use server';
          const username = formData.get('username');
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const addToCart = (data) => {
          "use server";
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const addToCart = async (data) => {
          "use server";
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const requestUsername = (formData) => {
          "use server";
          const username = formData.get('username');
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const requestUsername = async (formData) => {
          "use server";
          const username = formData.get('username');
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const addToCart = function (data) {
          'use server';
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const addToCart = async function (data) {
          'use server';
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const requestUsername = function (formData) {
          'use server';
          const username = formData.get('username');
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const requestUsername = async function (formData) {
          'use server';
          const username = formData.get('username');
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const addToCart = function (data) {
          "use server";
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const addToCart = async function (data) {
          "use server";
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const requestUsername = function (formData) {
          "use server";
          const username = formData.get('username');
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              output: `
        const requestUsername = async function (formData) {
          "use server";
          const username = formData.get('username');
        }
      `,
            },
          ],
        },
      ],
    },
  ]),
});
