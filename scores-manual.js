function renderManualScoreInput() {
  const state = loadState();
  const container = document.getElementById('matches-form');
  const dateSelector = document.getElementById('match-date');
  
  if (!container || !dateSelector) return;

  // Get all match dates
  const matchDates = getMatchDatesFromState(state);
  
  // Populate date selector
  dateSelector.innerHTML = matchDates
    .map(date => `<option value="${date}">${formatDate(date)}</option>`)
    .join('');
  
  // Render matches for selected date
  const selectedDate = dateSelector.value || matchDates[0];
  renderMatchesForDate(state, selectedDate, container);
  
  // Add event listener for date change
  dateSelector.addEventListener('change', () => {
    renderMatchesForDate(state, dateSelector.value, container);
  });
  
  // Add save button listener
  document.getElementById('save-scores')?.addEventListener('click', saveManualScores);
  document.getElementById('reset-scores')?.addEventListener('click', resetToApiData);
}

function renderMatchesForDate(state, date, container) {
  const matchesForDate = state.matches.filter(m => m.date === date && m.stage === 'group');
  const manualScores = state.manualScores || {};
  
  container.innerHTML = matchesForDate.map(m => {
    const matchId = m.id;
    const manualScore = manualScores[matchId] || {};
    const homeScore = manualScore.homeScore !== undefined ? manualScore.homeScore : m.homeScore;
    const awayScore = manualScore.awayScore !== undefined ? manualScore.awayScore : m.awayScore;
    
    return `
      <div class="match-input-row" data-match-id="${matchId}">
        <div class="match-info">
          ${renderTeamCell(m.home)}
          <span class="vs">vs</span>
          ${renderTeamCell(m.away)}
        </div>
        <div class="score-inputs">
          <label>
            Home Score:
            <input type="number" min="0" class="home-score" value="${homeScore !== null ? homeScore : ''}" />
          </label>
          <label>
            Away Score:
            <input type="number" min="0" class="away-score" value="${awayScore !== null ? awayScore : ''}" />
          </label>
        </div>
      </div>
    `;
  }).join('');
  
  if (matchesForDate.length === 0) {
    container.innerHTML = '<p>No group matches scheduled for this date.</p>';
  }
}

function saveManualScores() {
  const state = loadState();
  const dateSelector = document.getElementById('match-date');
  const selectedDate = dateSelector.value;
  
  const manualScores = state.manualScores || {};
  const matchRows = document.querySelectorAll('.match-input-row');
  
  matchRows.forEach(row => {
    const matchId = row.dataset.matchId;
    const homeScore = row.querySelector('.home-score').value;
    const awayScore = row.querySelector('.away-score').value;
    
    if (homeScore !== '' || awayScore !== '') {
      manualScores[matchId] = {
        homeScore: homeScore !== '' ? parseInt(homeScore, 10) : null,
        awayScore: awayScore !== '' ? parseInt(awayScore, 10) : null
      };
    } else {
      delete manualScores[matchId];
    }
  });
  
  state.manualScores = manualScores;
  updateLeaderboardSnapshots(state);
  saveState(state);
  
  showToast('Scores saved successfully! Leaderboard updated.');
}

function resetToApiData() {
  const state = loadState();
  state.manualScores = {};
  updateLeaderboardSnapshots(state);
  saveState(state);
  
  // Re-render the current date
  const dateSelector = document.getElementById('match-date');
  const container = document.getElementById('matches-form');
  renderMatchesForDate(state, dateSelector.value, container);
  
  showToast('Scores reset to API data.');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('scores-manual')) return;
  renderNav('scores-manual');
  initPageUi();
  
  renderManualScoreInput();
});
