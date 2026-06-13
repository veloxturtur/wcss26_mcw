// HARDCODED MATCH SCORES
// Edit scores here to update all leaderboards
// Format: 'MATCH_ID': { homeScore: X, awayScore: Y }
// Leave empty or null to use API data (if available)

const HARDCODED_MATCH_SCORES = {
  // Group A
  'g-A-0-0': { homeScore: , awayScore:  }, // MEX vs RSA
  'g-A-0-1': { homeScore: , awayScore:  }, // KOR vs CZE
  'g-A-1-0': { homeScore: , awayScore:  }, // CZE vs RSA
  'g-A-1-1': { homeScore: , awayScore:  }, // MEX vs KOR
  'g-A-2-0': { homeScore: , awayScore:  }, // CZE vs MEX
  'g-A-2-1': { homeScore: , awayScore:  }, // RSA vs KOR

  // Group B
  'g-B-0-0': { homeScore: , awayScore:  }, // CAN vs BIH
  'g-B-0-1': { homeScore: , awayScore:  }, // QAT vs SUI
  'g-B-1-0': { homeScore: , awayScore:  }, // SUI vs BIH
  'g-B-1-1': { homeScore: , awayScore:  }, // CAN vs QAT
  'g-B-2-0': { homeScore: , awayScore:  }, // SUI vs CAN
  'g-B-2-1': { homeScore: , awayScore:  }, // BIH vs QAT

  // Group C
  'g-C-0-0': { homeScore: , awayScore:  }, // BRA vs MAR
  'g-C-0-1': { homeScore: , awayScore:  }, // HTI vs SCO
  'g-C-1-0': { homeScore: , awayScore:  }, // SCO vs MAR
  'g-C-1-1': { homeScore: , awayScore:  }, // BRA vs HTI
  'g-C-2-0': { homeScore: , awayScore:  }, // SCO vs BRA
  'g-C-2-1': { homeScore: , awayScore:  }, // MAR vs HTI

  // Group D
  'g-D-0-0': { homeScore: , awayScore:  }, // USA vs PAR
  'g-D-0-1': { homeScore: , awayScore:  }, // AUS vs TUR
  'g-D-1-0': { homeScore: , awayScore:  }, // USA vs AUS
  'g-D-1-1': { homeScore: , awayScore:  }, // TUR vs PAR
  'g-D-2-0': { homeScore: , awayScore:  }, // TUR vs USA
  'g-D-2-1': { homeScore: , awayScore:  }, // PAR vs AUS

  // Group E
  'g-E-0-0': { homeScore: , awayScore:  }, // GER vs CUW
  'g-E-0-1': { homeScore: , awayScore:  }, // CIV vs ECU
  'g-E-1-0': { homeScore: , awayScore:  }, // GER vs CIV
  'g-E-1-1': { homeScore: , awayScore:  }, // ECU vs CUW
  'g-E-2-0': { homeScore: , awayScore:  }, // CUW vs CIV
  'g-E-2-1': { homeScore: , awayScore:  }, // ECU vs GER

  // Group F
  'g-F-0-0': { homeScore: , awayScore:  }, // NED vs JPN
  'g-F-0-1': { homeScore: , awayScore:  }, // SWE vs TUN
  'g-F-1-0': { homeScore: , awayScore:  }, // NED vs SWE
  'g-F-1-1': { homeScore: , awayScore:  }, // TUN vs JPN
  'g-F-2-0': { homeScore: , awayScore:  }, // JPN vs SWE
  'g-F-2-1': { homeScore: , awayScore:  }, // TUN vs NED

  // Group G
  'g-G-0-0': { homeScore: , awayScore:  }, // BEL vs EGY
  'g-G-0-1': { homeScore: , awayScore:  }, // IRN vs NZL
  'g-G-1-0': { homeScore: , awayScore:  }, // BEL vs IRN
  'g-G-1-1': { homeScore: , awayScore:  }, // NZL vs EGY
  'g-G-2-0': { homeScore: , awayScore:  }, // EGY vs IRN
  'g-G-2-1': { homeScore: , awayScore:  }, // NZL vs BEL

  // Group H
  'g-H-0-0': { homeScore: , awayScore:  }, // ESP vs CPV
  'g-H-0-1': { homeScore: , awayScore:  }, // KSA vs URU
  'g-H-1-0': { homeScore: , awayScore:  }, // ESP vs KSA
  'g-H-1-1': { homeScore: , awayScore:  }, // URU vs CPV
  'g-H-2-0': { homeScore: , awayScore:  }, // CPV vs KSA
  'g-H-2-1': { homeScore: , awayScore:  }, // URU vs ESP

  // Group I
  'g-I-0-0': { homeScore: , awayScore:  }, // FRA vs SEN
  'g-I-0-1': { homeScore: , awayScore:  }, // IRQ vs NOR
  'g-I-1-0': { homeScore: , awayScore:  }, // FRA vs IRQ
  'g-I-1-1': { homeScore: , awayScore:  }, // NOR vs SEN
  'g-I-2-0': { homeScore: , awayScore:  }, // NOR vs FRA
  'g-I-2-1': { homeScore: , awayScore:  }, // SEN vs IRQ

  // Group J
  'g-J-0-0': { homeScore: , awayScore:  }, // ARG vs ALG
  'g-J-0-1': { homeScore: , awayScore:  }, // AUT vs JOR
  'g-J-1-0': { homeScore: , awayScore:  }, // ARG vs AUT
  'g-J-1-1': { homeScore: , awayScore:  }, // JOR vs ALG
  'g-J-2-0': { homeScore: , awayScore:  }, // ALG vs AUT
  'g-J-2-1': { homeScore: , awayScore:  }, // JOR vs ARG

  // Group K
  'g-K-0-0': { homeScore: , awayScore:  }, // POR vs COD
  'g-K-0-1': { homeScore: , awayScore:  }, // UZB vs COL
  'g-K-1-0': { homeScore: , awayScore:  }, // POR vs UZB
  'g-K-1-1': { homeScore: , awayScore:  }, // COL vs COD
  'g-K-2-0': { homeScore: , awayScore:  }, // COL vs POR
  'g-K-2-1': { homeScore: , awayScore:  }, // COD vs UZB

  // Group L
  'g-L-0-0': { homeScore: , awayScore:  }, // ENG vs CRO
  'g-L-0-1': { homeScore: , awayScore:  }, // GHA vs PAN
  'g-L-1-0': { homeScore: , awayScore:  }, // ENG vs GHA
  'g-L-1-1': { homeScore: , awayScore:  }, // PAN vs CRO
  'g-L-2-0': { homeScore: , awayScore:  }, // PAN vs ENG
  'g-L-2-1': { homeScore: , awayScore:  }, // CRO vs GHA
};

// Set this to true to use hardcoded scores, false to use API data
const USE_HARDCODED_SCORES = false;
