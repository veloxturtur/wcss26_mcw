/** 2026 FIFA World Cup — groups A–L (48 teams). Codes used across the app. */
const WC2026_GROUPS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'QAT', 'SUI', 'BIH'],
  C: ['BRA', 'MAR', 'SCO', 'HTI'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'TUN', 'SWE'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'NOR', 'IRQ'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COL', 'UZB', 'COD'],
  L: ['ENG', 'GHA', 'PAN', 'CRO'],
};

/** Per-group matchday dates (MD1 / MD2 / MD3) — aligned to FIFA schedule */
const GROUP_MD_DATES = {
  A: ['2026-06-11', '2026-06-18', '2026-06-24'],
  B: ['2026-06-12', '2026-06-18', '2026-06-24'],
  C: ['2026-06-13', '2026-06-19', '2026-06-24'],
  D: ['2026-06-12', '2026-06-19', '2026-06-25'],
  E: ['2026-06-14', '2026-06-20', '2026-06-25'],
  F: ['2026-06-14', '2026-06-20', '2026-06-25'],
  G: ['2026-06-15', '2026-06-21', '2026-06-26'],
  H: ['2026-06-15', '2026-06-21', '2026-06-26'],
  I: ['2026-06-16', '2026-06-22', '2026-06-26'],
  J: ['2026-06-16', '2026-06-22', '2026-06-27'],
  K: ['2026-06-17', '2026-06-23', '2026-06-27'],
  L: ['2026-06-17', '2026-06-23', '2026-06-27'],
};

const GROUP_MATCH_PAIRS = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

function knockoutSlotLabel(slot) {
  if (!slot) return null;
  const s = String(slot).trim();
  if (/^W\d+$/.test(s)) return `Winner Match ${s.slice(1)}`;
  if (/^L\d+$/.test(s)) return `Loser Match ${s.slice(1)}`;
  if (/^1([A-L])$/.test(s)) return `Winner Group ${s[1]}`;
  if (/^2([A-L])$/.test(s)) return `Runner-up Group ${s[1]}`;
  if (/^3/.test(s)) return `Best 3rd (Grp ${s.slice(1)})`;
  return s;
}

