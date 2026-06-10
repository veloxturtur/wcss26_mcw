function renderLeaderboard() {
  const state = loadState();
  const board = getLeaderboard(state);
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;

  tbody.innerHTML = board
    .map(
      (row) => `
    <tr>
      <td class="rank ${row.rank === 1 ? 'rank-1' : ''}">${row.rank}</td>
      <td>${renderMovement(row.movement)}</td>
      <td>${playerNameLink(row.player)}</td>
      <td>${renderTeamsCell(row.teamCodes)}</td>
      <td class="games-played">${row.gamesPlayed}</td>
      <td class="points">${row.points}</td>
    </tr>`
    )
    .join('');

  bindPlayerLinks(tbody);

  const syncEl = document.getElementById('sync-status');
  if (syncEl) syncEl.textContent = formatSyncStatus(state);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('leaderboard')) return;
  renderNav('leaderboard');
  initPageUi();

  let state = loadState();
  if (arePicksLocked(state) && !state.lastLeaderboard?.length) {
    updateLeaderboardSnapshots(state);
    saveState(state);
  }

  renderLeaderboard();
  startAutoSync();
  document.addEventListener('wc-sync-complete', renderLeaderboard);
});
