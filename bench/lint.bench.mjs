// Benchmarks linting React code with this plugin's shareable configs (on ESLint 10).
//
// - The result of every run is written to `results/` (not committed), which
//   `ouka-lab/vitest-bench-compare` compares between the base branch and the PR in CI.
// - The baseline in `baseline/` (committed) is generated in CI by the `Benchmark: update baseline`
//   workflow (`BENCH_WRITE_BASELINE=1`). A run fails when it is more than 5% slower than the baseline.
//   Do not regenerate the baseline locally: the numbers depend on the machine.
// - The baseline also records the rules it was measured with (`baseline/rules.json`): adding or removing
//   a rule changes the cost of the `all` configs, so the baseline has to be regenerated when the rules change.

import fs from 'node:fs';
import path from 'node:path';

import { Linter } from 'eslint';
import { expect, test } from 'vitest';
import plugin from '@ysknsid25/eslint-plugin-react';

import { cases } from './cases.mjs';

const WRITE_BASELINE = !!process.env.BENCH_WRITE_BASELINE;
// skips the comparison with the baseline (used by `vitest-bench-compare`, which compares by itself)
const NO_ASSERT = !!process.env.BENCH_NO_ASSERT;
const ALLOWED_REGRESSION = 0.05;

const baselineDir = path.join(import.meta.dirname, 'baseline');
const baselineRulesPath = path.join(baselineDir, 'rules.json');
const ruleNames = Object.keys(plugin.rules).sort();
const hasBaseline = fs.existsSync(baselineRulesPath);

const linter = new Linter();

if (WRITE_BASELINE) {
  fs.mkdirSync(baselineDir, { recursive: true });
  fs.writeFileSync(baselineRulesPath, `${JSON.stringify(ruleNames, null, 2)}\n`);
} else if (hasBaseline && !NO_ASSERT) {
  test('the baseline was measured with the current rules', () => {
    const baselineRules = JSON.parse(fs.readFileSync(baselineRulesPath, 'utf8'));
    const added = ruleNames.filter((rule) => !baselineRules.includes(rule));
    const removed = baselineRules.filter((rule) => !ruleNames.includes(rule));
    expect(
      { added, removed },
      'The rules changed since the baseline was measured. Run the "Benchmark: update baseline" workflow on this branch.',
    ).toEqual({ added: [], removed: [] });
  });
}

cases(plugin).forEach(({ name, fixtures, config }) => {
  // consumed after the benchmark so that the work can not be optimized away
  let problems = 0;
  const lintFixtures = () => {
    fixtures.forEach((fixture) => {
      problems += linter.verify(fixture.code, config, fixture.filename).length;
    });
  };

  test(name, { retry: 2 }, async ({ bench }) => {
    const baselinePath = `./baseline/${name}.json`;
    const current = bench(
      name,
      { writeResult: WRITE_BASELINE ? baselinePath : `./results/${name}.json` },
      lintFixtures,
    );

    if (WRITE_BASELINE || NO_ASSERT || !hasBaseline) {
      await current.run();
    } else {
      const result = await bench.compare(current, bench.from('baseline', baselinePath));
      expect(result.get(name)).not.toBeSlowerThan(result.get('baseline'), { delta: ALLOWED_REGRESSION });
    }

    expect(problems).toBeGreaterThan(0);
  });
});
