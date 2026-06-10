let showAllUpcoming = false;

function matchStageLabel(m) {
  if (m.stage === 'group') return `Group ${m.group}`;
  return m.label || KNOCKOUT_STAGE_LABELS[m.stage] || m.stage;
}

function renderMatchRow(m) {
  const state = loadState();
  const homePlayer = m.home ? getPlayerByTeamCode(state, m.home) : null;
  const awayPlayer = m.away ? getPlayerByTeamCode(state, m.away) : null;

  const home = m.home ? renderTeamCell(m.home) : '<span class="team-unknown">TBD</span>';
  const away = m.away ? renderTeamCell(m.away) : '<span class="team-unknown">TBD</span>';

  const homeWithPlayer = homePlayer
    ? `${home}<span class="team-player">${homePlayer}</span>`
    : home;
  const awayWithPlayer = awayPlayer
    ? `${away}<span class="team-player">${awayPlayer}</span>`
    : away;

  const score =
    m.played && m.homeScore != null
      ? `<span class="match-score">${m.homeScore} – ${m.awayScore}</span>`
      : '<span class="match-score match-score-pending">vs</span>';
  const today = getLocalDateString();
  const live = !m.played && matchLocalDate(m) === today;
  return `
    <article class="match-card ${m.played ? 'match-finished' : ''} ${live ? 'match-live' : ''}">
      <div class="match-card-meta">
        <span class="match-date">${formatMatchDateTime(m)}</span>
        <span class="match-stage">${matchStageLabel(m)}</span>
        ${live ? '<span class="match-live-badge">Today</span>' : ''}
      </div>
      <div class="match-card-teams">
        <div class="match-side">${homeWithPlayer}</div>
        ${score}
        <div class="match-side">${awayWithPlayer}</div>
      </div>
    </article>`;
}

function renderMatchSection(title, matches, emptyText) {
  if (!matches.length) {
    return `
      <section class="match-section">
        <h2 class="section-title">${title}</h2>
        <p class="empty-cell">${emptyText}</p>
      </section>`;
  }
  return `
    <section class="match-section">
      <h2 class="section-title">${title} <span class="section-count">${matches.length}</span></h2>
      <div class="match-list">${matches.map(renderMatchRow).join('')}</div>
    </section>`;
}

function renderMatchCentre() {
  const state = loadState();
  const { today, live, upcoming, completed } = categorizeMatches(state);
  const root = document.getElementById('match-centre');
  if (!root) return;

  const upcomingVisible = showAllUpcoming ? upcoming : upcoming.slice(0, 24);
  const hiddenUpcoming = upcoming.length - upcomingVisible.length;

  root.innerHTML =
    renderMatchSection("Today's fixtures", today, 'No matches scheduled for today.') +
    renderMatchSection('Live & today', live, 'No live fixtures right now.') +
    renderMatchSection('Upcoming', upcomingVisible, 'No upcoming fixtures.') +
    (hiddenUpcoming > 0
      ? `<button type="button" class="load-more-btn" id="show-more-upcoming">+ ${hiddenUpcoming} more upcoming matches</button>`
      : '') +
    renderMatchSection('Completed', completed.slice(0, 30), 'No completed matches yet.');

  document.getElementById('show-more-upcoming')?.addEventListener('click', () => {
    showAllUpcoming = true;
    renderMatchCentre();
  });

  const syncEl = document.getElementById('sync-status');
  if (syncEl) syncEl.textContent = formatSyncStatus(state);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('matches')) return;
  renderNav('matches');
  renderMatchCentre();
  startAutoSync();
  document.addEventListener('wc-sync-complete', renderMatchCentre);
});
