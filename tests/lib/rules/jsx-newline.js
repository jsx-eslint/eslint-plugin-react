/**
 * @fileoverview Require or prevent a new line after jsx elements and expressions
 * @author Johnny Zabala
 * @author Joseph Stiles
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-newline');
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

new RuleTester({ parserOptions }).run('jsx-newline', rule, {
  valid: parsers.all([
    {
      code: `
        <div>
          <Button>{data.label}</Button>

          <List />

          <Button>
            <IconPreview />
            Button 2

            <span></span>
          </Button>

          {showSomething === true && <Something />}

          <Button>Button 3</Button>

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
    },
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          <List />
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
          {showSomething === true && <Something />}
          <Button>Button 3</Button>
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      options: [{ prevent: true }],
    },
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      options: [{ prevent: true }],
      features: ['fragment'],
    },
    {
      code: `
        {/* fake-eslint-disable-next-line react/forbid-component-props */}
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          <Icon f7='gear' />
        </Button>
      `,
    },
    {
      code: `
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          {/* fake-eslint-disable-next-line should also work inside a component */}
          <Icon f7='gear' />
        </Button>
      `,
    },
    {
      code: `
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          {/* should work inside a component */}
          {/* and it should work when using multiple comments */}
          <Icon f7='gear' />
        </Button>
      `,
    },
    {
      code: `
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          {/* this is a multiline
              block comment */}
          <Icon f7='gear' />
        </Button>
      `,
    },
    {
      code: `
        <>
          {/* does this */}
          <Icon f7='gear' />

          {/* also work with multiple components and inside a fragment? */}
          <OneLineComponent />
        </>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <>
          <OneLineComponent />
          <AnotherOneLineComponent prop={prop} />

          <MultilineComponent
            prop1={prop1}
            prop2={prop2}
          />

          <OneLineComponent />
        </>
      `,
      features: ['fragment'],
      options: [{ prevent: true, allowMultilines: true }],
    },
    {
      code: `
        <div>
          {/* this does not have a newline */}
          <Icon f7='gear' />
          {/* neither does this */}
          <OneLineComponent />

          {/* but this one needs one */}
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
        </div>
      `,
      options: [{ prevent: true, allowMultilines: true }],
    },
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          <List />

          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>

          {showSomething === true && <Something />}
          <Button>Button 3</Button>

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}

        </div>
      `,
      options: [{ prevent: true, allowMultilines: true }],
    },
  ]),
  invalid: parsers.all([
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          <List />
        </div>
      `,
      output: `
        <div>
          <Button>{data.label}</Button>

          <List />
        </div>
      `,
      errors: [{
        messageId: 'require',
      }],
    },
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          {showSomething === true && <Something />}
        </div>
      `,
      output: `
        <div>
          <Button>{data.label}</Button>

          {showSomething === true && <Something />}
        </div>
      `,
      errors: [{ messageId: 'require' }],
    },
    {
      code: `
        <div>
          {showSomething === true && <Something />}
          <Button>{data.label}</Button>
        </div>
      `,
      output: `
        <div>
          {showSomething === true && <Something />}

          <Button>{data.label}</Button>
        </div>
      `,
      errors: [{ messageId: 'require' }],
    },
    {
      code: `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      output: `
        <div>
          {showSomething === true && <Something />}

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      errors: [{ messageId: 'require' }],
    },
    {
      code: `
        <div>
          {/* This should however still not work*/}
          <Icon f7='gear' />

          <OneLineComponent />
          {/* Comments between components still need a newLine */}
          <OneLineComponent />
        </div>
      `,
      output: `
        <div>
          {/* This should however still not work*/}
          <Icon f7='gear' />

          <OneLineComponent />

          {/* Comments between components still need a newLine */}
          <OneLineComponent />
        </div>
      `,
      errors: [{ messageId: 'require' }],
    },
    {
      code: `
        <div>
          {/* this does not have a newline */}
          <Icon f7='gear' />
          {/* neither does this */}
          <OneLineComponent />
          {/* but this one needs one */}
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
        </div>
      `,
      output: `
        <div>
          {/* this does not have a newline */}
          <Icon f7='gear' />
          {/* neither does this */}
          <OneLineComponent />

          {/* but this one needs one */}
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
        </div>
      `,
      options: [{ prevent: true, allowMultilines: true }],
      errors: [{ messageId: 'allowMultilines' }],
    },
    {
      code: `
        <div>
          {/* this does not have a newline */}
          <Icon f7='gear' />
          {/* neither does this */}
          <OneLineComponent />
          {/* Multiline */}
          {/* Block comments */}
          {/* Stick to MultilineComponent */}
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
        </div>
      `,
      output: `
        <div>
          {/* this does not have a newline */}
          <Icon f7='gear' />
          {/* neither does this */}
          <OneLineComponent />

          {/* Multiline */}
          {/* Block comments */}
          {/* Stick to MultilineComponent */}
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
        </div>
      `,
      options: [{ prevent: true, allowMultilines: true }],
      errors: [{ messageId: 'allowMultilines' }],
    },
    {
      code: `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `,
      output: `
        <div>
          <div>
            <button></button>

            <button></button>
          </div>

          <div>
            <span></span>

            <span></span>
          </div>
        </div>
      `,
      errors: [
        { messageId: 'require' },
        { messageId: 'require' },
        { messageId: 'require' },
      ],
    },
    {
      output: `
        <div>
          <Button>{data.label}</Button>
          <List />
        </div>
      `,
      code: `
        <div>
          <Button>{data.label}</Button>

          <List />
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          <Button>{data.label}</Button>
          {showSomething === true && <Something />}
        </div>
      `,
      code: `
        <div>
          <Button>{data.label}</Button>

          {showSomething === true && <Something />}
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          {showSomething === true && <Something />}
          <Button>{data.label}</Button>
        </div>
      `,
      code: `
        <div>
          {showSomething === true && <Something />}

          <Button>{data.label}</Button>
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      code: `
        <div>
          {showSomething === true && <Something />}

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
    },
    {
      output: `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `,
      code: `
        <div>
          <div>
            <button></button>

            <button></button>
          </div>

          <div>
            <span></span>

            <span></span>
          </div>
        </div>
      `,
      errors: [
        { messageId: 'prevent' },
        { messageId: 'prevent' },
        { messageId: 'prevent' },
      ],
      options: [{ prevent: true }],
    },
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      output: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      errors: [{ messageId: 'require' }],
      features: ['fragment'],
    },
    {
      output: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      code: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      errors: [{ messageId: 'prevent' }],
      options: [{ prevent: true }],
      features: ['fragment'],
    },
    {
      code: `
        <>
          <OneLineComponent />
          <AnotherOneLineComponent prop={prop} />
          <MultilineComponent
            prop1={prop1}
            prop2={prop2}
          />
          <OneLineComponent />
        </>
      `,
      output: `
        <>
          <OneLineComponent />
          <AnotherOneLineComponent prop={prop} />

          <MultilineComponent
            prop1={prop1}
            prop2={prop2}
          />

          <OneLineComponent />
        </>
      `,
      features: ['fragment'],
      errors: [
        { messageId: 'allowMultilines' },
        { messageId: 'allowMultilines' },
      ],
      options: [{ prevent: true, allowMultilines: true }],
    },
    {
      code: `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      output: `
        <div>
          {showSomething === true && <Something />}

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      errors: [{ messageId: 'allowMultilines' }],
      options: [{ prevent: true, allowMultilines: true }],
    },
    {
      output: `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>

          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `,
      code: `
        <div>
          <div>
            <button></button>

            <button></button>
          </div>
          <div>
            <span></span>

            <span></span>
          </div>
        </div>
      `,
      errors: [
        { messageId: 'prevent' },
        { messageId: 'allowMultilines' },
        { messageId: 'prevent' },
      ],
      options: [{ prevent: true, allowMultilines: true }],
    },
    {
      code: `
        const frag: DocumentFragment = (
          <Fragment>
            <sni-sequence-editor-tool
              name="forward"
              direction="forward"
              type="control"
              onClick={ () => this.onClickNavigate('forward') }
            />
            <sni-sequence-editor-tool
              name="rotate"
              direction="left"
              type="control"
              onClick={ () => this.onClickNavigate('left') }
            />
    
            <sni-sequence-editor-tool
              name="rotate"
              direction="right"
              type="control"
              onClick={ (): void => this.onClickNavigate('right') }
            />
    
            <div className="sni-sequence-editor-control-panel__delete" data-name="delete" onClick={ this.onDeleteCommand } />
    
            {
              ...Array.from(this.children)
            }
          </Fragment>
        )
      `,
      output: `
        const frag: DocumentFragment = (
          <Fragment>
            <sni-sequence-editor-tool
              name="forward"
              direction="forward"
              type="control"
              onClick={ () => this.onClickNavigate('forward') }
            />

            <sni-sequence-editor-tool
              name="rotate"
              direction="left"
              type="control"
              onClick={ () => this.onClickNavigate('left') }
            />
${'    '}
            <sni-sequence-editor-tool
              name="rotate"
              direction="right"
              type="control"
              onClick={ (): void => this.onClickNavigate('right') }
            />
    
            <div className="sni-sequence-editor-control-panel__delete" data-name="delete" onClick={ this.onDeleteCommand } />
    
            {
              ...Array.from(this.children)
            }
          </Fragment>
        )
      `,
      features: ['types'],
      options: [{ prevent: true, allowMultilines: true }],
      errors: [
        { messageId: 'allowMultilines', line: 10 },
        { messageId: 'prevent', line: 26 },
      ],
    },
  ]),
});
