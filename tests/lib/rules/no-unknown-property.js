/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unknown-property');

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
ruleTester.run('no-unknown-property', rule, {
  valid: parsers.all([
    // React components and their props/attributes should be fine
    { code: '<App class="bar" />;' },
    { code: '<App for="bar" />;' },
    { code: '<App someProp="bar" />;' },
    { code: '<Foo.bar for="bar" />;' },
    { code: '<App accept-charset="bar" />;' },
    { code: '<App http-equiv="bar" />;' },
    {
      code: '<App xlink:href="bar" />;',
      features: ['jsx namespace'],
    },
    { code: '<App clip-path="bar" />;' },
    // Some HTML/DOM elements with common attributes should work
    { code: '<div className="bar"></div>;' },
    { code: '<div onMouseDown={this._onMouseDown}></div>;' },
    { code: '<a href="someLink">Read more</a>' },
    { code: '<img src="cat_keyboard.jpeg" alt="A cat sleeping on a keyboard" />' },
    { code: '<input type="password" required />' },
    { code: '<input ref={this.input} type="radio" />' },
    { code: '<div children="anything" />' },
    { code: '<iframe scrolling="?" />' },
    { code: '<input key="bar" type="radio" />' },
    { code: '<button disabled>You cannot click me</button>;' },
    { code: '<svg key="lock" viewBox="box" fill={10} d="d" stroke={1} strokeWidth={2} strokeLinecap={3} strokeLinejoin={4} transform="something" clipRule="else" x1={5} x2="6" y1="7" y2="8"></svg>' },
    { code: '<g fill="#7B82A0" fillRule="evenodd"></g>' },
    { code: '<mask fill="#7B82A0"></mask>' },
    { code: '<meta property="og:type" content="website" />' },
    { code: '<input type="checkbox" checked={checked} disabled={disabled} id={id} onChange={onChange} />' },
    { code: '<video playsInline />' },
    { code: '<img onError={foo} onLoad={bar} />' },
    { code: '<script onLoad={bar} onError={foo} />' },
    { code: '<source onError={foo} />' },
    { code: '<link onLoad={bar} onError={foo} />' },
    {
      code: '<div allowTransparency="true" />',
      settings: {
        react: { version: '16.0.99' },
      },
    },
    // React related attributes
    { code: '<div onPointerDown={this.onDown} onPointerUp={this.onUp} />' },
    { code: '<input type="checkbox" defaultChecked={this.state.checkbox} />' },
    { code: '<div onTouchStart={this.startAnimation} onTouchEnd={this.stopAnimation} onTouchCancel={this.cancel} onTouchMove={this.move} onMouseMoveCapture={this.capture} />' },
    // Case ignored attributes, for `charset` discussion see https://github.com/jsx-eslint/eslint-plugin-react/pull/1863
    { code: '<meta charset="utf-8" />;' },
    { code: '<meta charSet="utf-8" />;' },
    // Some custom web components that are allowed to use `class` instead of `className`
    { code: '<div class="foo" is="my-elem"></div>;' },
    { code: '<div {...this.props} class="foo" is="my-elem"></div>;' },
    { code: '<atom-panel class="foo"></atom-panel>;' },
    // data-* attributes should work
    { code: '<div data-foo="bar"></div>;' },
    { code: '<div data-foo-bar="baz"></div>;' },
    { code: '<div data-parent="parent"></div>;' },
    { code: '<div data-index-number="1234"></div>;' },
    { code: '<div data-e2e-id="5678"></div>;' },
    // Ignoring should work
    {
      code: '<div class="bar"></div>;',
      options: [{ ignore: ['class'] }],
    },
    {
      code: '<div someProp="bar"></div>;',
      options: [{ ignore: ['someProp'] }],
    },
    {
      code: '<div css={{flex: 1}}></div>;',
      options: [{ ignore: ['css'] }],
    },

    // aria-* attributes should work
    { code: '<button aria-haspopup="true">Click me to open pop up</button>;' },
    { code: '<button aria-label="Close" onClick={someThing.close} />;' },
    // Attributes on allowed elements should work
    { code: '<script crossOrigin />' },
    { code: '<audio crossOrigin />' },
    { code: '<svg><image crossOrigin /></svg>' },
    { code: '<details onToggle={this.onToggle}>Some details</details>' },
    { code: '<path fill="pink" d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z"></path>' },
    { code: '<line fill="pink" x1="0" y1="80" x2="100" y2="20"></line>' },
    { code: '<link as="audio">Audio content</link>' },
    { code: '<video controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true}></video>' },
    { code: '<audio controls={this.controls} crossOrigin="anonymous" disableRemotePlayback loop muted preload="none" src="something" onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onError={this.error}></audio>' },

    // fbt
    { code: '<fbt desc="foo" doNotExtract />;' },
  ]),
  invalid: parsers.all([
    {
      code: '<div allowTransparency="true" />',
      settings: {
        react: { version: '16.1.0' },
      },
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'allowTransparency',
          },
        },
      ],
    },
    {
      code: '<div hasOwnProperty="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'hasOwnProperty',
          },
        },
      ],
    },
    {
      code: '<div abc="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'abc',
          },
        },
      ],
    },
    {
      code: '<div aria-fake="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'aria-fake',
          },
        },
      ],
    },
    {
      code: '<div someProp="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'someProp',
          },
        },
      ],
    },
    {
      code: '<div class="bar"></div>;',
      output: '<div className="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'class',
            standardName: 'className',
          },
        },
      ],
    },
    {
      code: '<div for="bar"></div>;',
      output: '<div htmlFor="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'for',
            standardName: 'htmlFor',
          },
        },
      ],
    },
    {
      code: '<div accept-charset="bar"></div>;',
      output: '<div acceptCharset="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'accept-charset',
            standardName: 'acceptCharset',
          },
        },
      ],
    },
    {
      code: '<div http-equiv="bar"></div>;',
      output: '<div httpEquiv="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'http-equiv',
            standardName: 'httpEquiv',
          },
        },
      ],
    },
    {
      code: '<div accesskey="bar"></div>;',
      output: '<div accessKey="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'accesskey',
            standardName: 'accessKey',
          },
        },
      ],
    },
    {
      code: '<div onclick="bar"></div>;',
      output: '<div onClick="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'onclick',
            standardName: 'onClick',
          },
        },
      ],
    },
    {
      code: '<div onmousedown="bar"></div>;',
      output: '<div onMouseDown="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'onmousedown',
            standardName: 'onMouseDown',
          },
        },
      ],
    },
    {
      code: '<div onMousedown="bar"></div>;',
      output: '<div onMouseDown="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'onMousedown',
            standardName: 'onMouseDown',
          },
        },
      ],
    },
    {
      code: '<use xlink:href="bar" />;',
      output: '<use xlinkHref="bar" />;',
      features: ['jsx namespace'],
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'xlink:href',
            standardName: 'xlinkHref',
          },
        },
      ],
    },
    {
      code: '<rect clip-path="bar" />;',
      output: '<rect clipPath="bar" />;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'clip-path',
            standardName: 'clipPath',
          },
        },
      ],
    },
    {
      code: '<script crossorigin />',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'crossorigin',
            standardName: 'crossOrigin',
          },
        },
      ],
      output: '<script crossOrigin />',
    },
    {
      code: '<div crossorigin />',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'crossorigin',
            standardName: 'crossOrigin',
          },
        },
      ],
      output: '<div crossOrigin />',
    },
    {
      code: '<div crossOrigin />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'crossOrigin',
            tagName: 'div',
            allowedTags: 'script, img, video, audio, link, image',
          },
        },
      ],
    },
    {
      code: '<div as="audio" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'as',
            tagName: 'div',
            allowedTags: 'link',
          },
        },
      ],
    },
    {
      code: '<div onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onError={this.error} />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onAbort',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onDurationChange',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onEmptied',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onEnded',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onError',
            tagName: 'div',
            allowedTags: 'audio, video, img, link, source, script',
          },
        },
      ],
    },
    {
      code: '<div onLoad={this.load} />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onLoad',
            tagName: 'div',
            allowedTags: 'script, img, link',
          },
        },
      ],
    },
    {
      code: '<div fill="pink" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'fill',
            tagName: 'div',
            allowedTags: 'altGlyph, circle, ellipse, g, line, mask, path, polygon, polyline, rect, svg, text, textPath, tref, tspan, use, animate, animateColor, animateMotion, animateTransform, set',
          },
        },
      ],
    },
    {
      code: '<div controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true} allowFullScreen></div>',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'controls',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'loop',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'muted',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'playsInline',
            tagName: 'div',
            allowedTags: 'video',
          },
        },
      ],
    },
  ]),
});
