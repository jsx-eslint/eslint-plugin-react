/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  configEmoji: [
    ['jsx-runtime', '🏃'],
    ['recommended', '☑️'],
  ],
  ignoreConfig: ['all', 'flat/all', 'flat/recommended', `flat/jsx-runtime`],
  urlConfigs: 'https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs',
};

module.exports = config;
