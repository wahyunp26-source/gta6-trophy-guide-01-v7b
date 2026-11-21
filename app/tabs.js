// Leonida 100% — the Roadmap, Missables and Sources tabs: the order to earn
// the platinum in, the one trophy that can be missed, and the sources behind
// every claim.

const STAGES = [
  { stage: 1, title: 'Story first — chapters 1 to 5', text: 'Play the story in order. The 12 chapter and mission trophies pop as you finish each chapter and its key missions, and the final mission ends the story. Keep a manual save at the start of each chapter and before every finale.' },
  { stage: 2, title: 'Side stories — the strangers', text: 'After Coffee Break (chapter 2) you can switch freely between Jason and Lucia. Finish the six side-character finales (Andy, Kenton, Billy, Randy, Tyrone, Bret) and the 8 Strangers & Freaks strands. Only 4 strands are confirmed to count — Kirk, Kyle, Yago and Pilot Pete — so check the trophy counter after each one.' },
  { stage: 3, title: 'Robberies and duo work', text: 'Robberies, bank vaults and duo jobs with your partner. Rob two Payday Loans early to unlock the security-van tips, then the 8 large bank vaults. Bring your partner to every vault and every duo robbery.' },
  { stage: 4, title: 'Collectibles and activities', text: 'Cards, WAiNK scans, vehicles, meditations, stunts, shooting ranges, drone trials, races and challenges. Most of these count toward the 100% checklist, so work them together — scans and gang operations cluster in the same neighborhoods.' },
  { stage: 5, title: 'Cleanup — A Long Road', text: 'After the story, the 100% checklist unlocks (Progress, then Stats, then 100% Completion). Finish the remaining counts: 100 optional missions, 200 of 277 vehicles, 100 of 255 animals, 70 of 80 challenges, 300 of 397 stunts, and the rest of the table. That is the platinum.' },
];

export function renderRoadmap(trophies, el) {
  const byStage = new Map(STAGES.map((s) => [s.stage, []]));
  for (const t of trophies) {
    if (!byStage.has(t.road)) byStage.set(t.road, []);
    byStage.get(t.road).push(t);
  }
  el.innerHTML = '<h2>Roadmap to the platinum</h2>' +
    '<p>About 200 hours, difficulty 4 out of 10, one playthrough, no online trophies. ' +
    'Cheats disable trophies and saving for that session. Hardest trophy: A Long Road.</p>' +
    STAGES.map((s) => {
      const list = (byStage.get(s.stage) ?? []).map((t) => `${t.name} (${t.grade})`).join(', ');
      return `<div class="stage"><h3>Stage ${s.stage} — ${s.title}</h3><p>${s.text}</p><p>${list}</p></div>`;
    }).join('');
}

export function renderMissables(trophies, el) {
  const missable = trophies.find((t) => (t.flags ?? []).includes('missable'));
  const atRisk = trophies.filter((t) => (t.flags ?? []).includes('at-risk'));
  el.innerHTML = '<h2>Missables</h2>' +
    '<p>Only one trophy step can be missed for good. Everything else stays open after the credits.</p>' +
    (missable
      ? `<div class="missable-card"><h3>${missable.name} — the one missable</h3><p>${missable.guide}</p>` +
        '<p>Do it in chapter 1: on a morning after Down to Earth, Lucia walks from the kitchen out to the balcony. ' +
        'Follow her outside and accept. It counts +1 in the Progress menu but is not marked as a meditation spot. ' +
        'Whether it is strictly required is unconfirmed — every source says do it anyway, and keep a chapter 1 save.</p></div>'
      : '') +
    `<h3>At risk — do these before the story moves on</h3>` +
    '<ul>' + atRisk.map((t) => `<li><strong>${t.name}</strong> — ${t.guide}</li>`).join('') + '</ul>' +
    '<h3>Save plan</h3><p>15 manual saves plus 1 autosave. Keep separate slots for the start of each chapter, the mission before each chapter finale, any timed (hourglass) mission, and the final mission. Never overwrite them. Tourist Trap (late chapter 1) costs Jason his house and wipes carried cash — save first and move at least $5,000 into Family Savings. Checking Out (chapter 2 finale) needs $15,000 or more saved. The finale has more than one ending and no replay — save before the last mission of chapter 4 and before the finale.</p>';
}

export function renderSources(sources, trophies, el) {
  const counts = new Map();
  for (const t of trophies) {
    for (const step of t.steps ?? []) {
      for (const n of step.s) counts.set(n, (counts.get(n) ?? 0) + 1);
    }
  }
  const items = sources.map((s) => {
    const c = counts.get(s.n) ?? 0;
    return `<li>[${s.n}] ${s.site} — <a href="${s.url}">${s.title}</a> (${c} claim${c === 1 ? '' : 's'})</li>`;
  }).join('');
  el.innerHTML = '<h2>Sources</h2>' +
    '<p>Every claim in this guide cites its sources by number. 51 of 57 pages were read; ' +
    '6 refused the fetch and are cited nowhere. No source text is copied — each guide is written in my own words.</p>' +
    `<ol class="src-list">${items}</ol>`;
}
