/** @typedef {{ code: string, name: string, fifaRank: number, confederation: string }} Team */
/** @typedef {{ id: string, name: string, teamCodes: string[] }} Player */

const TEAMS = /** @type {Team[]} */ ([
  { code: 'ARG', name: 'Argentina', fifaRank: 1, confederation: 'CONMEBOL' },
  { code: 'FRA', name: 'France', fifaRank: 2, confederation: 'UEFA' },
  { code: 'BRA', name: 'Brazil', fifaRank: 3, confederation: 'CONMEBOL' },
  { code: 'ENG', name: 'England', fifaRank: 4, confederation: 'UEFA' },
  { code: 'BEL', name: 'Belgium', fifaRank: 5, confederation: 'UEFA' },
  { code: 'POR', name: 'Portugal', fifaRank: 6, confederation: 'UEFA' },
  { code: 'NED', name: 'Netherlands', fifaRank: 7, confederation: 'UEFA' },
  { code: 'ESP', name: 'Spain', fifaRank: 8, confederation: 'UEFA' },
  { code: 'CRO', name: 'Croatia', fifaRank: 10, confederation: 'UEFA' },
  { code: 'URU', name: 'Uruguay', fifaRank: 11, confederation: 'CONMEBOL' },
  { code: 'MAR', name: 'Morocco', fifaRank: 12, confederation: 'CAF' },
  { code: 'COL', name: 'Colombia', fifaRank: 13, confederation: 'CONMEBOL' },
  { code: 'GER', name: 'Germany', fifaRank: 14, confederation: 'UEFA' },
  { code: 'MEX', name: 'Mexico', fifaRank: 15, confederation: 'CONCACAF' },
  { code: 'USA', name: 'USA', fifaRank: 16, confederation: 'CONCACAF' },
  { code: 'SEN', name: 'Senegal', fifaRank: 17, confederation: 'CAF' },
  { code: 'JPN', name: 'Japan', fifaRank: 18, confederation: 'AFC' },
  { code: 'SUI', name: 'Switzerland', fifaRank: 19, confederation: 'UEFA' },
  { code: 'IRN', name: 'Iran', fifaRank: 20, confederation: 'AFC' },
  { code: 'DEN', name: 'Denmark', fifaRank: 21, confederation: 'UEFA' },
  { code: 'KOR', name: 'South Korea', fifaRank: 22, confederation: 'AFC' },
  { code: 'ECU', name: 'Ecuador', fifaRank: 23, confederation: 'CONMEBOL' },
  { code: 'AUS', name: 'Australia', fifaRank: 24, confederation: 'AFC' },
  { code: 'AUT', name: 'Austria', fifaRank: 27, confederation: 'UEFA' },
  { code: 'COD', name: 'DR Congo', fifaRank: 28, confederation: 'CAF' },
  { code: 'QAT', name: 'Qatar', fifaRank: 35, confederation: 'AFC' },
  { code: 'CAN', name: 'Canada', fifaRank: 48, confederation: 'CONCACAF' },
]);

const EXTRA_TEAMS = [
  { code: 'RSA', name: 'South Africa', fifaRank: 59, confederation: 'CAF' },
  { code: 'CZE', name: 'Czechia', fifaRank: 31, confederation: 'UEFA' },
  { code: 'BIH', name: 'Bosnia and Herzegovina', fifaRank: 75, confederation: 'UEFA' },
  { code: 'SCO', name: 'Scotland', fifaRank: 36, confederation: 'UEFA' },
  { code: 'HTI', name: 'Haiti', fifaRank: 87, confederation: 'CONCACAF' },
  { code: 'PAR', name: 'Paraguay', fifaRank: 54, confederation: 'CONMEBOL' },
  { code: 'TUR', name: 'Türkiye', fifaRank: 32, confederation: 'UEFA' },
  { code: 'CUW', name: 'Curaçao', fifaRank: 88, confederation: 'CONCACAF' },
  { code: 'CIV', name: "Côte d'Ivoire", fifaRank: 37, confederation: 'CAF' },
  { code: 'TUN', name: 'Tunisia', fifaRank: 40, confederation: 'CAF' },
  { code: 'SWE', name: 'Sweden', fifaRank: 34, confederation: 'UEFA' },
  { code: 'EGY', name: 'Egypt', fifaRank: 33, confederation: 'CAF' },
  { code: 'NZL', name: 'New Zealand', fifaRank: 93, confederation: 'OFC' },
  { code: 'CPV', name: 'Cabo Verde', fifaRank: 65, confederation: 'CAF' },
  { code: 'KSA', name: 'Saudi Arabia', fifaRank: 56, confederation: 'AFC' },
  { code: 'NOR', name: 'Norway', fifaRank: 45, confederation: 'UEFA' },
  { code: 'IRQ', name: 'Iraq', fifaRank: 55, confederation: 'AFC' },
  { code: 'ALG', name: 'Algeria', fifaRank: 43, confederation: 'CAF' },
  { code: 'JOR', name: 'Jordan', fifaRank: 70, confederation: 'AFC' },
  { code: 'UZB', name: 'Uzbekistan', fifaRank: 64, confederation: 'AFC' },
  { code: 'GHA', name: 'Ghana', fifaRank: 42, confederation: 'CAF' },
  { code: 'PAN', name: 'Panama', fifaRank: 41, confederation: 'CONCACAF' },
];

