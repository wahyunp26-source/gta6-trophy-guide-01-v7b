// Leonida 100% — a trophy's detail view: its guide, the cited steps, the
// disputes where sources disagree, and the sources behind every fact.
export function showDetail(trophy, sourceByNum, panel) {
  const steps = trophy.steps ?? [];
  const disputes = trophy.disputes ?? [];
  const used = new Map();
  for (const step of steps) {
    for (const n of step.s) {
      if (!used.has(n)) used.set(n, sourceByNum.get(n));
    }
  }
  const stepItems = steps.map((step) => {
    const cites = step.s.map((n) => `[${n}]`).join(' ');
    return `<li>${step.t} <span class="cite">${cites}</span></li>`;
  }).join('');
  const disputeBlocks = disputes.map((d) => (
    `<div class="dispute"><h3>SOURCES DIFFER — ${d.title}</h3>` +
    `<p><strong>One source says:</strong> ${d.a}</p>` +
    `<p><strong>Another says:</strong> ${d.b}</p>` +
    `<p><strong>Our call:</strong> ${d.call}</p></div>`
  )).join('');
  const sourceLines = [...used.entries()].map(([n, s]) => (
    s ? `<li>[${n}] ${s.site} — <a href="${s.url}">${s.title}</a></li>` : `<li>[${n}] (source not listed)</li>`
  )).join('');
  panel.innerHTML =
    `<button type="button" class="close" aria-label="Close">×</button>` +
    `<h2>${trophy.name}</h2>` +
    `<p class="meta">${trophy.description} — ${trophy.grade} · ${trophy.kind}` +
    (trophy.hidden ? ' · hidden on PlayStation until earned' : '') + `</p>` +
    `<p>${trophy.guide}</p>` +
    (steps.length ? `<ol>${stepItems}</ol>` : '') +
    disputeBlocks +
    (sourceLines ? `<p class="sources">Sources for this trophy:</p><ul class="sources">${sourceLines}</ul>` : '');
  panel.hidden = false;
  panel.querySelector('.close').addEventListener('click', () => { panel.hidden = true; });
}
