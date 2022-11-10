'use strict';

module.exports = async function publish({ github, context, core }) {
  const ref = context.payload.inputs.tag;

  console.log(`Checking status checks for ${ref}`);

  const { owner, repo } = context.repo;
  const { default_branch: branch } = context.payload.repository;

  const branchData = github.rest.repos.getBranch({ owner, repo, branch });

  const { data: { check_suites: checkSuites } } = await github.rest.checks.listSuitesForRef({ owner, repo, ref });

  if (checkSuites.some(({ status }) => status === 'completed')) {
    core.setFailed(`Some workflows for ${context.payload.inputs.tag} are still in-progress`);
  }

  const result = await Promise.all(
    (await branchData).data.protection.required_status_checks.checks.map(({ context: check_name }) => (
      github.rest.checks.listForRef({
        owner,
        repo,
        ref,
        check_name,
      })
    )),
  );

  console.log(result);

  const { data: { check_runs: checkRuns } } = result;

  checkRuns.forEach(({ name, status, conclusion }) => {
    if (status !== 'completed' || conclusion !== 'success') {
      console.log(`${name} check failed`);
      core.setFailed(`Required status check ${name} did not succeed`);
    }
    console.log(`${name} check passed`);
  });
};
