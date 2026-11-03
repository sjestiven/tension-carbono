# Tensión de Carbono

A Spanish-language classroom simulation of a carbon credit market linked to a carbon tax. Three companies, two foundations, and a government negotiate through up to four annual rounds. Application version **3.1.2**. Economic rules **3.1.0**.

**[Play Tensión de Carbono](https://sjestiven.github.io/tension-carbono/)** · [Source repository](https://github.com/sjestiven/tension-carbono)

## Guided gameplay

The game opens at home and returns there after a confirmed restart. Annual timers offer 12, 8, or 4 minutes. Closing a year with accumulated physical emissions above 1,400 tCO2e immediately ends the game with collective defeat and opens final results; exactly 1,400 does not trigger defeat. Version 2.0 exports remain importable and are migrated to the first terminal round after their full logs are validated.

New games use binding batch offers: both foundations quote, all companies submit, and foundations compare buyers before accepting whole offers. The engine reserves company cash and compensation capacity, checks solvency for every acceptance subset, and settles once. Drafts can be withdrawn; accepted contracts are final. Empty seller turns are skipped. Production and purchase previews distinguish after-tax profit, immediate cash, and tax savings. A compact policy balance and autumn climate accents connect decisions to collective results. Historical 2.x exports retain bilateral cancellation/refund rules. See [the teaching workflow](docs/teaching-workflow.md), [the design evaluation](docs/gameplay-design-review.md), and [validation](docs/VALIDACION.md). For local testing, run `npm run dev` and open the printed URL.

The application runs in the browser. Each table shares one computer, negotiates in person, and saves progress locally or through exported JSON. Core play works without a backend. Optional Supabase research collection requests six student codes, uses private tables and team opt-in, and retains pending uploads without blocking decisions. See [research setup](docs/research-setup.md) and [private analysis queries](supabase/analysis.sql).

## Quick start

Use Node.js 22 or later and npm. `.nvmrc` selects Node.js 22 for development and GitHub Actions. Run commands from this directory:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Source `index.html` requires Vite or a compiled HTTP-served build; do not open it directly.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm test` | Run engine and distributed example tests. |
| `npm run build` | Generate the production site in `dist/`. |
| `npm run check` | Run tests and compile the production site. |
| `npm run preview` | Serve the existing production build locally. |

Scripts bind to `127.0.0.1`. For a trusted classroom network, explicitly append `-- --host 0.0.0.0` to the dev or preview command.

## Project structure

```text
.
├── .github/workflows/       # Validation and GitHub Pages deployment
├── docs/
│   ├── architecture.md     # Code responsibilities and state flow
│   ├── deployment.md       # Publication and live verification
│   ├── development.md      # Local setup and verification
│   ├── references/         # Bibliography and ignored local PDFs
│   ├── antecedentes/       # Preserved historical documents
│   └── ...                 # Current Spanish rules and teaching guide
├── public/                 # Public assets copied into the site
├── src/                    # React interface, engine, and 3D scene
├── tests/                  # Automated tests
├── archive/                # Ignored original ZIP and checksum manifest
├── AGENTS.md
├── CONTRIBUTING.md
├── CONTEXTO_PARA_CODEX.md   # Original handoff snapshot
├── package.json
├── package-lock.json
└── vite.config.js
```

Dependencies, generated `dist/`, original archives, and local reference PDFs are excluded from Git. Only compiled assets and files from `public/` become the production site. Existing source code and academic source filenames are preserved.

## Publish to GitHub Pages

1. Push this directory's contents to a GitHub repository on branch `main`. Keep `package.json`, `src/`, and `.github/` at the repository root.
2. In **Settings > Pages > Build and deployment**, select **GitHub Actions** as the source.
3. Run **Actions > Deploy to GitHub Pages > Run workflow**, or push a change to `main`.
4. Wait for both jobs to succeed and open the deployment's reported URL.

The workflow installs locked dependencies, tests, builds, and deploys `dist/`. Relative asset URLs support repository subdirectories. Pull requests and other branch pushes validate without deployment. See the [deployment guide](docs/deployment.md).

**Publication status:** public on GitHub Pages and verified on 29 October 2026 (America/Bogota). [The first successful deployment](https://github.com/sjestiven/tension-carbono/actions/runs/40853527263) passed all 32 tests and the production build. The live site was checked for table creation, guide access, WebGL rendering, and the complete example results. All eight published files matched the verified local build. See [validation evidence](docs/VALIDACION.md) for scope and limits.

## Documentation

- [Current rules](docs/REGLAS.md)
- [Current academic teaching guide](docs/Instructivo_Academico_Tension_de_Carbono_v2.docx)
- [Local guided workflow teaching supplement](docs/teaching-workflow.md)
- [Validation evidence and limits](docs/VALIDACION.md)
- [Changes from the earlier prototype](docs/CAMBIOS.md)
- [Historical document notice](docs/antecedentes/LEER_PRIMERO.md)
- [Development guide](docs/development.md) and [architecture](docs/architecture.md)

The current engine and version 2 rules are authoritative. The root handoff and historical documents preserve earlier decisions; setup instructions and inventories in those snapshots may predate this layout.

## Scope

The game separates project financing, verified reductions, credit trading, retirement, tax accounting, and physical emissions. Parameters are educational assumptions; verification does not implement real additionality, permanence, leakage, or certification.

The role curtain supports sharing a computer; it does not authenticate participants. Export JSON before changing computers or browser origins. There is no multiplayer synchronization; optional research collection uses private server-side storage. See the teaching guide for the full limitations.

No project redistribution license has been selected. Academic PDF copies remain local references excluded from Git.

## Shared-computer release 3.1

New tables automatically apply valid zero-contribution agreements, skip impossible market steps, and settle the year when all sales finish. Teacher execution and two explicit lot-verification choices share one form; positive public grants retain State approval. Existing 3.0 and 2.x exports retain their original procedures. Six lightweight avatars, nonblocking settlement receipts, optional short motion, on-demand rendering, and stronger supporting-text contrast keep the decision cabin primary. See `docs/interface-design-review.md` and `docs/shared-computer-flow-and-motion.md` for evidence and limitations.
