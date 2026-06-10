let currentState = loadState();

function renderGroupTables() {
  const wrap = document.getElementById('group-tables');
  if (!wrap) return;

  const { tables } = buildGroupStandings(currentState.matches);
  const groups = Object.keys(WC2026_GROUPS).sort();

  wrap.innerHTML = groups
    .map((g) => {
      const teams = tables[g] || WC2026_GROUPS[g].map((code) => ({
        code,
        pts: 0,
        gd: 0,
        gf: 0,
        played: 0,
        w: 0,
        d: 0,
        l: 0,
      }));

      const rows = teams
        .map(
          (t, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${renderTeamCell(t.code)}</td>
          <td>${t.played}</td>
          <td>${t.w}</td>
          <td>${t.d}</td>
          <td>${t.l}</td>
          <td>${t.gd >= 0 ? '+' : ''}${t.gd}</td>
          <td class="points">${t.pts}</td>
        </tr>`
        )
        .join('');

      return `
      <div class="group-table-card">
        <h3>Group ${g}</h3>
        <table class="data-table compact">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    })
    .join('');
}

function renderKnockoutSummary() {
  const grid = document.getElementById('knockout-summary');
  if (!grid) return;

  const reach = getKnockoutReach(currentState.matches, currentState.knockoutTeams);
  const codes = Object.entries(reach)
    .filter(([, stage]) => stage && stage !== 'group')
    .sort((a, b) => {
      const order = [...STAGE_ORDER, 'runnerUp'];
      return order.indexOf(b[1]) - order.indexOf(a[1]);
    });

  if (!codes.length) {
    grid.innerHTML =
      '<p class="footer-note">Knockout progress will appear here once round-of-32 matches are played and synced.</p>';
    return;
  }

  const labels = {
    r32: 'Round of 32',
    r16: 'Round of 16',
    qf: 'Quarter-finals',
    sf: 'Semi-finals',
    final: 'Winner',
    runnerUp: 'Runner-up',
  };

  grid.innerHTML = codes
    .map(([code, stage]) => {
      const team = getTeamByCode(code);
      return `
      <div class="advance-item advance-readonly">
        ${renderFlag(code, 32)}
        <span class="advance-name">${team?.name || code}</span>
        <span class="advance-stage-label">${labels[stage] || stage}</span>
      </div>`;
    })
    .join('');
}

function refreshTable() {
  currentState = loadState();
  renderGroupTables();
  renderKnockoutSummary();
  const syncEl = document.getElementById('sync-status');
  if (syncEl) syncEl.textContent = formatSyncStatus(currentState);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('table')) return;
  renderNav('table');
  refreshTable();
  startAutoSync();
  document.addEventListener('wc-sync-complete', refreshTable);
});
