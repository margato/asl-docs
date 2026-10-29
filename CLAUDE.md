# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This repository is the **documentation site** for ASL (Docusaurus, English + Portuguese). It is not the compiler: that lives in `margato/asl`.

See [AGENTS.md](AGENTS.md) for the technical guidance (commands, layout, i18n, writing rules, design system, deploy, gotchas). It applies to any AI coding agent working here, not just Claude Code.

**Editing these files:** edits to CLAUDE.md or AGENTS.md must be made via
a parallel agent (fork), not inline in the main conversation thread —
always delegate changes to either file to a background agent. This rule
covers AGENTS.md too, since that's where the technical content lives.

Always-on rules (details in AGENTS.md):

- Every user-visible string exists in **English and Portuguese (pt-BR)**. Update both, and build both locales before finishing.
- `/docs` is written from the point of view of someone who **uses** ASL: no compiler internals, no Go, no "JSON Schema" wording.
- Every manifest and compiler output shown must come from running the **real compiler built from source**, never from memory and never from `../asl/bin`.
- Dark theme only, black background, accent `#ffcc00`, no gradients or glow, no movement (translate) on hover.
- Never kill processes by name (`pkill -f ...`): the user runs their own server on port 3000. Check builds with `--out-dir` in a temp directory.
- Verify visual changes in a headless browser at desktop and about 390px width, and keep the page free of horizontal overflow.
- Every `/docs` page keeps its "Work in progress" / "Em construção" admonition under the H1.
