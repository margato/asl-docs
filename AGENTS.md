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
npm start          # hot-reload dev server, English only, port 3000
npm run start:prod # docusaurus build + serve: BOTH locales, language switcher works, NO hot reload
npm run dev        # hot-reload dev server, English only (same as start, default port)
npm run dev:pt     # hot-reload dev server, Portuguese only
npm run build      # both locales into build/ (onBrokenLinks is "throw")
npm run typecheck  # tsc
```

`npm start` and `npm run dev` serve one locale at a time (a Docusaurus limitation), so the language switcher 404s there; use `npm run dev:pt` for Portuguese. To test both locales and the switcher, use `npm run start:prod`: it is a production build, so it needs a rebuild after each edit. It serves `./build`, so a fresh `npm run build` is picked up on page reload.

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
src/components/Terminal        animated terminal (English script); not used on the home for now, the hero shows the indicators instead
src/components/UseCases        home "use cases" carousel (4 cards) plus the selected demo, shown as "without ASL / with ASL"; `demos.tsx` has `Editor` (VS Code), `PciScope`, `PullRequest` (CI/CD checks) and `AgentCli`; `data.ts` holds the en + pt copy and the real outputs
src/components/LocaleSwitch    EN | PT switch (custom navbar item)
src/components/GithubLink      GitHub pill (custom navbar item)
src/theme/NavbarItem/ComponentTypes.tsx   registers the two custom navbar items
src/theme/Mermaid              wraps every Mermaid diagram with a fullscreen button
src/theme/prismTheme.ts        code highlight theme (dark); prismThemeLight.ts is the dormant light one
src/theme/prism-include-languages.ts      extra Prism setup (see below)
src/data/architecture.ts       dark-themed copy of the compiler's architecture.mmd
static/                        favicon, social card, CNAME, .nojekyll
.github/workflows/deploy.yml   deploy to GitHub Pages
```

- `docs.css` must stay scoped to docs classes so it never changes the home page. Global changes go in `custom.css`.
- `prism-include-languages.ts` defines the `asldiag` language (compiler output blocks: error, pointer, policy, ok lines) and highlights unquoted YAML values. Use ```` ```asldiag ```` for CLI output blocks.
- Home sections, in order: hero (text + five indicators on the right, in a 2-column grid whose last item spans the full width), one merged `.band` section told as a single narrative (`harnessTitle` "Agents pay to interpret your architecture. *Every time.*", `harnessLead`, then three cards side by side, `.hCards` > `li.hCard`: 01 Context / 02 Guardrails / 03 Feedback; each card has the header (reuses `.stepHead/.stepN/.stepTitle`), the problem block (`harnessBad` label with ✗, gray text), a ↓ arrow in a yellow circle over the divider (`.hArrow`) and the answer block (`harnessGood` label with ✓, `--asl-warm` background, `.hAnswer`); the cards use `subgrid` (`grid-row: span 4`) so the answer row starts at the same height in all three, and they stack in one column on mobile; the labels use the display font (~1.05rem), with no arrow between the cards; the copy is the `harness: {n, who, bad, good}[]` field in `src/pages/index.tsx`), what an architecture harness looks like without ASL vs with ASL (`<UseCases locale=.../>`, titled by `hcTitle` in `src/pages/index.tsx`), the agent example (its own steps 01-03), portability (five cards: pipeline, own tools, diagram editor, Python, VS Code, in a 6-column grid with 3 on top and 2 wider below), final call to action. "ASL is not Diagram as Code" is no longer on the home; it lives only in `docs/aac-vs-diagram-as-code.md`. Section backgrounds alternate strictly (band, plain, band, plain: cost of interpretation + harness, use cases, agent example, portability) with a slightly lighter `.band` so each section reads as its own block; the use cases section must stay plain because its panels use `--asl-surface`; `.section` padding is 7rem on desktop and 4.5rem on mobile. Section titles (h2) and the final call to action title have one accent-colored part: mark it with `*...*` in the copy strings of `src/pages/index.tsx` (for example `'What an architecture harness looks like: without ASL and *with ASL.*'`); `hl()` renders it, and new title strings use the same marker.
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
- Write the product name as **ASL** (uppercase) in running text: home copy, docs, labels and messages. Never "asl" there. The exception is the CLI command and technical identifiers, which stay lowercase in code format (`asl ./architecture`, file names, `asl(acme.writer-needs-owner)`, policy ids like `asl.builtin...`). In Portuguese keep the article the page already uses.
- When citing "harness" in visible text (home, docs, labels), always use the prefix: **architecture harness** in English and **harness de arquitetura** in Portuguese, because the architecture harness is a niche of the harness. Never plain "harness", "system-design harness" or "harness de system design" (the hero says "The architecture harness for your agents"; the home section is "What an architecture harness looks like: without ASL and with ASL"). Exceptions: code identifiers (`harness` as a copy key, CSS classes, field names) and generic mentions of the harness concept when the text is about harnesses in general, not about ASL.
- Landing copy avoids over-technical wording; the CEL link goes to `https://cel.dev` (the home's `withCel()` links every "CEL").

