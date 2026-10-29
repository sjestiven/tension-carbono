# GitHub Pages deployment

## Prepare the repository

Push the contents of this project root. `package.json`, `package-lock.json`, `src/`, `public/`, and `.github/` must be at the repository root. Avoid an extra containing folder. If using the browser uploader, verify that hidden `.github/` files were included.

The default branch is `main`. The original proposed destination was `sjestiven/tension-carbono`; verify the account, repository, permissions, and history before publishing. The current workspace has no verified public deployment.

```sh
npm ci
npm run check
npm run preview
```

Inspect the production preview. Relative URLs in `vite.config.js` support repository paths such as `/tension-carbono/`. The app has no URL-based client routing and needs no SPA rewrite rule.

## Publish

Git is initialized locally on `main`. The initial commit and remote are still to be created. After verifying the destination, replace `OWNER` and `REPOSITORY` below with the actual repository values:

```sh
git add .
git diff --cached --stat
git commit -m "Prepare Tension de Carbono v2 for GitHub Pages"
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

Use an existing configured author identity or configure the correct identity locally. Do not invent an author or change global Git settings. If a remote or commit already exists when following this guide, inspect it before applying these initial-setup commands.

1. Create or select the intended GitHub repository. Inspect existing content and preserve history if it already exists.
2. Push the source to `main`, including `.github/workflows/pages.yml`.
3. In **Settings > Pages > Build and deployment > Source**, select **GitHub Actions**.
4. Open **Actions > Deploy to GitHub Pages > Run workflow**, selecting `main`. Pushes to `main` also trigger deployment. If the first run preceded Pages configuration, rerun it afterward.
5. Wait for both `build` and `deploy` to succeed. Open the URL reported by the `github-pages` environment.

The workflow installs with `npm ci`, runs `npm run check`, configures Pages, uploads `dist/`, and deploys the artifact. Only deployment receives Pages write and OIDC token permissions. Pull requests and other branch pushes run `ci.yml` without deployment.

Keep `dist/` and `node_modules/` out of Git. Pages must serve the compiled artifact, not uncompiled React source from root or `docs/`. Local archives and reference PDFs are ignored.

## Verify publication

Open the reported URL while signed out. Verify the welcome screen, guide, table creation, complete example, scene or SVG fallback, and `ejemplos/partida_demo_v2.json`. Reference results: 1,345 tCO₂e accumulated emissions, 2,250 t production, and points A 100, B 100, C 75, F1 100, F2 100, government 95.5.

Record repository URL, deployed commit, successful Actions run, actual site URL, and smoke-test results in `docs/VALIDACION.md`. A successful local build does not confirm public deployment.

| Symptom | Check |
| --- | --- |
| Workflow missing | `.github/workflows/` exists at the remote root. |
| Deployment not triggered | Branch is `main` and Actions is enabled. |
| Configure/deploy failure | Pages uses Actions and policies permit Pages/OIDC deployment. |
| Blank page or missing assets | Artifact is `dist/` and asset URLs remain relative. |
| Saved table missing after moving | Browser storage is origin-specific; import its JSON backup. |

Official references: [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
