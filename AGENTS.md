# AGENTS.md

Guidance for AI coding agents working in this repository (Claude Code, Windsurf, Devin, Cursor, Codex, or otherwise).

## What this is

The documentation site for **ASL, the Architecture Specification Language**: a home page plus `/docs`, in English (default) and Portuguese (pt-BR). Built with Docusaurus 3.10 (React 19, TypeScript), published to GitHub Pages at `https://asl.architectureascode.dev`.

Two separate repositories:

| Repo | Contains |
| --- | --- |
| `margato/asl-docs` (this one) | the site |
| `margato/asl` (`../asl` locally) | the compiler (Go) |

All GitHub links in the navbar, footer and home point to `margato/asl` (the code). Only `editUrl` ("Edit this page") points to `margato/asl-docs`.

Requests that belong to the compiler are written as handoffs in `../asl/docs/handoffs/`, not implemented here. `Relationship.spec.edges` was renamed to `spec.relations` (all examples use the new name). Pending: the built-in duplicate-edge check (`duplicate-edges-and-spec-relations.md`, part A).

## Commands

```sh
npm install
npm start          # docusaurus build + serve: BOTH locales, language switcher works, NO hot reload
npm run dev        # hot-reload dev server, English only
npm run dev:pt     # hot-reload dev server, Portuguese only
npm run build      # both locales into build/ (onBrokenLinks is "throw")
npm run typecheck  # tsc
```

`npm run dev` serves one locale at a time (a Docusaurus limitation), so the language switcher 404s there. `npm start` is a production build, so it needs a rebuild after each edit. It serves `./build`, so a fresh `npm run build` is picked up on page reload.

## Layout

```
docs/                          English docs (default locale)
i18n/pt/...                    Portuguese (see "i18n")
sidebars.ts                    docs sidebar
docusaurus.config.ts           site config
src/pages/index.tsx            home page; ALL its copy is the COPY object (en + pt, same keys)
src/pages/styles.module.css    home page styles
src/css/custom.css             global tokens, navbar, buttons, mobile menu
src/css/docs.css               docs-only styles (sidebar, article, tables, admonitions, TOC)
src/components/Terminal        animated terminal in the hero (English script)
src/components/LocaleSwitch    EN | PT switch (custom navbar item)
src/components/GithubLink      GitHub pill (custom navbar item)
src/theme/NavbarItem/ComponentTypes.tsx   registers the two custom navbar items
src/theme/Mermaid              wraps every Mermaid diagram with a fullscreen button
src/theme/prismTheme.ts        code highlight theme
src/theme/prism-include-languages.ts      extra Prism setup (see below)
src/data/architecture.ts       dark-themed copy of the compiler's architecture.mmd
static/                        favicon, social card, CNAME, .nojekyll
.github/workflows/deploy.yml   deploy to GitHub Pages
```

