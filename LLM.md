# zoolabs.io

**Org:** zoo-apps  ·  **Ecosystem:** zoo  ·  **Path:** `/Users/a/work/zoo/zoo-apps/zoolabs.io`
**Origin:** https://github.com/zoo-apps/zoolabs.io.git

## Discovery

This file (`CLAUDE.md`) is the canonical agent-facing readme; `LLM.md` is a symlink to it. Update either name and both stay in sync.

## Where to look first

- `README.md` — human-facing overview (if present)
- `package.json` / `Cargo.toml` / `pyproject.toml` / `go.mod` — language & deps
- `.github/workflows/` — CI surface
- `docs/` — extended docs (if present)

## Sibling repos

See the org-level `LLM.md` at `/Users/a/work/zoo/zoo-apps/LLM.md` for the full inventory of sibling repos and inter-repo dependencies.

`zoo.ngo` is the surface to read before changing type here: same stack, and it
already publishes the Zoo public-site register (`--type-scale` 8/7, `--type-ratio`
0.84, `--tracking-display` −0.035em) and the rule that a page says what a thing IS
while `globals.css` says what it looks like.

## Type and appearance

- Zen reaches the page through ONE binding: `styles/globals.css` sets
  `--font-sans` from `@hanzo/font`'s published `--font-zen-sans`. No component
  spells a face. `@hanzo/design/tokens/fonts.css` is deliberately not imported —
  it would be a second copy of the faces.
- Sizes are RUNGS, never numbers: `--text-*` in CSS, `$n` in gui (gui's
  `--f-size-n` reads `var(--text-*)`). A literal px is a place the reader's own
  setting cannot reach.
- Colours live in `styles/globals.css`; `lib/brand.ts` names them by `var()` for
  gui props. A hex in TypeScript is invisible to `@hanzo/appearance`.
- `components/Look.tsx` mounts the appearance panel bottom LEFT — bottom right is
  Ask Blue — and `pages/_document.tsx` inlines `bootScript()` in `<head>` so the
  first paint is already the reader's.

### Two traps, both measured

- **`@import … layer(base)` is dead here.** webpack emits it as
  `@media layer(base){…}`, which matches nothing, so `@hanzo/design`'s whole
  `base.css` silently did not apply: body fell back to Times New Roman at 16px and
  every research link kept the UA underline. The file opens its own `@layer base`,
  so import it BARE.
- **gui's atomic sheet outranks a site class.** gui injects `:root ._ls-…{…}` into
  the body at render, so a `:root .my-class` rule ties on specificity and loses on
  order. Anything gui draws answers to the fleet's tokens; state display type on
  the ELEMENT and draw it with a plain `<h1>`/`<a>`.
