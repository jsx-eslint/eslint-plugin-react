/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  configEmoji: [
    ['jsx-runtime', '🏃'],
    ['recommended', '☑️'],
  ],
  ignoreConfig: ['all', 'flat'],
  // FIXME: Remove ruleDocSectionOptions once all rule documentation files have an "Options" or "Config" section added.
  ruleDocSectionOptions: false,
  urlConfigs: 'https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs',
};

module.exports = config;
