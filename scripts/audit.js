'use strict';

// FIXME: update to node:child_process when Node < 14 support is dropped (resolves Sonar S7772)
const execFileSync = require('child_process').execFileSync; // NOSONAR

let level = 'high';

// process.execPath is the absolute path to the node executable
// process.env.npm_execpath is the absolute path to the npm-cli.js script (when run via npm)
const node = process.execPath;
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  // eslint-disable-next-line no-console
  console.error('This script must be run via npm.');
  process.exit(1);
}

try {
  // Check if brace-expansion@1.x is in the dependency tree
  // Using execFileSync with absolute paths prevents PATH-hijacking (SonarQube javascript:S4036)
  const ls = execFileSync(node, [npmCli, 'ls', 'brace-expansion'], { encoding: 'utf8' });
  if (ls.includes('brace-expansion@1.')) {
    // FIXME: remove this conditional when brace-expansion@1.x is no longer in the dependency tree // NOSONAR
    level = 'critical';
  }
} catch (e) {
  // FIXME: remove this exclusion when we no longer need to swallow missing peer dep errors from npm ls
  // Ignore errors from npm ls
  // NOSONAR
}

// Run the npm audit with the calculated severity level
try {
  const env = Object.assign({}, process.env, { npm_config_legacy_peer_deps: 'true' });
  execFileSync(node, [npmCli, 'exec', '--yes', '--', 'npm@>= 10.2', 'audit', '--production', `--audit-level=${level}`], { stdio: 'inherit', env });
} catch (e) {
  // FIXME: remove this exclusion when we no longer need to silently exit without handling the error object
  process.exit(1); // NOSONAR
}
