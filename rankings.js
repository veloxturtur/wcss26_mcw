function renderRankings() {
  const state = loadState();
  const ranked = getTeamRankings(state);
  const tbody = document.getElementById('rankings-body');
  if (!tbody) return;

  tbody.innerHTML = ranked
    .map(
      (row, i) => `
    <tr>
      <td class="rank ${i === 0 ? 'rank-1' : ''}">${i + 1}</td>
      <td>${renderTeamCell(row.code)}</td>
      <td class="points">${row.points}</td>
      <td>${row.played}</td>
      <td>${row.w}-${row.d}-${row.l}</td>
      <td>${row.gd >= 0 ? '+' : ''}${row.gd}</td>
      <td>Group ${row.group}</td>
    </tr>`
    )
    .join('');

  const updated = document.getElementById('rankings-updated');
  if (updated) updated.textContent = formatSyncStatus(state);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('rankings')) return;
  renderNav('rankings');
  initPageUi();
  renderRankings();
  startAutoSync();
  document.addEventListener('wc-sync-complete', renderRankings);
});
