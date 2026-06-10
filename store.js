const STORAGE_KEY = 'wcSweepstake_v2';
const DATA_VERSION = 4;

// Fixed team picks. Edit this list only.
// Use FULL COUNTRY NAMES only (e.g. "England", "Netherlands").
// 3-letter codes like "ENG"/"NED" are rejected.
const HARD_CODED_PLAYER_INPUT = [
 { name: 'Evi', teams: ['Portugal', 'Sweden', 'Uzbekistan'] },
 { name: 'Jasper', teams: ['Mexico', 'Côte d\'Ivoire', 'Saudi Arabia'] },
 { name: 'Jurgen', teams: ['Colombia', 'Panama', 'Bosnia and Herzegovina'] },
 { name: 'Lien', teams: ['Germany', 'Canada', 'Iraq', 'Switzerland'] },
 { name: 'Noah', teams: ['Belgium', 'Algeria', 'Qatar'] },
 { name: 'Oma', teams: ['Croatia', 'Australia', 'Ghana', 'Japan'] },
 { name: 'Opa', teams: ['Argentina', 'Scotland', 'DR Congo', 'USA'] },
 { name: 'Oscar', teams: ['Brazil', 'Egypt', 'New Zealand'] },
 { name: 'Peet', teams: ['Jordan', 'Paraguay', 'Senegal', 'Iran'] },
 { name: 'Pie', teams: ['France', 'Czechia', 'Tunisia', 'Uruguay'] },
 { name: 'Sara', teams: ['Netherlands', 'Austria', 'South Africa'] },
 { name: 'Stan', teams: ['England', 'Ecuador', 'Haiti'] },
 { name: 'Stella', teams: ['Morocco', 'South Korea', 'Cabo Verde', 'Türkiye'] },
 { name: 'Teo', teams: ['Spain', 'Norway', 'Curaçao'] },
];

// Internal normalized version used by the app: { name, teamCodes: string[] }.
function normalizeTeamNameInput(s) {
  if (s == null) return '';
  // Lowercase + remove diacritics (e.g., "Türkiye" -> "turkiye")
  return String(s).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

// Build "full country name" -> team code index from `data.js`.
const FULL_NAME_TO_TEAM_CODE = (() => {
  const idx = {};
  if (typeof ALL_TEAMS === 'undefined') return idx;
  for (const t of ALL_TEAMS) idx[normalizeTeamNameInput(t.name)] = t.code;
  return idx;
})();

function fullTeamNameToCode(fullName) {
  if (!fullName) return null;
  return FULL_NAME_TO_TEAM_CODE[normalizeTeamNameInput(fullName)] || null;
}

const HARD_CODED_PLAYERS = HARD_CODED_PLAYER_INPUT.map((p, idx) => {
  const name = (p && p.name) ? String(p.name).trim() : `Player ${idx + 1}`;
  const rawTeams = Array.isArray(p?.teams) ? p.teams : [];
  const codes = rawTeams
    .map((t) => {
      if (!t) return null;
      const s = String(t).trim();
      // First: try to match by full country name.
      const byName = fullTeamNameToCode(s);
      if (byName) return byName;

      // If it looks like a 3-letter code, reject it.
      if (/^[A-Za-z]{3}$/.test(s)) {
        console.warn(
          `Team "${s}" for player "${name}" was not found as a full country name. ` +
            `3-letter codes are not allowed.`
        );
      }
      return null;
    })
    .filter(Boolean);
  return { name, teamCodes: codes };
});

const KNOCKOUT_BONUS = {
  r32: 2,
  r16: 4,
  qf: 6,
  sf: 9,
  final: 15,
  runnerUp: 12,
};

const STAGE_ORDER = ['group', 'r32', 'r16', 'qf', 'sf', 'final'];

function defaultState() {
  return {
    setupComplete: true,
    picksLocked: true,
    picksLockedAt: null,
    players: HARD_CODED_PLAYERS,
    matches: generateDefaultMatches(),
    knockoutTeams: {},
    lastSyncAt: null,
    syncSource: null,
    lastSyncCount: 0,
    lastLeaderboard: [],
    rankMovement: {},
    dataVersion: DATA_VERSION,
  };
}

function arePicksLocked(state) {
  return !!(state?.picksLocked || state?.setupComplete);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const needsRegeneration = parsed.dataVersion !== DATA_VERSION;
      return {
        // Team picks are fixed in code, so always treat setup as locked.
        setupComplete: true,
        picksLocked: true,
        picksLockedAt: parsed.picksLockedAt ?? null,
        players: HARD_CODED_PLAYERS,
        matches: needsRegeneration ? generateDefaultMatches() : (parsed.matches?.length ? parsed.matches : generateDefaultMatches()),
        knockoutTeams: needsRegeneration ? {} : (parsed.knockoutTeams ?? {}),
        lastSyncAt: needsRegeneration ? null : (parsed.lastSyncAt ?? null),
        syncSource: needsRegeneration ? null : (parsed.syncSource ?? null),
        lastSyncCount: needsRegeneration ? 0 : (parsed.lastSyncCount ?? 0),
        lastLeaderboard: needsRegeneration ? [] : (Array.isArray(parsed.lastLeaderboard) ? parsed.lastLeaderboard : []),
        rankMovement: needsRegeneration ? {} : (parsed.rankMovement ?? {}),
        dataVersion: DATA_VERSION,
      };
    }
    const legacy = localStorage.getItem('wcSweepstake_v1');
    if (legacy) {
      const old = JSON.parse(legacy);
      return {
        setupComplete: true,
        picksLocked: true,
        picksLockedAt: old?.picksLockedAt ?? null,
        players: HARD_CODED_PLAYERS,
        matches: generateDefaultMatches(),
        knockoutTeams: {},
        lastSyncAt: null,
        syncSource: null,
        lastSyncCount: 0,
        lastLeaderboard: [],
        rankMovement: {},
        dataVersion: DATA_VERSION,
      };
    }
  } catch {
    /* fall through */
  }
  return defaultState();
}

