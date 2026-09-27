File: `CONTRIBUTING.md`
# Contributing

Thank you for contributing. This file describes the preferred PR process, branch naming rules, and CI expectations.

## Branch naming
- Feature: `feature/<ticket>-short-description`
- Bugfix: `bugfix/<ticket>-short-description`
- Hotfix: `hotfix/<ticket>-short-description`
- Chore: `chore/<short-description>`
- Release: `release/<version>`

Use kebab-case for the description and include a tracking ticket id when available.

## Pull request workflow
1. Create a branch from `development-2`.
2. Keep PRs small and focused (one logical change per PR).
3. Push commits using conventional commits (recommended): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
4. Open a PR targeting `development-2`. Include:
  - A short description of the change.
  - Reference to any related issue or ticket.
  - Test or manual verification steps.
5. Assign at least one reviewer and request CI run.
6. Address review feedback, squash or rebase when requested, and merge when CI passes.

## CI / tests
- CI runs `npx nx affected --target=test` and `npx nx affected --target=build` for affected projects.
- Ensure tests and linting pass locally before pushing.
- If you modify shared packages under `packages/`, run full builds or locally test dependents.

## Local development
- Use `npm install` at repository root.
- Use `npx nx serve <project>` or `npx nx build <project>` for per-project dev.
- Keep environment-specific secrets out of the repo; use `.env` files or CI secrets.

## Code review
- Prefer clarity over cleverness.
- Add tests for behavior changes.
- Update documentation and changelogs as needed.

File: `.github/workflows/ci.yml`
name: CI - NX affected

on:
push:
branches:
- development-2
- main
- 'release/**'
pull_request:
branches:
- development-2
- main

jobs:
prepare:
runs-on: ubuntu-latest
outputs:
base-ref: ${{ steps.base.outputs.base }}
steps:
- name: Checkout
uses: actions/checkout@v4
with:
fetch-depth: 0
- name: Determine base ref
id: base
run: |
if [ "${{ github.event_name }}" = "pull_request" ]; then
echo "base=${{ github.event.pull_request.base.ref }}" >> $GITHUB_OUTPUT
else
echo "base=development-2" >> $GITHUB_OUTPUT
fi
- name: Setup Node.js
uses: actions/setup-node@v4
with:
node-version: 18
cache: 'npm'
- name: Install dependencies
run: npm ci

test:
needs: prepare
runs-on: ubuntu-latest
steps:
- name: Checkout
uses: actions/checkout@v4
with:
fetch-depth: 0
- name: Setup Node.js
uses: actions/setup-node@v4
with:
node-version: 18
cache: 'npm'
- name: Install dependencies
run: npm ci
- name: Run affected tests
env:
NX_BASE: ${{ needs.prepare.outputs.base-ref }}
run: |
echo "Running tests for affected projects (base=${NX_BASE})"
npx nx affected --target=test --base=${NX_BASE} --head=${{ github.sha }}

build:
needs: test
runs-on: ubuntu-latest
steps:
- name: Checkout
uses: actions/checkout@v4
with:
fetch-depth: 0
- name: Setup Node.js
uses: actions/setup-node@v4
with:
node-version: 18
cache: 'npm'
- name: Install dependencies
run: npm ci
- name: Run affected build
env:
NX_BASE: ${{ needs.prepare.outputs.base-ref }}
run: |
echo "Running builds for affected projects (base=${NX_BASE})"
npx nx affected --target=build --base=${NX_BASE} --head=${{ github.sha }}

File: `scripts/dev.ps1`
# PowerShell developer helper
# Starts commonly used services in separate terminals for local integration testing.
# Usage: Run this file from the repo root or double-click in Explorer.

param(
[string[]] $Services = @('api','web-ui')
)

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host "Repository root: $root"
foreach ($svc in $Services) {
$cmd = "cd `"$root`"; npx nx serve $svc"
Write-Host "Opening new terminal: serve $svc"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$cmd
}

Write-Host "All requested services started in new PowerShell windows."
