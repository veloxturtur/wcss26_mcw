const BRACKET_ROUNDS = [
  { key: 'r32', label: 'Round of 32' },
  { key: 'r16', label: 'Round of 16' },
  { key: 'qf', label: 'Quarter-finals' },
  { key: 'sf', label: 'Semi-finals' },
  { key: 'final', label: 'Final' },
];

function renderBracketTeam(m, side) {
  const code = side === 'home' ? m.home : m.away;
  const slot = side === 'home' ? m.homeSlot : m.awaySlot;
  if (code) return renderTeamCell(code);
  const label = slot ? knockoutSlotLabel(slot) : null;
  if (label) {
    return `<span class="team-unknown">TBD <span class="bracket-slot">(${label})</span></span>`;
  }
  return '<span class="team-unknown">TBD</span>';
}

function renderBracketMatch(m) {
  const home = renderBracketTeam(m, 'home');
  const away = renderBracketTeam(m, 'away');
  const score =
    matchPlayed(m) && m.homeScore != null
      ? `<div class="bracket-score">${m.homeScore} – ${m.awayScore}</div>`
      : '';
  const winner =
    matchPlayed(m) && m.homeScore !== m.awayScore
      ? m.homeScore > m.awayScore
        ? m.home
        : m.away
      : null;
  return `
    <div class="bracket-match ${winner ? 'bracket-match-done' : ''}">
      <div class="bracket-team ${winner === m.home ? 'bracket-winner' : ''}">${home}</div>
      ${score}
      <div class="bracket-team ${winner === m.away ? 'bracket-winner' : ''}">${away}</div>
      <div class="bracket-date">${formatMatchDateTime(m)}</div>
    </div>`;
}

function renderBracket() {
  const state = loadState();
  const wrap = document.getElementById('knockout-bracket');
  if (!wrap) return;

  const knockout = state.matches.filter((m) => m.stage !== 'group');
  const byStage = {};
  for (const r of BRACKET_ROUNDS) byStage[r.key] = [];
  for (const m of knockout) {
    if (byStage[m.stage]) byStage[m.stage].push(m);
  }

  wrap.innerHTML = BRACKET_ROUNDS.map((round) => {
    const matches = (byStage[round.key] || []).sort(
      (a, b) => (a.matchNum || 0) - (b.matchNum || 0)
    );
    return `
      <div class="bracket-round">
        <h3 class="bracket-round-title">${round.label}</h3>
        <div class="bracket-round-matches">
          ${matches.length ? matches.map(renderBracketMatch).join('') : '<p class="empty-cell">TBD</p>'}
        </div>
      </div>`;
  }).join('');

  const syncEl = document.getElementById('sync-status');
  if (syncEl) syncEl.textContent = formatSyncStatus(state);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('bracket')) return;
  renderNav('bracket');
  renderBracket();
  startAutoSync();
  document.addEventListener('wc-sync-complete', renderBracket);
});