- `docs.css` must stay scoped to docs classes so it never changes the home page. Global changes go in `custom.css`.
- `prism-include-languages.ts` defines the `asldiag` language (compiler output blocks: error, pointer, policy, ok lines) and highlights unquoted YAML values. Use ```` ```asldiag ```` for CLI output blocks.
- Home sections, in order: hero (+ four indicators), cost of interpretation, harness (Context / Guardrails / Feedback), the agent example (steps 01-03), "ASL is not Diagram as Code" (PT: "O ASL não é Diagram as Code") comparison, portability, final call to action. Section backgrounds alternate black and a slightly lighter band (`.band`) so each section reads as its own block.
- The navbar item order and left/right positions are set in `docusaurus.config.ts`; keep them unless asked.

## i18n

English is the default locale. Portuguese lives in:

- `i18n/pt/docusaurus-plugin-content-docs/current/*.md`: translated docs (same file names)
- `i18n/pt/docusaurus-plugin-content-docs/current.json`: sidebar category labels (Primeiros passos, Personalize, Saiba mais)
- `i18n/pt/docusaurus-theme-classic/navbar.json`, `footer.json`: theme strings
- `i18n/pt/code.json`: strings from `translate()` in our components (ids `asl.mermaid.*`)

Rules: every user-visible string needs both languages. The home copy lives in `COPY.en` and `COPY.pt` with identical keys; the type `Copy` at the top of `index.tsx` enforces it. A new sidebar label needs an entry in `current.json`; a new footer or navbar label needs one in the matching theme json. The home `<title>` comes from the site `title` in the config (the home passes no title).

## Docs structure

The sidebar has three fixed, non-collapsible sections: **Get started** (intro, cli), **Extend it** (custom-policies, custom-schemas), **Learn more about it** (why, aac-vs-diagram-as-code, architecture). Contributor and Go-internals pages (kinds, built-in policies, contributing, gotchas) were removed on purpose: this site is for people who use ASL.

Every page carries a work-in-progress admonition right under the H1. Keep it when editing and add it to new pages:

```md
:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::
```

Portuguese pages use `:::warning[Em construção]` and "Esta página está em construção. O conteúdo pode mudar ou estar incompleto."

## Writing rules for /docs

- Point of view of a user. No Go, no compiler package or file paths, no "kernel" internals, no tool trivia (output styling, colors, how files are walked).
- Never write "JSON Schema". A kind's schema is a **manifest definition**, written from scratch or inherited from a built-in kind and extended.
- Every page opens with a short, concrete narrative (3-6 sentences) before the concept.
- One consistent world: a company with `credit-service`, `billing-service` and `credit-db`, policy namespace `acme`, and an agent that proposes designs. Use "your company", not a company name, in prose.
- pt-BR must read as natural Brazilian Portuguese, not a literal translation: "alucinar" (never "chutar"), "na sua máquina" (never laptop/notebook for the computer), "navegador", "banco de dados compartilhado". Keep these in English as the Brazilian dev community does: pull request, build, pipeline, policy, schema, kind, manifest, exit code, CI, token, harness, guardrails. "Notebooks" meaning Jupyter stay.
- Always write the term **Diagram as Code** exactly like this, capitalized, in both English and Portuguese (never "diagrama como código", never lowercase "diagram as code"). It applies to the home (comparison title, column header, per-item mobile labels) and to the docs page titles ("Architecture as code vs Diagram as Code" / "Arquitetura como código vs Diagram as Code"). The file slug `aac-vs-diagram-as-code` stays lowercase because it is a URL.
- Landing copy avoids over-technical wording; the CEL link goes to `https://cel.dev` (the home's `withCel()` links every "CEL").

## Examples must be real

Every manifest and every compiler output shown comes from running the real compiler. Build it from source into a temp dir, and never write inside `../asl`:

```sh
cd ../asl && go build -o <tmp>/asl ./cmd/asl
<tmp>/asl <architecture-dir> --policies-bundle-path <policies-dir>
```

`../asl/bin/*` is stale (older manifest shape); do not trust it. Current shape: a `Relationship` holds `spec.relations`, a list of `{from, to, type}`; an `Application` needs `providers` and `language`. The home example (agent adds `billing-service` writing to `credit-db`) uses the policy `acme.single-writer` with `to(manifest, 'writes').size() <= 1`, tested on these cases: two writers block, one writer plus readers passes, no edges passes. When you change an example, re-run it and update the displayed output, line number and timing together (the home has a `RESULT` constant and the terminal script in `Terminal/index.tsx`).

## Design system

- **Dark only**: `colorMode` has `disableSwitch: true`. Pure black background (`#000`), cards `#0b0b0c`, borders `#1c1c20`.
- **Accent `#ffcc00`**. `--ifm-color-primary` is the fill; text, icons and borders use `--asl-accent-text`. Buttons use black text on yellow. The mermaid "adapter" category is also yellow.
- **Flat**: no gradients, glow or shadows. Cards radius 16px, pills fully rounded.
- **Fonts**: Bricolage Grotesque (display), Instrument Sans (body), IBM Plex Mono (code), Unbounded (navbar wordmark "ASL", not selectable). Loaded from Google Fonts in the config.
- **No movement on hover** (no translate/transform). Static sections (the comparison table, section labels in the docs sidebar) have no hover at all.
- **Code highlight bars**: step 01 of the home example highlights in light red, step 02 in light blue. Highlighted lines are table rows, so the side bar is drawn on the line-number cell (`[class*='codeLineNumber']`), not on the row. Step 01 scrolls to the `Relationship` on load (`FocusLine`).
- **Mermaid**: dark-themed; every diagram gets a fullscreen button (`src/theme/Mermaid`), with a fixed-overlay fallback. Keep the diagram's classDefs dark.
- Docs sidebar section labels are static mono labels with a yellow marker.

## Responsive rules

- No horizontal overflow of the page at 320-430px. Grid children that hold code need `min-width: 0` and mobile grids use `minmax(0, 1fr)`, otherwise long code lines widen the page.
- The hamburger exists only below 997px. Never force `display` on `.navbar__toggle` outside a max-width media query (it overrides Docusaurus hiding it on desktop).
- On phones the top bar keeps the hamburger, the wordmark and the language switch; Docs and GitHub live in the side menu, and the switch is not repeated there.

## Deploy

GitHub Pages through `.github/workflows/deploy.yml` on every push to `main` (and manually). It runs `npm ci` and `npm run build` with `SITE_URL=https://asl.architectureascode.dev` and `BASE_URL=/`, then uploads `build/`. The config reads `SITE_URL` and `BASE_URL` from the environment, defaulting to the same domain and `/`, so local and production both use `baseUrl: '/'`.

Custom domain: `asl.architectureascode.dev`. `static/CNAME` holds it (ignored by the Actions deploy but harmless). DNS is at Namecheap: a `CNAME` record `asl` pointing to `margato.github.io`, plus the `_github-pages-challenge-margato` TXT record used to verify the domain on the GitHub account. In the repository: Settings, Pages, source GitHub Actions, custom domain set, Enforce HTTPS on.

## Gotchas

- **Never kill servers by name** (`pkill -f ...`). The user runs their own server on port 3000 serving `./build`. For checks start a throwaway `npx docusaurus serve --no-open --port 43xx`, keep its PID, and kill only that PID.
- Concurrent `npm run build` runs collide in `./build` (an `ENOENT` on `__server` is the symptom). Do checks with `npx docusaurus build --out-dir <tmp dir>`.
- Docusaurus internals use hashed CSS-module class names; select them with attribute selectors (`[class*='codeLineNumber']`, `[class*='wordWrapButton']`).
- Code blocks: the word-wrap toggle is hidden in `custom.css`; blocks with long lines scroll horizontally.
- `index.tsx` is formatted by prettier, so naive multi-line string replaces fail. Match on content (a regex on the key, or a short unique phrase).
- When you script edits, assert that the pattern was actually found; a replace that silently matches nothing leaves the file unchanged.
- Do not add a new top-level Google Font without adding it to the `stylesheets` entry in the config.
- Verify visual changes in a headless browser at desktop and about 390px width, not only by building (for example Chrome driven by `puppeteer-core`, installed outside this repo).

## Before you finish

- [ ] Both locales updated (docs, `COPY.en`/`COPY.pt`, `current.json`, theme json, `code.json`).
- [ ] `npx docusaurus build --out-dir <tmp>` passes for en and pt, no broken links.
- [ ] `npm run typecheck` is clean when you touched `.ts`/`.tsx`.
- [ ] No horizontal scroll at 320-430px on the home and a docs page.
- [ ] Every manifest and output shown was produced by the real compiler built from source.
- [ ] WIP admonition still under the H1 of every docs page, in both languages.
- [ ] No `pkill`, no files written inside `../asl`.
