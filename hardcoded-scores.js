// HARDCODED MATCH SCORES
// Edit scores here to update all leaderboards
// Format: 'MATCH_ID': { homeScore: X, awayScore: Y }
// Leave empty or null to use API data (if available)

const HARDCODED_MATCH_SCORES = {
  // Group A
  'g-A-0-0': { homeScore: 2, awayScore: 0 }, // MEX vs RSA
  'g-A-0-1': { homeScore: 2, awayScore: 1 }, // KOR vs CZE
  'g-A-1-0': { homeScore: null, awayScore: null }, // CZE vs RSA
  'g-A-1-1': { homeScore: null, awayScore: null }, // MEX vs KOR
  'g-A-2-0': { homeScore: null, awayScore: null }, // CZE vs MEX
  'g-A-2-1': { homeScore: null, awayScore: null }, // RSA vs KOR

  // Group B
  'g-B-0-0': { homeScore: null, awayScore: null }, // CAN vs BIH
  'g-B-0-1': { homeScore: null, awayScore: null }, // QAT vs SUI
  'g-B-1-0': { homeScore: null, awayScore: null }, // SUI vs BIH
  'g-B-1-1': { homeScore: null, awayScore: null }, // CAN vs QAT
  'g-B-2-0': { homeScore: null, awayScore: null }, // SUI vs CAN
  'g-B-2-1': { homeScore: null, awayScore: null }, // BIH vs QAT

  // Group C
  'g-C-0-0': { homeScore: 1, awayScore: 1 }, // BRA vs MAR
  'g-C-0-1': { homeScore: 1, awayScore: 0 }, // HTI vs SCO
  'g-C-1-0': { homeScore: null, awayScore: null }, // SCO vs MAR
  'g-C-1-1': { homeScore: null, awayScore: null }, // BRA vs HTI
  'g-C-2-0': { homeScore: null, awayScore: null }, // SCO vs BRA
  'g-C-2-1': { homeScore: null, awayScore: null }, // MAR vs HTI

  // Group D
  'g-D-0-0': { homeScore: 4, awayScore: 1 }, // USA vs PAR
  'g-D-0-1': { homeScore: 2, awayScore: 0 }, // AUS vs TUR
  'g-D-1-0': { homeScore: null, awayScore: null }, // USA vs AUS
  'g-D-1-1': { homeScore: null, awayScore: null }, // TUR vs PAR
  'g-D-2-0': { homeScore: null, awayScore: null }, // TUR vs USA
  'g-D-2-1': { homeScore: null, awayScore: null }, // PAR vs AUS

  // Group E
  'g-E-0-0': { homeScore: 7, awayScore: 1 }, // GER vs CUW
  'g-E-0-1': { homeScore: 1, awayScore: 0 }, // CIV vs ECU
  'g-E-1-0': { homeScore: null, awayScore: null }, // GER vs CIV
  'g-E-1-1': { homeScore: null, awayScore: null }, // ECU vs CUW
  'g-E-2-0': { homeScore: null, awayScore: null }, // CUW vs CIV
  'g-E-2-1': { homeScore: null, awayScore: null }, // ECU vs GER

  // Group F
  'g-F-0-0': { homeScore: 2, awayScore: 2 }, // NED vs JPN
  'g-F-0-1': { homeScore: 1, awayScore: 5 }, // TUN vs SWE
  'g-F-1-0': { homeScore: null, awayScore: null }, // NED vs SWE
  'g-F-1-1': { homeScore: null, awayScore: null }, // TUN vs JPN
  'g-F-2-0': { homeScore: null, awayScore: null }, // JPN vs SWE
  'g-F-2-1': { homeScore: null, awayScore: null }, // TUN vs NED

  // Group G
  'g-G-0-0': { homeScore: 1, awayScore: 1 }, // BEL vs EGY
  'g-G-0-1': { homeScore: null, awayScore: null }, // IRN vs NZL
  'g-G-1-0': { homeScore: null, awayScore: null }, // BEL vs IRN
  'g-G-1-1': { homeScore: null, awayScore: null }, // NZL vs EGY
  'g-G-2-0': { homeScore: null, awayScore: null }, // EGY vs IRN
  'g-G-2-1': { homeScore: null, awayScore: null }, // NZL vs BEL

  // Group H
  'g-H-0-0': { homeScore: 0, awayScore: 0 }, // ESP vs CPV
  'g-H-0-1': { homeScore: null, awayScore: null }, // KSA vs URU
  'g-H-1-0': { homeScore: null, awayScore: null }, // ESP vs KSA
  'g-H-1-1': { homeScore: null, awayScore: null }, // URU vs CPV
  'g-H-2-0': { homeScore: null, awayScore: null }, // CPV vs KSA
  'g-H-2-1': { homeScore: null, awayScore: null }, // URU vs ESP

  // Group I
  'g-I-0-0': { homeScore: null, awayScore: null }, // FRA vs SEN
  'g-I-0-1': { homeScore: null, awayScore: null }, // IRQ vs NOR
  'g-I-1-0': { homeScore: null, awayScore: null }, // FRA vs IRQ
  'g-I-1-1': { homeScore: null, awayScore: null }, // NOR vs SEN
  'g-I-2-0': { homeScore: null, awayScore: null }, // NOR vs FRA
  'g-I-2-1': { homeScore: null, awayScore: null }, // SEN vs IRQ

  // Group J
  'g-J-0-0': { homeScore: null, awayScore: null }, // ARG vs ALG
  'g-J-0-1': { homeScore: null, awayScore: null }, // AUT vs JOR
  'g-J-1-0': { homeScore: null, awayScore: null }, // ARG vs AUT
  'g-J-1-1': { homeScore: null, awayScore: null }, // JOR vs ALG
  'g-J-2-0': { homeScore: null, awayScore: null }, // ALG vs AUT
  'g-J-2-1': { homeScore: null, awayScore: null }, // JOR vs ARG

  // Group K
  'g-K-0-0': { homeScore: null, awayScore: null }, // POR vs COD
  'g-K-0-1': { homeScore: null, awayScore: null }, // UZB vs COL
  'g-K-1-0': { homeScore: null, awayScore: null }, // POR vs UZB
  'g-K-1-1': { homeScore: null, awayScore: null }, // COL vs COD
  'g-K-2-0': { homeScore: null, awayScore: null }, // COL vs POR
  'g-K-2-1': { homeScore: null, awayScore: null }, // COD vs UZB

  // Group L
  'g-L-0-0': { homeScore: null, awayScore: null }, // ENG vs CRO
  'g-L-0-1': { homeScore: null, awayScore: null }, // GHA vs PAN
  'g-L-1-0': { homeScore: null, awayScore: null }, // ENG vs GHA
  'g-L-1-1': { homeScore: null, awayScore: null }, // PAN vs CRO
  'g-L-2-0': { homeScore: null, awayScore: null }, // PAN vs ENG
  'g-L-2-1': { homeScore: null, awayScore: null }, // CRO vs GHA
};

// Set this to true to use hardcoded scores, false to use API data
const USE_HARDCODED_SCORES = true;
