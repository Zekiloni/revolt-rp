# Revolt Roleplay (revolt-rp-monorepo)

This repository contains the Revolt-RP monorepo — a multi-package TypeScript/Node.js project that powers the BcrpRage server, client, tooling, and web UI for the roleplay server.

This README provides a technical overview, the repository layout, development and build guidance, and notes on common workflows.

---

## High level overview

- Monorepo managed with NX-style layout (TypeScript + Node). Projects include server and client code, web UI, tooling and game resources.
- Several packages use webpack for bundling; many TypeScript projects live under `packages/` and top-level apps (e.g., `web-ui`, `web-api`, `rage-client`, `rage-server`) have their own build configs.
- The repo also contains native/runtime bits used by the game server (`dev-server/`), and packaged game resources (`game_resources/`, `client_packages/`).

Goals of this document:
- Describe the projects and where to find things
- Provide quick start and common commands for development
- Explain build, run, and deployment notes

---

## Quick start

1. Clone the repo and install dependencies:

   - Windows PowerShell:
     ```powershell
     git clone <repo-url> .
     cd D:\Projects\revolt-rp\revolt-rp-monorepo
     npm install
     ```

2. Build a project (example: `web-ui` or `rage-server`):

   - Using NX or direct npm scripts, example commands:
     ```powershell
     npx nx build web-ui
     npx nx build rage-server
     ```
   - Or run the project in dev mode if available:
     ```powershell
     npx nx serve web-ui
     npx nx serve rage-server
     ```

Notes:
- The repo uses TypeScript project references and workspace-level configuration (`tsconfig.base.json`, `nx.json`). Use `npx nx` where possible to leverage cached builds and affected commands.
- Some projects include Dockerfiles (for example `web-api`, `discord-bot`, `web-ui`) to produce containers for deployment.

---

## Repository structure (top-level)

- `package.json` — root scripts and workspace config.
- `nx.json` — NX workspace configuration.
- `tsconfig.base.json` — base TypeScript configuration for the monorepo.
- `server-config.json` — server runtime config (used by the game server components).
- `dev-server/` — local/game server runtime files used for development (includes `ragemp-server.exe`, native libs and config).
- `client_packages/` — client-side packaged resources and index loader.
- `game_resources/` — shipped game resources, data and dlcpacks.
- `packages/` — shared packages used by other projects (e.g., `common`, `core`, `common-ui`).
- Individual app packages at top-level (each with own `project.json` or `package.json`):
  - `discord-bot/` — Discord integration and bots.
  - `rage-client/` — client-side game code.
  - `rage-server/` — server-side game logic.
  - `rage-ui/` — in-game UI code.
  - `web-api/` — backend APIs and services.
  - `web-ui/` — public website/admin UI.
  - `wiki/` — documentation and guides in Markdown.

Additional directories:
- `logs/` — runtime logs.
- `scripts/` — helper scripts and tooling for maintenance and data generation.
- `tmp/` — temporary build outputs.

---

## Per-project notes

- `packages/common`, `packages/core`: shared TypeScript libraries used across server and client. Keep these stable; changes must preserve public APIs or update dependents.
- `rage-server`: contains server-side TypeScript, likely bundled with webpack. Runtime depends on `dev-server/` native runtime for local testing.
- `rage-client`: client-side logic, built into game resources consumed by the game engine.
- `web-ui`: React (or similar) based UI; includes Tailwind config.
- `web-api`: Node/Express (or similar) API backend used by the web UI and external services.
- `discord-bot`: bot code; check its Dockerfile for deployment specifics.

---

## Development workflow and common commands

Assumptions: npm is used as package manager and `npx nx` is available. If your repo uses `yarn` or `pnpm`, substitute accordingly.

- Install dependencies:
  - `npm install`

- Build everything (root-level):
  - `npx nx run-many --target=build --all`  (or `npm run build` if configured)

- Build a single project:
  - `npx nx build <project>`

- Serve (dev mode) a UI or API locally:
  - `npx nx serve web-ui`
  - `npx nx serve web-api`

- Run tests for a project:
  - `npx nx test <project>`

- Linting / type checks:
  - `npx nx lint <project>`
  - `npx nx affected --target=lint`

- Docker build & run (example for `web-api`):
  - `docker build -f web-api/Dockerfile -t revolt/web-api:latest .`
  - `docker run -p 3000:3000 revolt/web-api:latest`

- Running the game server locally:
  - See `dev-server/` for the `ragemp-server.exe` and `conf.json` used to bootstrap the server. On Windows, run the provided server executable or use the provided `loader.mjs` in `dev-server/bin` when developing.

---

## Configuration and environment

- TypeScript project references are configured from `tsconfig.base.json` and individual `tsconfig.json` files in projects.
- Environment-specific values (ports, API keys, DB connections) should be stored in per-project `.env` files or placed in the process environment. Do not commit secrets to source control.
- `server-config.json` contains server runtime parameters — review before starting production servers.

---

## Tests and CI

- Many projects include their own test setup. Use `npx nx test <project>` or the package-level npm scripts.
- CI should run: install, lint, typecheck, build affected projects, and run tests. Consider using NX caching for faster CI runs.

---

## Notes about game resources

- `game_resources/` and `client_packages/` contain assets and packaged resources consumed by the game client.
- DLC packs live under `game_resources/dlcpacks`.
- Some large binary files are committed (e.g., `dlc.rpf`) — consider using Git LFS if you plan to change large binaries frequently.

---

## Contributing

- Keep changes small and scoped to a single logical unit.
- Update `packages` shared libraries carefully; run full builds and tests of dependents.
- Follow existing linting and formatting conventions.
- When adding large assets, document their origin and license.

---

## Useful files

- `nx.json` — workspace config for NX
- `tsconfig.base.json` — base TypeScript config
- `package.json` (root and per-project) — scripts and dependencies
- `Dockerfile` and per-project Dockerfiles for containerization
- `server-config.json` — server runtime configuration

---

## Next steps / suggestions

- Add a short `CONTRIBUTING.md` with preferred PR process and branch naming rules.
- Add CI workflow templates that run `npx nx affected --target=test` and `--target=build`.
- Consider adding a developer script (e.g., `scripts/dev.sh` or a PowerShell equivalent) that starts commonly used services together for local integration testing.

---

If you'd like, I can:
- Generate a `CONTRIBUTING.md` and a sample CI workflow (GitHub Actions) tailored for this monorepo.
- Inspect `package.json` and project-specific configs to produce exact dev commands and npm scripts.
