# Tensión de Carbono

A Spanish-language classroom simulation of a carbon credit market linked to a carbon tax. Three companies, two foundations, and a government negotiate through four annual rounds. Game version: **2.0.0**.

**[Play Tensión de Carbono](https://sjestiven.github.io/tension-carbono/)** · [Source repository](https://github.com/sjestiven/tension-carbono)

## Guided gameplay

The application includes mandatory cabin handoffs, fixed annual production after confirmation, contract cancellation with refunds, both foundation quotes before purchases, USD 0.50 price steps, an opening economy dashboard, a floating year route, and automatic timer start when the government opens its initial cabin. Final-results rendering, contextual Details, a single subsidy field, and confirmed game restart are available. See [the usability review](docs/ux-review.md), [the teaching workflow supplement](docs/teaching-workflow.md), and [the deployment record](docs/VALIDACION.md). For local testing, run `npm run dev` and open the printed URL.

The application runs in the browser. Each table shares one computer, negotiates in person, and saves progress locally or through exported JSON. No backend, accounts, or API keys are required.

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

The role curtain supports sharing a computer; it does not authenticate participants. Export JSON before changing computers or browser origins. There is no multiplayer synchronization or server-side storage. See the teaching guide for the full limitations.

No project redistribution license has been selected. Academic PDF copies remain local references excluded from Git.
