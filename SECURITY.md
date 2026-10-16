# Security Policy

## Supported Versions

Security updates are provided for the latest release of `@ysknsid25/eslint-plugin-react`.

| Version  | Supported          |
| -------- | ------------------ |
| 1.x      | :white_check_mark: |

The supported environments are ESLint `^9.7` and `^10`, and Node.js 22 or later.

Vulnerabilities of the original [`eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react) (7.x and earlier) should be reported to that project.

## Reporting a Vulnerability

To report a security vulnerability, please [file a private vulnerability report via GitHub](https://github.com/ouka-lab/eslint-plugin-react/security/advisories/new).
Please do not open a public issue for it.

## Supply Chain Security

- **Dependencies**: Dependabot updates the npm packages and the GitHub Actions every week. New versions are installed only after a 2 weeks cooldown (pnpm `minimumReleaseAge` and Dependabot `cooldown`), and CI installs with a frozen lockfile.
- **GitHub Actions**: every action is pinned to a full commit SHA, and the workflows run with the minimum `permissions`.
- **Releases**: packages are published with npm [staged publishing](https://docs.npmjs.com/staged-publishing/), so a release goes live only after it is approved with 2FA. The release workflow runs with [harden-runner](https://github.com/step-security/harden-runner).
