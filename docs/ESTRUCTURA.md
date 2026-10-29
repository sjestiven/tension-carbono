# Repository structure

The application is extracted directly into the workspace root. See the root README for the current directory tree. The original 29-file package and checksum manifest remain unchanged in ignored `archive/`; that manifest does not describe the edited working tree.

| Location | Contents |
| --- | --- |
| `.github/workflows/ci.yml` | Pull request and non-main branch validation. |
| `.github/workflows/pages.yml` | Main-branch build and Pages deployment. |
| `.editorconfig`, `.gitattributes`, `.nvmrc` | Editor, line-ending, and Node configuration. |
| `AGENTS.md`, `CONTRIBUTING.md` | Maintenance and contribution instructions. |
| `src/` | Existing interface, engine, scene, and source example. |
| `public/` | Favicon and importable example for the build. |
| `tests/` | Node test suite. |
| `docs/development.md` | Local setup and verification. |
| `docs/architecture.md` | Responsibilities and state flow. |
| `docs/deployment.md` | Publication and live verification. |
| `docs/REGLAS.md` | Current Spanish game rules. |
| `docs/VALIDACION.md`, `docs/CAMBIOS.md` | Validation and change history. |
| `docs/Instructivo_Academico_Tension_de_Carbono_v2.docx` | Current teaching guide. |
| `docs/antecedentes/` | Preserved historical documents and interpretation notice. |
| `docs/references/` | Bibliography and ignored PDF copies. |
| `CONTEXTO_PARA_CODEX.md` | Original handoff snapshot. |
| `archive/` | Ignored original ZIP and checksum manifest. |
| `node_modules/`, `dist/` | Ignored installed dependencies and production build. |

Pages publishes `dist/`, not the repository root. Original application and academic source filenames were preserved during extraction.
