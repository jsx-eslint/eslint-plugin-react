/**
 * @fileoverview Enforce props alphabetical sorting
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-sort-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

const expectedError = {
  messageId: 'sortPropsByAlpha',
  type: 'JSXIdentifier',
};
const expectedCallbackError = {
  messageId: 'listCallbacksLast',
  type: 'JSXIdentifier',
};
const expectedShorthandFirstError = {
  messageId: 'listShorthandFirst',
  type: 'JSXIdentifier',
};
const expectedShorthandLastError = {
  messageId: 'listShorthandLast',
  type: 'JSXIdentifier',
};
const expectedReservedFirstError = {
  messageId: 'listReservedPropsFirst',
  type: 'JSXIdentifier',
};
const expectedEmptyReservedFirstError = {
  messageId: 'listIsEmpty',
};
const expectedInvalidReservedFirstError = {
  messageId: 'noUnreservedProps',
  data: { unreservedWords: 'notReserved' },
};
const callbacksLastArgs = [{ callbacksLast: true }];
const ignoreCaseAndCallbackLastArgs = [
  {
    callbacksLast: true,
    ignoreCase: true,
  },
];
const shorthandFirstArgs = [{ shorthandFirst: true }];
const shorthandLastArgs = [{ shorthandLast: true }];
const shorthandAndCallbackLastArgs = [
  {
    callbacksLast: true,
    shorthandLast: true,
  },
];
const ignoreCaseArgs = [{ ignoreCase: true }];
const noSortAlphabeticallyArgs = [{ noSortAlphabetically: true }];
const sortAlphabeticallyArgs = [{ noSortAlphabetically: false }];
const reservedFirstAsBooleanArgs = [{ reservedFirst: true }];
const reservedFirstAsArrayArgs = [{ reservedFirst: ['children', 'dangerouslySetInnerHTML', 'key'] }];
const reservedFirstWithNoSortAlphabeticallyArgs = [
  {
    noSortAlphabetically: true,
    reservedFirst: true,
  },
];
const reservedFirstWithShorthandLast = [
  {
    reservedFirst: true,
    shorthandLast: true,
  },
];
const reservedFirstAsEmptyArrayArgs = [{ reservedFirst: [] }];
const reservedFirstAsInvalidArrayArgs = [{ reservedFirst: ['notReserved'] }];

ruleTester.run('jsx-sort-props', rule, {
  valid: parsers.all([
    { code: '<App />;' },
    { code: '<App {...this.props} />;' },
    { code: '<App a b c />;' },
    { code: '<App {...this.props} a b c />;' },
    { code: '<App c {...this.props} a b />;' },
    { code: '<App a="c" b="b" c="a" />;' },
    { code: '<App {...this.props} a="c" b="b" c="a" />;' },
    { code: '<App c="a" {...this.props} a="c" b="b" />;' },
    { code: '<App A a />;' },
    { code: '<App aB aa/>;' },
    { code: '<App aA aB />;' },
    { code: '<App aB aaa />;' },
    { code: '<App a aB aa />;' },
    { code: '<App Number="2" name="John" />;' },
    // Ignoring case
    { code: '<App a A />;', options: ignoreCaseArgs },
    { code: '<App aa aB />;', options: ignoreCaseArgs },
    { code: '<App a B c />;', options: ignoreCaseArgs },
    { code: '<App A b C />;', options: ignoreCaseArgs },
    { code: '<App name="John" Number="2" />;', options: ignoreCaseArgs },
    // Sorting callbacks below all other props
    { code: '<App a z onBar onFoo />;', options: callbacksLastArgs },
    { code: '<App z onBar onFoo />;', options: ignoreCaseAndCallbackLastArgs },
    // Sorting shorthand props before others
    { code: '<App a b="b" />;', options: shorthandFirstArgs },
    { code: '<App z a="a" />;', options: shorthandFirstArgs },
    { code: '<App x y z a="a" b="b" />;', options: shorthandFirstArgs },
    { code: '<App a="a" b="b" x y z />;', options: shorthandLastArgs },
    {
      code: '<App a="a" b="b" x y z onBar onFoo />;',
      options: shorthandAndCallbackLastArgs,
    },
    // noSortAlphabetically
    { code: '<App a b />;', options: noSortAlphabeticallyArgs },
    { code: '<App b a />;', options: noSortAlphabeticallyArgs },
    // reservedFirst
    {
      code: '<App children={<App />} key={0} ref="r" a b c />',
      options: reservedFirstAsBooleanArgs,
    },
    {
      code: '<App children={<App />} key={0} ref="r" a b c dangerouslySetInnerHTML={{__html: "EPR"}} />',
      options: reservedFirstAsBooleanArgs,
    },
    {
      code: '<App children={<App />} key={0} a ref="r" />',
      options: reservedFirstAsArrayArgs,
    },
    {
      code: '<App children={<App />} key={0} a dangerouslySetInnerHTML={{__html: "EPR"}} ref="r" />',
      options: reservedFirstAsArrayArgs,
    },
    {
      code: '<App ref="r" key={0} children={<App />} b a c />',
      options: reservedFirstWithNoSortAlphabeticallyArgs,
    },
    {
      code: '<div ref="r" dangerouslySetInnerHTML={{__html: "EPR"}} key={0} children={<App />} b a c />',
      options: reservedFirstWithNoSortAlphabeticallyArgs,
    },
    {
      code: '<App key="key" c="c" b />',
      options: reservedFirstWithShorthandLast,
    },
  ]),
  invalid: parsers.all([
    {
      code: '<App b a />;',
      errors: [expectedError],
      output: '<App a b />;',
    },
    {
      code: '<App aB a />;',
      errors: [expectedError],
      output: '<App a aB />;',
    },
    {
      code: '<App fistName="John" tel={5555555} name="John Smith" lastName="Smith" Number="2" />;',
      errors: [expectedError, expectedError, expectedError],
      output: '<App Number="2" fistName="John" lastName="Smith" name="John Smith" tel={5555555} />;',
    },
    {
      code: '<App aa aB />;',
      errors: [expectedError],
      output: '<App aB aa />;',
    },
    {
      code: '<App aB aA />;',
      errors: [expectedError],
      output: '<App aA aB />;',
    },
    {
      code: '<App aaB aA />;',
      errors: [expectedError],
      output: '<App aA aaB />;',
    },
    {
      code: '<App aaB aaa aA a />;',
      errors: [expectedError, expectedError],
      output: '<App a aA aaB aaa />;',
    },
    {
      code: '<App {...this.props} b a />;',
      errors: [expectedError],
      output: '<App {...this.props} a b />;',
    },
    {
      code: '<App c {...this.props} b a />;',
      errors: [expectedError],
      output: '<App c {...this.props} a b />;',
    },
    {
      code: '<App fistName="John" tel={5555555} name="John Smith" lastName="Smith" Number="2" />;',
      options: ignoreCaseArgs,
      errors: [expectedError, expectedError, expectedError],
      output: '<App fistName="John" lastName="Smith" name="John Smith" Number="2" tel={5555555} />;',
    },
    {
      code: '<App B a />;',
      options: ignoreCaseArgs,
      errors: [expectedError],
      output: '<App a B />;',
    },
    {
      code: '<App B A c />;',
      options: ignoreCaseArgs,
      errors: [expectedError],
      output: '<App A B c />;',
    },
    {
      code: '<App c="a" a="c" b="b" />;',
      output: '<App a="c" b="b" c="a" />;',
      errors: 2,
    },
    {
      code: '<App {...this.props} c="a" a="c" b="b" />;',
      output: '<App {...this.props} a="c" b="b" c="a" />;',
      errors: 2,
    },
    {
      code: '<App d="d" b="b" {...this.props} c="a" a="c" />;',
      output: '<App b="b" d="d" {...this.props} a="c" c="a" />;',
      errors: 2,
    },
    {
      code: `
        <App
          a={true}
          z
          r
          _onClick={function(){}}
          onHandle={function(){}}
          {...this.props}
          b={false}
          {...otherProps}
        >
          {test}
        </App>
      `,
      output: `
        <App
          _onClick={function(){}}
          a={true}
          onHandle={function(){}}
          r
          z
          {...this.props}
          b={false}
          {...otherProps}
        >
          {test}
        </App>
      `,
      errors: 3,
    },
    {
      code: '<App b={2} c={3} d={4} e={5} f={6} g={7} h={8} i={9} j={10} k={11} a={1} />',
      output: '<App a={1} b={2} c={3} d={4} e={5} f={6} g={7} h={8} i={9} j={10} k={11} />',
      errors: 1,
    },
    {
      code: `
        <List
          className={className}
          onStageAnswer={onStageAnswer}
          onCommitAnswer={onCommitAnswer}
          isFocused={isFocused}
          direction={direction}
          allowMultipleSelection={allowMultipleSelection}
          measureLongestChildNode={measureLongestChildNode}
          layoutItemsSize={layoutItemsSize}
          handleAppScroll={handleAppScroll}
          isActive={isActive}
          resetSelection={resetSelection}
          onKeyboardChoiceHovered={onKeyboardChoiceHovered}
          keyboardShortcutType
        />
      `,
      output: `
        <List
          allowMultipleSelection={allowMultipleSelection}
          className={className}
          direction={direction}
          handleAppScroll={handleAppScroll}
          isActive={isActive}
          isFocused={isFocused}
          keyboardShortcutType
          layoutItemsSize={layoutItemsSize}
          measureLongestChildNode={measureLongestChildNode}
          onCommitAnswer={onCommitAnswer}
          onKeyboardChoiceHovered={onKeyboardChoiceHovered}
          onStageAnswer={onStageAnswer}
          resetSelection={resetSelection}
        />
      `,
      errors: 10,
    },
    {
      code: `
        <CreateNewJob
          closed={false}
          flagOptions={flagOptions}
          jobHeight={300}
          jobWidth={200}
          campaign='Some Campaign name'
          campaignStart={moment('2018-07-28 00:00:00')}
          campaignFinish={moment('2018-09-01 00:00:00')}
          jobNumber={'Job Number can be a String'}
          jobTemplateOptions={jobTemplateOptions}
          numberOfPages={30}
          onChange={onChange}
          onClose={onClose}
          spreadSheetTemplateOptions={spreadSheetTemplateOptions}
          stateMachineOptions={stateMachineOptions}
          workflowTemplateOptions={workflowTemplateOptions}
          workflowTemplateSteps={workflowTemplateSteps}
          description='Some description for this job'

          jobTemplate='1'
          stateMachine='1'
          flag='1'
          spreadSheetTemplate='1'
          workflowTemplate='1'
          validation={validation}
          onSubmit={onSubmit}
        />
      `,
      output: `
        <CreateNewJob
          campaign='Some Campaign name'
          campaignFinish={moment('2018-09-01 00:00:00')}
          campaignStart={moment('2018-07-28 00:00:00')}
          closed={false}
          description='Some description for this job'
          flag='1'
          flagOptions={flagOptions}
          jobHeight={300}
          jobNumber={'Job Number can be a String'}
          jobTemplate='1'
          jobTemplateOptions={jobTemplateOptions}
          jobWidth={200}
          numberOfPages={30}
          onChange={onChange}
          onClose={onClose}
          onSubmit={onSubmit}
          spreadSheetTemplate='1'

          spreadSheetTemplateOptions={spreadSheetTemplateOptions}
          stateMachine='1'
          stateMachineOptions={stateMachineOptions}
          validation={validation}
          workflowTemplate='1'
          workflowTemplateOptions={workflowTemplateOptions}
          workflowTemplateSteps={workflowTemplateSteps}
        />
      `,
      errors: 13,
    },
    {
      code: '<App key="key" b c="c" />',
      errors: [expectedShorthandLastError],
      options: reservedFirstWithShorthandLast,
      output: '<App key="key" c="c" b />',
    },
    {
      code: '<App ref="ref" key="key" isShorthand veryLastAttribute="yes" />',
      errors: [expectedError, expectedShorthandLastError],
      options: reservedFirstWithShorthandLast,
      output: '<App key="key" ref="ref" veryLastAttribute="yes" isShorthand />',
    },
    {
      code: '<App a z onFoo onBar />;',
      errors: [expectedError],
      options: callbacksLastArgs,
      output: '<App a z onBar onFoo />;',
    },
    {
      code: '<App a onBar onFoo z />;',
      errors: [expectedCallbackError],
      options: callbacksLastArgs,
      output: '<App a z onBar onFoo />;',
    },
    {
      code: '<App a="a" b />;',
      errors: [expectedShorthandFirstError],
      options: shorthandFirstArgs,
      output: '<App b a="a" />;',
    },
    {
      code: '<App z x a="a" />;',
      errors: [expectedError],
      options: shorthandFirstArgs,
      output: '<App x z a="a" />;',
    },
    {
      code: '<App b a="a" />;',
      errors: [expectedShorthandLastError],
      options: shorthandLastArgs,
      output: '<App a="a" b />;',
    },
    {
      code: '<App a="a" onBar onFoo z x />;',
      errors: [expectedError],
      options: shorthandLastArgs,
      output: '<App a="a" onBar onFoo x z />;',
    },
    {
      code: '<App b a />;',
      errors: [expectedError],
      options: sortAlphabeticallyArgs,
      output: '<App a b />;',
    },
    // reservedFirst
    {
      code: '<App a key={1} />',
      options: reservedFirstAsBooleanArgs,
      errors: [expectedReservedFirstError],
      output: '<App key={1} a />',
    },
    {
      code: '<div a dangerouslySetInnerHTML={{__html: "EPR"}} />',
      options: reservedFirstAsBooleanArgs,
      errors: [expectedReservedFirstError],
      output: '<div dangerouslySetInnerHTML={{__html: "EPR"}} a />',
    },
    {
      code: '<App ref="r" key={2} b />',
      options: reservedFirstAsBooleanArgs,
      errors: [expectedError],
      output: '<App key={2} ref="r" b />',
    },
    {
      code: '<App key={2} b a />',
      options: reservedFirstAsBooleanArgs,
      output: '<App key={2} a b />',
      errors: [expectedError],
    },
    {
      code: '<App b a />',
      options: reservedFirstAsBooleanArgs,
      output: '<App a b />',
      errors: [expectedError],
    },
    {
      code: '<App dangerouslySetInnerHTML={{__html: "EPR"}} e key={2} b />',
      options: reservedFirstAsBooleanArgs,
      output: '<App key={2} b dangerouslySetInnerHTML={{__html: "EPR"}} e />',
      errors: [expectedReservedFirstError, expectedError],
    },
    {
      code: '<App key={3} children={<App />} />',
      options: reservedFirstAsArrayArgs,
      errors: [expectedError],
      output: '<App children={<App />} key={3} />',
    },
    {
      code: '<App z ref="r" />',
      options: reservedFirstWithNoSortAlphabeticallyArgs,
      errors: [expectedReservedFirstError],
      output: '<App ref="r" z />',
    },
    {
      code: '<App key={4} />',
      options: reservedFirstAsEmptyArrayArgs,
      errors: [expectedEmptyReservedFirstError],
    },
    {
      code: '<App key={5} />',
      options: reservedFirstAsInvalidArrayArgs,
      errors: [expectedInvalidReservedFirstError],
    },
  ]),
});
