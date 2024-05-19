/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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
    {
      code: '<App dataNotAnDataAttribute="yes" />;',
      options: [{ requireDataLowercase: true }],
    },
    // Some HTML/DOM elements with common attributes should work
    { code: '<div className="bar"></div>;' },
    { code: '<div onMouseDown={this._onMouseDown}></div>;' },
    { code: '<a href="someLink" download="foo">Read more</a>' },
    { code: '<area download="foo" />' },
    { code: '<img src="cat_keyboard.jpeg" alt="A cat sleeping on a keyboard" align="top" fetchPriority="high" />' },
    { code: '<input type="password" required />' },
    { code: '<input ref={this.input} type="radio" />' },
    { code: '<input type="file" webkitdirectory="" />' },
    { code: '<input type="file" webkitDirectory="" />' },
    { code: '<div inert children="anything" />' },
    { code: '<iframe scrolling="?" onLoad={a} onError={b} align="top" />' },
    { code: '<input key="bar" type="radio" />' },
    { code: '<button disabled>You cannot click me</button>;' },
    { code: '<svg key="lock" viewBox="box" fill={10} d="d" stroke={1} strokeWidth={2} strokeLinecap={3} strokeLinejoin={4} transform="something" clipRule="else" x1={5} x2="6" y1="7" y2="8"></svg>' },
    { code: '<g fill="#7B82A0" fillRule="evenodd"></g>' },
    { code: '<mask fill="#7B82A0"></mask>' },
    { code: '<symbol fill="#7B82A0"></symbol>' },
    { code: '<meta property="og:type" content="website" />' },
    { code: '<input type="checkbox" checked={checked} disabled={disabled} id={id} onChange={onChange} />' },
    { code: '<video playsInline />' },
    { code: '<img onError={foo} onLoad={bar} />' },
    { code: '<picture inert={false} onError={foo} onLoad={bar} />' },
    { code: '<iframe onError={foo} onLoad={bar} />' },
    { code: '<script onLoad={bar} onError={foo} />' },
    { code: '<source onLoad={bar} onError={foo} />' },
    { code: '<link onLoad={bar} onError={foo} />' },
    { code: '<link rel="preload" as="image" href="someHref" imageSrcSet="someImageSrcSet" imageSizes="someImageSizes" />' },
    { code: '<object onLoad={bar} />' },
    { code: '<video allowFullScreen webkitAllowFullScreen mozAllowFullScreen />' },
    { code: '<iframe allowFullScreen webkitAllowFullScreen mozAllowFullScreen />' },
    { code: '<table border="1" />' },
    { code: '<th abbr="abbr" />' },
    { code: '<td abbr="abbr" />' },
    {
      code: '<div allowTransparency="true" />',
      settings: {
        react: { version: '16.0.99' },
      },
    },
    // React related attributes
    { code: '<div onPointerDown={this.onDown} onPointerUp={this.onUp} />' },
    { code: '<input type="checkbox" defaultChecked={this.state.checkbox} />' },
    { code: '<div onTouchStart={this.startAnimation} onTouchEnd={this.stopAnimation} onTouchCancel={this.cancel} onTouchMove={this.move} onMouseMoveCapture={this.capture} onTouchCancelCapture={this.log} />' },
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
    { code: '<div data-testID="bar" data-under_sCoRe="bar" />;' },
    {
      code: '<div data-testID="bar" data-under_sCoRe="bar" />;',
      options: [{ requireDataLowercase: false }],
    },
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
    { code: '<script crossOrigin noModule />' },
    { code: '<audio crossOrigin />' },
    { code: '<svg focusable><image crossOrigin /></svg>' },
    { code: '<details onToggle={this.onToggle}>Some details</details>' },
    { code: '<path fill="pink" d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z"></path>' },
    { code: '<line fill="pink" x1="0" y1="80" x2="100" y2="20"></line>' },
    { code: '<link as="audio">Audio content</link>' },
    { code: '<video controlsList="nodownload" controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true} onResize={this.onResize}></video>' },
    { code: '<audio controlsList="nodownload" controls={this.controls} crossOrigin="anonymous" disableRemotePlayback loop muted preload="none" src="something" onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onError={this.error} onResize={this.onResize}></audio>' },
    { code: '<marker id={markerId} viewBox="0 0 2 2" refX="1" refY="1" markerWidth="1" markerHeight="1" orient="auto" />' },
    { code: '<pattern id="pattern" viewBox="0,0,10,10" width="10%" height="10%" />' },
    { code: '<symbol id="myDot" width="10" height="10" viewBox="0 0 2 2" />' },
    { code: '<view id="one" viewBox="0 0 100 100" />' },
    { code: '<hr align="top" />' },
    { code: '<applet align="top" />' },
    { code: '<marker fill="#000" />' },
    { code: '<dialog onClose={handler} open id="dialog" returnValue="something" onCancel={handler2} />' },
    {
      code: `
        <table align="top">
          <caption align="top">Table Caption</caption>
          <colgroup valign="top" align="top">
            <col valign="top" align="top"/>
          </colgroup>
          <thead valign="top" align="top">
            <tr valign="top" align="top">
              <th valign="top" align="top">Header</th>
              <td valign="top" align="top">Cell</td>
            </tr>
          </thead>
          <tbody valign="top" align="top" />
          <tfoot valign="top" align="top" />
        </table>
      `,
    },

    // fbt
    { code: '<fbt desc="foo" doNotExtract />;' },
    // fbs
    { code: '<fbs desc="foo" doNotExtract />;' },
    { code: '<math displaystyle="true" />;' },
    {
      code: `
        <div className="App" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash="customValue">
          Hello, world!
        </div>
      `,
    },
    {
      code: `
        <div>
          <button popovertarget="my-popover" popovertargetaction="toggle">Open Popover</button>

          <div popover id="my-popover">Greetings, one and all!</div>
        </div>
      `,
    },
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
      code: '<script crossorigin nomodule />',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'crossorigin',
            standardName: 'crossOrigin',
          },
        },
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'nomodule',
            standardName: 'noModule',
          },
        },
      ],
      output: '<script crossOrigin noModule />',
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
      code: '<div onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onResize={this.resize} onError={this.error} />',
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
            name: 'onResize',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onError',
            tagName: 'div',
            allowedTags: 'audio, video, img, link, source, script, picture, iframe',
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
            allowedTags: 'script, img, link, picture, iframe, object, source',
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
            allowedTags: 'altGlyph, circle, ellipse, g, line, marker, mask, path, polygon, polyline, rect, svg, symbol, text, textPath, tref, tspan, use, animate, animateColor, animateMotion, animateTransform, set',
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
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'allowFullScreen',
            tagName: 'div',
            allowedTags: 'iframe, video',
          },
        },
      ],
    },
    {
      code: '<div download="foo" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'download',
            tagName: 'div',
            allowedTags: 'a, area',
          },
        },
      ],
    },
    {
      code: '<div imageSrcSet="someImageSrcSet" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'imageSrcSet',
            tagName: 'div',
            allowedTags: 'link',
          },
        },
      ],
    },
    {
      code: '<div imageSizes="someImageSizes" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'imageSizes',
            tagName: 'div',
            allowedTags: 'link',
          },
        },
      ],
    },
    {
      code: '<div data-xml-anything="invalid" />',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'data-xml-anything',
          },
        },
      ],
    },
    {
      code: '<div data-testID="bar" data-under_sCoRe="bar" dataNotAnDataAttribute="yes" />;',
      errors: [
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-testID',
            lowerCaseName: 'data-testid',
          },
        },
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-under_sCoRe',
            lowerCaseName: 'data-under_score',
          },
        },
        {
          messageId: 'unknownProp',
          data: {
            name: 'dataNotAnDataAttribute',
            lowerCaseName: 'datanotandataattribute',
          },
        },
      ],
      options: [{ requireDataLowercase: true }],
    },
    {
      code: '<App data-testID="bar" data-under_sCoRe="bar" dataNotAnDataAttribute="yes" />;',
      errors: [
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-testID',
            lowerCaseName: 'data-testid',
          },
        },
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-under_sCoRe',
            lowerCaseName: 'data-under_score',
          },
        },
      ],
      options: [{ requireDataLowercase: true }],
    },
    {
      code: '<div abbr="abbr" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'abbr',
            tagName: 'div',
            allowedTags: 'th, td',
          },
        },
      ],
    },
    {
      code: '<div webkitDirectory="" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'webkitDirectory',
            tagName: 'div',
            allowedTags: 'input',
          },
        },
      ],
    },
    {
      code: '<div webkitdirectory="" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'webkitdirectory',
            tagName: 'div',
            allowedTags: 'input',
          },
        },
      ],
    },
    {
      code: `
        <div className="App" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c="customValue">
          Hello, world!
        </div>
      `,
      features: ['no-ts'],
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c',
          },
        },
      ],
    },
  ]),
});