/** homeSlot / awaySlot use openfootball codes (1A, 2B, 3A/B/C/D/F, W74, …). */
const KNOCKOUT_FIXTURES = [
  { id: 'k-r32-73', stage: 'r32', date: '2026-06-28', matchNum: 73, homeSlot: '2A', awaySlot: '2B', kickoffTime: '12:00 UTC-7', label: 'Round of 32 — Match 73' },
  { id: 'k-r32-74', stage: 'r32', date: '2026-06-29', matchNum: 74, homeSlot: '1E', awaySlot: '3A/B/C/D/F', kickoffTime: '16:30 UTC-4', label: 'Round of 32 — Match 74' },
  { id: 'k-r32-75', stage: 'r32', date: '2026-06-29', matchNum: 75, homeSlot: '1F', awaySlot: '2C', kickoffTime: '19:00 UTC-6', label: 'Round of 32 — Match 75' },
  { id: 'k-r32-76', stage: 'r32', date: '2026-06-29', matchNum: 76, homeSlot: '1C', awaySlot: '2F', kickoffTime: '12:00 UTC-5', label: 'Round of 32 — Match 76' },
  { id: 'k-r32-77', stage: 'r32', date: '2026-06-30', matchNum: 77, homeSlot: '1I', awaySlot: '3C/D/F/G/H', kickoffTime: '17:00 UTC-4', label: 'Round of 32 — Match 77' },
  { id: 'k-r32-78', stage: 'r32', date: '2026-06-30', matchNum: 78, homeSlot: '2E', awaySlot: '2I', kickoffTime: '12:00 UTC-5', label: 'Round of 32 — Match 78' },
  { id: 'k-r32-79', stage: 'r32', date: '2026-06-30', matchNum: 79, homeSlot: '1A', awaySlot: '3C/E/F/H/I', kickoffTime: '19:00 UTC-6', label: 'Round of 32 — Match 79' },
  { id: 'k-r32-80', stage: 'r32', date: '2026-07-01', matchNum: 80, homeSlot: '1L', awaySlot: '3E/H/I/J/K', kickoffTime: '12:00 UTC-4', label: 'Round of 32 — Match 80' },
  { id: 'k-r32-81', stage: 'r32', date: '2026-07-01', matchNum: 81, homeSlot: '1D', awaySlot: '3B/E/F/I/J', kickoffTime: '17:00 UTC-7', label: 'Round of 32 — Match 81' },
  { id: 'k-r32-82', stage: 'r32', date: '2026-07-01', matchNum: 82, homeSlot: '1G', awaySlot: '3A/E/H/I/J', kickoffTime: '13:00 UTC-7', label: 'Round of 32 — Match 82' },
  { id: 'k-r32-83', stage: 'r32', date: '2026-07-02', matchNum: 83, homeSlot: '2K', awaySlot: '2L', kickoffTime: '19:00 UTC-4', label: 'Round of 32 — Match 83' },
  { id: 'k-r32-84', stage: 'r32', date: '2026-07-02', matchNum: 84, homeSlot: '1H', awaySlot: '2J', kickoffTime: '12:00 UTC-7', label: 'Round of 32 — Match 84' },
  { id: 'k-r32-85', stage: 'r32', date: '2026-07-02', matchNum: 85, homeSlot: '1B', awaySlot: '3E/F/G/I/J', kickoffTime: '20:00 UTC-7', label: 'Round of 32 — Match 85' },
  { id: 'k-r32-86', stage: 'r32', date: '2026-07-03', matchNum: 86, homeSlot: '1J', awaySlot: '2H', kickoffTime: '18:00 UTC-4', label: 'Round of 32 — Match 86' },
  { id: 'k-r32-87', stage: 'r32', date: '2026-07-03', matchNum: 87, homeSlot: '1K', awaySlot: '3D/E/I/J/L', kickoffTime: '20:30 UTC-5', label: 'Round of 32 — Match 87' },
  { id: 'k-r32-88', stage: 'r32', date: '2026-07-03', matchNum: 88, homeSlot: '2D', awaySlot: '2G', kickoffTime: '13:00 UTC-5', label: 'Round of 32 — Match 88' },
  { id: 'k-r16-89', stage: 'r16', date: '2026-07-04', matchNum: 89, homeSlot: 'W74', awaySlot: 'W77', kickoffTime: '17:00 UTC-4', label: 'Round of 16 — Match 89' },
  { id: 'k-r16-90', stage: 'r16', date: '2026-07-04', matchNum: 90, homeSlot: 'W73', awaySlot: 'W75', kickoffTime: '12:00 UTC-5', label: 'Round of 16 — Match 90' },
  { id: 'k-r16-91', stage: 'r16', date: '2026-07-05', matchNum: 91, homeSlot: 'W76', awaySlot: 'W78', kickoffTime: '16:00 UTC-4', label: 'Round of 16 — Match 91' },
  { id: 'k-r16-92', stage: 'r16', date: '2026-07-05', matchNum: 92, homeSlot: 'W79', awaySlot: 'W80', kickoffTime: '18:00 UTC-6', label: 'Round of 16 — Match 92' },
  { id: 'k-r16-93', stage: 'r16', date: '2026-07-06', matchNum: 93, homeSlot: 'W83', awaySlot: 'W84', kickoffTime: '14:00 UTC-5', label: 'Round of 16 — Match 93' },
  { id: 'k-r16-94', stage: 'r16', date: '2026-07-06', matchNum: 94, homeSlot: 'W81', awaySlot: 'W82', kickoffTime: '17:00 UTC-7', label: 'Round of 16 — Match 94' },
  { id: 'k-r16-95', stage: 'r16', date: '2026-07-07', matchNum: 95, homeSlot: 'W86', awaySlot: 'W88', kickoffTime: '12:00 UTC-4', label: 'Round of 16 — Match 95' },
  { id: 'k-r16-96', stage: 'r16', date: '2026-07-07', matchNum: 96, homeSlot: 'W85', awaySlot: 'W87', kickoffTime: '13:00 UTC-7', label: 'Round of 16 — Match 96' },
  { id: 'k-qf-97', stage: 'qf', date: '2026-07-09', matchNum: 97, homeSlot: 'W89', awaySlot: 'W90', kickoffTime: '16:00 UTC-4', label: 'Quarter-final — Match 97' },
  { id: 'k-qf-98', stage: 'qf', date: '2026-07-10', matchNum: 98, homeSlot: 'W93', awaySlot: 'W94', kickoffTime: '12:00 UTC-7', label: 'Quarter-final — Match 98' },
  { id: 'k-qf-99', stage: 'qf', date: '2026-07-11', matchNum: 99, homeSlot: 'W91', awaySlot: 'W92', kickoffTime: '17:00 UTC-4', label: 'Quarter-final — Match 99' },
  { id: 'k-qf-100', stage: 'qf', date: '2026-07-11', matchNum: 100, homeSlot: 'W95', awaySlot: 'W96', kickoffTime: '20:00 UTC-5', label: 'Quarter-final — Match 100' },
  { id: 'k-sf-101', stage: 'sf', date: '2026-07-14', matchNum: 101, homeSlot: 'W97', awaySlot: 'W98', kickoffTime: '14:00 UTC-5', label: 'Semi-final — Match 101' },
  { id: 'k-sf-102', stage: 'sf', date: '2026-07-15', matchNum: 102, homeSlot: 'W99', awaySlot: 'W100', kickoffTime: '15:00 UTC-4', label: 'Semi-final — Match 102' },
  { id: 'k-final', stage: 'final', date: '2026-07-19', matchNum: 103, homeSlot: 'W101', awaySlot: 'W102', kickoffTime: '15:00 UTC-4', label: 'Final' },
];