function saveState(state) {
  const { players, ...rest } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

function getPlayers(state) {
  return state.players || [];
}

function getPlayerByTeamCode(state, code) {
  const players = getPlayers(state);
  for (const player of players) {
    if (player.teamCodes && player.teamCodes.includes(code)) {
      return player.name;
    }
  }
  return null;
}

function matchPlayed(m) {
  return m.homeScore !== null && m.awayScore !== null && m.homeScore !== '' && m.awayScore !== '';
}

function groupMatchPoints(homeScore, awayScore) {
  if (homeScore > awayScore) return { home: 3, away: 0 };
  if (homeScore < awayScore) return { home: 0, away: 3 };
  return { home: 1, away: 1 };
}

function buildGroupStandings(matches) {
  const groups = {};
  const groupMatches = matches.filter((m) => m.stage === 'group' && matchPlayed(m));

  for (const m of groupMatches) {
    if (!groups[m.group]) groups[m.group] = {};
    const register = (code) => {
      if (!code) return;
      if (!groups[m.group][code]) {
        groups[m.group][code] = { code, pts: 0, gd: 0, gf: 0, played: 0, w: 0, d: 0, l: 0 };
      }
    };
    register(m.home);
    register(m.away);

    const { home: hp, away: ap } = groupMatchPoints(m.homeScore, m.awayScore);
    const h = groups[m.group][m.home];
    const a = groups[m.group][m.away];
    h.pts += hp;
    h.gf += m.homeScore;
    h.gd += m.homeScore - m.awayScore;
    h.played += 1;
    a.pts += ap;
    a.gf += m.awayScore;
    a.gd += m.awayScore - m.homeScore;
    a.played += 1;
    if (hp === 3) {
      h.w += 1;
      a.l += 1;
    } else if (ap === 3) {
      a.w += 1;
      h.l += 1;
    } else {
      h.d += 1;
      a.d += 1;
    }
  }

  const bonuses = {};
  const tables = {};
  for (const group of Object.keys(groups)) {
    const teams = Object.values(groups[group]).sort((x, y) => {
      if (y.pts !== x.pts) return y.pts - x.pts;
      if (y.gd !== x.gd) return y.gd - x.gd;
      return y.gf - x.gf;
    });
    tables[group] = teams;
    if (teams[0]) bonuses[teams[0].code] = (bonuses[teams[0].code] || 0) + 3;
    if (teams[1]) bonuses[teams[1].code] = (bonuses[teams[1].code] || 0) + 1;
  }
  return { bonuses, tables };
}

function getKnockoutReach(matches, knockoutTeams) {
  const reach = { ...knockoutTeams };

  const knockoutMatches = matches
    .filter((m) => m.stage !== 'group' && matchPlayed(m))
    .sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage));

  for (const m of knockoutMatches) {
    const stage = m.stage;
    if (m.home) reach[m.home] = maxStage(reach[m.home], stage);
    if (m.away) reach[m.away] = maxStage(reach[m.away], stage);

    if (m.homeScore === m.awayScore) continue;
    const winner = m.homeScore > m.awayScore ? m.home : m.away;
    const loser = m.homeScore > m.awayScore ? m.away : m.home;

    if (stage === 'final') {
      reach[winner] = 'final';
      reach[loser] = 'runnerUp';
    } else {
      const next = nextStage(stage);
      if (next && winner) reach[winner] = maxStage(reach[winner], next);
    }
  }
  return reach;
}

