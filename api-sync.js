/** Live World Cup data — TheSportsDB (primary) + openfootball JSON (fallback). */

const THESPORTSDB_SEASON_URL =
  'https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4429&s=2026';
const OPENFOOTBALL_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

const SYNC_INTERVAL_MS = 5 * 1000;
let syncInFlight = false;

function buildTeamNameIndex() {
  const index = {};
  const add = (name, code) => {
    if (!name) return;
    index[name.toLowerCase().trim()] = code;
  };
  for (const t of ALL_TEAMS) {
    add(t.name, t.code);
  }
  const aliases = {
    'south africa': 'RSA',
    'south korea': 'KOR',
    'korea republic': 'KOR',
    'czech republic': 'CZE',
    'czechia': 'CZE',
    'bosnia-herzegovina': 'BIH',
    'bosnia & herzegovina': 'BIH',
    'bosnia and herzegovina': 'BIH',
    'united states': 'USA',
    'u.s.a.': 'USA',
    'ivory coast': 'CIV',
    "côte d'ivoire": 'CIV',
    'cote divoire': 'CIV',
    'curacao': 'CUW',
    'curaçao': 'CUW',
    'cape verde': 'CPV',
    'cabo verde': 'CPV',
    'saudi arabia': 'KSA',
    'turkey': 'TUR',
    'türkiye': 'TUR',
    'iran': 'IRN',
    'republic of ireland': 'IRL',
    'scotland': 'SCO',
    'england': 'ENG',
    'wales': 'WAL',
    'norway': 'NOR',
    'netherlands': 'NED',
    'holland': 'NED',
    'germany': 'GER',
    'spain': 'ESP',
    'france': 'FRA',
    'portugal': 'POR',
    'brazil': 'BRA',
    'argentina': 'ARG',
    'mexico': 'MEX',
    'canada': 'CAN',
    'japan': 'JPN',
    'morocco': 'MAR',
    'senegal': 'SEN',
    'ghana': 'GHA',
    'nigeria': 'NGA',
    'egypt': 'EGY',
    'australia': 'AUS',
    'new zealand': 'NZL',
    'ecuador': 'ECU',
    'uruguay': 'URU',
    'colombia': 'COL',
    'paraguay': 'PAR',
    'chile': 'CHI',
    'peru': 'PER',
    'panama': 'PAN',
    'costa rica': 'CRC',
    'honduras': 'HON',
    'jamaica': 'JAM',
    'haiti': 'HTI',
    'qatar': 'QAT',
    'tunisia': 'TUN',
    'algeria': 'ALG',
    'cameroon': 'CMR',
    'dr congo': 'COD',
    'democratic republic of congo': 'COD',
    'congo': 'COD',
    'congo dr': 'COD',
    'poland': 'POL',
    'croatia': 'CRO',
    'serbia': 'SRB',
    'switzerland': 'SUI',
    'austria': 'AUT',
    'belgium': 'BEL',
    'sweden': 'SWE',
    'denmark': 'DEN',
    'finland': 'FIN',
    'iceland': 'ISL',
    'ukraine': 'UKR',
    'russia': 'RUS',
    'uzbekistan': 'UZB',
    'iraq': 'IRQ',
    'jordan': 'JOR',
    'china': 'CHN',
    'indonesia': 'IDN',
    'thailand': 'THA',
    'vietnam': 'VNM',
  };
  for (const [name, code] of Object.entries(aliases)) add(name, code);
  return index;
}

const TEAM_NAME_INDEX = buildTeamNameIndex();

function teamNameToCode(name) {
  if (!name) return null;
  const n = name.toLowerCase().trim();
  if (TEAM_NAME_INDEX[n]) return TEAM_NAME_INDEX[n];
  const hit = ALL_TEAMS.find(
    (t) => t.name.toLowerCase() === n || t.code.toLowerCase() === n
  );
  return hit?.code || null;
}

function pairKey(a, b) {
  return [a, b].sort().join('|');
}

function apiRoundToStage(round) {
  const r = (round || '').toLowerCase();
  if (r.includes('round of 32') || r === 'r32') return 'r32';
  if (r.includes('round of 16') || r === 'r16') return 'r16';
  if (r.includes('quarter')) return 'qf';
  if (r.includes('semi') && !r.includes('quarter')) return 'sf';
  if (r === 'final' || r.includes('final') && !r.includes('semi') && !r.includes('quarter')) return 'final';
  if (r.includes('third')) return 'sf';
  return null;
}

