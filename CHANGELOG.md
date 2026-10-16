# @ysknsid25/eslint-plugin-react

## 1.0.0

### Major Changes

- A release for everyone who has been unable to upgrade their ESLint version because `jsx-eslint/eslint-plugin-react` does not support ESLint 10.

  This is the first release of `@ysknsid25/eslint-plugin-react`, a fork of [`jsx-eslint/eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react) based on its `master` after 7.37.5.
  The rules are the same, registered under the same `react/` namespace (e.g. `react/jsx-key`), and report the same problems as the original.

#### Breaking changes compared to `eslint-plugin-react` 7.37.5

- The package is published as `@ysknsid25/eslint-plugin-react`.
- ESLint `^9.7` or `^10` is required (ESLint 3 to 8 are no longer supported).
- Node.js 22 or later is required.
- Only the flat config (`eslint.config.js`) is supported: the legacy `.eslintrc*` configs refer to the plugin as `react`, which resolves to the original package.
- The rules' legacy `meta.docs.category` is removed.

#### ESLint 10 support

- `SourceCode#isSpaceBetweenTokens()` and `SourceCode#getJSDocComment()`, which were removed in ESLint 10, are replaced with implementations in this plugin, keeping the behavior of ESLint 9.
  With the original on ESLint 10, the `all` config throws, and components declared with a JSDoc `@extends React.Component` silently stop being detected.
- The plugin has `meta` (`name`, `version` and `namespace`), as recommended for ESLint 9+ plugins.
- The deprecated APIs of the rule context (e.g. `context.getSourceCode()`) are not used anymore.

#### Performance

- Faster than the original: ~12% with the `all` config and ~9% with `all` on TypeScript code, and about the same with `recommended` (measured on ESLint 9, see the Benchmarks of the README).

#### Dependencies and package size

- The runtime dependencies are reduced from 18 to 3 (`estraverse`, `minimatch` and `semver`): 7 installed packages instead of 124, and ~85% smaller install (1.07 MB instead of 7.32 MB).
  - Polyfills (`array-includes`, `array.prototype.findlast`, `array.prototype.flatmap`, `array.prototype.tosorted`, `es-iterator-helpers`, `hasown`, `object.entries`, `object.fromentries`, `object.values`, `string.prototype.matchall`, `string.prototype.repeat`) are replaced with the native APIs of Node.js 22.
  - The needed part of `jsx-ast-utils` is included in the plugin (MIT, with its tests), without its polyfills.
  - `resolve` is replaced with `require.resolve()`, the archived `doctrine` with a small parser of the `@extends` / `@augments` JSDoc tags, and `prop-types` with the list of its validator names.
- The published package is smaller than the original (unpacked: 923 KB instead of 938 KB): declaration maps and internal type declarations are not published anymore.

#### Supply chain security

- Dependabot updates the npm packages and the GitHub Actions every week, with a 2 weeks cooldown. pnpm also installs new versions only after 2 weeks (`minimumReleaseAge`), and CI installs with a frozen lockfile.
- Every GitHub Action is pinned to a full commit SHA, and the workflows run with the minimum `permissions`.
- Releases are published with npm staged publishing, and go live only after they are approved with 2FA.

#### Development

- pnpm only, TypeScript 6, ESLint 10 with flat config, `@stylistic/eslint-plugin` as the formatter, Vitest 5 and Changesets.
- CI tests on ESLint 9 and 10 and on Node.js 22, 24 and 26, checks the published types on TypeScript 5.0 to 6.0, applies `pnpm lint:fix` and regenerates the rule docs on PRs, and comments the coverage on PRs.
- Benchmarks with Vitest Bench (in `bench/`): CI fails when a PR is more than 5% slower than the baseline or not faster than the original, and comments the comparison with the base branch.

#### Changes of `eslint-plugin-react` since 7.37.5

These changes of the original are not released there yet, and are included in this release (see [CHANGELOG.upstream.md](CHANGELOG.upstream.md)).

#### Added

- `async-server-action`: add rule ([#3729](https://github.com/jsx-eslint/eslint-plugin-react/pull/3729) by @jorgezreik)
- `jsx-props-no-multi-spaces`: improve autofix for multi-line ([#3930](https://github.com/jsx-eslint/eslint-plugin-react/pull/3930) by @justisb)
- `jsx-handler-names`: support namespaced component names ([#3943](https://github.com/jsx-eslint/eslint-plugin-react/pull/3943) by @takuji)
- `jsx-no-leaked-render`: add `ignoreAttributes` option ([#3441](https://github.com/jsx-eslint/eslint-plugin-react/pull/3441) by @aleclarson)
- `jsx-sort-props`: add `sortFirst` option ([#3965](https://github.com/jsx-eslint/eslint-plugin-react/pull/3965) by @loderunner)
- `jsx-no-literals`: add `restrictedAttributes` option ([#3950](https://github.com/jsx-eslint/eslint-plugin-react/pull/3950) by @ushiboy)
- `forbid-dom-props`: Add `disallowedValues` option for forbidden props ([#3877](https://github.com/jsx-eslint/eslint-plugin-react/pull/3877) by @makxca)

#### Fixed

- `jsx-no-literals`: avoid crash on variable declarations without an initializer ([#4044](https://github.com/jsx-eslint/eslint-plugin-react/pull/4044) by @Aryan007-dev)
- `no-unknown-property`: allow `onLoad` on `body` ([#3923](https://github.com/jsx-eslint/eslint-plugin-react/pull/3923) by @DerekStapleton)
- `no-unknown-property`: allow `closedby` on `dialog` ([#3980](https://github.com/jsx-eslint/eslint-plugin-react/pull/3980) by @ljharb)
- `no-unknown-property`: add `onScrollEnd` and `onScrollEndCapture` events as known properties ([#3958](https://github.com/jsx-eslint/eslint-plugin-react/pull/3958) by @xfeeefeee)
- Remove extra space from CLI warning ([#3942](https://github.com/jsx-eslint/eslint-plugin-react/pull/3942) by @junaidkbr)
- `jsx-key`: detect missing keys in return statement with ternary operator ([#3928](https://github.com/jsx-eslint/eslint-plugin-react/pull/3928) by @hyeonbinHur)
- `jsx-key`: detect missing keys in logical expressions ([#3986](https://github.com/jsx-eslint/eslint-plugin-react/pull/3986) by @yalperg)
- `display-name`: avoid false positive when React is shadowed ([#3926](https://github.com/jsx-eslint/eslint-plugin-react/pull/3926) by @hyeonbinHur)
- `no-unused-prop-types`: detect used props in nested components ([#3955](https://github.com/jsx-eslint/eslint-plugin-react/pull/3955) by @avaice)
- `no-unknown-property`: add missing CSS transition event handlers ([#4001](https://github.com/jsx-eslint/eslint-plugin-react/pull/4001) by @baevm)
- `jsx-closing-bracket-location`: preserve comments in autofix ([#4028](https://github.com/jsx-eslint/eslint-plugin-react/pull/4028) by @raisulchowdhury)
- `jsx-closing-bracket-location`: keep TS type arguments when autofixing (by @ljharb)
- `jsx-closing-bracket-location`: say "on the next line" when a comment shares the closing bracket's line (by @ljharb)
- `sort-prop-types`: keep comments on the opening brace's line in place when autofixing (by @ljharb)
- `sort-prop-types`: preserve comments and separators in autofix ([#4029](https://github.com/jsx-eslint/eslint-plugin-react/pull/4029) by @raisulchowdhury)
- `jsx-no-leaked-render`: autofix `cond ? false : alternate` to `!cond && alternate` with correct negation and parentheses (by @ljharb)
- `jsx-no-leaked-render`: preserve ternary alternates when autofixing to coerce ([#4017](https://github.com/jsx-eslint/eslint-plugin-react/pull/4017) by @morgan-coded)
- `require-default-props`: handle function components wrapped in `memo`/`forwardRef` ([#4046](https://github.com/jsx-eslint/eslint-plugin-react/pull/4046) by @badukucuk)
- `no-unknown-property`: allow `transform-origin` on all transformable SVG elements ([#4047](https://github.com/jsx-eslint/eslint-plugin-react/pull/4047) by @ozenyunus35)

#### Changed

- `react-in-jsx-scope`, `jsx-uses-react`: automatically disable when React >= 19 is detected (by @jonkoops)
- Docs: `no-array-index-key`: add template literal examples ([#3978](https://github.com/jsx-eslint/eslint-plugin-react/pull/3978) by @akahoshi1421)
- `jsx-filename-extension`: include allowed extensions in message ([#4043](https://github.com/jsx-eslint/eslint-plugin-react/pull/4043) by @aduth)
- Docs: `hook-use-state`: clarify destructuring requirement ([#4030](https://github.com/jsx-eslint/eslint-plugin-react/pull/4030) by @raisulchowdhury)
- Refactor: `Components`: add `getWrappedComponentNode` util (by @ljharb)

## Before the fork

The release notes of this fork are generated by [Changesets](https://github.com/changesets/changesets).
For the history before the fork, see [CHANGELOG.upstream.md](CHANGELOG.upstream.md) (the changelog of [`jsx-eslint/eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react)).
