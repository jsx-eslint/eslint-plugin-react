# Changesets

Every PR that changes the published package needs a changeset, which becomes the release note in `CHANGELOG.md`.

```sh
pnpm changeset          # choose major / minor / patch and write the summary
pnpm changeset --empty  # for a PR that should not appear in the release notes (CI, docs, ...)
```

See [the Changesets docs](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) for details.
