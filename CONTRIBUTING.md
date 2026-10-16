# Contributing to `@ysknsid25/eslint-plugin-react`

## Setup

This repository uses [pnpm](https://pnpm.io/) only: its version is pinned in `devEngines.packageManager` of `package.json`, and `npm install` / `npm run` fail on purpose.
The development dependencies need Node.js `^22.22.2` or `>=24.15.0`.

```sh
pnpm install
```

New versions of dependencies are installed only after 2 weeks (`minimumReleaseAge` in `pnpm-workspace.yaml`).

## Commands

| Command | Description |
| --- | --- |
| `pnpm lint` | markdownlint, `eslint-doc-generator --check`, ESLint and `tsc` |
| `pnpm lint:fix` | Format the code with [`@stylistic/eslint-plugin`](https://eslint.style/) (`eslint --fix`) |
| `pnpm test` | Run the tests with Vitest, with coverage |
| `pnpm update:eslint-docs` | Regenerate the rule docs and the rules list in `README.md` from the rules' `meta` |
| `pnpm changeset` | Add a changeset (see below) |

The benchmarks are a separate package in [`bench/`](bench/README.md).

## Pull Requests

- Every PR needs a [changeset](.changeset/README.md), which becomes the release note in `CHANGELOG.md`. Use `pnpm changeset --empty` for changes that should not appear in the release notes (CI, docs, ...).
- On PRs, CI applies `pnpm lint:fix` and `pnpm update:eslint-docs` and commits the result, so formatting and generated docs do not need to be fixed by hand.
- CI also runs the tests on ESLint 9 and 10 and on Node.js 22, 24 and 26, checks the published types, and comments the coverage and the benchmark results on the PR.
- A PR fails when it makes the benchmarks more than 5% slower than the baseline. When a change is expected to change the performance (e.g. adding a rule), run the `Benchmark: update baseline` workflow on the branch.

## `eslint` Rules

### Markup

Files documenting individual rules live in docs/rules folder. They're annotated
using Markdown, which adds extra layer of legibility and better visual orientation
to the documents. Consider this when writing supporting text for the rules.

See the list below for some guidelines that need to be followed when adding to the
collection.

- Negative adverbs preceding snippets in 'Rule Details' sections must be **bold**.