## Examples must be real

Every manifest and every compiler output shown comes from running the real compiler. Build it from source into a temp dir, and never write inside `../asl`:

```sh
cd ../asl && go build -o <tmp>/asl ./cmd/asl
<tmp>/asl <architecture-dir> --policies-bundle-path <policies-dir>
```

`../asl/bin/*` is stale (older manifest shape); do not trust it. Current shape: a `Relationship` holds `spec.relations`, a list of `{from, to, type}`; an `Application` needs `providers` and `language`. The home example (agent adds `billing-service` writing to `credit-db`) uses the policy `acme.single-writer` with `to(manifest, 'writes').size() <= 1`, tested on these cases: two writers block, one writer plus readers passes, no edges passes. When you change an example, re-run it and update the displayed output, line number and timing together (the home has a `RESULT` constant; the terminal script in `Terminal/index.tsx` only matters if the terminal returns to the hero).

- `UseCases` has four cases, in this order (`ICONS`, `DEMOS` and `HUES` in `index.tsx`, and the `cases` arrays in `data.ts`, follow it), and each demo imitates the tool where it happens: Developing (VS Code: a markdown spec like OpenSpec/BMAD vs the ASL manifest with a Problems panel; a generic shared-database example: `cancellation-service` writes straight to `orders-db`, owned by `orders-service`; policy `acme.write-only-own-database`, a Relationship policy that only lets an application write to a database whose `owner` label is its own name; the fix is a topic, `cancellation-requests`, that `orders-service` consumes), Controlling PCI scope (medium "Compliance"; `PciScope` demo: scope map, the 3 PCI policies and an Agent proposes / Agent fixes toggle), Evaluating an architecture (medium label "CI/CD"; still the shop/loyalty pull-request demo: ASL on the proposal, before the code; Kyverno after the code, at deploy) and Interpreting an architecture (agent CLI; a regulated company asking for an impact analysis on the "payments" example). A new case imitates its medium: git looks like a pull request, code looks like a CLI or VS Code, and so on.
- SDLC tracker: always visible and centered, in one panel with the scenario (`.brief`), under a visible title (`Copy.sdlcLabel`: "Where ASL touches the SDLC" / "Onde a ASL toca o SDLC"), with 6 stages (Plan, Design, Develop, CI/CD, Deploy, Operate). Each case lights its own stages in yellow through `CaseCopy.sdlc` (indexes into `Copy.stages`); the other stages stay dim.
- `UseCases/data.ts` (see the comment at the top of the file): real = the `asl` compiler built from source on the "payments" example (policies `acme.pci-scope-is-declared`, `acme.pci-only-from-pci`, `acme.pci-scope-needs-approval`, `acme.write-only-own-database`): baseline `ok 7.4ms` (~2.6 KB of YAML); PCI proposal fails with 2 errors (`payments.asl.yaml:51` and `:1`), then `ok 7.4ms`; `cancellation-service` error at `cancellation.asl.yaml:1`, then `ok 7.5ms`. The shop example with `acme.no-shared-database` gives the loyalty-service error at `shop.asl.yaml:34`, then `ok 6.9ms`, plus `kyverno apply` 1.17 (`disallow-latest-tag` passes, `asl-declared-applications` denies loyalty-worker). The payments manifests and policies exist only in the scratchpad build, not in the repo: to refresh them, rebuild the compiler from `../asl/kernel` (`go build -o <tmp>/asl ./cmd/asl`, run inside `../asl/kernel`) and re-create the manifests and policies as described in `data.ts`. Proposal, does NOT exist: the `asl-declared-applications` policy reading the Applications declared in ASL through a ConfigMap; the UI marks it "Proposal · not available yet" / "Proposta · ainda não existe". Illustrative: the agent's answers, the later incidents, the draw.io excerpt, the "several KB of XML" estimate and the PCI scope in the old network diagram. Sizes and tokens are rough estimates, never exact numbers. When you change an example, re-run the compiler (and kyverno for the shop case) and update output, line and time together.
- ASL fact: an `Application` cannot `calls` another `Application` (only `APIGateway` calls `Application`; `Application` calls `AbstractResource`).

## Design system