/** home|away -> { date, time } from openfootball/worldcup.json */
const GROUP_MATCH_SCHEDULE = {
  'MEX|RSA': { date: '2026-06-11', time: '13:00 UTC-6' },
  'KOR|CZE': { date: '2026-06-11', time: '20:00 UTC-6' },
  'CZE|RSA': { date: '2026-06-18', time: '12:00 UTC-4' },
  'MEX|KOR': { date: '2026-06-18', time: '19:00 UTC-6' },
  'CZE|MEX': { date: '2026-06-24', time: '19:00 UTC-6' },
  'RSA|KOR': { date: '2026-06-24', time: '19:00 UTC-6' },
  'CAN|BIH': { date: '2026-06-12', time: '15:00 UTC-4' },
  'QAT|SUI': { date: '2026-06-13', time: '12:00 UTC-7' },
  'SUI|BIH': { date: '2026-06-18', time: '12:00 UTC-7' },
  'CAN|QAT': { date: '2026-06-18', time: '15:00 UTC-7' },
  'SUI|CAN': { date: '2026-06-24', time: '12:00 UTC-7' },
  'BIH|QAT': { date: '2026-06-24', time: '12:00 UTC-7' },
  'BRA|MAR': { date: '2026-06-13', time: '18:00 UTC-4' },
  'HTI|SCO': { date: '2026-06-13', time: '21:00 UTC-4' },
  'SCO|MAR': { date: '2026-06-19', time: '18:00 UTC-4' },
  'BRA|HTI': { date: '2026-06-19', time: '20:30 UTC-4' },
  'SCO|BRA': { date: '2026-06-24', time: '18:00 UTC-4' },
  'MAR|HTI': { date: '2026-06-24', time: '18:00 UTC-4' },
  'USA|PAR': { date: '2026-06-12', time: '18:00 UTC-7' },
  'AUS|TUR': { date: '2026-06-13', time: '21:00 UTC-7' },
  'USA|AUS': { date: '2026-06-19', time: '12:00 UTC-7' },
  'TUR|PAR': { date: '2026-06-19', time: '20:00 UTC-7' },
  'TUR|USA': { date: '2026-06-25', time: '19:00 UTC-7' },
  'PAR|AUS': { date: '2026-06-25', time: '19:00 UTC-7' },
  'GER|CUW': { date: '2026-06-14', time: '12:00 UTC-5' },
  'CIV|ECU': { date: '2026-06-14', time: '19:00 UTC-4' },
  'GER|CIV': { date: '2026-06-20', time: '16:00 UTC-4' },
  'ECU|CUW': { date: '2026-06-20', time: '19:00 UTC-5' },
  'CUW|CIV': { date: '2026-06-25', time: '16:00 UTC-4' },
  'ECU|GER': { date: '2026-06-25', time: '16:00 UTC-4' },
  'NED|JPN': { date: '2026-06-14', time: '15:00 UTC-5' },
  'SWE|TUN': { date: '2026-06-14', time: '20:00 UTC-6' },
  'NED|SWE': { date: '2026-06-20', time: '12:00 UTC-5' },
  'TUN|JPN': { date: '2026-06-20', time: '22:00 UTC-6' },
  'JPN|SWE': { date: '2026-06-25', time: '18:00 UTC-5' },
  'TUN|NED': { date: '2026-06-25', time: '18:00 UTC-5' },
  'BEL|EGY': { date: '2026-06-15', time: '12:00 UTC-7' },
  'IRN|NZL': { date: '2026-06-15', time: '18:00 UTC-7' },
  'BEL|IRN': { date: '2026-06-21', time: '12:00 UTC-7' },
  'NZL|EGY': { date: '2026-06-21', time: '18:00 UTC-7' },
  'EGY|IRN': { date: '2026-06-26', time: '20:00 UTC-7' },
  'NZL|BEL': { date: '2026-06-26', time: '20:00 UTC-7' },
  'ESP|CPV': { date: '2026-06-15', time: '12:00 UTC-4' },
  'KSA|URU': { date: '2026-06-15', time: '18:00 UTC-4' },
  'ESP|KSA': { date: '2026-06-21', time: '12:00 UTC-4' },
  'URU|CPV': { date: '2026-06-21', time: '18:00 UTC-4' },
  'CPV|KSA': { date: '2026-06-26', time: '19:00 UTC-5' },
  'URU|ESP': { date: '2026-06-26', time: '18:00 UTC-6' },
  'FRA|SEN': { date: '2026-06-16', time: '15:00 UTC-4' },
  'IRQ|NOR': { date: '2026-06-16', time: '18:00 UTC-4' },
  'FRA|IRQ': { date: '2026-06-22', time: '17:00 UTC-4' },
  'NOR|SEN': { date: '2026-06-22', time: '20:00 UTC-4' },
  'NOR|FRA': { date: '2026-06-26', time: '15:00 UTC-4' },
  'SEN|IRQ': { date: '2026-06-26', time: '15:00 UTC-4' },
  'ARG|ALG': { date: '2026-06-16', time: '20:00 UTC-5' },
  'AUT|JOR': { date: '2026-06-16', time: '21:00 UTC-7' },
  'ARG|AUT': { date: '2026-06-22', time: '12:00 UTC-5' },
  'JOR|ALG': { date: '2026-06-22', time: '20:00 UTC-7' },
  'ALG|AUT': { date: '2026-06-27', time: '21:00 UTC-5' },
  'JOR|ARG': { date: '2026-06-27', time: '21:00 UTC-5' },
  'POR|COD': { date: '2026-06-17', time: '12:00 UTC-5' },
  'UZB|COL': { date: '2026-06-17', time: '20:00 UTC-6' },
  'POR|UZB': { date: '2026-06-23', time: '12:00 UTC-5' },
  'COL|COD': { date: '2026-06-23', time: '20:00 UTC-6' },
  'COL|POR': { date: '2026-06-27', time: '19:30 UTC-4' },
  'COD|UZB': { date: '2026-06-27', time: '19:30 UTC-4' },
  'ENG|CRO': { date: '2026-06-17', time: '15:00 UTC-5' },
  'GHA|PAN': { date: '2026-06-17', time: '19:00 UTC-4' },
  'ENG|GHA': { date: '2026-06-23', time: '16:00 UTC-4' },
  'PAN|CRO': { date: '2026-06-23', time: '19:00 UTC-4' },
  'PAN|ENG': { date: '2026-06-27', time: '17:00 UTC-4' },
  'CRO|GHA': { date: '2026-06-27', time: '17:00 UTC-4' },
};

