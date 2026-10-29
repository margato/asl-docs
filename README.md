# asl-docs

ASL documentation site, built with [Docusaurus](https://docusaurus.io). Dark theme only. Locales: English (default, `/`) and Portuguese (`/pt/`).

```sh
npm install
npm start          # build + serve BOTH locales (language switcher works)
npm run dev        # hot-reload dev server, English only
npm run dev:pt     # hot-reload dev server, Portuguese only
npm run build      # builds both locales into build/
```

`npm run dev` serves a single locale (a Docusaurus limitation), so the language switcher leads to a 404 there. Use `npm start` to test switching.

English docs live in `docs/`; Portuguese translations in `i18n/pt/docusaurus-plugin-content-docs/current/`. The landing page copy is in `src/pages/index.tsx`.
