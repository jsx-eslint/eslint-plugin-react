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

let lsOutput = '';
try {
  // Check if brace-expansion@1.x is in the dependency tree
  // Using execFileSync with absolute paths prevents PATH-hijacking (SonarQube javascript:S4036)
  lsOutput = execFileSync(node, [npmCli, 'ls', 'brace-expansion'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
} catch (err) {
  // npm ls exits non-zero if optional peer dependencies are missing in the tree
  lsOutput = err.stdout ? err.stdout.toString() : '';
}

if (lsOutput.includes('brace-expansion@1.')) {
  level = 'critical';
}

// Run the npm audit with the calculated severity level
try {
  const env = Object.assign({}, process.env, { npm_config_legacy_peer_deps: 'true' });
  execFileSync(node, [npmCli, 'exec', '--yes', '--', 'npm@>= 10.2', 'audit', '--production', `--audit-level=${level}`], { stdio: 'inherit', env });
} catch (e) {
  process.exit(typeof e.status === 'number' ? e.status : 1);
}
