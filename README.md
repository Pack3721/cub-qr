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
text fields, with a live preview and a Save PNG button. The whole list is
saved to `localStorage` so it persists across visits.

`DEFAULT_ENTRIES` in `main.js` is the suggested list (Pack Join Link, Pack
Calendar Link, Download Scout App, Pack Facebook Group, Den Information at a
Glance, Pack Costs Explained — the Calendar entry preset to scout-cal's QR
defaults). Each default is added to a visitor's list **exactly once**: a
separate `localStorage` key tracks which default ids have already been
seeded, independent of the user's actual list. So adding a new entry to
`DEFAULT_ENTRIES` rolls it out to existing users next time they open the
page — appended to whatever they already have — without re-adding one
they've since deleted or duplicating one they've already customized.

Icons come from [Iconify](https://icon-sets.iconify.design/) — add entries to
the `ICONS` array with the icon's Iconify id to offer more choices. Color
schemes are defined in `COLOR_SCHEMES`; the "Navy & Gold" scheme matches the
default styling used by scout-cal's calendar QR codes.
