const DEFAULT_PAGE = 'leaderboard.html';

const NAV_ITEMS = [
  { href: 'leaderboard.html', label: 'Individual Leaderboard', icon: '🏆', page: 'leaderboard' },
  { href: 'matches.html', label: 'Match Centre', icon: '⚽', page: 'matches' },
  { href: 'bracket.html', label: 'Knockout', icon: '🎯', page: 'bracket' },
  { href: 'rankings.html', label: 'National Teams', icon: '🚩', page: 'rankings' },
  { href: 'everyone.html', label: "Everyone's Teams", icon: '👥', page: 'everyone' },
  { href: 'table.html', label: 'World Cup Table', icon: '📊', page: 'table' },
  { href: 'teamchallenge.html', label: 'Team Challenge', icon: '🏅', page: 'teamchallenge' },
];

const KNOCKOUT_STAGE_LABELS = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-finals',
  sf: 'Semi-finals',
  final: 'Final',
  runnerUp: 'Runner-up',
};

function renderNav(activePage) {
  const el = document.getElementById('main-nav');
  if (!el) return;
  const state = loadState();
  const items = arePicksLocked(state)
    ? NAV_ITEMS
    : [{ href: 'setup.html', label: 'Setup Teams', icon: '✏️', page: 'setup' }];
  el.innerHTML = items
    .map(
      (item) => `
    <a href="${item.href}" class="nav-link ${item.page === activePage ? 'active' : ''}" data-page="${item.page}">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label.toUpperCase()}</span>
    </a>`
    )
    .join('');
}

function requireSetup(page) {
  const state = loadState();
  if (!arePicksLocked(state) && page !== 'setup') {
    window.location.href = 'setup.html';
    return false;
  }
  // Team picks are fixed; setup UI is not needed anymore.
  if (arePicksLocked(state) && page === 'setup') {
    window.location.href = DEFAULT_PAGE;
    return false;
  }
  return true;
}

function renderTeamCell(code) {
  const team = getTeamByCode(code);
  if (!team) return `<span class="team-unknown">TBD</span>`;
  return `
    <span class="team-cell">
      ${renderFlag(code)}
      <span class="team-name">${team.name}</span>
    </span>`;
}

function renderTeamsCell(codes) {
  if (!codes?.length) return '<span class="team-unknown">—</span>';
  return `<span class="teams-multi teams-with-flags">${codes.map((c) => renderTeamCell(c)).join('')}</span>`;
}

function renderLockedTeamChip(code) {
  const team = getTeamByCode(code);
  const adminHint = 'Locked — cannot be changed';
  return `
    <span class="team-locked-chip" data-code="${code}">
      ${renderFlag(code, 32)}
      <span>${team?.name || 'Unknown'}</span>
      <span class="lock-icon" title="${adminHint}">🔒</span>
    </span>`;
}

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function getGloballyPickedTeams() {
  const picked = new Set();
  document.querySelectorAll('.team-locked-chip').forEach((el) => {
    if (el.dataset.code) picked.add(el.dataset.code);
  });
  document.querySelectorAll('.team-select').forEach((sel) => {
    if (sel.value) picked.add(sel.value);
  });
  return picked;
}

function playerNameLink(name, className = 'player-link') {
  const safe = name.replace(/"/g, '&quot;');
  return `<button type="button" class="${className}" data-player="${safe}">${name}</button>`;
}

function renderMovement(movement) {
  const m = movement || { text: '—', class: 'move-same', title: 'No change' };
  return `<span class="rank-move ${m.class}" title="${m.title || ''}">${m.text}</span>`;
}

function ensurePlayerModal() {
  if (document.getElementById('player-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'player-modal';
  modal.className = 'modal-overlay';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="modal-card modal-card-wide" role="dialog" aria-labelledby="player-modal-title">
      <button type="button" class="modal-close" id="player-modal-close" aria-label="Close">×</button>
      <div id="player-modal-content"></div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePlayerProfile();
  });
  document.getElementById('player-modal-close')?.addEventListener('click', closePlayerProfile);
}

function closePlayerProfile() {
  const modal = document.getElementById('player-modal');
  if (modal) modal.hidden = true;
}

function openPlayerProfile(playerName) {
  const state = loadState();
  const profile = getPlayerProfile(state, playerName);
  if (!profile) {
    showToast('Player not found.', 'error');
    return;
  }
  ensurePlayerModal();
  const content = document.getElementById('player-modal-content');
  const modal = document.getElementById('player-modal');
  if (!content || !modal) return;

  const teamsHtml = profile.teams
    .map((t) => {
      const ko = t.knockoutStage
        ? `<li>Knockout: <strong>${KNOCKOUT_STAGE_LABELS[t.knockoutStage] || t.knockoutStage}</strong> (+${t.knockoutPoints} pts)</li>`
        : '';
      return `
      <div class="profile-team-card">
        <div class="profile-team-head">${renderTeamCell(t.code)}</div>
        <ul class="profile-team-stats">
          <li>Total: <strong>${t.totalPoints} pts</strong></li>
          <li>From matches: ${t.matchPoints} pts · Group bonus: ${t.groupBonus} pts</li>
          ${ko}
          <li>Played: ${t.played} · Record: ${t.w}-${t.d}-${t.l} · GD: ${t.gd >= 0 ? '+' : ''}${t.gd}</li>
          <li>Group ${t.group}${t.groupPosition ? ` · ${t.groupPosition}${ordinal(t.groupPosition)} place` : ''} (${t.groupPts} group pts)</li>
        </ul>
      </div>`;
    })
    .join('');

  content.innerHTML = `
    <header class="profile-header">
      <h2 id="player-modal-title">${profile.name}</h2>
      <p class="profile-meta">
        Rank <strong>#${profile.rank}</strong>
        · <strong>${profile.totalPoints}</strong> pts
        · ${profile.gamesPlayed} matches played by their teams
        ${profile.movement ? ` · ${renderMovement(profile.movement)}` : ''}
      </p>
    </header>
    <h3 class="profile-section-title">Teams &amp; stats</h3>
    <div class="profile-teams">${teamsHtml}</div>`;

  modal.hidden = false;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function bindPlayerLinks(root = document) {
  root.querySelectorAll('.player-link, [data-player]').forEach((el) => {
    if (el.dataset.playerBound) return;
    el.dataset.playerBound = '1';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const name = el.dataset.player || el.textContent.trim();
      if (name) openPlayerProfile(name);
    });
  });
}

function initPageUi() {
  ensurePlayerModal();
  bindPlayerLinks();
}

function teamOptionsHtml(selected = '', includeEmpty = true) {
  const picked = getGloballyPickedTeams();
  const codes = [...ALL_TEAMS].sort((a, b) => a.name.localeCompare(b.name));
  let html = includeEmpty ? '<option value="">— Select team —</option>' : '';
  html += codes
    .map((t) => {
      const isSelected = t.code === selected;
      const taken = picked.has(t.code) && !isSelected;
      return `<option value="${t.code}" ${isSelected ? 'selected' : ''} ${taken ? 'disabled' : ''}>${t.name}${taken ? ' (taken)' : ''}</option>`;
    })
    .join('');
  return html;
}
