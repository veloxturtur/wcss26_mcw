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
  if (code && code !== 'TBD' && code !== 'null') return renderTeamCell(code);
  const label = slot ? knockoutSlotLabel(slot) : null;
  if (label) {
    return `<span class="team-unknown">TBD <span class="bracket-slot">(${label})</span></span>`;
  }
  return '<span class="team-unknown">TBD</span>';
}

function renderBracketMatch(m) {
  const home = renderBracketTeam(m, 'home');
  const away = renderBracketTeam(m, 'away');
  
  let score = '';
  if (matchPlayed(m) && m.homeScore != null) {
    // If it went to penalties, draw the penalty scores in brackets!
    if (m.homePen != null && m.awayPen != null) {
      score = `<div class="bracket-score"><span style="color:#888; font-size:0.85em;">(${m.homePen})</span> ${m.homeScore} – ${m.awayScore} <span style="color:#888; font-size:0.85em;">(${m.awayPen})</span></div>`;
    } else {
      score = `<div class="bracket-score">${m.homeScore} – ${m.awayScore}</div>`;
    }
  }

  let winner = null;
  if (matchPlayed(m) && m.homeScore != null && m.awayScore != null) {
    if (m.homeScore !== m.awayScore) {
      winner = m.homeScore > m.awayScore ? m.home : m.away;
    } else if (m.homePen != null && m.awayPen != null) {
      winner = m.homePen > m.awayPen ? m.home : m.away;
    }
  }

  return `
    <div class="bracket-match ${winner ? 'bracket-match-done' : ''}">
      <div class="bracket-team ${winner === m.home ? 'bracket-winner' : ''}">${home}</div>
      ${score}
      <div class="bracket-team ${winner === m.away ? 'bracket-winner' : ''}">${away}</div>
      <div class="bracket-date"></div> </div>`;
}

function renderBracket() {
  const state = loadState();
  const wrap = document.getElementById('knockout-bracket');
  if (!wrap) return;

  const customKnockout = [];

  if (typeof HARDCODED_MATCH_SCORES !== 'undefined') {
    for (const [id, data] of Object.entries(HARDCODED_MATCH_SCORES)) {
      if (!id.startsWith('g-') && !id.includes('3rd')) {
        let stg = 'r32';
        if (id.includes('r16')) stg = 'r16';
        else if (id.includes('qf')) stg = 'qf';
        else if (id.includes('sf')) stg = 'sf';
        else if (id.includes('final') || id.includes('Final')) stg = 'final';

        const man = state.manualScores?.[id] || {};
        const hs = man.homeScore !== undefined ? man.homeScore : data.homeScore;
        const as = man.awayScore !== undefined ? man.awayScore : data.awayScore;
        const hPen = data.homePen !== undefined ? data.homePen : null;
        const aPen = data.awayPen !== undefined ? data.awayPen : null;

        customKnockout.push({
          id,
          stage: stg,
          home: data.home || null,
          away: data.away || null,
          homeSlot: data.homeSlot || null,
          awaySlot: data.awaySlot || null,
          homeScore: hs,
          awayScore: as,
          homePen: hPen,
          awayPen: aPen,
          matchNum: parseInt(id.replace(/\D/g, ''), 10) || 0
        });
      }
    }
  }

  const knockout = customKnockout.length > 0 
    ? customKnockout 
    : state.matches.filter((m) => m.stage !== 'group');

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
  
  if (typeof HARDCODED_MATCH_SCORES === 'undefined') {
    startAutoSync();
    document.addEventListener('wc-sync-complete', renderBracket);
  }
});
