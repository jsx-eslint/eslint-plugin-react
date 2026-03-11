import '@eslint/core';

declare module '@eslint/core' {
  interface SettingsConfig {
    react?: {
      pragma?: string;
      fragment?: string;
      createClass?: string;
    };
  }
}

export {};
