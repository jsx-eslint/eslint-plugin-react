'use strict';

const execFileSync = require('child_process').execFileSync;

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
  // Using execFileSync with absolute paths prevents PATH-hijacking
  const ls = execFileSync(node, [npmCli, 'ls', 'brace-expansion'], { encoding: 'utf8' });
  if (ls.includes('brace-expansion@1.')) {
    level = 'critical';
  }
} catch (e) {
  // Ignore errors from npm ls (e.g. unmet peer dependencies in dev environment)
}

// Run the npm audit with the calculated severity level
try {
  const env = Object.assign({}, process.env, { npm_config_legacy_peer_deps: 'true' });
  execFileSync(node, [npmCli, 'exec', '--yes', '--', 'npm@>= 10.2', 'audit', '--production', `--audit-level=${level}`], { stdio: 'inherit', env });
} catch (err) {
  const exitCode = typeof err.status === 'number' ? err.status : 1;
  const reason = err.signal ? `killed by signal ${err.signal}` : `exit code ${exitCode}`;
  // eslint-disable-next-line no-console
  console.error(`npm audit failed (${reason}): ${err.message || 'vulnerabilities detected'}`);
  process.exit(exitCode);
}
