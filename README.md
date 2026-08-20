# Pack QR Generator

A GitHub Pages app for generating branded QR codes — pack join links, calendar
subscription links, and (over time) whatever other links your pack wants a
QR code for. Everything runs client-side; nothing is uploaded anywhere.

## Setup

1. Edit `_config.yml`:
   - `baseurl`: your repo name, e.g. `/cub-qr`
   - `url`: your GitHub Pages domain, e.g. `https://yourpack.github.io`
2. Push to `main` — the included GitHub Actions workflow
   (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages
   automatically. Enable Pages for the repo (Settings → Pages → Source:
   GitHub Actions) once.

## Local development

```
bundle install
bundle exec jekyll serve
```

Then open `http://127.0.0.1:4000/cub-qr/` (or your configured `baseurl`).

## Adding a new QR code type

Each QR code on the page is one entry in the `QR_DEFS` array in `main.js`.
Add an entry there (`id`, `label`, `urlPlaceholder`, default `icon` and
`colorScheme`, default `topText`/`bottomText`) and it will automatically get
its own box on the page — URL field, icon picker, color scheme picker,
border text fields, live preview, copy/save buttons.

Icons come from [Iconify](https://icon-sets.iconify.design/) — add entries to
the `ICONS` array with the icon's Iconify id. Color schemes are defined in
`COLOR_SCHEMES`; the "Navy & Gold" scheme matches the default styling used by
scout-cal's calendar QR codes.

User-entered values (URL, icon, color scheme, border text) are saved to
`localStorage` per-entry so they persist across visits.
