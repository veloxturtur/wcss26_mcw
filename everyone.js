document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('everyone')) return;
  renderNav('everyone');
  initPageUi();
  startAutoSync();

  const state = loadState();
  const players = getPlayers(state);
  const tbody = document.getElementById('everyone-body');
  if (!tbody) return;

  const sorted = [...players].sort((a, b) => a.name.localeCompare(b.name));
  tbody.innerHTML = sorted
    .map(
      (p) => `
    <tr>
      <td>${playerNameLink(p.name)}</td>
      <td>${renderTeamsCell(p.teamCodes)}</td>
    </tr>`
    )
    .join('');

  bindPlayerLinks(tbody);
});
