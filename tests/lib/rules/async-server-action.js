/**
 * @fileoverview Require functions with the `use server` directive to be async
 * @author Jorge Zreik
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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
    {
      code: `
        function* addToCart(data) {
          'use server';
        }
      `,
    },
    {
      code: `
        async function* addToCart(data) {
          'use server';
        }
      `,
    },
    {
      code: `
        export async function addToCart(data) {
          'use server';
        }
      `,
    },
    {
      code: `
        export default async function addToCart(data) {
          'use server';
        }
      `,
    },
    {
      code: `
        export default async function (data) {
          'use server';
        }
      `,
    },
    {
      code: `
        const obj = {
          async action() {
            'use server';
          }
        };
      `,
    },
    {
      code: `
        const obj = {
          async action() {
            'use server';
            const x = 1;
          }
        };
      `,
    },
    {
      code: `
        class Foo {
          async action() {
            'use server';
          }
        }
      `,
    },
    {
      code: `
        class Foo {
          static async action() {
            'use server';
          }
        }
      `,
    },
    {
      code: `
        function outer() {
          async function inner() {
            'use server';
          }
        }
      `,
    },
    {
      code: `
        const action = async function named(data) {
          'use server';
        }
      `,
    },
    {
      code: `
        function addToCart(data) {
          'use strict';
          console.log('use server');
        }
      `,
    },
    {
      code: `
        function empty() {}
      `,
    },
    {
      code: `
        const fn = () => 'use server';
      `,
    },
    {
      code: `
        <form action={async () => { 'use server'; }} />
      `,
    },
    {
      code: `
        <button onClick={async () => { 'use server'; doSomething(); }} />
      `,
    },
    {
      code: `
        async function action() {
          'use strict';
          'use server';
        }
      `,
    },
    {
      code: `
        function action() {
          'use strict';
          'use server';
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
              desc: 'Make `addToCart` an `async` function',
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
              desc: 'Make `requestUsername` an `async` function',
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
              desc: 'Make `addToCart` an `async` function',
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
              desc: 'Make `requestUsername` an `async` function',
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
              desc: 'Make this function `async`',
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
              desc: 'Make this function `async`',
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
              desc: 'Make this function `async`',
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
              desc: 'Make this function `async`',
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
              desc: 'Make this function `async`',
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
              desc: 'Make this function `async`',
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
              desc: 'Make this function `async`',
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
              desc: 'Make this function `async`',
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
    {
      code: `
        export function addToCart(data) {
          'use server';
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make `addToCart` an `async` function',
              output: `
        export async function addToCart(data) {
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
        export default function addToCart(data) {
          'use server';
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make `addToCart` an `async` function',
              output: `
        export default async function addToCart(data) {
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
        export default function (data) {
          'use server';
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make this function `async`',
              output: `
        export default async function (data) {
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
        const obj = {
          action() {
            'use server';
          }
        };
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make `action` an `async` function',
              output: `
        const obj = {
          async action() {
            'use server';
          }
        };
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        class Foo {
          action() {
            'use server';
          }
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make `action` an `async` function',
              output: `
        class Foo {
          async action() {
            'use server';
          }
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        class Foo {
          static action() {
            'use server';
          }
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make `action` an `async` function',
              output: `
        class Foo {
          static async action() {
            'use server';
          }
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        function outer() {
          function inner() {
            'use server';
          }
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make `inner` an `async` function',
              output: `
        function outer() {
          async function inner() {
            'use server';
          }
        }
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        const action = function named(data) {
          'use server';
        }
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make `named` an `async` function',
              output: `
        const action = async function named(data) {
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
        <form action={() => { 'use server'; }} />
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make this function `async`',
              output: `
        <form action={async () => { 'use server'; }} />
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <form
          action={function () {
            'use server';
            doSomething();
          }}
        />
      `,
      errors: [
        {
          message: 'Server Actions must be async',
          suggestions: [
            {
              desc: 'Make this function `async`',
              output: `
        <form
          action={async function () {
            'use server';
            doSomething();
          }}
        />
      `,
            },
          ],
        },
      ],
    },
  ]),
});
