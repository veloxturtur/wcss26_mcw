let rowId = 0;

function lockTeamPickRow(pickRow) {
  const select = pickRow.querySelector('.team-select');
  if (!select || !select.value) return;
  const code = select.value;
  const chip = document.createElement('div');
  chip.className = 'team-pick-row team-pick-locked';
  chip.dataset.code = code;
  chip.innerHTML = `${renderLockedTeamChip(code)}`;
  pickRow.replaceWith(chip);
  refreshAllTeamSelects();
}

function refreshAllTeamSelects() {
  document.querySelectorAll('.team-select').forEach((sel) => {
    const current = sel.value;
    sel.innerHTML = teamOptionsHtml(current);
  });
}

function createPlayerRow(name = '', teamCodes = ['']) {
  const id = `row-${++rowId}`;
  const teamsHtml = teamCodes
    .map((code) => {
      if (code) {
        return `
    <div class="team-pick-row team-pick-locked" data-code="${code}">
      ${renderLockedTeamChip(code)}
    </div>`;
      }
      return `
    <div class="team-pick-row">
      <select class="team-select">${teamOptionsHtml()}</select>
      <button type="button" class="btn-icon btn-remove-team" title="Remove team">×</button>
    </div>`;
    })
    .join('');

  return `
  <div class="setup-player-row" data-row="${id}">
    <input type="text" class="player-name" placeholder="Player name" value="${name.replace(/"/g, '&quot;')}" />
    <div class="team-picks">${teamsHtml}</div>
    <button type="button" class="btn-text btn-add-team">+ Add team</button>
    <button type="button" class="btn-icon btn-remove-player" title="Remove player">🗑</button>
  </div>`;
}

function persistSetupDraft() {
  const state = loadState();
  if (!canEditTeamPicks(state)) return;
  const { players } = collectPlayers();
  if (players.length) saveSetupDraft(state, players);
}

function bindRowEvents(container) {
  container.addEventListener('change', (e) => {
    if (!e.target.classList.contains('team-select')) return;
    const pickRow = e.target.closest('.team-pick-row');
    if (!pickRow || !e.target.value) return;
    lockTeamPickRow(pickRow);
    persistSetupDraft();
  });

  container.addEventListener('click', (e) => {
    const row = e.target.closest('.setup-player-row');
    if (!row) return;

    if (e.target.classList.contains('btn-add-team')) {
      const picks = row.querySelector('.team-picks');
      picks.insertAdjacentHTML(
        'beforeend',
        `<div class="team-pick-row">
          <select class="team-select">${teamOptionsHtml()}</select>
          <button type="button" class="btn-icon btn-remove-team" title="Remove team">×</button>
        </div>`
      );
      persistSetupDraft();
    }
    if (e.target.classList.contains('btn-remove-team')) {
      const pickRow = e.target.closest('.team-pick-row');
      if (pickRow?.classList.contains('team-pick-locked') && !isAdminUnlocked()) {
        showToast('Locked teams cannot be removed or changed.', 'error');
        return;
      }
      const picks = row.querySelectorAll('.team-pick-row:not(.team-pick-locked)');
      const admin = isAdminUnlocked();
      if (admin || picks.length > 1) pickRow?.remove();
      refreshAllTeamSelects();
      persistSetupDraft();
    }
    if (e.target.classList.contains('btn-remove-player')) {
      const all = container.querySelectorAll('.setup-player-row');
      if (all.length > 1 || isAdminUnlocked()) row.remove();
      refreshAllTeamSelects();
      persistSetupDraft();
    }
    if (e.target.classList.contains('lock-icon') && isAdminUnlocked()) {
      const pickRow = e.target.closest('.team-pick-row');
      const code = pickRow?.dataset.code;
      if (!pickRow || !code) return;
      pickRow.outerHTML = `
        <div class="team-pick-row">
          <select class="team-select">${teamOptionsHtml(code)}</select>
          <button type="button" class="btn-icon btn-remove-team" title="Remove team">×</button>
        </div>`;
      refreshAllTeamSelects();
      persistSetupDraft();
    }
  });

  container.addEventListener('input', (e) => {
    if (e.target.classList.contains('player-name')) persistSetupDraft();
  });
}

