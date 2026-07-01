// HARDCODED MATCH SCORES
// Edit scores here to update all leaderboards
// Format: 'MATCH_ID': { homeScore: X, awayScore: Y }
// Leave empty or null to use API data (if available)

const HARDCODED_MATCH_SCORES = {
  // Group A (MEX, RSA, KOR, CZE)
  'g-A-0-0': { homeScore: 2, awayScore: 0 }, // MEX vs RSA
  'g-A-0-1': { homeScore: 2, awayScore: 1 }, // KOR vs CZE
  'g-A-1-0': { homeScore: 1, awayScore: 0 }, // MEX vs KOR
  'g-A-1-1': { homeScore: 1, awayScore: 1 }, // RSA vs CZE
  'g-A-2-0': { homeScore: 3, awayScore: 0 }, // MEX vs CZE
  'g-A-2-1': { homeScore: 1, awayScore: 0 }, // RSA vs KOR

  // Group B (CAN, BIH, QAT, SUI)
  'g-B-0-0': { homeScore: 6, awayScore: 0 }, // CAN vs QAT
  'g-B-0-1': { homeScore: 4, awayScore: 1 }, // SUI vs BIH
  'g-B-1-0': { homeScore: 1, awayScore: 2 }, // CAN vs SUI
  'g-B-1-1': { homeScore: 1, awayScore: 3 }, // QAT vs BIH
  'g-B-2-0': { homeScore: 1, awayScore: 1 }, // CAN vs BIH
  'g-B-2-1': { homeScore: 1, awayScore: 1 }, // QAT vs SUI

  // Group C (BRA, MAR, HTI, SCO)
  'g-C-0-0': { homeScore: 1, awayScore: 1 }, // BRA vs MAR
  'g-C-0-1': { homeScore: 1, awayScore: 0 }, // HTI vs SCO
  'g-C-1-0': { homeScore: 3, awayScore: 0 }, // BRA vs HTI
  'g-C-1-1': { homeScore: 1, awayScore: 0 }, // MAR vs SCO
  'g-C-2-0': { homeScore: 3, awayScore: 0 }, // BRA vs SCO
  'g-C-2-1': { homeScore: 4, awayScore: 2 }, // MAR vs HTI

  // Group D (USA, PAR, AUS, TUR)
  'g-D-0-0': { homeScore: 4, awayScore: 1 }, // USA vs PAR
  'g-D-0-1': { homeScore: 2, awayScore: 0 }, // AUS vs TUR
  'g-D-1-0': { homeScore: 2, awayScore: 0 }, // USA vs AUS
  'g-D-1-1': { homeScore: 1, awayScore: 0 }, // PAR vs TUR
  'g-D-2-0': { homeScore: 2, awayScore: 3 }, // USA vs TUR
  'g-D-2-1': { homeScore: 0, awayScore: 0 }, // PAR vs AUS

  // Group E (GER, CUW, CIV, ECU)
  'g-E-0-0': { homeScore: 7, awayScore: 1 }, // GER vs CUW
  'g-E-0-1': { homeScore: 1, awayScore: 0 }, // CIV vs ECU
  'g-E-1-0': { homeScore: 2, awayScore: 1 }, // GER vs CIV
  'g-E-1-1': { homeScore: 0, awayScore: 0 }, // CUW vs ECU
  'g-E-2-0': { homeScore: 1, awayScore: 2 }, // GER vs ECU
  'g-E-2-1': { homeScore: 0, awayScore: 2 }, // CUW vs CIV

  // Group F (NED, JPN, TUN, SWE)
  'g-F-0-0': { homeScore: 2, awayScore: 2 }, // NED vs JPN
  'g-F-0-1': { homeScore: 1, awayScore: 5 }, // TUN vs SWE
  'g-F-1-0': { homeScore: 3, awayScore: 1 }, // NED vs TUN
  'g-F-1-1': { homeScore: 1, awayScore: 1 }, // JPN vs SWE
  'g-F-2-0': { homeScore: 5, awayScore: 1 }, // NED vs SWE
  'g-F-2-1': { homeScore: 4, awayScore: 0 }, // JPN vs TUN

  // Group G (BEL, EGY, IRN, NZL)
  'g-G-0-0': { homeScore: 1, awayScore: 1 }, // BEL vs EGY
  'g-G-0-1': { homeScore: 2, awayScore: 2 }, // IRN vs NZL
  'g-G-1-0': { homeScore: 0, awayScore: 0 }, // BEL vs IRN
  'g-G-1-1': { homeScore: 3, awayScore: 1 }, // EGY vs NZL
  'g-G-2-0': { homeScore: 5, awayScore: 1 }, // BEL vs NZL
  'g-G-2-1': { homeScore: 1, awayScore: 1 }, // EGY vs IRN

  // Group H (ESP, CPV, KSA, URU)
  'g-H-0-0': { homeScore: 0, awayScore: 0 }, // ESP vs CPV
  'g-H-0-1': { homeScore: 1, awayScore: 1 }, // KSA vs URU
  'g-H-1-0': { homeScore: 4, awayScore: 0 }, // ESP vs KSA
  'g-H-1-1': { homeScore: 2, awayScore: 2 }, // CPV vs URU
  'g-H-2-0': { homeScore: 1, awayScore: 0 }, // ESP vs URU
  'g-H-2-1': { homeScore: 0, awayScore: 0 }, // CPV vs KSA

  // Group I (FRA, SEN, NOR, IRQ)
  'g-I-0-0': { homeScore: 3, awayScore: 1 }, // FRA vs SEN
  'g-I-0-1': { homeScore: 4, awayScore: 1 }, // NOR vs IRQ
  'g-I-1-0': { homeScore: 4, awayScore: 1 }, // FRA vs NOR
  'g-I-1-1': { homeScore: 5, awayScore: 0 }, // SEN vs IRQ
  'g-I-2-0': { homeScore: 3, awayScore: 0 }, // FRA vs IRQ
  'g-I-2-1': { homeScore: 2, awayScore: 3 }, // SEN vs NOR

  // Group J (ARG, ALG, AUT, JOR)
  'g-J-0-0': { homeScore: 3, awayScore: 0 }, // ARG vs ALG
  'g-J-0-1': { homeScore: 3, awayScore: 1 }, // AUT vs JOR
  'g-J-1-0': { homeScore: 2, awayScore: 0 }, // ARG vs AUT
  'g-J-1-1': { homeScore: 2, awayScore: 1 }, // ALG vs JOR
  'g-J-2-0': { homeScore: 3, awayScore: 1 }, // ARG vs JOR
  'g-J-2-1': { homeScore: 3, awayScore: 3 }, // ALG vs AUT

  // Group K (POR, COL, UZB, COD)
  'g-K-0-0': { homeScore: 0, awayScore: 0 }, // POR vs COL
  'g-K-0-1': { homeScore: 1, awayScore: 3 }, // UZB vs COD
  'g-K-1-0': { homeScore: 5, awayScore: 0 }, // POR vs UZB
  'g-K-1-1': { homeScore: 1, awayScore: 0 }, // COL vs COD
  'g-K-2-0': { homeScore: 1, awayScore: 1 }, // COD vs POR
  'g-K-2-1': { homeScore: 3, awayScore: 1 }, // COL vs UZB

  // Group L (ENG, GHA, PAN, CRO)
  'g-L-0-0': { homeScore: 0, awayScore: 0 }, // ENG vs GHA
  'g-L-0-1': { homeScore: 0, awayScore: 1 }, // PAN vs CRO
  'g-L-1-0': { homeScore: 2, awayScore: 0 }, // ENG vs PAN
  'g-L-1-1': { homeScore: 1, awayScore: 2 }, // GHA vs CRO
  'g-L-2-0': { homeScore: 4, awayScore: 2 }, // ENG vs CRO
  'g-L-2-1': { homeScore: 1, awayScore: 0 }, // GHA vs PAN

  // ==========================================
  // INJECTED KNOCKOUT MATCHES
  // Configured with ISO 'T' date formatting so all web browsers can parse them!
  // ==========================================

  // Round of 32 (June 28 – July 3, 2026)
  'ko-r32-1': { stage: 'r32', home: 'CAN', away: 'RSA', homeScore: 1, awayScore: 0 },
  'ko-r32-2': { stage: 'r32', home: 'NED', away: 'MAR', homeScore: 1, awayScore: 1, homePen: 2, awayPen: 3 },
  'ko-r32-3': { stage: 'r32', home: 'GER', away: 'PAR', homeScore: 1, awayScore: 1, homePen: 3, awayPen: 4 },
  'ko-r32-4': { stage: 'r32', date: '2026-06-29T19:00', home: 'FRA', away: 'SWE', homeScore: 3, awayScore: 0 },
  'ko-r32-5': { stage: 'r32', date: '2026-06-29T22:00', home: 'BEL', away: 'SEN', homeScore: null, awayScore: null },
  'ko-r32-6': { stage: 'r32', date: '2026-06-30T16:00', home: 'USA', away: 'BIH', homeScore: null, awayScore: null },
  'ko-r32-7': { stage: 'r32', date: '2026-06-30T19:00', home: 'ESP', away: 'AUT', homeScore: null, awayScore: null },
  'ko-r32-8': { stage: 'r32', date: '2026-06-30T22:00', home: 'POR', away: 'CRO', homeScore: null, awayScore: null },
  'ko-r32-9': { stage: 'r32', date: '2026-07-01T16:00', home: 'BRA', away: 'JPN', homeScore: 2, awayScore: 1 },
  'ko-r32-10': { stage: 'r32', date: '2026-07-01T19:00', home: 'CIV', away: 'NOR', homeScore: 1, awayScore: 2 },
  'ko-r32-11': { stage: 'r32', date: '2026-07-01T22:00', home: 'MEX', away: 'ECU', homeScore: 2, awayScore: 0 },
  'ko-r32-12': { stage: 'r32', date: '2026-07-02T16:00', home: 'ENG', away: 'COD', homeScore: 2, awayScore: 1 },
  'ko-r32-13': { stage: 'r32', date: '2026-07-02T19:00', home: 'SUI', away: 'ALG', homeScore: null, awayScore: null },
  'ko-r32-14': { stage: 'r32', date: '2026-07-02T22:00', home: 'COL', away: 'GHA', homeScore: null, awayScore: null },
  'ko-r32-15': { stage: 'r32', date: '2026-07-03T16:00', home: 'AUS', away: 'EGY', homeScore: null, awayScore: null },
  'ko-r32-16': { stage: 'r32', home: 'ARG', away: 'CPV', homeScore: null, awayScore: null },

  // Round of 16 (July 4 – July 7, 2026)
  'ko-r16-1': { stage: 'r16', date: '2026-07-04T19:00', home: 'CAN', away: 'MAR', homeScore: null, awayScore: null },
  'ko-r16-2': { stage: 'r16', date: '2026-07-04T22:00', home: 'PAR', away: 'FRA', homeScore: null, awayScore: null },
  'ko-r16-3': { stage: 'r16', date: '2026-07-05T19:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
  'ko-r16-4': { stage: 'r16', date: '2026-07-05T22:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
  'ko-r16-5': { stage: 'r16', date: '2026-07-06T19:00', home: 'BRA', away: 'NOR', homeScore: null, awayScore: null },
  'ko-r16-6': { stage: 'r16', date: '2026-07-06T22:00', home: 'MEX', away: 'ENG', homeScore: null, awayScore: null },
  'ko-r16-7': { stage: 'r16', date: '2026-07-07T19:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
  'ko-r16-8': { stage: 'r16', date: '2026-07-07T22:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },

  // Quarterfinals (July 9 – July 10, 2026)
  'ko-qf-1': { stage: 'qf', date: '2026-07-09T19:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
  'ko-qf-2': { stage: 'qf', date: '2026-07-09T22:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
  'ko-qf-3': { stage: 'qf', date: '2026-07-10T19:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
  'ko-qf-4': { stage: 'qf', date: '2026-07-10T22:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },

  // Semifinals (July 14 – July 15, 2026)
  'ko-sf-1': { stage: 'sf', date: '2026-07-14T20:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
  'ko-sf-2': { stage: 'sf', date: '2026-07-15T20:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },

  // Grand Final (July 19, 2026)
  'ko-final': { stage: 'final', date: '2026-07-19T22:00', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null }
};

// Set this to true to use hardcoded scores, false to use API data
const USE_HARDCODED_SCORES = true;

// ==========================================
// MANUAL KNOCKOUT POINT OVERRIDES
// Force the leaderboard to give a team points for reaching a specific stage.
// Stages: 'r32', 'r16', 'qf', 'sf', 'runnerUp', 'final'
//
// HOW TO USE THIS:
// - To award points, remove the "//" from the start of the line.
// - To upgrade a team, change 'r32' to 'r16', 'qf', etc.
// - Make sure every active line ends with a comma!
// ==========================================

const MANUAL_KNOCKOUT_OVERRIDES = {
 'RSA': 'r32',
 'CAN': 'r16',
 'MEX': 'r16',
  // 'SUI': 'r32',
 'BRA': 'r16',
 'JPN': 'r32',
  // 'USA': 'r32',
 'MAR': 'r16',
 'GER': 'r32',
  // 'AUS': 'r32',
 'NED': 'r32',
 'CIV': 'r32',
  // 'BEL': 'r32',
 'SWE': 'r32',
  // 'ESP': 'r32',
  // 'EGY': 'r32',
 'FRA': 'r16',
  // 'CPV': 'r32',
  // 'ARG': 'r32',
 'NOR': 'r16',
  // 'POR': 'r32',
  // 'ALG': 'r32',
 'ENG': 'r16',
  // 'COL': 'r32',
  // 'SEN': 'r32',
  // 'AUT': 'r32',
  // 'URU': 'r32',
  'COD': 'r32',
  // 'KOR': 'r32',
 'PAR': 'r16',
  // 'CRO': 'r32',
 'ECU': 'r32'
};