function scheduleForPair(home, away) {
  return (
    GROUP_MATCH_SCHEDULE[`${home}|${away}`] ||
    GROUP_MATCH_SCHEDULE[`${away}|${home}`] ||
    null
  );
}

function generateDefaultMatches() {
  const matches = [];
  let n = 0;

  for (const [group, teams] of Object.entries(WC2026_GROUPS)) {
    const dates = GROUP_MD_DATES[group];
    GROUP_MATCH_PAIRS.forEach((dayPairs, mdIndex) => {
      const date = dates[mdIndex];
      dayPairs.forEach(([hi, ai], pairIndex) => {
        n += 1;
        const sched = scheduleForPair(teams[hi], teams[ai]);
        matches.push({
          id: `g-${group}-${mdIndex}-${pairIndex}`,
          group,
          date: sched?.date || date,
          kickoff: sched ? parseKickoff(sched.date, sched.time) : null,
          stage: 'group',
          home: teams[hi],
          away: teams[ai],
          homeScore: null,
          awayScore: null,
          matchNum: pairIndex + 1,
        });
      });
    });
  }

  for (const k of KNOCKOUT_FIXTURES) {
    matches.push({
      id: k.id,
      group: '',
      date: k.date,
      kickoff: k.kickoffTime ? parseKickoff(k.date, k.kickoffTime) : null,
      stage: k.stage,
      home: '',
      away: '',
      homeSlot: k.homeSlot,
      awaySlot: k.awaySlot,
      homeScore: null,
      awayScore: null,
      matchNum: k.matchNum,
      label: k.label,
    });
  }

  return matches;
}

function getMatchDates(matches) {
  const dates = [...new Set(matches.map((m) => m.date))];
  dates.sort();
  return dates;
}

function getAllTournamentTeamCodes() {
  const codes = new Set();
  Object.values(WC2026_GROUPS).forEach((g) => g.forEach((c) => codes.add(c)));
  return [...codes];
}