function maxStage(a, b) {
  if (!a) return b;
  if (!b) return a;
  const order = [...STAGE_ORDER, 'runnerUp'];
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
}

function nextStage(stage) {
  const i = STAGE_ORDER.indexOf(stage);
  return i >= 0 && i < STAGE_ORDER.length - 1 ? STAGE_ORDER[i + 1] : null;
}

function knockoutPointsForStage(stage) {
  if (stage === 'runnerUp') return KNOCKOUT_BONUS.runnerUp;
  if (stage === 'final') return KNOCKOUT_BONUS.final;
  return KNOCKOUT_BONUS[stage] || 0;
}

function calculateTeamPoints(state) {
  const { matches, knockoutTeams } = state;
  const points = {};

  const init = (code) => {
    if (code) points[code] = 0;
  };

  for (const m of matches) {
    if (m.stage !== 'group' || !matchPlayed(m)) continue;
    init(m.home);
    init(m.away);
    const { home, away } = groupMatchPoints(m.homeScore, m.awayScore);
    points[m.home] += home;
    points[m.away] += away;
  }

  const { bonuses } = buildGroupStandings(matches);
  for (const [code, bonus] of Object.entries(bonuses)) {
    init(code);
    points[code] = (points[code] || 0) + bonus;
  }

  const reach = getKnockoutReach(matches, knockoutTeams);
  for (const [code, stage] of Object.entries(reach)) {
    if (!code) continue;
    init(code);
    points[code] = (points[code] || 0) + knockoutPointsForStage(stage);
  }

  return points;
}

function countTeamMatchesPlayed(state, code) {
  if (!code) return 0;
  return state.matches.filter(
    (m) => matchPlayed(m) && (m.home === code || m.away === code)
  ).length;
}

function playerGamesPlayed(state, teamCodes) {
  return (teamCodes || []).reduce((sum, c) => sum + countTeamMatchesPlayed(state, c), 0);
}

function computeRankMovement(row, prevSnapshot) {
  const prev = (prevSnapshot || []).find((p) => p.player === row.player);
  if (!prev) return { text: '—', class: 'move-new', title: 'New on leaderboard' };
  const diff = prev.rank - row.rank;
  if (diff > 0) return { text: `↑${diff}`, class: 'move-up', title: `Up ${diff} place${diff > 1 ? 's' : ''}` };
  if (diff < 0) {
    const n = Math.abs(diff);
    return { text: `↓${n}`, class: 'move-down', title: `Down ${n} place${n > 1 ? 's' : ''}` };
  }
  return { text: '—', class: 'move-same', title: 'No change' };
}

function buildLeaderboardRows(state) {
  const teamPts = calculateTeamPoints(state);
  const rows = getPlayers(state).map((p) => {
    const codes = p.teamCodes || [];
    const totalPoints = codes.reduce((sum, c) => sum + (teamPts[c] || 0), 0);
    const points = codes.length > 0 ? totalPoints / codes.length : 0;
    return {
      player: p.name,
      teamCodes: codes,
      points,
      gamesPlayed: playerGamesPlayed(state, codes),
    };
  });
  rows.sort((a, b) => b.points - a.points);
  return rows.map((r, i) => ({ rank: i + 1, ...r }));
}

function updateLeaderboardSnapshots(state) {
  const board = buildLeaderboardRows(state);
  const movement = {};
  for (const row of board) {
    movement[row.player] = computeRankMovement(row, state.lastLeaderboard);
  }
  state.rankMovement = movement;
  state.lastLeaderboard = board.map((r) => ({
    player: r.player,
    rank: r.rank,
    points: r.points,
  }));
  return state;
}

function getLeaderboard(state) {
  return buildLeaderboardRows(state).map((row) => ({
    ...row,
    movement:
      state.rankMovement?.[row.player] ||
      computeRankMovement(row, state.lastLeaderboard),
  }));
}