function normalizeApiEvents(events) {
  return (events || [])
    .map((ev) => normalizeApiEvent(ev))
    .filter((e) => e.home && e.away);
}

function normalizeApiEvent(ev) {
  const home = teamNameToCode(ev.strHomeTeam || ev.team1);
  const away = teamNameToCode(ev.strAwayTeam || ev.team2);
  const group = (ev.strGroup || ev.group || '').toString().replace(/group\s*/i, '').trim().toUpperCase();
  const round = ev.strRound || ev.round || '';
  const stage = apiRoundToStage(round) || (group ? 'group' : null);
  let homeScore = null;
  let awayScore = null;

  if (ev.score?.ft) {
    homeScore = ev.score.ft[0];
    awayScore = ev.score.ft[1];
  } else if (ev.intHomeScore != null && ev.intAwayScore != null && ev.intHomeScore !== '') {
    homeScore = Number(ev.intHomeScore);
    awayScore = Number(ev.intAwayScore);
  }

  const status = (ev.strStatus || '').toLowerCase();
  const finished =
    homeScore != null &&
    awayScore != null &&
    !Number.isNaN(homeScore) &&
    !Number.isNaN(awayScore) &&
    (status.includes('finished') ||
      status === 'ft' ||
      status === 'aet' ||
      status === 'pen' ||
      !!ev.score?.ft);

  let kickoff = null;
  if (ev.strTimestamp) {
    kickoff = ev.strTimestamp.endsWith('Z') ? ev.strTimestamp : `${ev.strTimestamp}Z`;
  } else if (ev.date && ev.time) {
    kickoff = parseKickoff(ev.date, ev.time);
  }

  return {
    date: ev.dateEventLocal || ev.dateEvent || ev.date,
    kickoff,
    home,
    away,
    group,
    stage,
    homeScore,
    awayScore,
    finished,
    pair: home && away ? pairKey(home, away) : null,
  };
}

