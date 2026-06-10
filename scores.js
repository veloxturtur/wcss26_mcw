let currentState = loadState();
let selectedDate = '';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('scores')) return;
  renderNav('scores');

  const dates = getMatchDatesFromState(currentState);
  const groupDates = dates.filter((d) =>
    currentState.matches.some((m) => m.date === d && m.stage === 'group')
  );
  selectedDate = groupDates[0] || dates[0];

  const dateSelect = document.getElementById('match-date');
  if (dateSelect) {
    dateSelect.innerHTML = groupDates
      .map((d) => `<option value="${d}">${formatDate(d)}</option>`)
      .join('');
    dateSelect.value = selectedDate;
    dateSelect.addEventListener('change', (e) => {
      selectedDate = e.target.value;
      renderMatchesForDate();
    });
  }

  renderMatchesForDate();

  document.getElementById('save-scores')?.addEventListener('click', () => {
    const formMatches = collectFormMatches();
    currentState = updateMatches(currentState, selectedDate, formMatches);
    showToast('Scores saved! Rankings and leaderboard updated.');
  });
});

function renderMatchesForDate() {
  const container = document.getElementById('matches-container');
  if (!container) return;

  const dayMatches = currentState.matches.filter(
    (m) => m.date === selectedDate && m.stage === 'group'
  );

  if (dayMatches.length === 0) {
    container.innerHTML = '<p class="footer-note">No group-stage matches on this date.</p>';
    return;
  }

  const byGroup = {};
  for (const m of dayMatches) {
    const key = `GROUP ${m.group}`;
    if (!byGroup[key]) byGroup[key] = [];
    byGroup[key].push(m);
  }

  container.innerHTML = Object.entries(byGroup)
    .map(([groupName, matches]) => {
      const rows = matches
        .map((m) => {
          const hs = m.homeScore ?? '';
          const as = m.awayScore ?? '';
          return `
          <div class="match-row" data-id="${m.id}">
            <span class="match-label">Match ${m.matchNum}</span>
            <div class="team-side">${renderTeamCell(m.home)}</div>
            <div class="score-inputs">
              <input type="number" min="0" max="99" class="score-home" value="${hs}" placeholder="-" aria-label="Home score" />
              <span class="dash">-</span>
              <input type="number" min="0" max="99" class="score-away" value="${as}" placeholder="-" aria-label="Away score" />
            </div>
            <div class="team-side away">${renderTeamCell(m.away)}</div>
          </div>`;
        })
        .join('');
      return `<section class="group-section"><h2>${groupName}</h2>${rows}</section>`;
    })
    .join('');
}

function collectFormMatches() {
  const rows = document.querySelectorAll('.match-row[data-id]');
  const updates = [];
  rows.forEach((row) => {
    updates.push({
      id: row.dataset.id,
      homeScore: row.querySelector('.score-home').value === '' ? '' : row.querySelector('.score-home').value,
      awayScore: row.querySelector('.score-away').value === '' ? '' : row.querySelector('.score-away').value,
    });
  });
  return updates;
}
