# Contributing

How to check a change before opening a pull request, how CI judges it, and how a release is
published. CI uses Node 22.

## Checking a change locally

```bash
npm ci
npm run lint          # any warning fails
npm run typecheck
npm run build         # builds lib/ and checks the package (publint, attw)
npm run bundleCheck   # tree-shaking and bundle-size check against bundle-check/baseline
```

Browser tests:

```bash
npm run test:stories:ci   # opens every Storybook story in a browser and fails if one throws
npm run test:leak         # mounts and unmounts the chart-group demo (two 2D charts, one 3D), checks nothing is left in memory
npm run test:docker       # visual and leak tests inside the same Docker image CI uses
```

`test:leak` needs the chart-group demo installed once: `npm --prefix demos/features/chart-group ci`.
The tests start their own servers on `127.0.0.1:6106` (Storybook) and `127.0.0.1:3100` (chart-group
demo); locally they reuse whatever is already running there, so stop anything else on those ports
first.

### Visual tests

Every story is screenshotted and compared with a reference image in `tests/__screenshots__/linux/`.
Screenshots differ slightly from machine to machine, so **only CI records and judges these images**.
Never commit screenshots taken on your own machine.

- `npm run test:docker` runs the tests in CI's image, which is the closest you can get locally. It
  can still differ by a few pixels from CI, for example on an Apple Silicon Mac.
- Running `npm run test:visual` directly on macOS or Windows compares against a separate set for
  that system, kept only on your machine (git ignores it). The first run creates it and fails.

### Updating the reference screenshots

When a change is meant to alter how a story looks:

1. Push the branch. The `browser-tests` job in CI fails on the changed stories.
2. Open the failed run in GitHub Actions and download two artifacts:
   - `playwright-report`: shows each difference. Check that it is the change you intended.
   - `visual-baselines-linux`: the screenshots CI just recorded.
3. Unzip `visual-baselines-linux` into `tests/__screenshots__/linux/`, commit and push.

New stories work the same way: the first run fails because there is no reference image yet.

### Demos

CI builds every demo in `demos/` on each pull request. To build one locally, run `npm run build`
in the repo root first (most demos use the built `lib/`), then in the demo folder:

```bash
npm ci
npm run build             # demos/electron: npm run package
```

`demos/electron` copies `lib/` instead of linking it, so run `npm ci` there again after
rebuilding the library.

## What CI runs

`.github/workflows/ci.yaml`, on every pull request and on pushes to `main`:

| Job | What it does |
| --- | --- |
| `verify` | lint, typecheck, build, bundle-size check |
| `browser-tests` | story smoke tests, visual tests, leak test, inside `mcr.microsoft.com/playwright` |
| `demos` | builds each demo |

The Playwright image tag in `ci.yaml` and `tests/Dockerfile` must match the `@playwright/test`
version in `package.json`. Update all three together.

On every push to `main`, `.github/workflows/deploy.yaml` publishes the Storybook docs to GitHub
Pages.

## Releasing

Releases go through the **Publish to npm** workflow (`.github/workflows/publish.yaml`). Nothing is
published automatically. The branch you run it on decides the npm tag:

| Branch | npm tag | Version |
| --- | --- | --- |
| `alpha` | `alpha` | bumped by the workflow (`x.y.z-alpha.N`) |
| `beta` | `beta` | bumped by the workflow (`x.y.z-beta.N`) |
| `main` | `latest` | set by hand before running |

Before publishing, the workflow runs the install, typecheck, build and bundle-size checks again,
then publishes with npm trusted publishing (no npm token is stored).

### A prerelease (`alpha` or `beta`)

1. Merge the changes into the `alpha` or `beta` branch.
2. Actions → **Publish to npm** → Run workflow → pick the branch.

The workflow raises the prerelease number, commits it to the branch with a `v…` tag, and publishes.

### A release (`latest`)

1. In the pull request into `main`, rename `[Unreleased]` in `CHANGELOG.md` to the new version.
   Merge it.
2. On an up-to-date local `main`, set the version: `npm version <x.y.z>`. This commits `<x.y.z>`
   and tags `v<x.y.z>`. Push both: `git push --follow-tags`.
3. Actions → **Publish to npm** → Run workflow → `main`. It refuses a prerelease version and a
   version that is already on npm.
4. Create a GitHub Release on the tag, with the CHANGELOG entry as its text.
5. Merge `main` into `alpha`, so the next alpha builds on the released version.

Check the result with `npm view scichart-react dist-tags`.
