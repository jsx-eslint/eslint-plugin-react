/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-key');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  react: {
    pragma: 'Act',
    fragment: 'Frag',
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-key', rule, {
  valid: parsers.all([
    { code: 'fn()' },
    { code: '[1, 2, 3].map(function () {})' },
    { code: '<App />;' },
    { code: '[<App key={0} />, <App key={1} />];' },
    { code: '[1, 2, 3].map(function(x) { return <App key={x} /> });' },
    { code: '[1, 2, 3].map(x => <App key={x} />);' },
    { code: '[1, 2 ,3].map(x => x && <App x={x} key={x} />);' },
    { code: '[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} key="2" />);' },
    { code: '[1, 2, 3].map(x => { return <App key={x} /> });' },
    { code: 'Array.from([1, 2, 3], function(x) { return <App key={x} /> });' },
    { code: 'Array.from([1, 2, 3], (x => <App key={x} />));' },
    { code: 'Array.from([1, 2, 3], (x => {return <App key={x} />}));' },
    { code: 'Array.from([1, 2, 3], someFn);' },
    { code: 'Array.from([1, 2, 3]);' },
    { code: '[1, 2, 3].foo(x => <App />);' },
    { code: 'var App = () => <div />;' },
    { code: '[1, 2, 3].map(function(x) { return; });' },
    { code: 'foo(() => <div />);' },
    {
      code: 'foo(() => <></>);',
      features: ['fragment'],
    },
    {
      code: '<></>;',
      features: ['fragment'],
    },
    {
      code: '<App {...{}} />;',
    },
    {
      code: '<App key="keyBeforeSpread" {...{}} />;',
      options: [{ checkKeyMustBeforeSpread: true }],
    },
    {
      code: '<div key="keyBeforeSpread" {...{}} />;',
      options: [{ checkKeyMustBeforeSpread: true }],
    },
    {
      code: `
        const spans = [
          <span key="notunique"/>,
          <span key="notunique"/>,
        ];
      `,
    },
    {
      code: `
        function Component(props) {
          return hasPayment ? (
            <div className="stuff">
              <BookingDetailSomething {...props} />
              {props.modal && props.calculatedPrice && (
                <SomeOtherThing items={props.something} discount={props.discount} />
              )}
            </div>
          ) : null;
        }
      `,
    },
    {
      code: `
        import React, { FC, useRef, useState } from 'react';

        import './ResourceVideo.sass';
        import VimeoVideoPlayInModal from '../vimeoVideoPlayInModal/VimeoVideoPlayInModal';

        type Props = {
          videoUrl: string;
          videoTitle: string;
        };
        const ResourceVideo: FC<Props> = ({
          videoUrl,
          videoTitle,
        }: Props): JSX.Element => {
          return (
            <div className="resource-video">
              <VimeoVideoPlayInModal videoUrl={videoUrl} />
              <h3>{videoTitle}</h3>
            </div>
          );
        };

        export default ResourceVideo;
      `,
      features: ['types'],
    },
    {
      code: `
        // testrule.jsx
        const trackLink = () => {};
        const getAnalyticsUiElement = () => {};

        const onTextButtonClick = (e, item) => trackLink([, getAnalyticsUiElement(item), item.name], e);
      `,
    },
    {
      code: `
        function Component({ allRatings }) {
          return (
            <RatingDetailsStyles>
              {Object.entries(allRatings)?.map(([key, value], index) => {
                const rate = value?.split(/(?=[%, /])/);

                if (!rate) return null;

                return (
                  <li key={\`\${entertainment.tmdbId}\${index}\`}>
                    <img src={\`/assets/rating/\${key}.png\`} />
                    <span className="rating-details--rate">{rate?.[0]}</span>
                    <span className="rating-details--rate-suffix">{rate?.[1]}</span>
                  </li>
                );
              })}
            </RatingDetailsStyles>
          );
        }
      `,
      features: ['optional chaining'],
    },
    {
      code: `
        const baz = foo?.bar?.()?.[1] ?? 'qux';

        qux()?.map()

        const directiveRanges = comments?.map(tryParseTSDirective)
      `,
      features: ['optional chaining', 'nullish coalescing'],
    },
    {
      code: `
        import { observable } from "mobx";

        export interface ClusterFrameInfo {
          frameId: number;
          processId: number;
        }

        export const clusterFrameMap = observable.map<string, ClusterFrameInfo>();
      `,
      features: ['types', 'no-babel-old'],
    },
    { code: 'React.Children.toArray([1, 2 ,3].map(x => <App />));' },
    {
      code: `
        import { Children } from "react";
        Children.toArray([1, 2 ,3].map(x => <App />));
      `,
    },
    {
      // TODO: uncomment the commented lines below
      code: `
        import Act from 'react';
        import { Children as ReactChildren } from 'react';

        const { Children } = Act;
        const { toArray } = Children;

        Act.Children.toArray([1, 2 ,3].map(x => <App />));
        Act.Children.toArray(Array.from([1, 2 ,3], x => <App />));
        Children.toArray([1, 2 ,3].map(x => <App />));
        Children.toArray(Array.from([1, 2 ,3], x => <App />));
        // ReactChildren.toArray([1, 2 ,3].map(x => <App />));
        // ReactChildren.toArray(Array.from([1, 2 ,3], x => <App />));
        // toArray([1, 2 ,3].map(x => <App />));
        // toArray(Array.from([1, 2 ,3], x => <App />));
      `,
      settings,
    },
  ]),
  invalid: parsers.all([
    {
      code: '[<App />];',
      errors: [{ messageId: 'missingArrayKey' }],
    },
    {
      code: '[<App {...key} />];',
      errors: [{ messageId: 'missingArrayKey' }],
    },
    {
      code: '[<App key={0}/>, <App />];',
      errors: [{ messageId: 'missingArrayKey' }],
    },
    {
      code: '[1, 2 ,3].map(function(x) { return <App /> });',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2 ,3].map(x => <App />);',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2 ,3].map(x => x && <App x={x} />);',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} />);',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} key="2" />);',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2 ,3].map(x => { return <App /> });',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: 'Array.from([1, 2 ,3], function(x) { return <App /> });',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: 'Array.from([1, 2 ,3], (x => { return <App /> }));',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: 'Array.from([1, 2 ,3], (x => <App />));',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2, 3]?.map(x => <BabelEslintApp />)',
      features: ['no-default'],
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2, 3]?.map(x => <TypescriptEslintApp />)',
      features: ['ts'],
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2, 3].map(x => <>{x}</>);',
      features: ['fragment'],
      options: [{ checkFragmentShorthand: true }],
      settings,
      errors: [
        {
          messageId: 'missingIterKeyUsePrag',
          data: {
            reactPrag: 'Act',
            fragPrag: 'Frag',
          },
        },
      ],
    },
    {
      code: '[<></>];',
      features: ['fragment'],
      options: [{ checkFragmentShorthand: true }],
      settings,
      errors: [
        {
          messageId: 'missingArrayKeyUsePrag',
          data: {
            reactPrag: 'Act',
            fragPrag: 'Frag',
          },
        },
      ],
    },
    {
      code: '[<App {...obj} key="keyAfterSpread" />];',
      options: [{ checkKeyMustBeforeSpread: true }],
      settings,
      errors: [{ messageId: 'keyBeforeSpread' }],
    },
    {
      code: '[<div {...obj} key="keyAfterSpread" />];',
      options: [{ checkKeyMustBeforeSpread: true }],
      settings,
      errors: [{ messageId: 'keyBeforeSpread' }],
    },
    {
      code: `
        const spans = [
          <span key="notunique"/>,
          <span key="notunique"/>,
        ];
      `,
      options: [{ warnOnDuplicates: true }],
      errors: [
        { messageId: 'nonUniqueKeys', line: 3 },
        { messageId: 'nonUniqueKeys', line: 4 },
      ],
    },
    {
      code: `
        const div = (
          <div>
            <span key="notunique"/>
            <span key="notunique"/>
          </div>
        );
      `,
      options: [{ warnOnDuplicates: true }],
      errors: [
        { messageId: 'nonUniqueKeys', line: 4 },
        { messageId: 'nonUniqueKeys', line: 5 },
      ],
    },
    {
      code: `
        const Test = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                }

                return <div />;
              })}
            </div>
          );
        };
      `,
      errors: [
        { messageId: 'missingIterKey' },
        { messageId: 'missingIterKey' },
      ],
    },
    {
      code: `
        const TestO = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                } else if (item < 5) {
                  return <div></div>
                }  else {
                  return <div></div>
                }

                return <div />;
              })}
            </div>
          );
        };
      `,
      errors: [
        { messageId: 'missingIterKey' },
        { messageId: 'missingIterKey' },
        { messageId: 'missingIterKey' },
        { messageId: 'missingIterKey' },
      ],
    },
    {
      code: `
        const TestCase = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) return <div>{item}</div>;
                else if (item < 5) return <div />;
                else return <div />;
              })}
            </div>
          );
        };
      `,
      errors: [
        { messageId: 'missingIterKey' },
        { messageId: 'missingIterKey' },
        { messageId: 'missingIterKey' },
      ],
    },
    {
      code: `
        const TestCase = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(x => <div {...spread} key={x} />)}
            </div>
          );
        };
      `,
      options: [{ checkKeyMustBeforeSpread: true }],
      errors: [{ messageId: 'keyBeforeSpread' }],
    },
  ]),
});
