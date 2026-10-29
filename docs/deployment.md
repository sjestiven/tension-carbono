# GitHub Pages deployment

## Current deployment

- Game: https://sjestiven.github.io/tension-carbono/
- Public repository: https://github.com/sjestiven/tension-carbono
- Latest application release: `6e7173d332acb88329e00efd25eb119037876eef` (guided gameplay, results repair, independent foundation quotes, fixed annual production, and automatic timer).
- Latest verified application deployment: https://github.com/sjestiven/tension-carbono/actions/runs/40872073522
- Latest validation: 46 tests and build passed; all eight live files matched the local build; public results, guide, dashboard, route, and automatic State-cabin timer checked.
- First successful workflow: https://github.com/sjestiven/tension-carbono/actions/runs/40853527263
- Initial application commit: `973756719f87b8bd31226986c44fb8cbd1136b1b`.
- Public browser and asset verification: 29 October 2026 (America/Bogota).

Pages is configured to use GitHub Actions with HTTPS enforced. `origin` points to the public repository and local `main` tracks `origin/main`. Commit attribution uses the account's GitHub noreply address, as requested, without changing global Git identity or account privacy settings.

## Prepare the repository

Push the contents of this project root. `package.json`, `package-lock.json`, `src/`, `public/`, and `.github/` must be at the repository root. Avoid an extra containing folder. If using the browser uploader, verify that hidden `.github/` files were included.

The deployment branch is `main`. The destination is `sjestiven/tension-carbono`. If deploying a separate copy, verify its account, repository, permissions, and history before publishing.

```sh
npm ci
npm run check
npm run preview
```

Inspect the production preview. Relative URLs in `vite.config.js` support repository paths such as `/tension-carbono/`. The app has no URL-based client routing and needs no SPA rewrite rule.

## Publish

For updates in this checkout, review the changes, commit the intended files, and push `main`:

```sh
git status
git diff
git add <intended-paths>
git diff --cached --check
git commit -m "Describe the change"
git push origin main
```

Replace `<intended-paths>` with the actual files to include. Use the configured local author identity. Do not invent an author, change global Git identity, or weaken account email privacy settings.

1. Create or select the intended GitHub repository. Inspect existing content and preserve history if it already exists.
2. Push the source to `main`, including `.github/workflows/pages.yml`.
3. In **Settings > Pages > Build and deployment > Source**, select **GitHub Actions**.
4. Open **Actions > Deploy to GitHub Pages > Run workflow**, selecting `main`. Pushes to `main` also trigger deployment. If the first run preceded Pages configuration, rerun it afterward.
5. Wait for both `build` and `deploy` to succeed. Open the URL reported by the `github-pages` environment.

The workflow installs with `npm ci`, runs `npm run check`, configures Pages, uploads `dist/`, and deploys the artifact. Only deployment receives Pages write and OIDC token permissions. Pull requests and other branch pushes run `ci.yml` without deployment.

Keep `dist/` and `node_modules/` out of Git. Pages must serve the compiled artifact, not uncompiled React source from root or `docs/`. Local archives and reference PDFs are ignored.

## Verify publication

Open the reported URL while signed out. Verify the welcome screen, guide, table creation, complete example, scene or SVG fallback, and `ejemplos/partida_demo_v2.json`. Reference results: 1,345 tCO₂e accumulated emissions, 2,250 t production, and points A 100, B 100, C 75, F1 100, F2 100, government 95.5.

Record repository URL, deployed commit, successful Actions run, actual site URL, and smoke-test results in `docs/VALIDACION.md`. The initial public deployment has been verified; apply the same checks after future application changes.

| Symptom | Check |
| --- | --- |
| Workflow missing | `.github/workflows/` exists at the remote root. |
| Deployment not triggered | Branch is `main` and Actions is enabled. |
| Configure/deploy failure | Pages uses Actions and policies permit Pages/OIDC deployment. |
| Blank page or missing assets | Artifact is `dist/` and asset URLs remain relative. |
| Saved table missing after moving | Browser storage is origin-specific; import its JSON backup. |

Official references: [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
