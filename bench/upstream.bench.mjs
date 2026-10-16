// Compares this fork with the original eslint-plugin-react, linting the same code with the same configs.
//
// Both run on ESLint 9 (`eslint-v9`), since the original does not support ESLint 10
// (e.g. its `all` config throws there). Before measuring, each case checks that both report exactly
// the same problems: otherwise one may be faster only because it does less work.

import { createRequire } from 'node:module';

import { expect, test } from 'vitest';
import ours from '@ysknsid25/eslint-plugin-react';
import upstream from 'eslint-plugin-react';

import { cases } from './cases.mjs';

const { Linter } = createRequire(import.meta.url)('eslint-v9');

// skips the comparison (used by `vitest-bench-compare`, which only collects the results)
const NO_ASSERT = !!process.env.BENCH_NO_ASSERT;

// `recommended` enables only a few rules, so the difference is within the noise (~1%):
// only check that it is not more than 5% slower there. The other configs have to be faster.
const NOT_SLOWER_ONLY = new Set(['recommended']);
const ALLOWED_REGRESSION = 0.05;

const linter = new Linter();

const ourCases = cases(ours);
const upstreamCases = cases(upstream);

function problemsOf(fixture, config) {
  return linter.verify(fixture.code, config, fixture.filename)
    .map((problem) => `${problem.ruleId} ${problem.line}:${problem.column} ${problem.messageId || problem.message}`);
}

ourCases.forEach(({ name, fixtures, config }, index) => {
  const upstreamConfig = upstreamCases[index].config;

  test(`${name}: reports the same problems as the original`, () => {
    fixtures.forEach((fixture) => {
      expect(problemsOf(fixture, config), fixture.filename).toEqual(problemsOf(fixture, upstreamConfig));
    });
  });

  const title = NOT_SLOWER_ONLY.has(name) ? 'is not slower than the original' : 'is faster than the original';

  test(`${name}: ${title}`, { retry: 2 }, async ({ bench }) => {
    // consumed after the benchmark so that the work can not be optimized away
    let problems = 0;
    const lint = (lintConfig) => () => {
      fixtures.forEach((fixture) => {
        problems += linter.verify(fixture.code, lintConfig, fixture.filename).length;
      });
    };

    const result = await bench.compare(
      bench(`${name} (this fork)`, lint(config)),
      bench(`${name} (eslint-plugin-react)`, lint(upstreamConfig)),
    );

    const fork = result.get(`${name} (this fork)`);
    const original = result.get(`${name} (eslint-plugin-react)`);
    if (NO_ASSERT) {
      // only measure
    } else if (NOT_SLOWER_ONLY.has(name)) {
      expect(fork).not.toBeSlowerThan(original, { delta: ALLOWED_REGRESSION });
    } else {
      expect(fork).toBeFasterThan(original);
    }
    expect(problems).toBeGreaterThan(0);
  });
});