function normalizeScheduleEvents(events) {
  return (events || [])
    .map((ev) => normalizeApiEvent(ev))
    .filter((e) => e.home && e.away);
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchTheSportsDbRawEvents() {
  const byId = new Map();

  const addRaw = (list) => {
    for (const ev of list || []) {
      if (ev?.idEvent) byId.set(ev.idEvent, ev);
    }
  };

  try {
    const season = await fetchJson(THESPORTSDB_SEASON_URL);
    addRaw(season.events);
  } catch {
    /* continue */
  }

  for (let round = 1; round <= 12; round += 1) {
    try {
      const data = await fetchJson(
        `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=4429&r=${round}&s=2026`
      );
      if (!data.events?.length) break;
      addRaw(data.events);
    } catch {
      break;
    }
  }

  return [...byId.values()];
}

async function fetchTheSportsDbEvents() {
  return normalizeApiEvents(await fetchTheSportsDbRawEvents());
}

async function fetchOpenFootballEvents() {
  const data = await fetchJson(OPENFOOTBALL_URL);
  const matches = (data.matches || []).map((m) => ({
    strHomeTeam: m.team1,
    strAwayTeam: m.team2,
    dateEvent: m.date,
    time: m.time,
    strGroup: (m.group || '').replace(/group\s*/i, ''),
    strRound: m.round,
    strStatus: m.score ? 'Match Finished' : 'NS',
    score: m.score,
    intHomeScore: m.score?.ft?.[0],
    intAwayScore: m.score?.ft?.[1],
  }));
  return normalizeApiEvents(matches);
}

async function fetchOpenFootballSchedule() {
  const data = await fetchJson(OPENFOOTBALL_URL);
  const matches = (data.matches || []).map((m) => ({
    strHomeTeam: m.team1,
    strAwayTeam: m.team2,
    dateEvent: m.date,
    time: m.time,
    strGroup: (m.group || '').replace(/group\s*/i, ''),
    strRound: m.round,
    strStatus: m.score ? 'Match Finished' : 'NS',
    score: m.score,
    intHomeScore: m.score?.ft?.[0],
    intAwayScore: m.score?.ft?.[1],
  }));
  return normalizeScheduleEvents(matches);
}

function eventMergeKey(ev) {
  return `${ev.pair}|${ev.group || ''}|${ev.stage || ''}|${ev.date || ''}`;
}

async function loadExternalSchedule() {
  const merged = new Map();
  const sources = [];

  try {
    for (const ev of await fetchOpenFootballSchedule()) {
      merged.set(eventMergeKey(ev), ev);
    }
    sources.push('openfootball');
  } catch {
    /* optional */
  }

  try {
    for (const ev of normalizeScheduleEvents(await fetchTheSportsDbRawEvents())) {
      merged.set(eventMergeKey(ev), ev);
    }
    sources.push('TheSportsDB');
  } catch {
    /* optional */
  }

  return {
    events: [...merged.values()],
    source: sources.length ? sources.join(' + ') : null,
  };
}

function findMatchingEvent(localMatch, apiEvents) {
  const home = localMatch.home;
  const away = localMatch.away;
  if (!home || !away) return null;

  const localPair = pairKey(home, away);
  const localGroup = (localMatch.group || '').toUpperCase();

  const candidates = apiEvents.filter((ev) => {
    if (ev.pair !== localPair) return false;
    if (localMatch.stage === 'group' && localGroup && ev.group && ev.group !== localGroup) return false;
    if (localMatch.stage !== 'group' && ev.stage && ev.stage !== localMatch.stage) return false;
    return true;
  });

  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  const sameDay = candidates.filter((c) => c.date === localMatch.date);
  if (sameDay.length) return sameDay[0];
  return candidates[0];
}

function applyEventsToState(state, apiEvents) {
  let updated = 0;
  state.matches = state.matches.map((m) => {
    const hit = findMatchingEvent(m, apiEvents);
    if (!hit) return m;
    const changed =
      m.homeScore !== hit.homeScore ||
      m.awayScore !== hit.awayScore ||
      (!m.home && hit.home) ||
      (!m.away && hit.away);
    if (!changed) return m;
    updated += 1;
    return {
      ...m,
      home: m.home || hit.home,
      away: m.away || hit.away,
      homeScore: hit.homeScore,
      awayScore: hit.awayScore,
    };
  });
  return updated;
}

function applyScheduleToState(state, scheduleEvents) {
  let updated = 0;
  state.matches = state.matches.map((m) => {
    const hit = findMatchingEvent(m, scheduleEvents);
    if (!hit?.kickoff || hit.kickoff === m.kickoff) return m;
    updated += 1;
    return { ...m, kickoff: hit.kickoff };
  });
  return updated;
}

async function loadExternalEvents() {
  const merged = new Map();
  const sources = [];

  try {
    for (const ev of await fetchOpenFootballEvents()) {
      merged.set(eventMergeKey(ev), ev);
    }
    sources.push('openfootball');
  } catch {
    /* optional */
  }

  try {
    for (const ev of await fetchTheSportsDbEvents()) {
      merged.set(eventMergeKey(ev), ev);
    }
    sources.push('TheSportsDB');
  } catch {
    /* optional */
  }

  const events = [...merged.values()];
  return {
    events,
    source: sources.length ? sources.join(' + ') : null,
  };
}

async function syncWorldCupData() {
  if (syncInFlight) return loadState();
  const state = loadState();
  if (!arePicksLocked(state)) return state;

  syncInFlight = true;
  try {
    const [{ events, source: scoreSource }, { events: scheduleEvents, source: scheduleSource }] =
      await Promise.all([loadExternalEvents(), loadExternalSchedule()]);
    const scoreCount = applyEventsToState(state, events);
    const scheduleCount = applyScheduleToState(state, scheduleEvents);
    const count = scoreCount + scheduleCount;
    const source = [scoreSource, scheduleSource].filter(Boolean).join(' + ') || null;
    state.lastSyncAt = new Date().toISOString();
    state.syncSource = source;
    state.lastSyncCount = count;
    updateLeaderboardSnapshots(state);
    saveState(state);
    document.dispatchEvent(
      new CustomEvent('wc-sync-complete', { detail: { count, source } })
    );
    return state;
  } finally {
    syncInFlight = false;
  }
}

function startAutoSync() {
  const state = loadState();
  if (!arePicksLocked(loadState())) return;

  syncWorldCupData().catch(() => {});

  if (window.__wcSyncInterval) clearInterval(window.__wcSyncInterval);
  window.__wcSyncInterval = setInterval(() => {
    syncWorldCupData().catch(() => {});
  }, SYNC_INTERVAL_MS);
}

function formatSyncStatus(state) {
  if (!state?.lastSyncAt) {
    return 'Waiting for first sync from live World Cup data…';
  }
  const when = new Date(state.lastSyncAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: UK_TIMEZONE,
  });
  const src = state.syncSource || 'API';
  return `Last updated ${when} via ${src}`;
}