function collectPlayers() {
  const rows = document.querySelectorAll('.setup-player-row');
  const players = [];
  const errors = [];
  const usedTeams = new Set();

  rows.forEach((row, i) => {
    const name = row.querySelector('.player-name').value.trim();
    const codes = [
      ...row.querySelectorAll('.team-pick-locked'),
      ...row.querySelectorAll('.team-pick-row:not(.team-pick-locked)'),
    ]
      .map((el) => el.dataset.code || el.querySelector('.team-select')?.value)
      .filter(Boolean);
    const unique = [...new Set(codes)];

    if (!name && unique.length === 0) return;
    if (!name) {
      errors.push(`Row ${i + 1}: enter a player name`);
      return;
    }
    if (unique.length === 0) {
      errors.push(`${name}: pick at least one team`);
      return;
    }
    for (const c of unique) {
      if (usedTeams.has(c)) {
        const team = getTeamByCode(c);
        errors.push(`${team?.name || c} is already assigned to another player`);
        return;
      }
      usedTeams.add(c);
    }
    players.push({
      id: `p-${Date.now()}-${i}`,
      name,
      teamCodes: unique,
    });
  });

  if (players.length === 0) errors.push('Add at least one player');
  return { players, errors };
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSetup('setup')) return;
  renderNav('setup');

  const container = document.getElementById('setup-players');
  bindRowEvents(container);

  document.getElementById('add-player')?.addEventListener('click', () => {
    container.insertAdjacentHTML('beforeend', createPlayerRow());
    persistSetupDraft();
  });

  const state = loadState();
  const saved = getPlayers(state);
  const adminEdit = arePicksLocked(state) && isAdminUnlocked();

  if (saved.length) {
    container.innerHTML = saved
      .map((p) => createPlayerRow(p.name, p.teamCodes?.length ? p.teamCodes : ['']))
      .join('');
  } else {
    container.innerHTML = createPlayerRow() + createPlayerRow();
  }

  if (adminEdit) {
    document.body.classList.add('admin-edit-mode');
    document.querySelectorAll('.lock-icon').forEach((el) => {
      el.title = 'Click to change team';
    });
  }

  window.addEventListener('beforeunload', persistSetupDraft);

  const lockBtn = document.getElementById('lock-setup');
  if (adminEdit && lockBtn) {
    lockBtn.textContent = 'SAVE CHANGES';
    lockBtn.addEventListener('click', () => {
      const { players, errors } = collectPlayers();
      if (errors.length) {
        showToast(errors[0], 'error');
        return;
      }
      updatePlayers(loadState(), players);
      showToast('Team assignments updated.');
      setTimeout(() => {
        window.location.href = 'everyone.html';
      }, 600);
    });
    return;
  }

  if (arePicksLocked(state)) {
    lockBtn?.setAttribute('disabled', 'true');
    return;
  }

  lockBtn?.addEventListener('click', () => {
    const { players, errors } = collectPlayers();
    if (errors.length) {
      showToast(errors[0], 'error');
      return;
    }
    if (
      !window.confirm(
        'Lock the sweepstake? Team picks stay locked unless you use the admin edit button with your password.'
      )
    ) {
      return;
    }
    const current = loadState();
    if (arePicksLocked(current)) {
      showToast('Teams are already locked.', 'error');
      window.location.href = 'leaderboard.html';
      return;
    }
    completeSetup(current, players);
    showToast('Sweepstake started — teams are locked.');
    setTimeout(() => {
      window.location.href = 'leaderboard.html';
    }, 800);
  });
});