function getTeamStats(state, code) {
  const teamPts = calculateTeamPoints(state);
  const { tables, bonuses } = buildGroupStandings(state.matches);
  const reach = getKnockoutReach(state.matches, state.knockoutTeams);
  const groupRow = Object.entries(tables).find(([, teams]) =>
    teams.some((t) => t.code === code)
  );
  const gs = groupRow?.[1]?.find((t) => t.code === code);
  const posIdx = groupRow ? groupRow[1].findIndex((t) => t.code === code) : -1;
  const groupPts = gs?.pts ?? 0;
  const groupBonus = bonuses[code] || 0;
  const knockoutPts = knockoutPointsForStage(reach[code] || '');
  const matchPts = (teamPts[code] || 0) - groupBonus - knockoutPts;

  return {
    code,
    team: getTeamByCode(code),
    totalPoints: teamPts[code] || 0,
    matchPoints: Math.max(0, matchPts),
    groupBonus,
    knockoutPoints: knockoutPts,
    knockoutStage: reach[code] || null,
    played: countTeamMatchesPlayed(state, code),
    w: gs?.w ?? 0,
    d: gs?.d ?? 0,
    l: gs?.l ?? 0,
    gd: gs?.gd ?? 0,
    group: groupRow?.[0] ?? '—',
    groupPosition: posIdx >= 0 ? posIdx + 1 : null,
    groupPts,
  };
}

function getPlayerProfile(state, playerName) {
  const player = getPlayers(state).find(
    (p) => p.name.toLowerCase() === playerName.toLowerCase()
  );
  if (!player) return null;
  const board = getLeaderboard(state);
  const row = board.find((r) => r.player === player.name);
  const teams = (player.teamCodes || []).map((code) => getTeamStats(state, code));
  return {
    name: player.name,
    rank: row?.rank ?? '—',
    totalPoints: row?.points ?? 0,
    gamesPlayed: row?.gamesPlayed ?? 0,
    movement: row?.movement,
    teams,
  };
}

function categorizeMatches(state) {
  const today = getLocalDateString();
  const buckets = { today: [], live: [], upcoming: [], completed: [] };

  for (const m of state.matches) {
    if (!m.home && !m.away) continue;
    const played = matchPlayed(m);
    const entry = { ...m, played };
    const matchDay = matchLocalDate(m);

    if (played) {
      buckets.completed.push(entry);
    } else if (matchDay > today) {
      buckets.upcoming.push(entry);
    } else if (matchDay === today) {
      buckets.today.push(entry);
      buckets.live.push(entry);
    } else {
      buckets.upcoming.push(entry);
    }
  }

  const byDate = (a, b) =>
    matchLocalDate(a).localeCompare(matchLocalDate(b)) ||
    (a.kickoff || '').localeCompare(b.kickoff || '') ||
    (a.matchNum || 0) - (b.matchNum || 0);
  buckets.completed.sort((a, b) => matchLocalDate(b).localeCompare(matchLocalDate(a)));
  buckets.today.sort(byDate);
  buckets.live.sort(byDate);
  buckets.upcoming.sort(byDate);
  return buckets;
}

function getTeamRankings(state) {
  const teamPts = calculateTeamPoints(state);
  const { tables } = buildGroupStandings(state.matches);
  const groupByTeam = {};
  Object.entries(tables).forEach(([g, teams]) => {
    teams.forEach((t, idx) => {
      groupByTeam[t.code] = { group: g, position: idx + 1, ...t };
    });
  });

  return getAllTournamentTeamCodes()
    .map((code) => {
      const team = getTeamByCode(code);
      const gs = groupByTeam[code];
      return {
        code,
        team,
        points: teamPts[code] || 0,
        played: gs?.played ?? 0,
        w: gs?.w ?? 0,
        d: gs?.d ?? 0,
        l: gs?.l ?? 0,
        gd: gs?.gd ?? 0,
        group: gs?.group ?? '—',
        groupPts: gs?.pts ?? 0,
      };
    })
    .sort((a, b) => b.points - a.points || b.gd - a.gd);
}

function updateMatches(state, date, formMatches) {
  const byId = Object.fromEntries(formMatches.map((m) => [m.id, m]));
  state.matches = state.matches.map((m) => {
    if (m.date !== date) return m;
    const upd = byId[m.id];
    if (!upd) return m;
    return {
      ...m,
      homeScore: upd.homeScore === '' ? null : Number(upd.homeScore),
      awayScore: upd.awayScore === '' ? null : Number(upd.awayScore),
      home: upd.home ?? m.home,
      away: upd.away ?? m.away,
    };
  });
  saveState(state);
  return state;
}

function saveKnockoutProgress(state, knockoutTeams) {
  state.knockoutTeams = knockoutTeams;
  saveState(state);
  return state;
}

function getMatchDatesFromState(state) {
  return getMatchDates(state.matches);
}
