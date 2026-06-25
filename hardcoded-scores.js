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
  'g-C-0-1': { homeScore: 1, awayScore: 0 }, // SCO vs HTI
  'g-C-1-0': { homeScore: 3, awayScore: 0 }, // BRA vs SCO
  'g-C-1-1': { homeScore: 4, awayScore: 2 }, // MAR vs HTI
  'g-C-2-0': { homeScore: 3, awayScore: 0 }, // BRA vs HTI
  'g-C-2-1': { homeScore: 1, awayScore: 0 }, // MAR vs SCO

  // Group D (USA, PAR, AUS, TUR)
  'g-D-0-0': { homeScore: 4, awayScore: 1 }, // USA vs PAR
  'g-D-0-1': { homeScore: 2, awayScore: 0 }, // AUS vs TUR
  'g-D-1-0': { homeScore: 2, awayScore: 0 }, // USA vs AUS
  'g-D-1-1': { homeScore: 1, awayScore: 0 }, // PAR vs TUR
  'g-D-2-0': { homeScore: null, awayScore: null }, // TUR vs USA
  'g-D-2-1': { homeScore: null, awayScore: null }, // PAR vs AUS

  // Group E (GER, CUW, CIV, ECU)
  'g-E-0-0': { homeScore: 7, awayScore: 1 }, // GER vs CUW
  'g-E-0-1': { homeScore: 1, awayScore: 0 }, // CIV vs ECU
  'g-E-1-0': { homeScore: 2, awayScore: 1 }, // GER vs CIV
  'g-E-1-1': { homeScore: 0, awayScore: 0 }, // CUW vs ECU
  'g-E-2-0': { homeScore: null, awayScore: null }, // ECU vs GER
  'g-E-2-1': { homeScore: null, awayScore: null }, // CUW vs CIV

  // Group F (NED, JPN, TUN, SWE)
  'g-F-0-0': { homeScore: 2, awayScore: 2 }, // NED vs JPN
  'g-F-0-1': { homeScore: 1, awayScore: 5 }, // TUN vs SWE
  'g-F-1-0': { homeScore: null, awayScore: null }, // NED vs TUN
  'g-F-1-1': { homeScore: null, awayScore: null }, // JPN vs SWE
  'g-F-2-0': { homeScore: 5, awayScore: 1 }, // NED vs SWE
  'g-F-2-1': { homeScore: 4, awayScore: 0 }, // JPN vs TUN

  // Group G (BEL, EGY, IRN, NZL)
  'g-G-0-0': { homeScore: 1, awayScore: 1 }, // BEL vs EGY
  'g-G-0-1': { homeScore: 2, awayScore: 2 }, // IRN vs NZL
  'g-G-1-0': { homeScore: 0, awayScore: 0 }, // BEL vs IRN
  'g-G-1-1': { homeScore: 3, awayScore: 1 }, // EGY vs NZL
  'g-G-2-0': { homeScore: null, awayScore: null }, // NZL vs BEL
  'g-G-2-1': { homeScore: null, awayScore: null }, // EGY vs IRN

  // Group H (ESP, CPV, KSA, URU)
  'g-H-0-0': { homeScore: 0, awayScore: 0 }, // ESP vs CPV
  'g-H-0-1': { homeScore: 1, awayScore: 1 }, // KSA vs URU
  'g-H-1-0': { homeScore: 4, awayScore: 0 }, // ESP vs KSA
  'g-H-1-1': { homeScore: 2, awayScore: 2 }, // CPV vs URU
  'g-H-2-0': { homeScore: null, awayScore: null }, // URU vs ESP
  'g-H-2-1': { homeScore: null, awayScore: null }, // CPV vs KSA

  // Group I (FRA, SEN, NOR, IRQ)
  'g-I-0-0': { homeScore: 3, awayScore: 1 }, // FRA vs SEN
  'g-I-0-1': { homeScore: 4, awayScore: 1 }, // NOR vs IRQ
  'g-I-1-0': { homeScore: null, awayScore: null }, // FRA vs NOR
  'g-I-1-1': { homeScore: null, awayScore: null }, // SEN vs IRQ
  'g-I-2-0': { homeScore: 3, awayScore: 0 }, // FRA vs IRQ
  'g-I-2-1': { homeScore: 2, awayScore: 3 }, // SEN vs NOR

  // Group J (ARG, ALG, AUT, JOR)
  'g-J-0-0': { homeScore: 3, awayScore: 0 }, // ARG vs ALG
  'g-J-0-1': { homeScore: 3, awayScore: 1 }, // AUT vs JOR
  'g-J-1-0': { homeScore: 2, awayScore: 0 }, // ARG vs AUT
  'g-J-1-1': { homeScore: 2, awayScore: 1 }, // ALG vs JOR
  'g-J-2-0': { homeScore: null, awayScore: null }, // JOR vs ARG
  'g-J-2-1': { homeScore: null, awayScore: null }, // ALG vs AUT

  // Group K (POR, COL, UZB, COD)
  'g-K-0-0': { homeScore: null, awayScore: null }, // POR vs COL
  'g-K-0-1': { homeScore: null, awayScore: null }, // UZB vs COD
  'g-K-1-0': { homeScore: 5, awayScore: 0 }, // POR vs UZB
  'g-K-1-1': { homeScore: 1, awayScore: 0 }, // COL vs COD
  'g-K-2-0': { homeScore: 1, awayScore: 1 }, // COD vs POR
  'g-K-2-1': { homeScore: 3, awayScore: 1 }, // COL vs UZB

  // Group L (ENG, GHA, PAN, CRO)
  'g-L-0-0': { homeScore: 0, awayScore: 0 }, // ENG vs GHA
  'g-L-0-1': { homeScore: 0, awayScore: 1 }, // PAN vs CRO
  'g-L-1-0': { homeScore: null, awayScore: null }, // ENG vs PAN
  'g-L-1-1': { homeScore: null, awayScore: null }, // GHA vs CRO
  'g-L-2-0': { homeScore: 4, awayScore: 2 }, // ENG vs CRO
  'g-L-2-1': { homeScore: 1, awayScore: 0 }, // GHA vs PAN
};

// Set this to true to use hardcoded scores, false to use API data
const USE_HARDCODED_SCORES = true;
