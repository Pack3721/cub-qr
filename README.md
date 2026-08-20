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

## Adding/editing QR codes

The list of QR codes is fully editable on the page itself — click "+ Add QR
Code" for a new one, rename any entry's name field, or hit the ✕ to remove
one. Each box has its own URL, icon picker, color scheme picker, and border
text fields, with a live preview and copy/save buttons. The whole list is
saved to `localStorage` so it persists across visits.

`DEFAULT_ENTRIES` in `main.js` is just the seed list shown on first visit
(currently Pack Join Link and Pack Calendar Link, the latter preset to
scout-cal's calendar QR defaults) — after that, the user's own list takes
over.

Icons come from [Iconify](https://icon-sets.iconify.design/) — add entries to
the `ICONS` array with the icon's Iconify id to offer more choices. Color
schemes are defined in `COLOR_SCHEMES`; the "Navy & Gold" scheme matches the
default styling used by scout-cal's calendar QR codes.