- **Dark by default, currently dark only**: `colorMode` has `defaultMode: 'dark'` and `disableSwitch: true`. Colors are tokens in `src/css/custom.css` (`:root, [data-theme='light']` and `[data-theme='dark']`: `--asl-bg`, `--asl-surface`, `--asl-border*`, `--asl-strong`, `--asl-text-*`, `--asl-muted`, `--asl-accent-text`, ...). Never hardcode neutral hex in CSS; use the tokens. Dark palette (no longer pure black): `--asl-bg` `#0d1117`, `--asl-surface` `#161b22`, `--asl-band` `#161b22` (alternate home sections), borders in the `#30363d` family, and `--asl-screen` `#000` for the terminal/IDE/GitHub mock windows and the architecture-harness answers. Links are blue (`--asl-link` `#58a6ff`). Semantic tokens: `--asl-info`, `--asl-success`, `--asl-warning`, and `--asl-hue-green/violet/cyan/orange` for generic icons. Brand colors appear only on the Go, Python, VS Code and Kubernetes logo marks (`.brandGo` etc. in `src/pages/styles.module.css`). Syntax highlighting (`src/theme/prismTheme.ts`) follows GitHub Dark. Admonitions: note/info blue, tip green, warning/caution yellow, danger red. The light token block, `src/theme/prismThemeLight.ts` and `src/components/ThemeSwitch` are kept dormant. To re-enable light: set `colorMode` to `defaultMode: 'light'` and `disableSwitch: false`, re-add the `custom-themeSwitch` navbar item (next to the language switch), and keep the built-in toggle hidden by CSS. Terminal and Mermaid diagrams stay dark in both themes (`--asl-diagram-bg`). The Portuguese strings are `asl.theme.*` in `i18n/pt/code.json`.
- **Accent `#ffcc00`**, reserved for the brand: logo, primary button, active nav, focus, list markers and the WIP admonition. `--ifm-color-primary` is the fill; text, icons and borders use `--asl-accent-text` (a darker gold in the dormant light theme). Buttons use black text on yellow. The mermaid "adapter" category is also yellow.
- **Flat**: no gradients, glow or shadows. Cards radius 16px, pills fully rounded.
- **Fonts**: Bricolage Grotesque (display), Instrument Sans (body), IBM Plex Mono (code), Unbounded (navbar wordmark "ASL", not selectable). Loaded from Google Fonts in the config.
- Fake window chrome (UseCases windows, title bars, tabs, badges) is `user-select: none`, so it reads as UI, not as text.
- **No movement on hover** (no translate/transform). Home cards have no yellow on hover: the hover is neutral (only a neutral background and border change). Static sections (the comparison table, section labels in the docs sidebar) have no hover at all.
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

- **Port 3000 belongs to the user.** Never restart, stop, start or change the port of the server there (`npm start`, hot-reload dev server, English). No `kill`/`pkill` on it (and never kill servers by name), no other server on that port, no change to the port in the script. For checks use `npx docusaurus build --out-dir <temp dir>` or a throwaway `npx docusaurus serve --no-open --port 43xx`, keep its PID, and kill only that PID. If a change to `docusaurus.config.ts` or `sidebars.ts` needs a restart, tell the user instead of restarting.
- Concurrent `npm run build` runs collide in `./build` (an `ENOENT` on `__server` is the symptom). Do checks with `npx docusaurus build --out-dir <tmp dir>`.
- Docusaurus internals use hashed CSS-module class names; select them with attribute selectors (`[class*='codeLineNumber']`, `[class*='wordWrapButton']`).
- Code blocks: the word-wrap toggle is hidden in `custom.css`; blocks with long lines scroll horizontally.
- `index.tsx` is formatted by prettier, so naive multi-line string replaces fail. Match on content (a regex on the key, or a short unique phrase).
- When you script edits, assert that the pattern was actually found; a replace that silently matches nothing leaves the file unchanged.
- Do not add a new top-level Google Font without adding it to the `stylesheets` entry in the config.
- Verify visual changes in a headless browser at desktop and about 390px width (dark), not only by building (for example Chrome driven by `puppeteer-core`, installed outside this repo).

## Before you finish

- [ ] Both locales updated (docs, `COPY.en`/`COPY.pt`, `current.json`, theme json, `code.json`).
- [ ] `npx docusaurus build --out-dir <tmp>` passes for en and pt, no broken links.
- [ ] `npm run typecheck` is clean when you touched `.ts`/`.tsx`.
- [ ] No horizontal scroll at 320-430px on the home and a docs page.
- [ ] Every manifest and output shown was produced by the real compiler built from source.
- [ ] WIP admonition still under the H1 of every docs page, in both languages.
- [ ] No `pkill`, no files written inside `../asl`.