const ALL_TEAMS = [...TEAMS, ...EXTRA_TEAMS];

const DEFAULT_MATCHES = generateDefaultMatches();
const MATCH_DATES = getMatchDates(DEFAULT_MATCHES);

function getTeamByCode(code) {
  return ALL_TEAMS.find((t) => t.code === code);
}

/** FIFA / app codes → ISO 3166-1 alpha-2 for real flag images */
const FIFA_TO_ISO2 = {
  ALG: 'dz',
  ARG: 'ar',
  AUS: 'au',
  AUT: 'at',
  BEL: 'be',
  BIH: 'ba',
  BRA: 'br',
  CAN: 'ca',
  CIV: 'ci',
  COL: 'co',
  CPV: 'cv',
  CRO: 'hr',
  CZE: 'cz',
  DEN: 'dk',
  ECU: 'ec',
  EGY: 'eg',
  ENG: 'gb-eng',
  ESP: 'es',
  FRA: 'fr',
  GER: 'de',
  GHA: 'gh',
  HTI: 'ht',
  IRN: 'ir',
  IRQ: 'iq',
  JOR: 'jo',
  JPN: 'jp',
  KOR: 'kr',
  KSA: 'sa',
  MAR: 'ma',
  MEX: 'mx',
  NED: 'nl',
  NOR: 'no',
  NZL: 'nz',
  PAN: 'pa',
  PAR: 'py',
  COD: 'cd',
  POR: 'pt',
  QAT: 'qa',
  RSA: 'za',
  SCO: 'gb-sct',
  SEN: 'sn',
  SUI: 'ch',
  SWE: 'se',
  TUN: 'tn',
  TUR: 'tr',
  URU: 'uy',
  USA: 'us',
  UZB: 'uz',
  CUW: 'cw',
};

function getFlagIso(code) {
  if (!code) return null;
  const key = code.toUpperCase();
  return FIFA_TO_ISO2[key] || (key.length === 2 ? key.toLowerCase() : null);
}

function flagUrl(code, size = 40) {
  const iso = getFlagIso(code);
  if (!iso) return null;
  return `https://flagcdn.com/w${size}/${iso}.png`;
}

function renderFlag(code, size = 40) {
  const url = flagUrl(code, size);
  const team = getTeamByCode(code);
  const label = team?.name || code || 'Team';
  if (!url) return '<span class="flag flag-fallback" aria-hidden="true">🏳️</span>';
  return `<img class="flag-img" src="${url}" width="${Math.round(size * 0.75)}" height="${Math.round(size * 0.56)}" alt="" loading="lazy" title="${label}" />`;
}

function flagEmoji(code) {
  const iso = getFlagIso(code);
  if (!iso || iso.includes('-')) return '🏳️';
  const a = 0x1f1e6 - 65;
  const two = iso.replace(/-.*/, '').toUpperCase();
  if (two.length !== 2) return '🏳️';
  return String.fromCodePoint(...[...two].map((c) => a + c.charCodeAt(0)));
}

const UK_TIMEZONE = 'Europe/London';

function getLocalDateString(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: UK_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function parseKickoffInstant(kickoff) {
  if (!kickoff) return null;
  const iso =
    kickoff.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(kickoff) ? kickoff : `${kickoff}Z`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** UK calendar date for a match, derived from kick-off when available. */
function matchLocalDate(m) {
  const d = parseKickoffInstant(m?.kickoff);
  return d ? getLocalDateString(d) : m.date;
}

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Parse "18:00 UTC-4" style strings into an ISO UTC timestamp. */
function parseKickoff(date, timeStr) {
  if (!date || !timeStr) return null;
  const m = String(timeStr).match(/^(\d{1,2}):(\d{2})\s+UTC([+-]?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const hours = parseInt(m[1], 10);
  const mins = parseInt(m[2], 10);
  const offsetHours = parseFloat(m[3]);
  const utcMs = Date.UTC(
    parseInt(date.slice(0, 4), 10),
    parseInt(date.slice(5, 7), 10) - 1,
    parseInt(date.slice(8, 10), 10),
    hours - offsetHours,
    mins
  );
  return new Date(utcMs).toISOString();
}

function formatMatchTime(m) {
  const d = parseKickoffInstant(m?.kickoff);
  if (!d) return '';
  return d.toLocaleTimeString('en-GB', {
    timeZone: UK_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMatchDateTime(m) {
  const d = parseKickoffInstant(m?.kickoff);
  if (d) {
    return d.toLocaleString('en-GB', {
      timeZone: UK_TIMEZONE,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return formatDate(m.date);
}