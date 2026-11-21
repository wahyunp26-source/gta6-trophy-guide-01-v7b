# Leonida 100% — GTA VI Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/wahyunp26-source/gta6-trophy-guide-01-v7b/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/wahyunp26-source/gta6-trophy-guide-01-v7b/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Built for the [gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01?ref=amzcd6wq) on make.fun.

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft
Auto VI: every trophy with its official name, description and grade, a cited
step-by-step guide in my own words, a roadmap to the platinum, missable flags,
and a checklist whose progress saves in the browser.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network at run time: the
app is plain static files under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the kit's `buildDossier`.

## Contents

- `app/` — the guide itself (`index.html`, `style.css`, `app.js`,
  `detail.js`, `tabs.js`, `data/trophies.json`, `data/sources.json`).
- `screenshots/` — four renders of the app in a browser.
- `shots.json` — which view each screenshot shows.
- `main.ts` — hands the guide in (copies `app/` + `screenshots/`, writes
  `dossier.json`).
- `serve.ts` — a tiny static server for local testing.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
