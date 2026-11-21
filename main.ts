// Leonida 100% — hands the guide in (Node 22, standard library only).
// The guide is the plain static files under app/ beside this file: a browser
// opens app/index.html (ES modules, CSS, no build step) with the network off,
// and its trophy list and guides are app/data/trophies.json. This program
// copies app/ and screenshots/ to the output directory and writes
// output/dossier.json, the summary the judge reads (the screenshots, the
// first load's files and bytes, and the source), using the vendored make.fun
// library. Leave vendor/makefun-frontend.ts as it is: the scorer rebuilds
// dossier.json with its own copy and compares the two byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(out, 'dossier.json'), dossier);
// Say what was written, so a local run shows the dossier's size at a glance.
console.log(`wrote ${join(out, 'dossier.json')} (${dossier.length} bytes)`);
