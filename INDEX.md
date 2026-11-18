# INDEX.md

File map of `asl-docs` for AI agents: where each thing lives and what to touch for a given task. Rules and commands are in [AGENTS.md](AGENTS.md); update this file when files are added, moved or removed.

## Content (every page exists in English and Portuguese)

| English (default) | Portuguese (pt-BR) | Topic |
| --- | --- | --- |
| `docs/intro.md` | `i18n/pt/docusaurus-plugin-content-docs/current/intro.md` | Introduction |
| `docs/why.md` | `.../why.md` | Why ASL |
| `docs/aac-vs-diagram-as-code.md` | `.../aac-vs-diagram-as-code.md` | Architecture as code vs diagram as code |
| `docs/architecture.md` | `.../architecture.md` | How ASL works |
| `docs/cli.md` | `.../cli.md` | The `asl` CLI |
| `docs/custom-schemas.md` | `.../custom-schemas.md` | Custom schemas |
| `docs/custom-policies.md` | `.../custom-policies.md` | Custom policies |
| `docs/deprecation.md` | `.../deprecation.md` | Deprecating kinds and fields |
| `docs/javascript.md` | `.../javascript.md` | JavaScript SDK |
| `docs/vscode-extension.md` | `.../vscode-extension.md` | VS Code extension |
| `docs/faq.md` | `.../faq.md` | FAQ |
| `docs/use-cases/*.mdx` (designing, developing, diagram-editor, interpreting, pci-scope) | `.../use-cases/*.mdx` | Use cases (render `<UseCase id>`) |

Sidebar order and labels: `sidebars.ts` (English) and `i18n/pt/docusaurus-plugin-content-docs/current.json` (labels in Portuguese).

## Site code

| Path | What it is |
| --- | --- |
| `docusaurus.config.ts` | Site config: navbar, footer, locales, search, Mermaid, `SITE_URL`/`BASE_URL` |
| `sidebars.ts` | Docs sidebar |
| `src/pages/index.tsx` | Home page; all copy in the `COPY` object (en + pt) |
| `src/pages/styles.module.css` | Home styles |
| `src/pages/playground.tsx`, `playground.module.css` | `/playground` page |
| `src/css/custom.css` | Global tokens (`--asl-*`), navbar, buttons, mobile menu |
| `src/css/docs.css` | Docs-only styles (sidebar, article, tables, admonitions, TOC) |
| `src/components/Playground` | In-browser editor running the compiler (WASM) |
| `src/components/PlaygroundLink` | Navbar link to the playground |
| `src/components/UseCases` | `UseCase` demos (`demos.tsx`), copy and real outputs (`data.ts`) |
| `src/components/LocaleSwitch`, `GithubLink`, `ThemeSwitch` | Navbar items (theme switch is dormant) |
| `src/components/ZoomImage` | Click-to-zoom image |
| `src/components/Terminal` | Animated terminal (currently unused) |
| `src/theme/MDXComponents.tsx` | Registers components usable in `.mdx` |
| `src/theme/NavbarItem/ComponentTypes.tsx` | Registers the custom navbar items |
| `src/theme/Mermaid` | Mermaid wrapper with fullscreen button |
| `src/theme/prismTheme.ts`, `prismThemeLight.ts` | Code highlight themes (light is dormant) |
| `src/theme/prism-include-languages.ts` | Defines the `asldiag` language |
| `src/data/architecture.ts` | Dark copy of the compiler's architecture diagram |
| `src/lib/asl/` | JS wrapper and `wasm_exec.js` for the WASM compiler |
| `src/clientModules/preloadSearch.ts` | Preloads the local search index |
| `static/` | Favicon and logo (`img/`), `asl/asl.wasm.gz`, `CNAME`, `.nojekyll` |

## Translations (pt-BR)

| Path | Holds |
| --- | --- |
| `i18n/pt/code.json` | Strings from `src/` (components, pages) |
| `i18n/pt/docusaurus-theme-classic/navbar.json`, `footer.json` | Navbar and footer |
| `i18n/pt/docusaurus-plugin-content-docs/current.json` | Sidebar labels |

## Repository tooling

| Path | What it is |
| --- | --- |
| `.github/workflows/deploy.yml` | Build both locales and publish to GitHub Pages on push to `main` |
| `.github/workflows/pr.yml` | PR checks: Conventional Commit title, typecheck, build (en + pt) |
| `.github/ISSUE_TEMPLATE/` | Issue forms (`bug_report.yml`, `feature_request.yml`, `config.yml`) |
| `.github/pull_request_template.md` | PR description and checklist |
| `.husky/commit-msg`, `commitlint.config.mjs` | Local Conventional Commits check |
| `package.json`, `tsconfig.json` | Scripts, dependencies, TypeScript config |
| `AGENTS.md`, `CLAUDE.md` | Agent guidance (edit through a background agent) |

## Where to start

| Task | Files |
| --- | --- |
| Edit a docs page | the `docs/` file **and** its pt twin |
| Add a docs page | both files, `sidebars.ts`, `current.json`, then this index |
| Change home copy | `COPY.en` and `COPY.pt` in `src/pages/index.tsx` |
| Change colors or typography | `src/css/custom.css` tokens |
| Add a navbar item | `docusaurus.config.ts`, `src/theme/NavbarItem/ComponentTypes.tsx`, `i18n/pt/.../navbar.json` |
| Change CI or deploy | `.github/workflows/` |
