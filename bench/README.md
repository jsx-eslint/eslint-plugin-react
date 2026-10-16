# Benchmarks

A separate package of the pnpm workspace, so that its dependencies (e.g. the original `eslint-plugin-react`) stay out of the plugin itself.

```sh
pnpm install          # in the repository root
cd bench
pnpm bench            # all benchmarks
pnpm bench lint       # only lint.bench.mjs
pnpm bench upstream   # only upstream.bench.mjs
```

Each benchmark lints the code in `fixtures/` with the `recommended`, `all` and `all` (TypeScript) configs (see `cases.mjs`).

## `lint.bench.mjs`: no regression

Runs on ESLint 10, and fails when

- it is more than 5% slower than the baseline in `baseline/`, or
- the rules changed since the baseline was measured (`baseline/rules.json`).

The baseline is generated in CI: run the `Benchmark: update baseline` workflow on the branch, for example after adding a rule.
Do not regenerate it locally (`BENCH_WRITE_BASELINE=1`), since the numbers depend on the machine.
Without a baseline, the benchmark only measures.

The results are written to `results/`, and on PRs CI comments the comparison with the base branch ([vitest-bench-compare](https://github.com/ouka-lab/vitest-bench-compare)).

## `upstream.bench.mjs`: faster than the original

Compares this fork with the original [`eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react) on ESLint 9, since the original does not support ESLint 10.
For each config, it first checks that both report exactly the same problems (otherwise the comparison is meaningless), then fails when this fork is not faster.
For `recommended`, which enables only a few rules and where the difference is within the noise, it only fails when this fork is more than 5% slower.
