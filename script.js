const TEAM_COLORS = [
  '#ff3b3b', '#4da6ff', '#ffd700', '#4dff91',
  '#ff7c4d', '#c97bff', '#ff9ec8', '#00e5d4',
  '#b8f05a', '#ff5fd2', '#7f8cff', '#ffb84d'
];

const TYPE_COLORS = {
  normal:   '#A8A8A8', fire:     '#F08030', water:    '#6890F0',
  grass:    '#78C850', electric: '#F8D030', ice:      '#98D8D8',
  fighting: '#C03028', poison:   '#A040A0', ground:   '#E0C068',
  flying:   '#A890F0', psychic:  '#F85888', bug:      '#A8B820',
  rock:     '#B8A038', ghost:    '#705898', dragon:   '#7038F8',
  dark:     '#705848', steel:    '#B8B8D0', fairy:    '#EE99AC'
};

const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const DEFAULT_NAMES = [
  'Red Bulls', 'Blue Jays', 'Gold Rush', 'Green Wave',
  'Blaze Squad', 'Purple Haze', 'Pink Tide', 'Teal Force',
  'Lime Lights', 'Magenta Max', 'Indigo Crew', 'Amber Guard'
];

const CPU_PERSONALITIES = {
  balanced: {
    label: 'Balanced',
    short: 'BAL',
    topN: 4,
    randomness: 4.5,
    wildcardChance: 0.08,
    wildcardTopN: 6,
    selectionTemperature: 8,
    weights: { power: 0.40, typeFit: 0.18, role: 0.18, weakness: 0.16, scarcity: 0.08 },
  },
  power: {
    label: 'Power',
    short: 'PWR',
    topN: 2,
    randomness: 2.5,
    wildcardChance: 0.03,
    wildcardTopN: 4,
    selectionTemperature: 4.5,
    weights: { power: 0.60, attack: 0.18, typeFit: 0.05, role: 0.05, weakness: 0.07, scarcity: 0.05 },
  },
  speed: {
    label: 'Speed',
    short: 'SPD',
    topN: 4,
    randomness: 6.5,
    wildcardChance: 0.10,
    wildcardTopN: 7,
    selectionTemperature: 8.5,
    weights: { power: 0.28, speed: 0.26, role: 0.18, typeFit: 0.10, weakness: 0.10, scarcity: 0.04, attack: 0.04 },
  },
  bulky: {
    label: 'Bulky',
    short: 'BLK',
    topN: 4,
    randomness: 5,
    wildcardChance: 0.08,
    wildcardTopN: 6,
    selectionTemperature: 7.5,
    weights: { power: 0.28, bulk: 0.24, weakness: 0.20, role: 0.14, typeFit: 0.08, scarcity: 0.04, attack: 0.02 },
  },
  coverage: {
    label: 'Coverage',
    short: 'COV',
    topN: 5,
    randomness: 8,
    wildcardChance: 0.14,
    wildcardTopN: 8,
    selectionTemperature: 10,
    weights: { power: 0.25, typeFit: 0.34, weakness: 0.18, scarcity: 0.12, role: 0.08, speed: 0.03 },
  },
};

const CPU_PERSONALITY_ORDER = ['balanced', 'power', 'speed', 'bulky', 'coverage'];

const GENS = [
  { num: 1, label: 'Gen 1 — Kanto',  short: 'G1', start: 1,   end: 151, color: '#ff6b6b' },
  { num: 2, label: 'Gen 2 — Johto',  short: 'G2', start: 152, end: 251, color: '#ffd93d' },
  { num: 3, label: 'Gen 3 — Hoenn',  short: 'G3', start: 252, end: 386, color: '#6bcb77' },
  { num: 4, label: 'Gen 4 — Sinnoh', short: 'G4', start: 387, end: 493, color: '#4d96ff' },
];

const MAX_TEAMS = 12;
const DRAFT_ROUNDS = 6;
const ACTIVE_ROSTER_SIZE = 6;
const MAX_ROSTER_SIZE = ACTIVE_ROSTER_SIZE + 2;
const SAVE_VERSION = 5;

// ── State ──
let allPokemon = [];
let teams = [];
let numTeams = 4, numRounds = DRAFT_ROUNDS;
let currentRound = 0, currentPickInRound = 0;
let draftedIds = new Set();
let snakeOrder = [];
let draftOrderIndices = [];  // team indices in pick order for current draft
let currentGenIdx = 0;
let draftNumber = 1;
let curSort = 'recommended', curSearch = '', curType = '';
let faSort = 'recommended', faSearch = '', faType = '', faTeamIdx = 0;
let faHistoryDraft = 'current', faHistoryTeam = 'all', faHistoryMove = 'all';
let faDropId = null, faNotice = '', faCpuThinking = false, faCpuPassStreak = 0;
let cpuThinking = false;
let season = null;
let selectedBattleLogs = { season: null, playoff: null };
let battlePlayback = { scope: null, gameId: null, stepIdx: 0, playing: false, timer: null };

const SEASON_PHASES = {
  DRAFT: 'draft',
  ROSTER_LOCK: 'rosterLock',
  REGULAR_SEASON: 'regularSeason',
  PLAYOFFS: 'playoffs',
  BETWEEN_DRAFTS: 'betweenDrafts',
  COMPLETE: 'complete',
};

// ── Helpers ──
function getGen(id) {
  return GENS.find(g => id >= g.start && id <= g.end) ?? GENS[0];
}

function isValidCpuPersonality(key) {
  return Boolean(CPU_PERSONALITIES[key]);
}

function normalizeCpuPersonalityKey(key) {
  return isValidCpuPersonality(key) ? key : null;
}

function defaultCpuPersonality(cpuOrdinal) {
  return CPU_PERSONALITY_ORDER[cpuOrdinal % CPU_PERSONALITY_ORDER.length];
}

function normalizeCpuPersonalities(teamList = teams) {
  let cpuOrdinal = 0;
  teamList.forEach(team => {
    if (!team?.isCpu) {
      team.cpuPersonality = null;
      return;
    }
    if (!isValidCpuPersonality(team.cpuPersonality)) {
      team.cpuPersonality = defaultCpuPersonality(cpuOrdinal);
    }
    cpuOrdinal++;
  });
  return teamList;
}

function normalizeTeamOrder(order = [], teamList = teams, fallbackOrder = []) {
  const size = teamList.length || numTeams;
  const normalized = [];
  const addIdx = (idx) => {
    if (!Number.isInteger(idx) || idx < 0 || idx >= size || normalized.includes(idx)) return;
    normalized.push(idx);
  };

  (Array.isArray(order) ? order : []).forEach(addIdx);
  fallbackOrder.forEach(addIdx);
  Array.from({ length: size }, (_, idx) => idx).forEach(addIdx);
  return normalized;
}

function normalizeSavedTeamList(teamList = [], fallbackList = []) {
  let cpuOrdinal = 0;
  const assignedIds = new Set();
  return teamList.map((team, idx) => {
    const fallback = fallbackList[idx] ?? {};
    const picks = [];
    (Array.isArray(team?.picks) ? team.picks : []).forEach(pick => {
      const id = pick?.id ?? pick;
      if (!Number.isInteger(id) || assignedIds.has(id)) return;
      assignedIds.add(id);
      picks.push(pick);
    });
    const pickIds = new Set(picks.map(pick => pick?.id ?? pick));
    const normalized = {
      ...team,
      isCpu: Boolean(team?.isCpu),
      picks,
      activeIds: Array.isArray(team?.activeIds)
        ? [...new Set(team.activeIds.filter(id => Number.isInteger(id) && pickIds.has(id)))]
        : [],
    };

    if (!normalized.isCpu) {
      normalized.cpuPersonality = null;
      return normalized;
    }

    normalized.cpuPersonality =
      normalizeCpuPersonalityKey(team?.cpuPersonality) ??
      normalizeCpuPersonalityKey(team?.personality) ??
      normalizeCpuPersonalityKey(fallback?.cpuPersonality) ??
      normalizeCpuPersonalityKey(fallback?.personality) ??
      defaultCpuPersonality(cpuOrdinal);
    cpuOrdinal++;
    return normalized;
  });
}

function normalizeFreeAgencyTransactions(transactions) {
  if (!Array.isArray(transactions)) return [];

  return transactions.flatMap((transaction, idx) => {
    if (!transaction || transaction.action !== 'claim') return [];
    if (!Number.isInteger(transaction.teamIdx) || !Number.isInteger(transaction.pokemonId)) return [];

    const source = transaction.source === 'cpu' ? 'cpu' : 'human';
    const droppedPokemonId = Number.isInteger(transaction.droppedPokemonId)
      ? transaction.droppedPokemonId
      : null;

    return [{
      id: typeof transaction.id === 'string' && transaction.id
        ? transaction.id
        : `fa-${transaction.draftId ?? 1}-${transaction.pokemonId}-${idx}`,
      draftId: Number.isInteger(transaction.draftId) ? transaction.draftId : 1,
      genIdx: Number.isInteger(transaction.genIdx) ? transaction.genIdx : 0,
      timestamp: typeof transaction.timestamp === 'string'
        ? transaction.timestamp
        : new Date(0).toISOString(),
      action: 'claim',
      source,
      teamIdx: transaction.teamIdx,
      teamName: typeof transaction.teamName === 'string' ? transaction.teamName : `Team ${transaction.teamIdx + 1}`,
      teamColor: typeof transaction.teamColor === 'string' ? transaction.teamColor : '',
      pokemonId: transaction.pokemonId,
      pokemonName: typeof transaction.pokemonName === 'string' ? transaction.pokemonName : `Pokemon #${transaction.pokemonId}`,
      droppedPokemonId,
      droppedPokemonName: droppedPokemonId !== null && typeof transaction.droppedPokemonName === 'string'
        ? transaction.droppedPokemonName
        : null,
      waiverRankBefore: Number.isInteger(transaction.waiverRankBefore) && transaction.waiverRankBefore > 0
        ? transaction.waiverRankBefore
        : null,
      cpuGain: source === 'cpu' && Number.isFinite(transaction.cpuGain)
        ? transaction.cpuGain
        : null,
      cpuReason: source === 'cpu' && typeof transaction.cpuReason === 'string'
        ? transaction.cpuReason
        : null,
    }];
  });
}

function normalizeSavedSeason(saved, normalizedTeams) {
  if (!saved?.season) return saved?.season ?? null;
  const hasSeasonTeams = Array.isArray(saved.season.teams) && saved.season.teams.length > 0;
  const seasonTeams = normalizeSavedTeamList(hasSeasonTeams ? saved.season.teams : normalizedTeams, normalizedTeams);
  return {
    ...saved.season,
    version: SAVE_VERSION,
    teams: seasonTeams,
    waiverOrder: normalizeTeamOrder(saved.season.waiverOrder, seasonTeams),
    freeAgencyTransactions: normalizeFreeAgencyTransactions(saved.season.freeAgencyTransactions),
    settings: {
      ...(saved.season.settings ?? {}),
      numTeams: saved.season.settings?.numTeams ?? seasonTeams.length,
      numRounds: saved.season.settings?.numRounds ?? DRAFT_ROUNDS,
      activeRosterSize: saved.season.settings?.activeRosterSize ?? ACTIVE_ROSTER_SIZE,
      maxRosterSize: saved.season.settings?.maxRosterSize ?? MAX_ROSTER_SIZE,
    },
  };
}

function cpuPersonalityLabel(team) {
  if (!team?.isCpu) return '';
  return CPU_PERSONALITIES[cpuPersonalityKey(team)]?.label ?? CPU_PERSONALITIES.balanced.label;
}

function cpuPersonalityKey(team) {
  return isValidCpuPersonality(team?.cpuPersonality) ? team.cpuPersonality : 'balanced';
}

function cpuBadgeHtml(team, extraClass = '', options = {}) {
  if (!team?.isCpu) return '';
  const key = cpuPersonalityKey(team);
  const config = CPU_PERSONALITIES[key] ?? CPU_PERSONALITIES.balanced;
  const label = config.label;
  const display = options.compact ? config.short : label;
  return `<span class="tt-cpu-badge cpu-personality-badge cpu-personality-${key}${extraClass ? ` ${extraClass}` : ''}" title="${label} CPU personality" aria-label="${label} CPU personality"><span class="cpu-badge-kind">CPU</span><span class="cpu-badge-label">${display}</span></span>`;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function teamTotalBst(team) {
  return team.picks.reduce((s, p) => s + (p?.bst ?? 0), 0);
}

function pokemonPower(poke) {
  if (!poke) return 0;
  const speed = poke.stats?.speed ?? 0;
  const bulk = (poke.stats?.hp ?? 0) + (poke.stats?.defense ?? 0) + (poke.stats?.['special-defense'] ?? 0);
  return (poke.bst ?? 0) + speed * 0.5 + bulk * 0.2;
}

function getActiveRoster(team) {
  const activeIds = new Set(team.activeIds ?? []);
  const active = team.picks.filter(p => activeIds.has(p.id));
  if (active.length) return active.slice(0, ACTIVE_ROSTER_SIZE);
  return [...team.picks]
    .sort((a, b) => pokemonPower(b) - pokemonPower(a))
    .slice(0, ACTIVE_ROSTER_SIZE);
}

function getActiveRosterIds(team) {
  return getActiveRoster(team).map(p => p.id);
}

function setActiveRoster(team, ids) {
  const validIds = new Set(team.picks.map(p => p.id));
  team.activeIds = ids
    .filter(id => validIds.has(id))
    .slice(0, ACTIVE_ROSTER_SIZE);
}

function autoSetActiveRoster(team) {
  setActiveRoster(team, [...team.picks]
    .sort((a, b) => pokemonPower(b) - pokemonPower(a))
    .slice(0, ACTIVE_ROSTER_SIZE)
    .map(p => p.id));
}

function ensureActiveRosters() {
  teams.forEach(team => {
    const validActive = (team.activeIds ?? []).filter(id => team.picks.some(p => p.id === id));
    if (validActive.length === Math.min(ACTIVE_ROSTER_SIZE, team.picks.length)) {
      team.activeIds = validActive;
      return;
    }
    autoSetActiveRoster(team);
  });
}

function isActiveRosterLocked(team) {
  return (team.activeIds ?? []).length === Math.min(ACTIVE_ROSTER_SIZE, team.picks.length);
}

function rosterLimit() {
  return season?.settings?.maxRosterSize ?? MAX_ROSTER_SIZE;
}

function rosterCount(team) {
  return teamPickIds(team).length;
}

function isBenchPokemon(team, pokeId) {
  const active = new Set(getActiveRosterIds(team));
  return teamPickIds(team).includes(pokeId) && !active.has(pokeId);
}

function canDropPokemon(team, pokeId) {
  if (!team || !Number.isInteger(pokeId)) return false;
  return rosterCount(team) > ACTIVE_ROSTER_SIZE && isBenchPokemon(team, pokeId);
}

function removePokemonFromTeam(team, pokeId) {
  if (!canDropPokemon(team, pokeId)) return null;
  const dropped = team.picks.find(p => p.id === pokeId) ?? null;
  team.picks = team.picks.filter(p => p.id !== pokeId);
  team.activeIds = (team.activeIds ?? []).filter(id => id !== pokeId);
  return dropped;
}

function selectedFreeAgentDrop(team) {
  return canDropPokemon(team, faDropId) ? team.picks.find(p => p.id === faDropId) : null;
}

function canSignFreeAgent(team, poke) {
  if (!team || !poke || !canAddPokemonToTeam(team, poke)) return false;
  if (rosterCount(team) < rosterLimit()) return true;
  return Boolean(selectedFreeAgentDrop(team));
}

function canClaimFreeAgent(team, poke, teamIdx = faTeamIdx) {
  return canSignFreeAgent(team, poke) && teamIdx === currentWaiverTeamIdx();
}

function typeEffectiveness(attackingType, defendingTypes = []) {
  return defendingTypes.reduce((multiplier, defendingType) =>
    multiplier * (TYPE_CHART[attackingType]?.[defendingType] ?? 1), 1);
}

function uniqueRosterTypes(roster) {
  return [...new Set(roster.flatMap(p => p?.types ?? []))];
}

function summarizeEffectiveness(values) {
  const summary = { immune: 0, resistant: 0, neutral: 0, weak: 0, doubleWeak: 0 };
  values.forEach(value => {
    if (value === 0) summary.immune++;
    else if (value < 1) summary.resistant++;
    else if (value === 1) summary.neutral++;
    else if (value >= 4) summary.doubleWeak++;
    else summary.weak++;
  });
  return summary;
}

function typeCoverageProfile(attackingTypes, defendingRoster) {
  const defenders = defendingRoster.filter(Boolean);
  if (!attackingTypes.length || !defenders.length) {
    return {
      average: 1,
      bestAverage: 1,
      superEffectiveTargets: 0,
      resistedTargets: 0,
      immuneTargets: 0,
      targetScores: [],
    };
  }

  const targetScores = defenders.map(poke => {
    const scores = attackingTypes.map(type => ({
      type,
      multiplier: typeEffectiveness(type, poke.types),
    }));
    const best = scores.reduce((top, cur) => cur.multiplier > top.multiplier ? cur : top, scores[0]);
    return {
      id: poke.id,
      name: poke.name,
      types: poke.types,
      bestType: best.type,
      bestMultiplier: best.multiplier,
      averageMultiplier: scores.reduce((sum, s) => sum + s.multiplier, 0) / scores.length,
    };
  });

  return {
    average: targetScores.reduce((sum, s) => sum + s.averageMultiplier, 0) / targetScores.length,
    bestAverage: targetScores.reduce((sum, s) => sum + s.bestMultiplier, 0) / targetScores.length,
    superEffectiveTargets: targetScores.filter(s => s.bestMultiplier > 1).length,
    resistedTargets: targetScores.filter(s => s.bestMultiplier < 1 && s.bestMultiplier > 0).length,
    immuneTargets: targetScores.filter(s => s.bestMultiplier === 0).length,
    targetScores,
  };
}

function defensiveTypeProfile(roster, incomingTypes) {
  const defenders = roster.filter(Boolean);
  if (!defenders.length || !incomingTypes.length) {
    return {
      averageTaken: 1,
      worstAverage: 1,
      summary: summarizeEffectiveness([]),
      targetScores: [],
    };
  }

  const targetScores = defenders.map(poke => {
    const scores = incomingTypes.map(type => ({
      type,
      multiplier: typeEffectiveness(type, poke.types),
    }));
    const worst = scores.reduce((top, cur) => cur.multiplier > top.multiplier ? cur : top, scores[0]);
    const averageTaken = scores.reduce((sum, s) => sum + s.multiplier, 0) / scores.length;
    return {
      id: poke.id,
      name: poke.name,
      types: poke.types,
      worstType: worst.type,
      worstMultiplier: worst.multiplier,
      averageTaken,
    };
  });

  return {
    averageTaken: targetScores.reduce((sum, s) => sum + s.averageTaken, 0) / targetScores.length,
    worstAverage: targetScores.reduce((sum, s) => sum + s.worstMultiplier, 0) / targetScores.length,
    summary: summarizeEffectiveness(targetScores.flatMap(target =>
      incomingTypes.map(type => typeEffectiveness(type, target.types)))),
    targetScores,
  };
}

function buildBattleProfile(team) {
  const activeRoster = getActiveRoster(team);
  const rosterSize = activeRoster.length;
  const types = uniqueRosterTypes(activeRoster);
  const totalBst = activeRoster.reduce((sum, p) => sum + (p?.bst ?? 0), 0);
  const physicalAttack = activeRoster.reduce((sum, p) => sum + (p?.stats?.attack ?? 0), 0);
  const specialAttack = activeRoster.reduce((sum, p) => sum + (p?.stats?.['special-attack'] ?? 0), 0);
  const speed = activeRoster.reduce((sum, p) => sum + (p?.stats?.speed ?? 0), 0);
  const bulk = activeRoster.reduce((sum, p) =>
    sum + (p?.stats?.hp ?? 0) + (p?.stats?.defense ?? 0) + (p?.stats?.['special-defense'] ?? 0), 0);
  const allAttackTypes = Object.keys(TYPE_CHART);
  const defensiveProfile = defensiveTypeProfile(activeRoster, allAttackTypes);

  return {
    teamName: team.name,
    activeIds: activeRoster.map(p => p.id),
    rosterSize,
    types,
    diversity: types.length,
    averageBst: rosterSize ? Math.round(totalBst / rosterSize) : 0,
    totalBst,
    physicalAttack: rosterSize ? Math.round(physicalAttack / rosterSize) : 0,
    specialAttack: rosterSize ? Math.round(specialAttack / rosterSize) : 0,
    speed: rosterSize ? Math.round(speed / rosterSize) : 0,
    bulk: rosterSize ? Math.round(bulk / rosterSize) : 0,
    defensiveProfile,
  };
}

function buildMatchupProfile(teamA, teamB) {
  const profileA = buildBattleProfile(teamA);
  const profileB = buildBattleProfile(teamB);
  const rosterA = getActiveRoster(teamA);
  const rosterB = getActiveRoster(teamB);
  const offenseA = typeCoverageProfile(profileA.types, rosterB);
  const offenseB = typeCoverageProfile(profileB.types, rosterA);
  const defenseA = defensiveTypeProfile(rosterA, profileB.types);
  const defenseB = defensiveTypeProfile(rosterB, profileA.types);

  return {
    teamA: profileA,
    teamB: profileB,
    offenseA,
    offenseB,
    defenseA,
    defenseB,
    typeEdgeA: Number((offenseA.bestAverage - offenseB.bestAverage + defenseB.averageTaken - defenseA.averageTaken).toFixed(3)),
    typeEdgeB: Number((offenseB.bestAverage - offenseA.bestAverage + defenseA.averageTaken - defenseB.averageTaken).toFixed(3)),
  };
}

function gameMatchupProfile(teamAIdx, teamBIdx) {
  if (!Number.isInteger(teamAIdx) || !Number.isInteger(teamBIdx)) return null;
  return buildMatchupProfile(teams[teamAIdx], teams[teamBIdx]);
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function normalizedDiff(a, b, scale) {
  if (!scale) return 0;
  return clamp((a - b) / scale, -1, 1);
}

function matchupScore(teamA, teamB) {
  const matchup = buildMatchupProfile(teamA, teamB);
  const ratingA = teamRating(teamA);
  const ratingB = teamRating(teamB);
  const attackA = Math.max(matchup.teamA.physicalAttack, matchup.teamA.specialAttack);
  const attackB = Math.max(matchup.teamB.physicalAttack, matchup.teamB.specialAttack);
  const mixedAttackA = 1 - Math.abs(matchup.teamA.physicalAttack - matchup.teamA.specialAttack) / Math.max(1, attackA);
  const mixedAttackB = 1 - Math.abs(matchup.teamB.physicalAttack - matchup.teamB.specialAttack) / Math.max(1, attackB);

  const components = {
    rating: normalizedDiff(ratingA, ratingB, 650),
    type: clamp(matchup.typeEdgeA / 2.5, -1, 1),
    speed: normalizedDiff(matchup.teamA.speed, matchup.teamB.speed, 90),
    bulk: normalizedDiff(matchup.teamA.bulk, matchup.teamB.bulk, 220),
    attack: normalizedDiff(attackA, attackB, 95),
    mixedAttack: normalizedDiff(mixedAttackA, mixedAttackB, 0.75),
    diversity: normalizedDiff(matchup.teamA.diversity, matchup.teamB.diversity, 10),
  };

  const weightedEdge =
    components.rating * 0.48 +
    components.type * 0.22 +
    components.speed * 0.08 +
    components.bulk * 0.08 +
    components.attack * 0.07 +
    components.mixedAttack * 0.04 +
    components.diversity * 0.03;
  const chanceA = clamp(0.5 + weightedEdge * 0.32, 0.18, 0.82);

  return {
    ratingA,
    ratingB,
    matchup,
    components,
    edgeA: Number(weightedEdge.toFixed(3)),
    edgeB: Number((-weightedEdge).toFixed(3)),
    chanceA: Number(chanceA.toFixed(3)),
    chanceB: Number((1 - chanceA).toFixed(3)),
  };
}

function compactMatchupScore(score) {
  if (!score) return null;
  return {
    edgeA: score.edgeA,
    edgeB: score.edgeB,
    chanceA: score.chanceA,
    chanceB: score.chanceB,
    ratingA: score.ratingA,
    ratingB: score.ratingB,
    components: Object.fromEntries(
      Object.entries(score.components).map(([key, value]) => [key, Number(value.toFixed(3))])
    ),
  };
}

function activePokemonByMetric(team, metric) {
  const roster = getActiveRoster(team);
  if (!roster.length) return null;
  const valueFor = typeof metric === 'function'
    ? metric
    : (poke) => poke?.stats?.[metric] ?? 0;
  return [...roster].sort((a, b) => valueFor(b) - valueFor(a))[0];
}

function pokemonDisplayName(poke) {
  return poke?.name ? poke.name.replace(/-/g, ' ') : 'a key pick';
}

function teamBattleStyle(score, isTeamA) {
  const profile = isTeamA ? score.matchup.teamA : score.matchup.teamB;
  const components = score.components;
  const signed = (key) => isTeamA ? components[key] : -components[key];
  const strengths = [
    { key: 'type', label: 'type coverage', value: signed('type') },
    { key: 'speed', label: 'speed', value: signed('speed') },
    { key: 'bulk', label: 'bulk', value: signed('bulk') },
    { key: 'attack', label: 'finishing power', value: signed('attack') },
    { key: 'diversity', label: 'type diversity', value: signed('diversity') },
  ].sort((a, b) => b.value - a.value);
  const best = strengths[0];
  if (best?.value > 0.12) return best.label;
  if (profile.speed >= 95) return 'tempo';
  if (profile.bulk >= 230) return 'bulk';
  return 'balance';
}

function primaryComponent(score, winnerIsA) {
  const entries = Object.entries(score.components)
    .map(([key, value]) => ({ key, value: winnerIsA ? value : -value }))
    .sort((a, b) => b.value - a.value);
  return entries[0] ?? { key: 'rating', value: 0 };
}

function battleEvent(id, kind, text, impact = 'medium', teamIdx = null, pokemonId = null) {
  return { id, kind, text, impact, teamIdx, pokemonId };
}

function generateBattleLog(game, score, winnerIdx) {
  if (game.sets?.length) return generateSetBattleLog(game, score, winnerIdx);

  const teamA = teams[game.teamAIdx];
  const teamB = teams[game.teamBIdx];
  const winner = teams[winnerIdx];
  const loserIdx = winnerIdx === game.teamAIdx ? game.teamBIdx : game.teamAIdx;
  const loser = teams[loserIdx];
  const winnerIsA = winnerIdx === game.teamAIdx;
  const winnerChance = winnerIsA ? score.chanceA : score.chanceB;
  const typeEdge = winnerIsA ? score.matchup.typeEdgeA : score.matchup.typeEdgeB;
  const component = primaryComponent(score, winnerIsA);
  const anchor = activePokemonByMetric(winner, (poke) => pokemonPower(poke));
  const speedster = activePokemonByMetric(winner, 'speed');
  const tank = activePokemonByMetric(winner, (poke) =>
    (poke?.stats?.hp ?? 0) + (poke?.stats?.defense ?? 0) + (poke?.stats?.['special-defense'] ?? 0));
  const style = teamBattleStyle(score, winnerIsA);
  const edgeText = typeEdge > 0.25
    ? `${winner.name} found favorable type pressure into ${loser.name}.`
    : typeEdge < -0.25
      ? `${winner.name} overcame an awkward type matchup against ${loser.name}.`
      : `${teamA.name} and ${teamB.name} entered with a fairly even type spread.`;
  const componentText = {
    rating: `${winner.name}'s active roster carried the stronger overall profile.`,
    type: `${winner.name}'s type map created the cleanest openings.`,
    speed: `${winner.name} controlled tempo through speed.`,
    bulk: `${winner.name} absorbed pressure better in the middle stretch.`,
    attack: `${winner.name} had more reliable finishing power.`,
    mixedAttack: `${winner.name} kept pressure balanced between physical and special threats.`,
    diversity: `${winner.name}'s broader type mix gave them more answers.`,
  }[component.key] ?? `${winner.name} found the better matchup shape.`;

  return [
    battleEvent('preview', 'preview',
      `${teamA.name} entered at ${Math.round(score.chanceA * 100)}% odds; ${teamB.name} entered at ${Math.round(score.chanceB * 100)}%.`,
      'low'),
    battleEvent('type-edge', 'type-edge', edgeText, Math.abs(typeEdge) > 0.35 ? 'high' : 'medium', winnerIdx),
    battleEvent('profile-edge', 'stat-edge', componentText, component.value > 0.2 ? 'high' : 'medium', winnerIdx),
    battleEvent('swing', 'swing',
      `${pokemonDisplayName(speedster)} helped ${winner.name} play through ${style}.`,
      'medium', winnerIdx, speedster?.id ?? null),
    battleEvent('anchor', 'swing',
      `${pokemonDisplayName(tank)} stabilized the matchup while ${pokemonDisplayName(anchor)} gave ${winner.name} a closing threat.`,
      'medium', winnerIdx, anchor?.id ?? null),
    battleEvent('finish', 'finish',
      `${winner.name} defeated ${loser.name} ${winnerIdx === game.teamAIdx ? game.scoreA : game.scoreB}-${winnerIdx === game.teamAIdx ? game.scoreB : game.scoreA}.`,
      winnerChance < 0.45 ? 'high' : 'medium', winnerIdx),
  ];
}

function bestTypeMultiplier(attacker, defender) {
  const attackingTypes = attacker?.types ?? [];
  if (!attackingTypes.length || !defender?.types?.length) return { type: null, multiplier: 1 };
  return attackingTypes
    .map(type => ({ type, multiplier: typeEffectiveness(type, defender.types) }))
    .sort((a, b) => b.multiplier - a.multiplier)[0];
}

function skirmishStatScore(poke, typeMultiplier) {
  const bestAttack = Math.max(poke?.stats?.attack ?? 0, poke?.stats?.['special-attack'] ?? 0);
  const bulk = (poke?.stats?.hp ?? 0) + (poke?.stats?.defense ?? 0) + (poke?.stats?.['special-defense'] ?? 0);
  const speed = poke?.stats?.speed ?? 0;
  const bst = poke?.bst ?? 0;
  const typeBonus = typeMultiplier === 0
    ? -90
    : typeMultiplier >= 4
      ? 120
      : typeMultiplier > 1
        ? 70
        : typeMultiplier < 1
          ? -45
          : 0;

  return bst * 0.45 + speed * 0.18 + bestAttack * 0.18 + bulk * 0.12 + typeBonus;
}

function skirmishReason(winnerPoke, loserPoke, winnerType, loserType, winnerScore, loserScore) {
  const winnerName = pokemonDisplayName(winnerPoke);
  const loserName = pokemonDisplayName(loserPoke);
  if (winnerType.multiplier >= 4) {
    return `${winnerName} overwhelmed ${loserName} with a 4x ${winnerType.type} matchup.`;
  }
  if (winnerType.multiplier > 1 && winnerType.multiplier > loserType.multiplier) {
    return `${winnerName} exploited a ${winnerType.type} advantage into ${loserName}.`;
  }
  if (loserType.multiplier > winnerType.multiplier) {
    return `${winnerName} survived the worse type chart and won on stats.`;
  }
  const speedGap = (winnerPoke?.stats?.speed ?? 0) - (loserPoke?.stats?.speed ?? 0);
  if (speedGap >= 25) return `${winnerName} moved first and kept ${loserName} under pressure.`;
  const bulkGap = ((winnerPoke?.stats?.hp ?? 0) + (winnerPoke?.stats?.defense ?? 0) + (winnerPoke?.stats?.['special-defense'] ?? 0)) -
    ((loserPoke?.stats?.hp ?? 0) + (loserPoke?.stats?.defense ?? 0) + (loserPoke?.stats?.['special-defense'] ?? 0));
  if (bulkGap >= 55) return `${winnerName} outlasted ${loserName} through bulk.`;
  if (winnerScore - loserScore <= 18) return `${winnerName} edged ${loserName} in a tight exchange.`;
  return `${winnerName} beat ${loserName} with the cleaner overall profile.`;
}

function simulateSkirmish(pokeA, pokeB, teamAIdx, teamBIdx, setNumber) {
  const typeA = bestTypeMultiplier(pokeA, pokeB);
  const typeB = bestTypeMultiplier(pokeB, pokeA);
  const baseA = skirmishStatScore(pokeA, typeA.multiplier);
  const baseB = skirmishStatScore(pokeB, typeB.multiplier);
  const rollA = baseA + (Math.random() - 0.5) * 55;
  const rollB = baseB + (Math.random() - 0.5) * 55;
  const winnerIdx = rollA >= rollB ? teamAIdx : teamBIdx;
  const winnerPokemon = winnerIdx === teamAIdx ? pokeA : pokeB;
  const loserPokemon = winnerIdx === teamAIdx ? pokeB : pokeA;
  const winnerType = winnerIdx === teamAIdx ? typeA : typeB;
  const loserType = winnerIdx === teamAIdx ? typeB : typeA;
  const winnerScore = winnerIdx === teamAIdx ? rollA : rollB;
  const loserScore = winnerIdx === teamAIdx ? rollB : rollA;

  return {
    id: `set-${setNumber}`,
    setNumber,
    teamAIdx,
    teamBIdx,
    pokemonAId: pokeA.id,
    pokemonBId: pokeB.id,
    pokemonAName: pokeA.name,
    pokemonBName: pokeB.name,
    typeMultiplierA: Number(typeA.multiplier.toFixed(2)),
    typeMultiplierB: Number(typeB.multiplier.toFixed(2)),
    statEdgeA: Math.round(baseA - baseB),
    statEdgeB: Math.round(baseB - baseA),
    scoreA: Math.round(rollA),
    scoreB: Math.round(rollB),
    winnerIdx,
    winnerPokemonId: winnerPokemon.id,
    winnerPokemonName: winnerPokemon.name,
    reason: skirmishReason(winnerPokemon, loserPokemon, winnerType, loserType, winnerScore, loserScore),
  };
}

function simulateSets(game) {
  const rosterA = shuffleArray(getActiveRoster(teams[game.teamAIdx]));
  const rosterB = shuffleArray(getActiveRoster(teams[game.teamBIdx]));
  if (!rosterA.length || !rosterB.length) {
    return {
      sets: [],
      scoreA: 0,
      scoreB: 0,
      winnerIdx: game.teamAIdx,
    };
  }
  const sets = [];
  let winsA = 0;
  let winsB = 0;

  for (let i = 0; i < 5 && winsA < 3 && winsB < 3; i++) {
    const pokeA = rosterA[i % rosterA.length];
    const pokeB = rosterB[i % rosterB.length];
    const set = simulateSkirmish(pokeA, pokeB, game.teamAIdx, game.teamBIdx, i + 1);
    sets.push(set);
    if (set.winnerIdx === game.teamAIdx) winsA++;
    else winsB++;
  }

  return {
    sets,
    scoreA: winsA,
    scoreB: winsB,
    winnerIdx: winsA > winsB ? game.teamAIdx : game.teamBIdx,
  };
}

function generateSetBattleLog(game, score, winnerIdx) {
  const teamA = teams[game.teamAIdx];
  const teamB = teams[game.teamBIdx];
  const winner = teams[winnerIdx];
  const loser = teams[winnerIdx === game.teamAIdx ? game.teamBIdx : game.teamAIdx];
  const winnerChance = winnerIdx === game.teamAIdx ? score.chanceA : score.chanceB;
  const logs = [
    battleEvent('preview', 'preview',
      `${teamA.name} entered at ${Math.round(score.chanceA * 100)}% odds; ${teamB.name} entered at ${Math.round(score.chanceB * 100)}%.`,
      'low'),
  ];

  game.sets.forEach(set => {
    logs.push(battleEvent(
      set.id,
      set.winnerIdx === winnerIdx ? 'skirmish-win' : 'skirmish-loss',
      `Skirmish ${set.setNumber}: ${set.reason}`,
      set.winnerIdx === winnerIdx ? 'medium' : 'low',
      set.winnerIdx,
      set.winnerPokemonId
    ));
  });

  logs.push(battleEvent('finish', 'finish',
    `${winner.name} defeated ${loser.name} ${game.scoreA}-${game.scoreB} in ${game.sets.length} skirmishes.`,
    winnerChance < 0.45 ? 'high' : 'medium', winnerIdx));
  return logs;
}

function ensureBattleLog(game) {
  if (!game?.simulated) return game;
  if (game.battleLog?.length) return game;
  if (!Number.isInteger(game.teamAIdx) || !Number.isInteger(game.teamBIdx) || !Number.isInteger(game.winnerIdx)) {
    game.battleLog = [];
    return game;
  }

  const score = matchupScore(teams[game.teamAIdx], teams[game.teamBIdx]);
  game.matchup = compactMatchupProfile(score.matchup);
  game.matchupScore = compactMatchupScore(score);
  game.battleLog = generateBattleLog(game, score, game.winnerIdx);
  return game;
}

function compactMatchupProfile(matchup) {
  if (!matchup) return null;
  if (typeof matchup.offenseA === 'number') return matchup;
  return {
    typeEdgeA: matchup.typeEdgeA,
    typeEdgeB: matchup.typeEdgeB,
    offenseA: Number(matchup.offenseA.bestAverage.toFixed(3)),
    offenseB: Number(matchup.offenseB.bestAverage.toFixed(3)),
    defenseA: Number(matchup.defenseA.averageTaken.toFixed(3)),
    defenseB: Number(matchup.defenseB.averageTaken.toFixed(3)),
    teamATypes: matchup.teamA.types,
    teamBTypes: matchup.teamB.types,
  };
}

function teamRating(team) {
  const activeRoster = getActiveRoster(team);
  if (!activeRoster.length) return 1;
  const totalBst = activeRoster.reduce((s, p) => s + (p?.bst ?? 0), 0);
  const uniqueTypes = new Set(activeRoster.flatMap(p => p?.types ?? [])).size;
  const speedTotal = activeRoster.reduce((sum, p) => sum + (p?.stats?.speed ?? 0), 0);
  const bulkTotal = activeRoster.reduce((sum, p) =>
    sum + (p?.stats?.hp ?? 0) + (p?.stats?.defense ?? 0) + (p?.stats?.['special-defense'] ?? 0), 0);
  const speedAvg = speedTotal / activeRoster.length;
  const bulkAvg = bulkTotal / activeRoster.length;

  return Math.round(totalBst + uniqueTypes * 25 + speedAvg * 0.8 + bulkAvg * 0.35);
}

function teamPickIds(team) {
  return (team?.picks ?? [])
    .map(p => p?.id ?? p)
    .filter(id => Number.isInteger(id));
}

function ownedPokemonIds(teamList = teams) {
  const ids = new Set();
  teamList.forEach(team => {
    teamPickIds(team).forEach(id => ids.add(id));
    (team?.activeIds ?? [])
      .filter(id => Number.isInteger(id))
      .forEach(id => ids.add(id));
  });
  return ids;
}

function pokemonOwner(id, teamList = teams) {
  return teamList.find((team) =>
    teamPickIds(team).includes(id) ||
    (team?.activeIds ?? []).includes(id)
  ) ?? null;
}

function isPokemonOwned(id, teamList = teams) {
  return ownedPokemonIds(teamList).has(id);
}

function canAddPokemonToTeam(team, poke, teamList = teams) {
  const id = poke?.id ?? poke;
  if (!Number.isInteger(id)) return false;
  if (team && teamPickIds(team).includes(id)) return false;
  return !isPokemonOwned(id, teamList);
}

function freeAgentPokemon(source = allPokemon, teamList = teams) {
  const owned = ownedPokemonIds(teamList);
  return source.filter(poke => !owned.has(poke.id));
}

function syncDraftedIdsWithOwnership() {
  draftedIds = ownedPokemonIds();
}

function initialWaiverOrder() {
  const inverseDraftOrder = [...draftOrderIndices].reverse();
  return normalizeTeamOrder(inverseDraftOrder, teams);
}

function getWaiverOrder() {
  const activeSeason = ensureSeason();
  activeSeason.waiverOrder = normalizeTeamOrder(activeSeason.waiverOrder, teams, initialWaiverOrder());
  return activeSeason.waiverOrder;
}

function currentWaiverTeamIdx() {
  return getWaiverOrder()[0] ?? 0;
}

function waiverRank(teamIdx) {
  const idx = getWaiverOrder().indexOf(teamIdx);
  return idx >= 0 ? idx + 1 : null;
}

function recordFreeAgencyTransaction({
  teamIdx,
  pokemon,
  droppedPokemon = null,
  source = 'human',
  waiverRankBefore = null,
  gain = null,
  reason = null,
}) {
  const team = teams[teamIdx];
  if (!team || !Number.isInteger(pokemon?.id)) return null;

  const activeSeason = ensureSeason();
  activeSeason.freeAgencyTransactions = normalizeFreeAgencyTransactions(activeSeason.freeAgencyTransactions);
  const normalizedSource = source === 'cpu' ? 'cpu' : 'human';
  const timestamp = new Date().toISOString();
  const sequence = activeSeason.freeAgencyTransactions.length + 1;
  const transaction = {
    id: `fa-${draftNumber}-${pokemon.id}-${Date.now()}-${sequence}`,
    draftId: draftNumber,
    genIdx: currentGenIdx,
    timestamp,
    action: 'claim',
    source: normalizedSource,
    teamIdx,
    teamName: team.name,
    teamColor: team.color,
    pokemonId: pokemon.id,
    pokemonName: pokemon.name,
    droppedPokemonId: Number.isInteger(droppedPokemon?.id) ? droppedPokemon.id : null,
    droppedPokemonName: Number.isInteger(droppedPokemon?.id) ? droppedPokemon.name : null,
    waiverRankBefore: Number.isInteger(waiverRankBefore) && waiverRankBefore > 0
      ? waiverRankBefore
      : null,
    cpuGain: normalizedSource === 'cpu' && Number.isFinite(gain)
      ? Number(gain.toFixed(2))
      : null,
    cpuReason: normalizedSource === 'cpu' && typeof reason === 'string' && reason
      ? reason
      : null,
  };

  activeSeason.freeAgencyTransactions.push(transaction);
  return transaction;
}

function rotateWaiverOrder(teamIdx = currentWaiverTeamIdx()) {
  const activeSeason = ensureSeason();
  const order = getWaiverOrder();
  const idx = order.indexOf(teamIdx);
  if (idx < 0) return order;
  activeSeason.waiverOrder = [
    ...order.slice(0, idx),
    ...order.slice(idx + 1),
    teamIdx,
  ];
  return activeSeason.waiverOrder;
}

function resetWaiverOrderForDraft() {
  const activeSeason = ensureSeason();
  activeSeason.waiverOrder = initialWaiverOrder();
  return activeSeason.waiverOrder;
}

function waiverOrderPills() {
  return getWaiverOrder().map((teamIdx, idx) => {
    const team = teams[teamIdx];
    if (!team) return '';
    return `
      <div class="fa-waiver-pill${idx === 0 ? ' current' : ''}">
        <span>${idx + 1}</span>
        <i style="background:${team.color}"></i>
        <strong>${team.name}</strong>
      </div>
    `;
  }).join('');
}

function serializeTeam(team) {
  return {
    name: team.name,
    color: team.color,
    isCpu: team.isCpu,
    cpuPersonality: team.isCpu ? cpuPersonalityKey(team) : null,
    picks: teamPickIds(team),
    activeIds: getActiveRosterIds(team),
  };
}

function buildSeasonStandings() {
  const schedule = getCurrentDraftSchedule();
  if (schedule.some(game => game.simulated)) {
    return buildRegularSeasonStandings(schedule);
  }

  return teams
    .map((team, idx) => ({
      teamIdx: idx,
      name: team.name,
      color: team.color,
      isCpu: team.isCpu,
      cpuPersonality: team.isCpu ? cpuPersonalityKey(team) : null,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
      rating: teamRating(team),
      totalBst: teamTotalBst(team),
      rosterSize: team.picks.length,
      activeRosterSize: getActiveRoster(team).length,
    }))
    .sort((a, b) => b.rating - a.rating || b.totalBst - a.totalBst)
    .map((entry, seed) => ({ ...entry, seed: seed + 1 }));
}

function buildDraftRecord(status = 'inProgress') {
  const gen = GENS[currentGenIdx];
  return {
    id: draftNumber,
    genIdx: currentGenIdx,
    genNum: gen.num,
    genLabel: gen.label,
    status,
    order: [...draftOrderIndices],
    snakeOrder: [...snakeOrder],
    currentRound,
    currentPickInRound,
    draftedIds: [...ownedPokemonIds()],
    picksByTeam: teams.map(teamPickIds),
  };
}

function createSeason() {
  return {
    version: SAVE_VERSION,
    phase: SEASON_PHASES.DRAFT,
    startedAt: new Date().toISOString(),
    settings: {
      startGenIdx: currentGenIdx,
      numTeams,
      numRounds,
      activeRosterSize: ACTIVE_ROSTER_SIZE,
      maxRosterSize: MAX_ROSTER_SIZE,
      maxGenIdx: GENS.length - 1,
    },
    currentDraftId: draftNumber,
    currentGenIdx,
    teams: teams.map(serializeTeam),
    drafts: [buildDraftRecord()],
    standings: buildSeasonStandings(),
    schedule: [],
    results: [],
    playoffs: [],
    champions: [],
    champion: null,
    nextDraftOrder: [...draftOrderIndices],
    waiverOrder: initialWaiverOrder(),
    freeAgencyTransactions: [],
  };
}

function ensureSeason() {
  if (!season) season = createSeason();
  return season;
}

function syncSeason(phase = SEASON_PHASES.DRAFT, draftStatus = 'inProgress') {
  const activeSeason = ensureSeason();
  activeSeason.drafts ??= [];
  const draftRecord = buildDraftRecord(draftStatus);
  const draftIdx = activeSeason.drafts.findIndex(d => d.id === draftRecord.id);

  activeSeason.version = SAVE_VERSION;
  activeSeason.phase = phase;
  activeSeason.currentDraftId = draftNumber;
  activeSeason.currentGenIdx = currentGenIdx;
  activeSeason.settings ??= {};
  activeSeason.settings.numTeams = numTeams;
  activeSeason.settings.numRounds = numRounds;
  activeSeason.settings.activeRosterSize = ACTIVE_ROSTER_SIZE;
  activeSeason.settings.maxRosterSize ??= MAX_ROSTER_SIZE;
  activeSeason.settings.maxGenIdx ??= GENS.length - 1;
  activeSeason.teams = teams.map(serializeTeam);
  activeSeason.standings = buildSeasonStandings();
  activeSeason.schedule ??= [];
  activeSeason.results ??= [];
  activeSeason.playoffs ??= [];
  activeSeason.champions ??= [];
  activeSeason.champion ??= null;
  activeSeason.waiverOrder = normalizeTeamOrder(activeSeason.waiverOrder, teams, initialWaiverOrder());
  activeSeason.freeAgencyTransactions = normalizeFreeAgencyTransactions(activeSeason.freeAgencyTransactions);

  if (draftIdx >= 0) activeSeason.drafts[draftIdx] = draftRecord;
  else activeSeason.drafts.push(draftRecord);

  return activeSeason;
}

function computeNextDraftOrder() {
  const playoffOrder = computePlayoffDraftOrder();
  if (playoffOrder.length) return playoffOrder;

  const standings = buildRegularSeasonStandings(getCurrentDraftSchedule());
  if (standings.some(s => s.wins || s.losses)) {
    return [...standings].reverse().map(s => s.teamIdx);
  }

  return [...teams]
    .map((t, i) => ({ i, bst: teamTotalBst(t) }))
    .sort((a, b) => a.bst - b.bst)
    .map(t => t.i);
}

function setNextDraftOrder(order) {
  const activeSeason = ensureSeason();
  activeSeason.nextDraftOrder = [...order];
}

function getCurrentDraftSchedule() {
  return season?.schedule?.filter(game => game.draftId === draftNumber) ?? [];
}

function generateRoundRobinSchedule() {
  const gen = GENS[currentGenIdx];
  const slots = Array.from({ length: numTeams }, (_, i) => i);
  if (slots.length % 2 === 1) slots.push(null);

  const rounds = slots.length - 1;
  const games = [];
  let rotation = [...slots];

  for (let week = 1; week <= rounds; week++) {
    for (let i = 0; i < rotation.length / 2; i++) {
      const left = rotation[i];
      const right = rotation[rotation.length - 1 - i];
      if (left === null || right === null) continue;

      const flip = week % 2 === 0;
      const teamAIdx = flip ? right : left;
      const teamBIdx = flip ? left : right;
      games.push({
        id: `${draftNumber}-${week}-${teamAIdx}-${teamBIdx}`,
        draftId: draftNumber,
        genIdx: currentGenIdx,
        genNum: gen.num,
        week,
        teamAIdx,
        teamBIdx,
        ratingA: teamRating(teams[teamAIdx]),
        ratingB: teamRating(teams[teamBIdx]),
        matchup: compactMatchupProfile(gameMatchupProfile(teamAIdx, teamBIdx)),
        matchupScore: null,
        battleLog: [],
        sets: [],
        scoreA: null,
        scoreB: null,
        winnerIdx: null,
        simulated: false,
      });
    }

    rotation = [
      rotation[0],
      rotation[rotation.length - 1],
      ...rotation.slice(1, rotation.length - 1),
    ];
  }

  return games;
}

function ensureRegularSeasonSchedule() {
  const activeSeason = ensureSeason();
  activeSeason.schedule ??= [];

  const existing = getCurrentDraftSchedule();
  if (existing.length) return existing;

  const schedule = generateRoundRobinSchedule();
  activeSeason.schedule.push(...schedule);
  activeSeason.results ??= [];
  activeSeason.standings = buildRegularSeasonStandings(schedule);
  return schedule;
}

function buildRegularSeasonStandings(schedule = getCurrentDraftSchedule()) {
  const table = teams.map((team, idx) => ({
    teamIdx: idx,
    name: team.name,
    color: team.color,
    isCpu: team.isCpu,
    cpuPersonality: team.isCpu ? cpuPersonalityKey(team) : null,
    wins: 0,
    losses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    pointDiff: 0,
      rating: teamRating(team),
      totalBst: teamTotalBst(team),
      rosterSize: team.picks.length,
      activeRosterSize: getActiveRoster(team).length,
    }));

  schedule.forEach(game => {
    if (!game.simulated) return;
    const teamA = table[game.teamAIdx];
    const teamB = table[game.teamBIdx];
    teamA.pointsFor += game.scoreA;
    teamA.pointsAgainst += game.scoreB;
    teamB.pointsFor += game.scoreB;
    teamB.pointsAgainst += game.scoreA;

    if (game.winnerIdx === game.teamAIdx) {
      teamA.wins++;
      teamB.losses++;
    } else {
      teamB.wins++;
      teamA.losses++;
    }
  });

  return table
    .map(entry => ({
      ...entry,
      pointDiff: entry.pointsFor - entry.pointsAgainst,
    }))
    .sort((a, b) =>
      b.wins - a.wins ||
      b.pointDiff - a.pointDiff ||
      b.pointsFor - a.pointsFor ||
      b.rating - a.rating ||
      b.totalBst - a.totalBst)
    .map((entry, seed) => ({ ...entry, seed: seed + 1 }));
}

function syncRegularSeasonResults() {
  const activeSeason = ensureSeason();
  const schedule = getCurrentDraftSchedule();
  activeSeason.results = [
    ...(activeSeason.results ?? []).filter(result => result.draftId !== draftNumber),
    ...schedule.filter(game => game.simulated).map(game => {
      ensureBattleLog(game);
      return {
        id: game.id,
        draftId: game.draftId,
        genIdx: game.genIdx,
        week: game.week,
        teamAIdx: game.teamAIdx,
        teamBIdx: game.teamBIdx,
        scoreA: game.scoreA,
        scoreB: game.scoreB,
        winnerIdx: game.winnerIdx,
        matchup: compactMatchupProfile(game.matchup),
        matchupScore: compactMatchupScore(game.matchupScore),
        battleLog: game.battleLog ?? [],
        sets: game.sets ?? [],
      };
    }),
  ];
  activeSeason.standings = buildRegularSeasonStandings(schedule);
  activeSeason.nextDraftOrder = computeNextDraftOrder();
}

function simulateGame(game) {
  if (game.simulated) return game;

  const score = matchupScore(teams[game.teamAIdx], teams[game.teamBIdx]);
  const ratingA = score.ratingA;
  const ratingB = score.ratingB;
  game.matchup = compactMatchupProfile(score.matchup);
  game.matchupScore = compactMatchupScore(score);
  const setResult = simulateSets(game);

  game.ratingA = ratingA;
  game.ratingB = ratingB;
  game.sets = setResult.sets;
  game.winnerIdx = setResult.winnerIdx;
  game.scoreA = setResult.scoreA;
  game.scoreB = setResult.scoreB;
  game.battleLog = generateBattleLog(game, score, setResult.winnerIdx);
  game.simulated = true;
  return game;
}

function isRegularSeasonComplete() {
  const schedule = getCurrentDraftSchedule();
  return schedule.length > 0 && schedule.every(game => game.simulated);
}

function getCurrentPlayoffGames() {
  return season?.playoffs?.filter(game => game.draftId === draftNumber) ?? [];
}

function buildPlayoffSeeds() {
  const standings = buildRegularSeasonStandings(getCurrentDraftSchedule());
  const playoffSize = Math.min(4, standings.length);
  return standings.slice(0, playoffSize).map((entry, idx) => ({
    ...entry,
    playoffSeed: idx + 1,
  }));
}

function playoffGameBase(id, round, label, teamAIdx, teamBIdx, sourceA = null, sourceB = null) {
  const gen = GENS[currentGenIdx];
  return {
    id,
    draftId: draftNumber,
    genIdx: currentGenIdx,
    genNum: gen.num,
    round,
    label,
    teamAIdx,
    teamBIdx,
    sourceA,
    sourceB,
    ratingA: Number.isInteger(teamAIdx) ? teamRating(teams[teamAIdx]) : null,
    ratingB: Number.isInteger(teamBIdx) ? teamRating(teams[teamBIdx]) : null,
    matchup: compactMatchupProfile(gameMatchupProfile(teamAIdx, teamBIdx)),
    matchupScore: null,
    battleLog: [],
    sets: [],
    scoreA: null,
    scoreB: null,
    winnerIdx: null,
    simulated: false,
  };
}

function generatePlayoffBracket() {
  const seeds = buildPlayoffSeeds();
  if (seeds.length < 2) return [];

  if (seeds.length === 2) {
    return [
      playoffGameBase(`${draftNumber}-final`, 1, 'Final', seeds[0].teamIdx, seeds[1].teamIdx),
    ];
  }

  if (seeds.length === 3) {
    return [
      playoffGameBase(`${draftNumber}-playin`, 1, 'Play-In', seeds[1].teamIdx, seeds[2].teamIdx),
      playoffGameBase(`${draftNumber}-final`, 2, 'Final', seeds[0].teamIdx, null, null, `${draftNumber}-playin`),
    ];
  }

  return [
    playoffGameBase(`${draftNumber}-semi-1`, 1, 'Semifinal', seeds[0].teamIdx, seeds[3].teamIdx),
    playoffGameBase(`${draftNumber}-semi-2`, 1, 'Semifinal', seeds[1].teamIdx, seeds[2].teamIdx),
    playoffGameBase(`${draftNumber}-final`, 2, 'Final', null, null, `${draftNumber}-semi-1`, `${draftNumber}-semi-2`),
  ];
}

function resolvePlayoffSources() {
  const games = getCurrentPlayoffGames();
  games.forEach(game => {
    if (game.sourceA) {
      const source = games.find(g => g.id === game.sourceA);
      if (source?.winnerIdx !== null && source?.winnerIdx !== undefined) game.teamAIdx = source.winnerIdx;
    }
    if (game.sourceB) {
      const source = games.find(g => g.id === game.sourceB);
      if (source?.winnerIdx !== null && source?.winnerIdx !== undefined) game.teamBIdx = source.winnerIdx;
    }
    game.ratingA = Number.isInteger(game.teamAIdx) ? teamRating(teams[game.teamAIdx]) : null;
    game.ratingB = Number.isInteger(game.teamBIdx) ? teamRating(teams[game.teamBIdx]) : null;
    game.matchup = compactMatchupProfile(gameMatchupProfile(game.teamAIdx, game.teamBIdx));
  });
}

function ensurePlayoffBracket() {
  const activeSeason = ensureSeason();
  activeSeason.playoffs ??= [];

  const existing = getCurrentPlayoffGames();
  if (existing.length) {
    resolvePlayoffSources();
    return existing;
  }

  const bracket = generatePlayoffBracket();
  activeSeason.playoffs.push(...bracket);
  resolvePlayoffSources();
  return bracket;
}

function isPlayoffGameReady(game) {
  return Number.isInteger(game.teamAIdx) && Number.isInteger(game.teamBIdx);
}

function getNextPlayablePlayoffRound() {
  resolvePlayoffSources();
  const readyGames = getCurrentPlayoffGames()
    .filter(game => !game.simulated && isPlayoffGameReady(game));
  if (!readyGames.length) return null;
  return Math.min(...readyGames.map(game => game.round));
}

function isPlayoffsComplete() {
  const games = getCurrentPlayoffGames();
  return games.length > 0 && games.every(game => game.simulated);
}

function getPlayoffFinalGame() {
  return getCurrentPlayoffGames()
    .sort((a, b) => b.round - a.round)[0] ?? null;
}

function getPlayoffChampionIdx() {
  const final = getPlayoffFinalGame();
  if (!final?.simulated) return null;
  return final?.winnerIdx ?? null;
}

function getPlayoffRunnerUpIdx() {
  const final = getPlayoffFinalGame();
  if (!final?.simulated) return null;
  return final.winnerIdx === final.teamAIdx ? final.teamBIdx : final.teamAIdx;
}

function syncPlayoffResults() {
  const activeSeason = ensureSeason();
  resolvePlayoffSources();
  const championIdx = getPlayoffChampionIdx();
  const standings = buildRegularSeasonStandings(getCurrentDraftSchedule());
  activeSeason.standings = standings;
  activeSeason.nextDraftOrder = computePlayoffDraftOrder();

  if (championIdx !== null && championIdx !== undefined) {
    const standing = standings.find(s => s.teamIdx === championIdx);
    const champion = {
      draftId: draftNumber,
      genIdx: currentGenIdx,
      teamIdx: championIdx,
      name: teams[championIdx].name,
      seed: standing?.seed ?? null,
      record: standing ? `${standing.wins}-${standing.losses}` : null,
      pointDiff: standing?.pointDiff ?? 0,
      decidedBy: 'playoffs',
    };
    activeSeason.champion = champion;
    activeSeason.champions = [
      ...(activeSeason.champions ?? []).filter(c => c.draftId !== draftNumber),
      champion,
    ];
  }
}

function computePlayoffDraftOrder() {
  const games = getCurrentPlayoffGames();
  if (!games.length || !games.some(game => game.simulated)) return [];

  const standings = buildRegularSeasonStandings(getCurrentDraftSchedule());
  const seedOrder = standings.map(s => s.teamIdx);
  const playoffTeams = new Set(buildPlayoffSeeds().map(seed => seed.teamIdx));
  const ordered = [];

  standings
    .filter(entry => !playoffTeams.has(entry.teamIdx))
    .reverse()
    .forEach(entry => ordered.push(entry.teamIdx));

  const championIdx = getPlayoffChampionIdx();
  const runnerUpIdx = getPlayoffRunnerUpIdx();
  const finalists = new Set([championIdx, runnerUpIdx].filter(Number.isInteger));
  const eliminated = [];

  games.forEach(game => {
    if (!game.simulated) return;
    const loserIdx = game.winnerIdx === game.teamAIdx ? game.teamBIdx : game.teamAIdx;
    if (Number.isInteger(loserIdx) && !finalists.has(loserIdx)) {
      eliminated.push({ teamIdx: loserIdx, round: game.round });
    }
  });

  eliminated
    .sort((a, b) => a.round - b.round || seedOrder.indexOf(b.teamIdx) - seedOrder.indexOf(a.teamIdx))
    .forEach(entry => ordered.push(entry.teamIdx));

  if (Number.isInteger(runnerUpIdx)) ordered.push(runnerUpIdx);
  if (Number.isInteger(championIdx)) ordered.push(championIdx);

  return ordered.filter((teamIdx, idx) => ordered.indexOf(teamIdx) === idx);
}

// ── Setup ──
function updateTeamCount(val) {
  numTeams = Math.min(MAX_TEAMS, parseInt(val));
  document.getElementById('numTeamsVal').textContent = numTeams;
  renderNameInputs();
}

function updateRounds() {
  numRounds = DRAFT_ROUNDS;
  document.getElementById('numRoundsVal').textContent = DRAFT_ROUNDS;
}

function renderNameInputs() {
  const grid = document.getElementById('teamNamesGrid');
  const existing = [...grid.querySelectorAll('.team-name-field')].map(i => i.value);
  const existingCpu = [...grid.querySelectorAll('.cpu-toggle')].map(b => b.dataset.cpu === 'true');
  grid.innerHTML = '';
  for (let i = 0; i < numTeams; i++) {
    const row = document.createElement('div');
    row.className = 'team-name-row';

    const dot = document.createElement('div');
    dot.className = 'team-dot';
    dot.style.background = TEAM_COLORS[i];

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'team-name-field';
    inp.value = existing[i] !== undefined ? existing[i] : DEFAULT_NAMES[i];
    inp.placeholder = `Team ${i + 1}`;

    const cpuBtn = document.createElement('button');
    cpuBtn.type = 'button';
    cpuBtn.className = 'cpu-toggle';
    cpuBtn.textContent = 'CPU';
    const isCpu = existingCpu[i] ?? false;
    cpuBtn.dataset.cpu = String(isCpu);
    if (isCpu) cpuBtn.classList.add('active');
    cpuBtn.addEventListener('click', () => {
      const nowCpu = cpuBtn.dataset.cpu !== 'true';
      cpuBtn.dataset.cpu = String(nowCpu);
      cpuBtn.classList.toggle('active', nowCpu);
    });

    row.appendChild(dot);
    row.appendChild(inp);
    row.appendChild(cpuBtn);
    grid.appendChild(row);
  }
}

async function startDraft() {
  currentGenIdx = parseInt(document.getElementById('genSelect').value);
  draftNumber = 1;
  currentRound = 0;
  currentPickInRound = 0;
  draftedIds = new Set();
  season = null;
  selectedBattleLogs = { season: null, playoff: null };
  faSort = 'recommended'; faSearch = ''; faType = ''; faTeamIdx = 0; faHistoryDraft = 'current'; faHistoryTeam = 'all'; faHistoryMove = 'all'; faDropId = null; faNotice = ''; faCpuThinking = false; faCpuPassStreak = 0;
  numTeams = Math.min(MAX_TEAMS, parseInt(document.getElementById('numTeamsRange').value));
  numRounds = DRAFT_ROUNDS;
  updateRounds();

  const nameFields = document.querySelectorAll('.team-name-field');
  const cpuToggles = document.querySelectorAll('.cpu-toggle');
  teams = Array.from({ length: numTeams }, (_, i) => ({
    name: nameFields[i]?.value.trim() || `Team ${i + 1}`,
    color: TEAM_COLORS[i],
    isCpu: cpuToggles[i]?.dataset.cpu === 'true',
    cpuPersonality: null,
    picks: [],
    activeIds: [],
  }));
  normalizeCpuPersonalities(teams);
  syncDraftedIdsWithOwnership();

  // Randomise first draft order
  draftOrderIndices = shuffleArray(Array.from({ length: numTeams }, (_, i) => i));

  document.getElementById('setupScreen').style.display = 'none';
  await loadGen(currentGenIdx);

  buildSnakeOrder();
  season = createSeason();
  saveSeason(buildSeasonState());
  populateTypeFilter();

  document.getElementById('loadingScreen').style.display = 'none';
  document.getElementById('draftScreen').style.display = 'flex';

  refreshHeader();
  refreshSnakeBar();
  refreshGrid();
  refreshTeams();
  if (isMobile()) initMobileTabs();
  triggerCpuIfNeeded();
}

// ── Data Loading ──
async function loadGen(genIdx) {
  const gen = GENS[genIdx];
  document.getElementById('loadLabel').textContent = `Loading ${gen.label}`;
  document.getElementById('loadingScreen').style.display = 'flex';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('loadCount').textContent = '0 / 0';
  document.getElementById('loadName').textContent = '';

  await loadPokemonData(gen.start, gen.end);
}

async function loadPokemonData(start, end) {
  allPokemon = [];
  const count = end - start + 1;

  // Try to serve entirely from IndexedDB
  const cached = await getCachedRange(start, end);
  if (cached.length === count) {
    allPokemon = cached;
    return;
  }

  // Partial or no cache — fetch missing with progress
  const cachedMap = new Map(cached.map(p => [p.id, p]));
  const allIds = Array.from({ length: count }, (_, i) => start + i);
  let loaded = 0;
  document.getElementById('loadCount').textContent = `0 / ${count}`;
  const BATCH = 60;

  for (let i = 0; i < allIds.length; i += BATCH) {
    const batchIds = allIds.slice(i, i + BATCH);
    const results = await Promise.all(batchIds.map(async (id) => {
      if (cachedMap.has(id)) { loaded++; return cachedMap.get(id); }

      const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json());
      const parsed = parsePokemon(data);
      await putCachedPokemon(parsed);

      loaded++;
      const pct = Math.round((loaded / count) * 100);
      document.getElementById('progressFill').style.width = `${pct}%`;
      document.getElementById('loadCount').textContent = `${loaded} / ${count}`;
      document.getElementById('loadName').textContent = parsed.name;
      return parsed;
    }));
    allPokemon.push(...results);
  }
}

function parsePokemon(data) {
  let bst = 0;
  const stats = {};
  for (const s of data.stats) {
    stats[s.stat.name] = s.base_stat;
    bst += s.base_stat;
  }
  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
    types: data.types.map(t => t.type.name),
    stats, bst
  };
}

function fallbackPokemon(id) {
  return {
    id,
    name: `pokemon-${id}`,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    types: [],
    stats: {},
    bst: 0,
  };
}

async function hydrateSavedPokemon(pick) {
  if (pick && typeof pick === 'object') return pick;
  const id = Number(pick);
  if (!Number.isInteger(id)) return null;
  return await getCachedPokemon(id) ?? fallbackPokemon(id);
}

// ── Snake Logic ──
function buildSnakeOrder() {
  snakeOrder = [];
  const order = draftOrderIndices.length
    ? draftOrderIndices
    : Array.from({ length: numTeams }, (_, i) => i);
  for (let r = 0; r < numRounds; r++) {
    for (let p = 0; p < numTeams; p++) {
      snakeOrder.push(r % 2 === 0 ? order[p] : order[numTeams - 1 - p]);
    }
  }
}

function currentPickNum() { return currentRound * numTeams + currentPickInRound; }
function currentTeamIdx() { return snakeOrder[currentPickNum()]; }

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function pokemonAttackScore(poke) {
  return Math.max(poke?.stats?.attack ?? 0, poke?.stats?.['special-attack'] ?? 0);
}

function pokemonBulkScore(poke) {
  return (poke?.stats?.hp ?? 0) + (poke?.stats?.defense ?? 0) + (poke?.stats?.['special-defense'] ?? 0);
}

function draftTeamWeaknesses(team) {
  const roster = team?.picks ?? [];
  if (!roster.length) return [];

  return Object.keys(TYPE_CHART)
    .map(type => ({
      type,
      multiplier: average(roster.map(poke => typeEffectiveness(type, poke.types))),
    }))
    .filter(entry => entry.multiplier > 1.12)
    .sort((a, b) => b.multiplier - a.multiplier);
}

function draftRoleNeeds(team) {
  const roster = team?.picks ?? [];
  if (!roster.length) {
    return { speed: 0.65, offense: 0.65, bulk: 0.65 };
  }

  return {
    speed: clamp((92 - average(roster.map(p => p.stats?.speed ?? 0))) / 62, 0, 1),
    offense: clamp((100 - average(roster.map(pokemonAttackScore))) / 64, 0, 1),
    bulk: clamp((255 - average(roster.map(pokemonBulkScore))) / 118, 0, 1),
  };
}

function draftTypeScarcity(poke, available) {
  const typeCounts = poke.types.map(type =>
    available.filter(candidate => candidate.types.includes(type)).length);
  if (!typeCounts.length) return 0;
  return average(typeCounts.map(count => clamp((8 - count) / 7, 0, 1))) * 100;
}

function draftRecommendationScore(poke, team = teams[currentTeamIdx()]) {
  const available = availablePokemon();
  const ownedTypes = new Set((team?.picks ?? []).flatMap(p => p.types));
  const newTypes = poke.types.filter(type => !ownedTypes.has(type));
  const weaknesses = draftTeamWeaknesses(team);
  const roleNeeds = draftRoleNeeds(team);
  const weaknessCovers = weaknesses.filter(weakness => typeEffectiveness(weakness.type, poke.types) < 1);
  const speedFit = clamp(((poke.stats?.speed ?? 0) - 55) / 75, 0, 1);
  const offenseFit = clamp((pokemonAttackScore(poke) - 65) / 75, 0, 1);
  const bulkFit = clamp((pokemonBulkScore(poke) - 190) / 150, 0, 1);
  const roleFits = {
    speed: speedFit * roleNeeds.speed,
    offense: offenseFit * roleNeeds.offense,
    bulk: bulkFit * roleNeeds.bulk,
  };
  const bestRole = Object.entries(roleFits).sort((a, b) => b[1] - a[1])[0] ?? ['balance', 0];

  const powerScore = clamp(((poke.bst ?? 0) - 300) / 320, 0, 1) * 100;
  const typeFitScore = poke.types.length ? (newTypes.length / poke.types.length) * 100 : 0;
  const roleScore = average(Object.values(roleFits)) * 100;
  const weaknessScore = weaknesses.length ? clamp(weaknessCovers.length / Math.min(3, weaknesses.length), 0, 1) * 100 : 45;
  const scarcityScore = draftTypeScarcity(poke, available);
  const score = clamp(
    powerScore * 0.48 +
    typeFitScore * 0.18 +
    roleScore * 0.16 +
    weaknessScore * 0.12 +
    scarcityScore * 0.06,
    0,
    100
  );

  const reason = weaknessCovers.length
    ? `Covers ${weaknessCovers[0].type}`
    : newTypes.length
      ? `Adds ${newTypes.slice(0, 2).join('/')}`
      : bestRole[1] > 0.18
        ? `Need: ${bestRole[0]}`
        : powerScore >= 70
          ? 'Power pick'
          : 'Depth fit';

  return {
    score: Math.round(score),
    reason,
    newTypes,
    weaknessCovers: weaknessCovers.map(entry => entry.type),
    bestRole: bestRole[0],
    components: {
      power: Math.round(powerScore),
      typeFit: Math.round(typeFitScore),
      role: Math.round(roleScore),
      weakness: Math.round(weaknessScore),
      scarcity: Math.round(scarcityScore),
    },
  };
}

function recommendationTitle(rec) {
  return `Fit ${rec.score} | Power ${rec.components.power} | Type ${rec.components.typeFit} | Role ${rec.components.role} | Coverage ${rec.components.weakness} | Scarcity ${rec.components.scarcity}`;
}

function availablePokemon() {
  return freeAgentPokemon(allPokemon);
}

function getTopRecommendations(team, count = 3) {
  return availablePokemon()
    .map(poke => ({ poke, rec: draftRecommendationScore(poke, team) }))
    .sort((a, b) => b.rec.score - a.rec.score || b.poke.bst - a.poke.bst || a.poke.id - b.poke.id)
    .slice(0, count);
}

function labelFromKey(key) {
  return key ? key[0].toUpperCase() + key.slice(1) : 'None';
}

function getPrimaryDraftNeed(team) {
  const picks = team?.picks ?? [];
  if (!picks.length) return 'core';

  const roleNeeds = draftRoleNeeds(team);
  const strongestRole = Object.entries(roleNeeds).sort((a, b) => b[1] - a[1])[0] ?? ['balance', 0];
  const ownedTypes = new Set(picks.flatMap(p => p.types));
  if (strongestRole[1] >= 0.35) return strongestRole[0];
  if (ownedTypes.size < Math.min(8, picks.length * 2)) return 'coverage';
  return 'balance';
}

function getTargetTypesForWeakness(team, limit = 3) {
  const weaknesses = draftTeamWeaknesses(team);
  const mainWeakness = weaknesses[0];
  if (!mainWeakness) return [];

  const ownedTypes = new Set((team?.picks ?? []).flatMap(p => p.types));
  return Object.keys(TYPE_CHART)
    .filter(type => !ownedTypes.has(type))
    .map(type => ({
      type,
      multiplier: typeEffectiveness(mainWeakness.type, [type]),
    }))
    .filter(entry => entry.multiplier < 1)
    .sort((a, b) => a.multiplier - b.multiplier)
    .slice(0, limit)
    .map(entry => entry.type);
}

function getTeamNeedsSummary(team) {
  const topPicks = getTopRecommendations(team, 3);
  const weakness = draftTeamWeaknesses(team)[0] ?? null;
  return {
    primaryNeed: getPrimaryDraftNeed(team),
    weakness,
    targetTypes: getTargetTypesForWeakness(team),
    topPick: topPicks[0] ?? null,
    topPicks,
  };
}

function renderDraftAssistant() {
  const panel = document.getElementById('draftAssistant');
  if (!panel) return;

  if (currentRound >= numRounds || !teams.length || !availablePokemon().length) {
    panel.innerHTML = `
      <div class="da-label">Draft Assistant</div>
      <div class="da-empty">Draft complete</div>
    `;
    return;
  }

  const team = teams[currentTeamIdx()];
  if (!team) {
    panel.innerHTML = '';
    return;
  }

  const summary = getTeamNeedsSummary(team);
  const topPick = summary.topPick;
  const pickLabel = `Round ${currentRound + 1} · Pick ${currentPickInRound + 1}`;
  const weaknessText = summary.weakness
    ? labelFromKey(summary.weakness.type)
    : team.picks.length ? 'Stable' : 'None yet';
  const targetTypes = summary.targetTypes.length
    ? summary.targetTypes
    : topPick?.rec.newTypes.slice(0, 3) ?? [];

  panel.innerHTML = `
    <div class="da-label">Draft Assistant</div>
    <div class="da-team-row">
      <span class="da-team-dot" style="background:${team.color}"></span>
      <span class="da-team-name"><span>${team.name}</span>${cpuBadgeHtml(team, 'da-cpu-personality', { compact: true })}</span>
      <strong>${pickLabel}</strong>
    </div>
    ${topPick ? `
      <div class="da-best">
        <img src="${topPick.poke.sprite}" alt="${topPick.poke.name}" onerror="this.style.visibility='hidden'">
        <div class="da-best-main">
          <div class="da-best-label">Best Pick</div>
          <div class="da-best-name">${pokemonDisplayName(topPick.poke)}</div>
          <div class="da-best-reason">${topPick.rec.reason}</div>
        </div>
        <div class="da-fit">${topPick.rec.score}</div>
      </div>
    ` : '<div class="da-empty">No available picks</div>'}
    <div class="da-needs-grid">
      <div class="da-need-block">
        <span>Need</span>
        <strong>${labelFromKey(summary.primaryNeed)}</strong>
      </div>
      <div class="da-need-block">
        <span>Weakness</span>
        <strong>${weaknessText}</strong>
      </div>
    </div>
    <div class="da-targets">
      <span>Targets</span>
      <div>
        ${targetTypes.length
          ? targetTypes.map(type => `<b style="background:${TYPE_COLORS[type] || '#888888'};color:${isLight(TYPE_COLORS[type] || '#888888') ? '#000' : '#fff'}">${type}</b>`).join('')
          : '<em>Power and balance</em>'}
      </div>
    </div>
    <div class="da-top-list">
      ${summary.topPicks.map((entry, idx) => `
        <div class="da-top-row">
          <span>${idx + 1}</span>
          <strong>${pokemonDisplayName(entry.poke)}</strong>
          <b>${entry.rec.score}</b>
        </div>
      `).join('')}
    </div>
  `;
}

// ── CPU Logic ──
function cpuPersonalityConfig(team) {
  return CPU_PERSONALITIES[team?.cpuPersonality] ?? CPU_PERSONALITIES.balanced;
}

function cpuStatBiasScores(poke) {
  return {
    speed: clamp(((poke?.stats?.speed ?? 0) - 45) / 95, 0, 1) * 100,
    bulk: clamp((pokemonBulkScore(poke) - 170) / 190, 0, 1) * 100,
    attack: clamp((pokemonAttackScore(poke) - 55) / 95, 0, 1) * 100,
  };
}

function cpuDraftScore(poke, team) {
  const config = cpuPersonalityConfig(team);
  const recommendation = draftRecommendationScore(poke, team);
  const statBias = cpuStatBiasScores(poke);
  const weights = config.weights ?? CPU_PERSONALITIES.balanced.weights;
  const score =
    recommendation.components.power * (weights.power ?? 0) +
    recommendation.components.typeFit * (weights.typeFit ?? 0) +
    recommendation.components.role * (weights.role ?? 0) +
    recommendation.components.weakness * (weights.weakness ?? 0) +
    recommendation.components.scarcity * (weights.scarcity ?? 0) +
    statBias.speed * (weights.speed ?? 0) +
    statBias.bulk * (weights.bulk ?? 0) +
    statBias.attack * (weights.attack ?? 0);

  return {
    score: Number(score.toFixed(2)),
    recommendation,
    statBias,
    personality: team?.cpuPersonality ?? 'balanced',
  };
}

function cpuRandomAdjustment(config) {
  const range = config.randomness ?? CPU_PERSONALITIES.balanced.randomness ?? 6;
  return (Math.random() * 2 - 1) * range;
}

function applyCpuPersonalityRandomness(scored, config) {
  return scored
    .map((entry, index) => {
      const randomAdjustment = cpuRandomAdjustment(config);
      return {
        ...entry,
        baseRank: index + 1,
        randomAdjustment: Number(randomAdjustment.toFixed(2)),
        finalScore: Number((entry.score + randomAdjustment).toFixed(2)),
      };
    })
    .sort((a, b) =>
      b.finalScore - a.finalScore ||
      b.score - a.score ||
      b.poke.bst - a.poke.bst ||
      a.poke.id - b.poke.id
    );
}

function weightedCpuPoolPick(pool, config) {
  if (!pool.length) return null;
  const temperature = Math.max(1, config.selectionTemperature ?? CPU_PERSONALITIES.balanced.selectionTemperature ?? 8);
  const bestScore = pool[0].finalScore;
  const weighted = pool.map(entry => ({
    entry,
    weight: Math.exp((entry.finalScore - bestScore) / temperature),
  }));
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.entry;
  }
  return weighted[weighted.length - 1].entry;
}

function chooseCpuDraftEntry(scored, config) {
  const randomized = applyCpuPersonalityRandomness(scored, config);
  const preferredTopN = Math.min(config.topN ?? 4, randomized.length);
  const wildcardTopN = Math.min(config.wildcardTopN ?? preferredTopN, randomized.length);
  const canWildcard = wildcardTopN > preferredTopN;
  const useWildcard = canWildcard && Math.random() < (config.wildcardChance ?? 0);
  const poolSize = useWildcard ? wildcardTopN : preferredTopN;
  const pool = randomized.slice(0, poolSize);

  return weightedCpuPoolPick(pool, config);
}

function cpuFreeAgentOpenThreshold(team) {
  const key = cpuPersonalityKey(team);
  const openSlots = Math.max(0, rosterLimit() - rosterCount(team));
  const base = {
    balanced: 64,
    power: 66,
    speed: 64,
    bulky: 63,
    coverage: 61,
  }[key] ?? 64;
  return openSlots > 1 ? base - 4 : base;
}

function cpuFreeAgentUpgradeThreshold(team) {
  return {
    balanced: 7,
    power: 6,
    speed: 6,
    bulky: 6,
    coverage: 5,
  }[cpuPersonalityKey(team)] ?? 7;
}

function cpuBenchDropCandidate(team) {
  const bench = (team?.picks ?? []).filter(p => canDropPokemon(team, p.id));
  if (!bench.length) return null;
  return bench
    .map(poke => ({ poke, ...cpuDraftScore(poke, team) }))
    .sort((a, b) => a.score - b.score || pokemonPower(a.poke) - pokemonPower(b.poke))[0];
}

function cpuFreeAgentDecision(team) {
  const available = freeAgentPokemon(allPokemon);
  if (!team || !available.length) return { action: 'pass', reason: 'no free agents' };
  if (team.isCpu && !isValidCpuPersonality(team.cpuPersonality)) {
    normalizeCpuPersonalities(teams);
  }

  const config = cpuPersonalityConfig(team);
  const openSlots = Math.max(0, rosterLimit() - rosterCount(team));
  const replacement = openSlots ? null : cpuBenchDropCandidate(team);
  if (!openSlots && !replacement) return { action: 'pass', reason: 'no bench drop' };

  const openThreshold = cpuFreeAgentOpenThreshold(team);
  const upgradeThreshold = cpuFreeAgentUpgradeThreshold(team);
  const scored = available
    .map(poke => {
      const score = cpuDraftScore(poke, team);
      const gain = replacement ? score.score - replacement.score : score.score - openThreshold;
      return {
        poke,
        ...score,
        gain: Number(gain.toFixed(2)),
        dropId: replacement?.poke.id ?? null,
        dropName: replacement?.poke.name ?? '',
      };
    })
    .filter(entry => openSlots ? entry.score >= openThreshold : entry.gain >= upgradeThreshold)
    .sort((a, b) =>
      b.gain - a.gain ||
      b.score - a.score ||
      b.poke.bst - a.poke.bst ||
      a.poke.id - b.poke.id
    );

  const choice = chooseCpuDraftEntry(scored, config);
  if (!choice) return { action: 'pass', reason: openSlots ? 'no fit' : 'no upgrade' };
  return {
    action: 'claim',
    reason: openSlots ? 'open roster fit' : 'roster upgrade',
    ...choice,
  };
}

function triggerCpuFreeAgencyIfNeeded() {
  const screen = document.getElementById('freeAgentScreen');
  if (!screen || screen.style.display === 'none') return;
  if (faCpuThinking || faCpuPassStreak >= teams.length) return;

  const teamIdx = currentWaiverTeamIdx();
  const team = teams[teamIdx];
  if (!team?.isCpu) return;

  faTeamIdx = teamIdx;
  faDropId = null;
  faCpuThinking = true;
  faNotice = `${team.name} is evaluating waivers...`;
  populateFreeAgentControls();
  renderFreeAgentScreen();
  setTimeout(cpuFreeAgentPick, 650 + Math.random() * 650);
}

function cpuFreeAgentPick() {
  const screen = document.getElementById('freeAgentScreen');
  if (!screen || screen.style.display === 'none') {
    faCpuThinking = false;
    return;
  }
  const teamIdx = currentWaiverTeamIdx();
  const team = teams[teamIdx];
  if (!team?.isCpu) {
    faCpuThinking = false;
    renderFreeAgentScreen();
    return;
  }

  const decision = cpuFreeAgentDecision(team);
  faCpuThinking = false;
  faTeamIdx = teamIdx;
  faDropId = decision.dropId ?? null;

  if (decision.action === 'claim') {
    claimFreeAgent(decision.poke.id, {
      source: 'cpu',
      gain: decision.gain,
      reason: decision.reason,
    });
  } else {
    passWaiverClaim({ source: 'cpu', reason: decision.reason });
  }
}

function cpuPick() {
  const team = teams[currentTeamIdx()];
  const available = availablePokemon();
  if (!team || !available.length) return;

  if (team.isCpu && !isValidCpuPersonality(team.cpuPersonality)) {
    normalizeCpuPersonalities(teams);
  }
  const config = cpuPersonalityConfig(team);

  const scored = available
    .map(p => ({ poke: p, ...cpuDraftScore(p, team) }))
    .sort((a, b) => b.score - a.score || b.poke.bst - a.poke.bst || a.poke.id - b.poke.id);

  const choice = (chooseCpuDraftEntry(scored, config) ?? scored[0]).poke;
  setCpuThinking(false);
  draftPokemon(choice);
}

function setCpuThinking(on) {
  cpuThinking = on;
  const picker = document.getElementById('dhPicker');
  const sub = document.getElementById('dhSub');
  if (on) {
    picker.classList.add('thinking');
    sub.textContent = 'CPU is thinking...';
  } else {
    picker.classList.remove('thinking');
  }
  renderDraftAssistant();
}

function triggerCpuIfNeeded() {
  if (currentRound >= numRounds) return;
  const ti = currentTeamIdx();
  if (!teams[ti].isCpu) return;
  setCpuThinking(true);
  setTimeout(cpuPick, 800 + Math.random() * 800);
}

// ── Rendering ──
function populateTypeFilter() {
  const types = new Set();
  allPokemon.forEach(p => p.types.forEach(t => types.add(t)));
  const sel = document.getElementById('typeFilter');
  [...types].sort().forEach(t => {
    const o = document.createElement('option');
    o.value = t;
    o.textContent = t[0].toUpperCase() + t.slice(1);
    sel.appendChild(o);
  });
}

function refreshHeader() {
  if (cpuThinking) return;
  const total = numRounds * numTeams;
  const pick = currentPickNum();
  const team = teams[currentTeamIdx()];
  const gen = GENS[currentGenIdx];
  const picker = document.getElementById('dhPicker');
  picker.innerHTML = '';
  const pickText = document.createElement('span');
  pickText.textContent = `${team.name}'s Pick`;
  picker.appendChild(pickText);
  if (team.isCpu) {
    picker.insertAdjacentHTML('beforeend', cpuBadgeHtml(team, 'dh-cpu-personality', { compact: true }));
  }
  picker.style.color = team.color;
  document.getElementById('dhSub').textContent =
    `${gen.short} · Round ${currentRound + 1} · Pick ${currentPickInRound + 1} of ${numTeams}`;
  document.getElementById('dhRight').textContent =
    `${total - pick} pick${total - pick !== 1 ? 's' : ''} remaining`;
}

function refreshSnakeBar() {
  const bar = document.getElementById('snakeBar');
  bar.innerHTML = '';
  const cur = currentPickNum();
  snakeOrder.forEach((ti, i) => {
    if (i > 0 && i % numTeams === 0) {
      const sep = document.createElement('div');
      sep.className = 's-sep';
      sep.textContent = '|';
      bar.appendChild(sep);
    }
    const pip = document.createElement('div');
    pip.className = 's-pip ' + (i < cur ? 'done' : i === cur ? 'current' : 'upcoming') +
      (teams[ti].isCpu ? ` s-pip-cpu cpu-personality-${cpuPersonalityKey(teams[ti])}` : '');
    pip.style.background = teams[ti].color;
    pip.title = teams[ti].name + (teams[ti].isCpu ? ` (${cpuPersonalityLabel(teams[ti])} CPU)` : '');
    pip.textContent = ti + 1;
    bar.appendChild(pip);
  });
  bar.querySelector('.current')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function typePills(types) {
  return types.map(t => {
    const bg = TYPE_COLORS[t] || '#888';
    const fg = isLight(bg) ? '#000' : '#fff';
    return `<span class="type-pill" style="background:${bg};color:${fg}">${t}</span>`;
  }).join('');
}

function getDisplayList() {
  let list = [...allPokemon];
  if (curSearch) {
    const q = curSearch.toLowerCase();
    list = list.filter(p => p.name.includes(q) || String(p.id).includes(q));
  }
  if (curType) list = list.filter(p => p.types.includes(curType));
  if (curSort === 'recommended') {
    const team = teams[currentTeamIdx()];
    const owned = ownedPokemonIds();
    list.sort((a, b) => {
      const draftedA = owned.has(a.id);
      const draftedB = owned.has(b.id);
      if (draftedA !== draftedB) return draftedA ? 1 : -1;
      if (!team) return b.bst - a.bst;
      const scoreB = draftRecommendationScore(b, team).score;
      const scoreA = draftRecommendationScore(a, team).score;
      return scoreB - scoreA || b.bst - a.bst || a.id - b.id;
    });
  }
  else if (curSort === 'bst-desc')     list.sort((a, b) => b.bst - a.bst);
  else if (curSort === 'bst-asc') list.sort((a, b) => a.bst - b.bst);
  else if (curSort === 'name')    list.sort((a, b) => a.name.localeCompare(b.name));
  else                            list.sort((a, b) => a.id - b.id);
  return list;
}

function refreshGrid() {
  const grid = document.getElementById('pokeGrid');
  grid.innerHTML = '';
  const owned = ownedPokemonIds();
  getDisplayList().forEach(poke => {
    const isDrafted = owned.has(poke.id);
    const rec = isDrafted ? null : draftRecommendationScore(poke);
    const card = document.createElement('div');
    card.className = 'poke-card' + (isDrafted ? ' drafted' : '') + (rec?.score >= 82 ? ' recommended-pick' : '');
    card.dataset.id = poke.id;
    card.innerHTML = `
      ${rec ? `<div class="pc-fit" title="${recommendationTitle(rec)}"><span>Fit</span><strong>${rec.score}</strong></div>` : ''}
      <img src="${poke.sprite}" alt="${poke.name}" onerror="this.style.visibility='hidden'">
      <div class="pc-num">#${String(poke.id).padStart(3, '0')}</div>
      <div class="pc-name">${poke.name}</div>
      <div class="pc-types">${typePills(poke.types)}</div>
      ${rec ? `<div class="pc-rec-reason">${rec.reason}</div>` : ''}
      <div class="pc-bst-lbl">BASE STAT TOTAL</div>
      <div class="pc-bst">${poke.bst}</div>
    `;
    if (!isDrafted) {
      card.addEventListener('click', () => {
        if (cpuThinking) return;
        draftPokemon(poke);
      });
    }
    grid.appendChild(card);
  });
}

function refreshTeams() {
  renderDraftAssistant();
  const list = document.getElementById('teamsList');
  list.innerHTML = '';
  const curIdx = currentTeamIdx();
  teams.forEach((team, i) => {
    const tile = document.createElement('div');
    tile.className = 'team-tile' + (i === curIdx ? ' current' : '');
    const isMultiGen = draftNumber > 1;
    const activeIds = new Set(team.activeIds ?? []);
    const picks = team.picks.length
      ? team.picks.map(p => {
          const gen = getGen(p.id);
          const isCurGen = gen.num === GENS[currentGenIdx].num;
          const isActive = activeIds.has(p.id);
          const genTag = isMultiGen
            ? `<span class="mini-gen-tag" style="background:${gen.color}">${gen.short}</span>`
            : '';
          return `
            <div class="mini-chip${isCurGen ? '' : ' prev-gen'}${isActive ? ' active-roster' : ' bench-roster'}">
              <img src="${p.sprite}" alt="${p.name}">
              ${genTag}
              <span>${p.name}</span>
            </div>`;
        }).join('')
      : '<span class="tt-empty">No picks yet</span>';
    const cpuBadge = cpuBadgeHtml(team);
    tile.innerHTML = `
      <div class="tt-head">
        <div class="tt-dot" style="background:${team.color}"></div>
        <div class="tt-name">${team.name}</div>
        ${cpuBadge}
        <div class="tt-count">${(team.activeIds ?? []).length}/${ACTIVE_ROSTER_SIZE} active · ${team.picks.length}</div>
      </div>
      <div class="tt-picks">${picks}</div>
    `;
    list.appendChild(tile);
  });
}

// ── Drafting ──
function draftPokemon(poke) {
  const ti = currentTeamIdx();
  const team = teams[ti];
  if (!team || !canAddPokemonToTeam(team, poke)) {
    refreshGrid();
    refreshTeams();
    return;
  }
  team.picks.push(poke);
  if ((team.activeIds ?? []).length < ACTIVE_ROSTER_SIZE) {
    team.activeIds ??= [];
    team.activeIds.push(poke.id);
  }
  draftedIds.add(poke.id);

  const card = document.querySelector(`.poke-card[data-id="${poke.id}"]`);
  if (card) card.classList.add('drafted');

  currentPickInRound++;
  if (currentPickInRound >= numTeams) {
    currentPickInRound = 0;
    currentRound++;
  }

  if (currentRound >= numRounds) {
    showRosterScreen();
    return;
  }

  refreshHeader();
  refreshSnakeBar();
  refreshGrid();
  refreshTeams();
  flashRosterTab();
  saveSeason(buildSeasonState(SEASON_PHASES.DRAFT, 'inProgress'));
  triggerCpuIfNeeded();
}

function buildSeasonState(
  phase = season?.phase ?? SEASON_PHASES.DRAFT,
  draftStatus = currentRound >= numRounds ? 'complete' : 'inProgress'
) {
  const activeSeason = syncSeason(phase, draftStatus);

  return {
    version: SAVE_VERSION,
    season: activeSeason,
    currentGenIdx,
    draftNumber,
    numTeams, numRounds,
    teams: teams.map(serializeTeam),
    draftedIds: [...ownedPokemonIds()],
    snakeOrder,
    draftOrderIndices,
    currentRound,
    currentPickInRound,
    status: phase,
  };
}

// ── Active Rosters ──
function prepareActiveRosterLocks() {
  teams.forEach(team => {
    const validActive = (team.activeIds ?? []).filter(id => team.picks.some(p => p.id === id));
    team.activeIds = validActive.slice(0, ACTIVE_ROSTER_SIZE);
    if (team.isCpu || team.activeIds.length === 0) {
      autoSetActiveRoster(team);
    }
  });
}

function allActiveRostersLocked() {
  return teams.every(isActiveRosterLocked);
}

function showRosterScreen() {
  document.getElementById('draftScreen').style.display = 'none';
  document.getElementById('seasonScreen').style.display = 'none';
  document.getElementById('freeAgentScreen').style.display = 'none';
  document.getElementById('playoffScreen').style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'none';
  document.getElementById('completeScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'flex';

  prepareActiveRosterLocks();
  const gen = GENS[currentGenIdx];
  document.getElementById('rosterTitle').textContent = `${gen.label} Active Rosters`;
  renderRosterScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
}

function renderRosterScreen() {
  const layout = document.getElementById('rosterLayout');
  layout.innerHTML = teams.map((team, teamIdx) => {
    const active = new Set(team.activeIds ?? []);
    const activeCount = active.size;
    const picks = [...team.picks]
      .sort((a, b) => Number(active.has(b.id)) - Number(active.has(a.id)) || pokemonPower(b) - pokemonPower(a))
      .map(p => {
        const isActive = active.has(p.id);
        const disabled = team.isCpu ? ' disabled' : '';
        return `
          <button class="roster-pick${isActive ? ' active' : ''}" onclick="toggleActiveRosterPick(${teamIdx}, ${p.id})"${disabled}>
            <img src="${p.sprite}" alt="${p.name}">
            <span>${p.name}</span>
            <strong>${p.bst}</strong>
          </button>
        `;
      }).join('');
    const cpuBadge = cpuBadgeHtml(team);
    return `
      <div class="roster-team-card">
        <div class="roster-team-head">
          <span class="roster-team-dot" style="background:${team.color}"></span>
          <span class="roster-team-name">${team.name} ${cpuBadge}</span>
          <span class="roster-team-count">${activeCount}/${ACTIVE_ROSTER_SIZE}</span>
        </div>
        <div class="roster-picks">${picks}</div>
      </div>
    `;
  }).join('');

  const locked = allActiveRostersLocked();
  document.getElementById('rosterSub').textContent = locked
    ? 'All active rosters locked'
    : `Choose exactly ${ACTIVE_ROSTER_SIZE} active Pokémon for each team`;
  document.getElementById('btnRosterContinue').disabled = !locked;
}

function toggleActiveRosterPick(teamIdx, pokeId) {
  const team = teams[teamIdx];
  if (!team || team.isCpu) return;

  team.activeIds ??= [];
  const exists = team.activeIds.includes(pokeId);
  if (exists) {
    team.activeIds = team.activeIds.filter(id => id !== pokeId);
  } else if (team.activeIds.length < ACTIVE_ROSTER_SIZE) {
    team.activeIds.push(pokeId);
  }

  renderRosterScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
}

function autoSetAllActiveRosters() {
  teams.forEach(autoSetActiveRoster);
  renderRosterScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
}

function continueAfterRosterLock() {
  if (!allActiveRostersLocked()) return;
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
  showFreeAgentScreen();
}

function showFreeAgentScreen() {
  document.getElementById('draftScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
  document.getElementById('seasonScreen').style.display = 'none';
  document.getElementById('playoffScreen').style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'none';
  document.getElementById('completeScreen').style.display = 'none';
  document.getElementById('freeAgentScreen').style.display = 'flex';

  getWaiverOrder();
  faTeamIdx = currentWaiverTeamIdx();
  faCpuPassStreak = 0;
  faCpuThinking = false;
  if (!canDropPokemon(teams[faTeamIdx], faDropId)) faDropId = null;
  const gen = GENS[currentGenIdx];
  document.getElementById('freeAgentTitle').textContent = `${gen.label} Free Agents`;
  populateFreeAgentControls();
  renderFreeAgentScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
  triggerCpuFreeAgencyIfNeeded();
}

function populateFreeAgentControls() {
  const typeSelect = document.getElementById('faTypeFilter');
  if (typeSelect) {
    const types = new Set(allPokemon.flatMap(p => p.types));
    typeSelect.innerHTML = '<option value="">All Types</option>';
    [...types].sort().forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = labelFromKey(type);
      typeSelect.appendChild(option);
    });
    typeSelect.value = faType;
    typeSelect.disabled = faCpuThinking;
  }

  const teamSelect = document.getElementById('faTeamSelect');
  if (teamSelect) {
    teamSelect.innerHTML = teams.map((team, idx) =>
      `<option value="${idx}">${idx === currentWaiverTeamIdx() ? '★ ' : ''}${team.name}${team.isCpu ? ` (${cpuPersonalityLabel(team)} CPU)` : ''}</option>`
    ).join('');
    teamSelect.value = String(faTeamIdx);
    teamSelect.disabled = faCpuThinking;
  }
  const search = document.getElementById('faSearch');
  if (search) {
    search.value = faSearch;
    search.disabled = faCpuThinking;
  }
  const sort = document.getElementById('faSort');
  if (sort) {
    sort.value = faSort;
    sort.disabled = faCpuThinking;
  }
  populateFreeAgencyHistoryControls();
}

function populateFreeAgencyHistoryControls() {
  const draftSelect = document.getElementById('faHistoryDraft');
  if (draftSelect) draftSelect.value = faHistoryDraft;

  const teamSelect = document.getElementById('faHistoryTeam');
  if (teamSelect) {
    teamSelect.innerHTML = [
      '<option value="all">All Teams</option>',
      ...teams.map((team, idx) => `<option value="${idx}">${team.name}</option>`),
    ].join('');
    teamSelect.value = teams[Number(faHistoryTeam)] ? faHistoryTeam : 'all';
    if (teamSelect.value !== faHistoryTeam) faHistoryTeam = 'all';
  }

  const moveSelect = document.getElementById('faHistoryMove');
  if (moveSelect) moveSelect.value = faHistoryMove;
}

function freeAgencyHistoryTransactions() {
  const transactions = normalizeFreeAgencyTransactions(season?.freeAgencyTransactions);
  return transactions
    .filter(transaction => faHistoryDraft === 'all' || transaction.draftId === draftNumber)
    .filter(transaction => faHistoryTeam === 'all' || transaction.teamIdx === Number(faHistoryTeam))
    .filter(transaction => faHistoryMove !== 'drops' || transaction.droppedPokemonId !== null)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp) || b.id.localeCompare(a.id));
}

function freeAgencyHistoryTimestamp(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime()) || date.getTime() === 0) return '';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function renderFreeAgencyHistory() {
  const list = document.getElementById('faHistoryList');
  const count = document.getElementById('faHistoryCount');
  if (!list || !count) return;

  const transactions = freeAgencyHistoryTransactions();
  count.textContent = `${transactions.length} move${transactions.length === 1 ? '' : 's'}`;
  list.innerHTML = transactions.length ? transactions.map(transaction => {
    const genLabel = GENS[transaction.genIdx]?.label ?? `Generation ${transaction.genIdx + 1}`;
    const timeLabel = freeAgencyHistoryTimestamp(transaction.timestamp);
    const cpuDetails = transaction.source === 'cpu'
      ? [
          Number.isFinite(transaction.cpuGain) ? `Upgrade +${transaction.cpuGain}` : '',
          transaction.cpuReason || '',
        ].filter(Boolean).join(' · ')
      : '';
    return `
      <article class="fa-history-row">
        <div class="fa-history-team-row">
          <i style="background:${transaction.teamColor}"></i>
          <strong>${transaction.teamName}</strong>
          <span class="fa-history-source ${transaction.source}">${transaction.source === 'cpu' ? 'CPU' : 'Human'}</span>
        </div>
        <div class="fa-history-move">
          <span>Claimed <strong>${transaction.pokemonName}</strong></span>
          ${transaction.droppedPokemonId !== null
            ? `<span class="fa-history-drop">Dropped <strong>${transaction.droppedPokemonName}</strong></span>`
            : '<span class="fa-history-open-slot">Open roster slot</span>'}
        </div>
        <div class="fa-history-meta">
          <span>Draft ${transaction.draftId}</span>
          <span>${genLabel}</span>
          <span>Waiver #${transaction.waiverRankBefore ?? '-'}</span>
          ${timeLabel ? `<span>${timeLabel}</span>` : ''}
          ${cpuDetails ? `<span class="fa-history-cpu-detail">${cpuDetails}</span>` : ''}
        </div>
      </article>
    `;
  }).join('') : '<div class="fa-history-empty">No transactions match these filters.</div>';
}

function freeAgentDisplayList() {
  const team = teams[faTeamIdx];
  let list = freeAgentPokemon(allPokemon);
  if (faSearch) {
    const q = faSearch.toLowerCase();
    list = list.filter(p => p.name.includes(q) || String(p.id).includes(q));
  }
  if (faType) list = list.filter(p => p.types.includes(faType));

  if (faSort === 'recommended') {
    list.sort((a, b) => {
      const scoreB = team ? draftRecommendationScore(b, team).score : b.bst;
      const scoreA = team ? draftRecommendationScore(a, team).score : a.bst;
      return scoreB - scoreA || b.bst - a.bst || a.id - b.id;
    });
  } else if (faSort === 'bst-desc') list.sort((a, b) => b.bst - a.bst);
  else if (faSort === 'bst-asc') list.sort((a, b) => a.bst - b.bst);
  else if (faSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else list.sort((a, b) => a.id - b.id);

  return list;
}

function renderFreeAgentScreen() {
  const team = teams[faTeamIdx] ?? teams[0];
  if (!canDropPokemon(team, faDropId)) faDropId = null;
  const list = freeAgentDisplayList();
  const grid = document.getElementById('freeAgentGrid');
  const sub = document.getElementById('freeAgentSub');
  const teamPanel = document.getElementById('freeAgentTeam');
  const rosterPanel = document.getElementById('freeAgentRoster');
  const limit = rosterLimit();
  const count = rosterCount(team);
  const benchCount = Math.max(0, count - ACTIVE_ROSTER_SIZE);
  const atLimit = count >= limit;
  const selectedDrop = selectedFreeAgentDrop(team);
  const currentClaimIdx = currentWaiverTeamIdx();
  const currentClaimTeam = teams[currentClaimIdx];
  const onClock = faTeamIdx === currentClaimIdx;
  const rank = waiverRank(faTeamIdx);

  if (sub) {
    sub.textContent = `${list.length} available · waiver claims rotate after claim or pass`;
  }

  if (teamPanel && team) {
    teamPanel.innerHTML = `
      <div class="fa-team-head">
        <span class="fa-team-dot" style="background:${team.color}"></span>
        <span>${team.name}</span>
        ${cpuBadgeHtml(team, 'free-agent-cpu-personality', { compact: true })}
      </div>
      <div class="fa-team-meta">${count}/${limit} owned · ${(team.activeIds ?? []).length}/${ACTIVE_ROSTER_SIZE} active · ${benchCount} bench · waiver #${rank ?? '-'}</div>
      <div class="fa-waiver-panel">
        <div class="fa-waiver-head">
          <span>${currentClaimTeam ? `${currentClaimTeam.name} on claim` : 'Waiver claim order'}</span>
          <button class="fa-pass-btn" onclick="passWaiverClaim()"${faCpuThinking ? ' disabled' : ''}>Pass Claim</button>
        </div>
        <div class="fa-waiver-pills">${waiverOrderPills()}</div>
      </div>
      <div class="fa-roster-limit ${atLimit ? 'at-limit' : ''}">
        ${!onClock
          ? `${team.name} is waiting for waiver priority`
          : atLimit
          ? (selectedDrop ? `At limit · signing will drop ${selectedDrop.name}` : 'At limit · choose a bench drop before signing')
          : `${limit - count} roster slot${limit - count === 1 ? '' : 's'} open`}
      </div>
      <div class="fa-rule-note">${faCpuThinking ? 'CPU free agency is resolving.' : 'Only the team first in waiver order can claim. Active roster Pokémon are protected.'}</div>
      ${faNotice ? `<div class="fa-notice">${faNotice}</div>` : ''}
    `;
  }

  if (rosterPanel && team) {
    const active = new Set(getActiveRosterIds(team));
    rosterPanel.innerHTML = [...team.picks]
      .sort((a, b) => Number(active.has(b.id)) - Number(active.has(a.id)) || pokemonPower(b) - pokemonPower(a))
      .map(p => {
        const isActive = active.has(p.id);
        const canDrop = canDropPokemon(team, p.id);
        const selected = faDropId === p.id;
        return `
        <div class="fa-roster-chip${isActive ? ' active' : ''}${selected ? ' drop-selected' : ''}">
          <img src="${p.sprite}" alt="${p.name}">
          <span>${p.name}</span>
          <strong>${p.bst}</strong>
          <small>${isActive ? 'Active' : 'Bench'}</small>
          ${canDrop
            ? `<button class="fa-drop-btn" onclick="selectFreeAgentDrop(${p.id})">${selected ? 'Marked' : 'Mark'}</button>`
            : `<em>${isActive ? 'Locked' : 'Keep'}</em>`}
        </div>
      `;
      }).join('') || '<div class="fa-empty">No owned Pokémon</div>';
  }

  renderFreeAgencyHistory();

  if (!grid) return;
  grid.innerHTML = list.length ? list.map(poke => {
    const rec = team ? draftRecommendationScore(poke, team) : null;
    const canClaim = canClaimFreeAgent(team, poke, faTeamIdx) && !faCpuThinking;
    const actionText = !onClock
      ? 'Waiting'
      : faCpuThinking ? 'CPU Thinking'
      : selectedDrop ? `Claim / Drop ${selectedDrop.name}`
      : (atLimit ? 'Choose Drop' : 'Claim');
    return `
      <button class="free-agent-card${canClaim ? '' : ' disabled'}" onclick="claimFreeAgent(${poke.id})"${canClaim ? '' : ' disabled'}>
        ${rec ? `<span class="fa-fit" title="${recommendationTitle(rec)}">Fit ${rec.score}</span>` : ''}
        <img src="${poke.sprite}" alt="${poke.name}" onerror="this.style.visibility='hidden'">
        <span class="fa-num">#${String(poke.id).padStart(3, '0')}</span>
        <span class="fa-name">${poke.name}</span>
        <span class="fa-types">${typePills(poke.types)}</span>
        <strong>${poke.bst}</strong>
        <span class="fa-card-action">${actionText}</span>
      </button>
    `;
  }).join('') : '<div class="fa-empty">No free agents match the current filters</div>';
}

function claimFreeAgent(pokeId, options = {}) {
  if (faCpuThinking && options.source !== 'cpu') return;
  const teamIdx = faTeamIdx;
  const team = teams[faTeamIdx];
  const poke = allPokemon.find(p => p.id === pokeId);
  if (!team || !poke || !canAddPokemonToTeam(team, poke)) return;
  if (teamIdx !== currentWaiverTeamIdx()) {
    const currentTeam = teams[currentWaiverTeamIdx()];
    faNotice = `${team.name} must wait. ${currentTeam?.name ?? 'Another team'} is first in waiver order.`;
    renderFreeAgentScreen();
    return;
  }
  const waiverRankBefore = waiverRank(teamIdx);
  const selectedDrop = selectedFreeAgentDrop(team);
  let claimNotice;
  if (selectedDrop) {
    removePokemonFromTeam(team, selectedDrop.id);
    claimNotice = options.source === 'cpu'
      ? `${team.name} claimed ${poke.name} and dropped ${selectedDrop.name}.`
      : `${selectedDrop.name} was dropped. ${poke.name} claimed by ${team.name}.`;
    faDropId = null;
  } else if (rosterCount(team) >= rosterLimit()) {
    faNotice = 'Choose a bench Pokémon to drop before signing at the roster limit.';
    renderFreeAgentScreen();
    return;
  } else {
    claimNotice = options.source === 'cpu'
      ? `${team.name} claimed ${poke.name}.`
      : `${poke.name} claimed by ${team.name}.`;
  }
  team.picks.push(poke);
  syncDraftedIdsWithOwnership();
  recordFreeAgencyTransaction({
    teamIdx,
    pokemon: poke,
    droppedPokemon: selectedDrop,
    source: options.source,
    waiverRankBefore,
    gain: options.gain,
    reason: options.reason,
  });
  faCpuPassStreak = 0;
  rotateWaiverOrder(teamIdx);
  faTeamIdx = currentWaiverTeamIdx();
  const nextTeam = teams[faTeamIdx];
  const gainText = options.source === 'cpu' && Number.isFinite(options.gain)
    ? ` Upgrade +${options.gain}.`
    : '';
  faNotice = `${claimNotice}${gainText} ${nextTeam ? `${nextTeam.name} is next on claim.` : ''}`;
  populateFreeAgentControls();
  renderFreeAgentScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
  triggerCpuFreeAgencyIfNeeded();
}

function passWaiverClaim(options = {}) {
  if (faCpuThinking && options.source !== 'cpu') return;
  const passingIdx = currentWaiverTeamIdx();
  const passingTeam = teams[passingIdx];
  rotateWaiverOrder(passingIdx);
  faTeamIdx = currentWaiverTeamIdx();
  faDropId = null;
  faCpuPassStreak++;
  const nextTeam = teams[faTeamIdx];
  const reason = options.source === 'cpu' && options.reason ? ` (${options.reason})` : '';
  const cycleDone = faCpuPassStreak >= teams.length ? ' All teams have passed this waiver cycle.' : '';
  faNotice = `${passingTeam?.name ?? 'Team'} passed${reason}. ${nextTeam ? `${nextTeam.name} is next on claim.` : ''}${cycleDone}`;
  populateFreeAgentControls();
  renderFreeAgentScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
  triggerCpuFreeAgencyIfNeeded();
}

function signFreeAgent(pokeId) {
  claimFreeAgent(pokeId);
}

function selectFreeAgentDrop(pokeId) {
  if (faCpuThinking) return;
  const team = teams[faTeamIdx];
  if (!canDropPokemon(team, pokeId)) {
    faNotice = 'Only bench Pokémon can be dropped from the free-agent screen.';
    renderFreeAgentScreen();
    return;
  }
  faDropId = faDropId === pokeId ? null : pokeId;
  const selected = selectedFreeAgentDrop(team);
  faNotice = selected ? `${selected.name} marked as the next drop.` : '';
  renderFreeAgentScreen();
}

function filterFreeAgencyHistoryDraft(value) {
  faHistoryDraft = value === 'all' ? 'all' : 'current';
  renderFreeAgencyHistory();
}

function filterFreeAgencyHistoryTeam(value) {
  faHistoryTeam = value === 'all' || teams[Number(value)] ? value : 'all';
  renderFreeAgencyHistory();
}

function filterFreeAgencyHistoryMove(value) {
  faHistoryMove = value === 'drops' ? 'drops' : 'all';
  renderFreeAgencyHistory();
}

function filterFreeAgents(value) {
  if (faCpuThinking) return;
  faSearch = value.toLowerCase();
  renderFreeAgentScreen();
}

function filterFreeAgentType(value) {
  if (faCpuThinking) return;
  faType = value;
  renderFreeAgentScreen();
}

function sortFreeAgents(value) {
  if (faCpuThinking) return;
  faSort = value;
  renderFreeAgentScreen();
}

function selectFreeAgentTeam(value) {
  if (faCpuThinking) return;
  const idx = Number(value);
  faTeamIdx = Number.isInteger(idx) && teams[idx] ? idx : 0;
  faDropId = null;
  faNotice = '';
  renderFreeAgentScreen();
}

function continueAfterFreeAgents() {
  faDropId = null;
  faNotice = '';
  faCpuThinking = false;
  faCpuPassStreak = 0;
  saveSeason(buildSeasonState(SEASON_PHASES.ROSTER_LOCK, 'complete'));
  showSeasonScreen();
}

// ── Battle Logs ──
function battleLogGames(scope) {
  return scope === 'playoff' ? getCurrentPlayoffGames() : getCurrentDraftSchedule();
}

function getSelectedBattleLogGame(scope) {
  const games = battleLogGames(scope);
  const selected = games.find(game => game.id === selectedBattleLogs[scope] && game.simulated);
  if (selected) return selected;

  const latest = [...games].reverse().find(game => game.simulated);
  selectedBattleLogs[scope] = latest?.id ?? null;
  return latest ?? null;
}

function selectBattleLog(scope, gameId) {
  selectedBattleLogs[scope] = gameId;
  if (scope === 'playoff') renderPlayoffScreen();
  else renderSeasonScreen();
}

function renderBattleLogPanel(panelId, game, scope) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  if (!game?.simulated) {
    panel.innerHTML = `
      <div class="battle-log-empty">
        <div class="battle-log-title">Battle Log</div>
        <div class="battle-log-sub">Simulate a completed matchup to review its key swings.</div>
      </div>
    `;
    return;
  }

  ensureBattleLog(game);
  const teamA = teams[game.teamAIdx];
  const teamB = teams[game.teamBIdx];
  const winner = teams[game.winnerIdx];
  const events = game.battleLog ?? [];
  const sets = game.sets ?? [];
  panel.innerHTML = `
    <div class="battle-log-title">${teamA.name} ${game.scoreA} · ${teamB.name} ${game.scoreB}</div>
    <div class="battle-log-sub">${winner.name} wins · ${sets.length || events.length} ${sets.length ? 'skirmishes' : 'events'}</div>
    ${sets.length && scope ? `
      <div class="battle-log-actions">
        <button class="btn-watch-battle" onclick="openBattlePlayback('${scope}', '${game.id}')">Watch Battle</button>
      </div>
    ` : ''}
    ${sets.length ? `
      <div class="battle-sets">
        ${sets.map(set => {
          return `
            <div class="battle-set ${set.winnerIdx === game.teamAIdx ? 'team-a' : 'team-b'}">
              <div class="battle-set-num">${set.setNumber}</div>
              <div class="battle-set-matchup">
                <span>${pokemonDisplayName({ name: set.pokemonAName })}</span>
                <strong>vs</strong>
                <span>${pokemonDisplayName({ name: set.pokemonBName })}</span>
              </div>
              <div class="battle-set-winner">${pokemonDisplayName({ name: set.winnerPokemonName })}</div>
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}
    <div class="battle-events">
      ${events.map(event => `
        <div class="battle-event ${event.kind} ${event.impact}">
          <div class="battle-event-kind">${event.kind.replace(/-/g, ' ')}</div>
          <div class="battle-event-text">${event.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function pokemonSpriteUrl(id) {
  return Number.isInteger(id)
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    : '';
}

function findBattlePlaybackGame(scope, gameId) {
  return battleLogGames(scope).find(game => game.id === gameId && game.simulated) ?? null;
}

function buildPlaybackSteps(game) {
  let scoreA = 0;
  let scoreB = 0;
  return (game.sets ?? []).map(set => {
    if (set.winnerIdx === game.teamAIdx) scoreA++;
    else scoreB++;

    return {
      ...set,
      scoreA,
      scoreB,
      pokemonANameDisplay: pokemonDisplayName({ name: set.pokemonAName }),
      pokemonBNameDisplay: pokemonDisplayName({ name: set.pokemonBName }),
      winnerPokemonNameDisplay: pokemonDisplayName({ name: set.winnerPokemonName }),
    };
  });
}

function clearBattlePlaybackTimer() {
  if (battlePlayback.timer) clearInterval(battlePlayback.timer);
  battlePlayback.timer = null;
  battlePlayback.playing = false;
}

function currentBattlePlaybackGame() {
  if (!battlePlayback.scope || !battlePlayback.gameId) return null;
  return findBattlePlaybackGame(battlePlayback.scope, battlePlayback.gameId);
}

function currentBattlePlaybackSteps() {
  const game = currentBattlePlaybackGame();
  return game ? buildPlaybackSteps(game) : [];
}

function openBattlePlayback(scope, gameId) {
  const game = findBattlePlaybackGame(scope, gameId);
  if (!game?.sets?.length) return;

  clearBattlePlaybackTimer();
  battlePlayback = { scope, gameId, stepIdx: 0, playing: false, timer: null };
  const overlay = document.getElementById('battlePlaybackOverlay');
  if (overlay) overlay.style.display = 'flex';
  renderBattlePlayback();
}

function closeBattlePlayback() {
  clearBattlePlaybackTimer();
  battlePlayback = { scope: null, gameId: null, stepIdx: 0, playing: false, timer: null };
  const overlay = document.getElementById('battlePlaybackOverlay');
  if (overlay) overlay.style.display = 'none';
}

function nextBattleStep() {
  const steps = currentBattlePlaybackSteps();
  if (!steps.length) return;

  if (battlePlayback.stepIdx >= steps.length - 1) {
    clearBattlePlaybackTimer();
    renderBattlePlayback();
    return;
  }

  battlePlayback.stepIdx++;
  renderBattlePlayback();
}

function prevBattleStep() {
  clearBattlePlaybackTimer();
  battlePlayback.stepIdx = Math.max(0, battlePlayback.stepIdx - 1);
  renderBattlePlayback();
}

function toggleBattleAutoplay() {
  const steps = currentBattlePlaybackSteps();
  if (!steps.length) return;

  if (battlePlayback.playing) {
    clearBattlePlaybackTimer();
    renderBattlePlayback();
    return;
  }

  if (battlePlayback.stepIdx >= steps.length - 1) battlePlayback.stepIdx = 0;
  battlePlayback.playing = true;
  renderBattlePlayback();
  battlePlayback.timer = setInterval(nextBattleStep, 1450);
}

function playbackMultiplierText(multiplier) {
  if (multiplier >= 4) return '4x hit';
  if (multiplier > 1) return `${multiplier}x hit`;
  if (multiplier === 0) return 'immune';
  if (multiplier < 1) return `${multiplier}x resisted`;
  return 'neutral';
}

function renderBattlePlaybackSide(game, step, side) {
  const isA = side === 'A';
  const team = teams[isA ? game.teamAIdx : game.teamBIdx];
  const pokemonId = isA ? step.pokemonAId : step.pokemonBId;
  const pokemonName = isA ? step.pokemonANameDisplay : step.pokemonBNameDisplay;
  const multiplier = isA ? step.typeMultiplierA : step.typeMultiplierB;
  const score = isA ? step.scoreA : step.scoreB;
  const isWinner = step.winnerIdx === (isA ? game.teamAIdx : game.teamBIdx);

  return `
    <div class="battle-side-inner">
      <div class="battle-team-row">
        <span class="battle-team-dot" style="background:${team.color}"></span>
        <span>${team.name}</span>
        <strong>${score}</strong>
      </div>
      <img src="${pokemonSpriteUrl(pokemonId)}" alt="${pokemonName}" onerror="this.style.opacity=0">
      <div class="battle-pokemon-name">${pokemonName}</div>
      <div class="battle-pokemon-meta">${playbackMultiplierText(multiplier)}</div>
      <div class="battle-result-tag">${isWinner ? 'Wins skirmish' : 'Faints'}</div>
    </div>
  `;
}

function renderBattlePlayback() {
  const game = currentBattlePlaybackGame();
  const steps = currentBattlePlaybackSteps();
  if (!game || !steps.length) return;

  battlePlayback.stepIdx = clamp(battlePlayback.stepIdx, 0, steps.length - 1);
  const step = steps[battlePlayback.stepIdx];
  const teamA = teams[game.teamAIdx];
  const teamB = teams[game.teamBIdx];
  const sideA = document.getElementById('battleSideA');
  const sideB = document.getElementById('battleSideB');
  const btnPrev = document.getElementById('btnBattlePrev');
  const btnNext = document.getElementById('btnBattleNext');
  const btnAuto = document.getElementById('btnBattleAuto');

  document.getElementById('battlePlaybackTitle').textContent = `${teamA.name} vs ${teamB.name}`;
  document.getElementById('battlePlaybackSub').textContent = `Set ${step.setNumber} of ${steps.length}`;
  document.getElementById('battlePlaybackText').textContent = step.reason;
  document.getElementById('battlePlaybackScore').textContent =
    `${teamA.name} ${step.scoreA} - ${teamB.name} ${step.scoreB}`;

  sideA.className = `battle-side ${step.winnerIdx === game.teamAIdx ? 'winner' : 'loser'}`;
  sideB.className = `battle-side ${step.winnerIdx === game.teamBIdx ? 'winner' : 'loser'}`;
  sideA.innerHTML = renderBattlePlaybackSide(game, step, 'A');
  sideB.innerHTML = renderBattlePlaybackSide(game, step, 'B');

  btnPrev.disabled = battlePlayback.stepIdx === 0;
  btnNext.disabled = battlePlayback.stepIdx === steps.length - 1;
  btnAuto.textContent = battlePlayback.playing ? 'Pause' : battlePlayback.stepIdx === steps.length - 1 ? 'Replay' : 'Auto Play';
}

// ── Regular Season ──
function showSeasonScreen() {
  document.getElementById('draftScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
  document.getElementById('freeAgentScreen').style.display = 'none';
  document.getElementById('playoffScreen').style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'none';
  document.getElementById('completeScreen').style.display = 'none';
  document.getElementById('seasonScreen').style.display = 'flex';

  const gen = GENS[currentGenIdx];
  ensureActiveRosters();
  ensureRegularSeasonSchedule();
  syncSeason(SEASON_PHASES.REGULAR_SEASON, 'complete');
  renderSeasonScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.REGULAR_SEASON, 'complete'));

  document.getElementById('seasonTitle').textContent = `${gen.label} Regular Season`;
}

function renderSeasonScreen() {
  const schedule = getCurrentDraftSchedule();
  const standings = buildRegularSeasonStandings(schedule);
  const simulated = schedule.filter(game => game.simulated).length;
  const nextWeek = schedule.find(game => !game.simulated)?.week;
  const complete = isRegularSeasonComplete();

  document.getElementById('seasonSub').textContent =
    `${simulated} of ${schedule.length} games complete${complete ? ' · season complete' : ` · week ${nextWeek} up next`}`;

  document.getElementById('seasonStandings').innerHTML = standings.map(entry => `
    <div class="season-standing-row">
      <div class="season-rank">${entry.seed}</div>
      <div class="season-team-dot" style="background:${entry.color}"></div>
      <div class="season-team-name">${entry.name} ${cpuBadgeHtml(entry, 'season-cpu-personality', { compact: true })}</div>
      <div class="season-record">${entry.wins}-${entry.losses}</div>
      <div class="season-stat">PF ${entry.pointsFor}</div>
      <div class="season-stat">PD ${entry.pointDiff > 0 ? '+' : ''}${entry.pointDiff}</div>
      <div class="season-rating">${entry.rating}</div>
    </div>
  `).join('');

  const weeks = [...new Set(schedule.map(game => game.week))];
  const selectedLogGame = getSelectedBattleLogGame('season');
  document.getElementById('seasonSchedule').innerHTML = weeks.map(week => {
    const games = schedule.filter(game => game.week === week);
    return `
      <div class="season-week">
        <div class="season-week-title">Week ${week}</div>
        ${games.map(game => {
          const teamA = teams[game.teamAIdx];
          const teamB = teams[game.teamBIdx];
          const winnerA = game.winnerIdx === game.teamAIdx;
          const winnerB = game.winnerIdx === game.teamBIdx;
          const clickable = game.simulated ? ` onclick="selectBattleLog('season', '${game.id}')"` : '';
          const selected = selectedLogGame?.id === game.id ? ' selected' : '';
          return `
            <div class="season-game${game.simulated ? ' simulated' : ''}${selected}"${clickable}>
              <div class="season-game-team${winnerA ? ' winner' : ''}">
                <span class="season-team-dot" style="background:${teamA.color}"></span>
                <span>${teamA.name}</span>
                <strong>${game.simulated ? game.scoreA : '-'}</strong>
              </div>
              <div class="season-game-vs">vs</div>
              <div class="season-game-team${winnerB ? ' winner' : ''}">
                <span class="season-team-dot" style="background:${teamB.color}"></span>
                <span>${teamB.name}</span>
                <strong>${game.simulated ? game.scoreB : '-'}</strong>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
  renderBattleLogPanel('seasonBattleLog', selectedLogGame, 'season');

  document.getElementById('btnSimWeek').disabled = complete;
  document.getElementById('btnSimAll').disabled = complete;
  document.getElementById('btnSeasonContinue').disabled = !complete;
}

function simulateNextWeek() {
  const schedule = getCurrentDraftSchedule();
  const nextWeek = schedule.find(game => !game.simulated)?.week;
  if (!nextWeek) return;

  schedule
    .filter(game => game.week === nextWeek)
    .forEach(simulateGame);

  syncRegularSeasonResults();
  renderSeasonScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.REGULAR_SEASON, 'complete'));
}

function simulateAllSeason() {
  getCurrentDraftSchedule().forEach(simulateGame);
  syncRegularSeasonResults();
  renderSeasonScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.REGULAR_SEASON, 'complete'));
}

function continueAfterRegularSeason() {
  if (!isRegularSeasonComplete()) return;

  showPlayoffScreen();
}

// ── Playoffs ──
function playoffTeamName(teamIdx, fallback = 'TBD') {
  return Number.isInteger(teamIdx) ? teams[teamIdx].name : fallback;
}

function playoffSeedFor(teamIdx) {
  return buildPlayoffSeeds().find(seed => seed.teamIdx === teamIdx)?.playoffSeed ?? null;
}

function showPlayoffScreen() {
  document.getElementById('draftScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
  document.getElementById('freeAgentScreen').style.display = 'none';
  document.getElementById('seasonScreen').style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'none';
  document.getElementById('completeScreen').style.display = 'none';
  document.getElementById('playoffScreen').style.display = 'flex';

  const gen = GENS[currentGenIdx];
  ensurePlayoffBracket();
  syncSeason(SEASON_PHASES.PLAYOFFS, 'complete');
  renderPlayoffScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.PLAYOFFS, 'complete'));

  document.getElementById('playoffTitle').textContent = `${gen.label} Playoffs`;
}

function renderPlayoffScreen() {
  resolvePlayoffSources();
  const games = getCurrentPlayoffGames();
  const seeds = buildPlayoffSeeds();
  const championIdx = getPlayoffChampionIdx();
  const nextRound = getNextPlayablePlayoffRound();
  const complete = isPlayoffsComplete();

  document.getElementById('playoffSub').textContent = complete
    ? `${playoffTeamName(championIdx)} wins the draft crown`
    : nextRound
      ? `Round ${nextRound} ready`
      : 'Waiting for bracket results';

  const rounds = [...new Set(games.map(game => game.round))];
  const selectedLogGame = getSelectedBattleLogGame('playoff');
  document.getElementById('playoffBracket').innerHTML = rounds.map(round => {
    const roundGames = games.filter(game => game.round === round);
    return `
      <div class="playoff-round">
        <div class="playoff-round-title">${roundGames[0]?.label === 'Final' ? 'Final' : `Round ${round}`}</div>
        ${roundGames.map(game => {
          const seedA = playoffSeedFor(game.teamAIdx);
          const seedB = playoffSeedFor(game.teamBIdx);
          const winnerA = game.winnerIdx === game.teamAIdx;
          const winnerB = game.winnerIdx === game.teamBIdx;
          const clickable = game.simulated ? ` onclick="selectBattleLog('playoff', '${game.id}')"` : '';
          const selected = selectedLogGame?.id === game.id ? ' selected' : '';
          return `
            <div class="playoff-game${game.simulated ? ' simulated' : ''}${selected}"${clickable}>
              <div class="playoff-game-label">${game.label}</div>
              <div class="playoff-team${winnerA ? ' winner' : ''}">
                <span class="playoff-seed-num">${seedA ? seedA : '-'}</span>
                <span class="playoff-team-dot" style="background:${Number.isInteger(game.teamAIdx) ? teams[game.teamAIdx].color : 'var(--border)'}"></span>
                <span>${playoffTeamName(game.teamAIdx)}</span>
                <strong>${game.simulated ? game.scoreA : '-'}</strong>
              </div>
              <div class="playoff-team${winnerB ? ' winner' : ''}">
                <span class="playoff-seed-num">${seedB ? seedB : '-'}</span>
                <span class="playoff-team-dot" style="background:${Number.isInteger(game.teamBIdx) ? teams[game.teamBIdx].color : 'var(--border)'}"></span>
                <span>${playoffTeamName(game.teamBIdx)}</span>
                <strong>${game.simulated ? game.scoreB : '-'}</strong>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  document.getElementById('playoffSeeds').innerHTML = seeds.map(seed => `
    <div class="playoff-seed-row">
      <span class="playoff-seed-num">${seed.playoffSeed}</span>
      <span class="playoff-team-dot" style="background:${seed.color}"></span>
      <span class="playoff-team-name">${seed.name} ${cpuBadgeHtml(seed, 'playoff-cpu-personality', { compact: true })}</span>
      <strong>${seed.wins}-${seed.losses}</strong>
    </div>
  `).join('');

  document.getElementById('playoffChampion').innerHTML = championIdx !== null && championIdx !== undefined
    ? `<div class="playoff-champ-label">Champion</div><div class="playoff-champ-name">${teams[championIdx].name}</div>`
    : '<div class="playoff-champ-label">Champion</div><div class="playoff-champ-name">TBD</div>';
  renderBattleLogPanel('playoffBattleLog', selectedLogGame, 'playoff');

  document.getElementById('btnSimPlayoffRound').disabled = complete || nextRound === null;
  document.getElementById('btnSimPlayoffsAll').disabled = complete || nextRound === null;
  document.getElementById('btnPlayoffContinue').disabled = !complete;
}

function simulateNextPlayoffRound() {
  const nextRound = getNextPlayablePlayoffRound();
  if (nextRound === null) return;

  getCurrentPlayoffGames()
    .filter(game => game.round === nextRound && !game.simulated && isPlayoffGameReady(game))
    .forEach(simulateGame);

  resolvePlayoffSources();
  syncPlayoffResults();
  renderPlayoffScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.PLAYOFFS, 'complete'));
}

function simulateAllPlayoffs() {
  while (!isPlayoffsComplete()) {
    const nextRound = getNextPlayablePlayoffRound();
    if (nextRound === null) break;
    getCurrentPlayoffGames()
      .filter(game => game.round === nextRound && !game.simulated && isPlayoffGameReady(game))
      .forEach(simulateGame);
    resolvePlayoffSources();
  }

  syncPlayoffResults();
  renderPlayoffScreen();
  saveSeason(buildSeasonState(SEASON_PHASES.PLAYOFFS, 'complete'));
}

function continueAfterPlayoffs() {
  if (!isPlayoffsComplete()) return;

  syncPlayoffResults();
  setNextDraftOrder(computeNextDraftOrder());
  saveSeason(buildSeasonState(SEASON_PHASES.BETWEEN_DRAFTS, 'complete'));

  const hasMoreGens = currentGenIdx < GENS.length - 1;
  if (hasMoreGens) {
    showLobby();
  } else {
    showComplete();
  }
}

// ── Lobby (between gens) ──
function showLobby() {
  document.getElementById('draftScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
  document.getElementById('freeAgentScreen').style.display = 'none';
  document.getElementById('seasonScreen').style.display = 'none';
  document.getElementById('playoffScreen').style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'flex';

  const gen = GENS[currentGenIdx];
  const nextGen = GENS[currentGenIdx + 1];

  document.getElementById('lobbyGenComplete').textContent = `${gen.label} Complete`;
  document.getElementById('lobbyDraftNum').textContent =
    season?.champion?.draftId === draftNumber
      ? `Draft ${draftNumber} · ${season.champion.name} wins the playoffs`
      : `Draft ${draftNumber} · Playoffs complete`;

  const standings = buildRegularSeasonStandings(getCurrentDraftSchedule());
  const ranked = standings.map(entry => ({
    ...entry,
    team: teams[entry.teamIdx],
    idx: entry.teamIdx,
  }));

  const nextOrder = season?.nextDraftOrder?.length
    ? season.nextDraftOrder.map(idx => ranked.find(entry => entry.idx === idx)).filter(Boolean)
    : [...ranked].reverse();
  setNextDraftOrder(nextOrder.map(entry => entry.idx));

  // Order pills
  const pillsEl = document.getElementById('lobbyOrderPills');
  pillsEl.innerHTML = nextOrder.map((entry, i) => `
    <div class="order-pill">
      <span class="order-num">${i + 1}</span>
      <span class="order-dot" style="background:${entry.team.color}"></span>
      <span class="order-name">${entry.team.name} ${cpuBadgeHtml(entry.team, 'order-cpu-personality', { compact: true })}</span>
    </div>
  `).join('');

  // Standings cards
  const MEDALS = ['🏆', '🥈', '🥉'];
  document.getElementById('lobbyStandings').innerHTML = ranked.map((entry, rank) => {
    const { team } = entry;
    const picks = team.picks.map(p => {
      const g = getGen(p.id);
      return `
        <div class="lobby-pick" title="${p.name} (${g.label})">
          <img src="${p.sprite}" alt="${p.name}">
          <span class="lobby-gen-tag" style="background:${g.color}">${g.short}</span>
        </div>`;
    }).join('');
    const cpuBadge = cpuBadgeHtml(team, 'lobby-cpu-personality', { compact: true });
    return `
      <div class="lobby-team-card">
        <div class="lobby-team-head">
          <span class="lobby-rank">${MEDALS[rank] || rank + 1}</span>
          <span class="lobby-team-dot" style="background:${team.color}"></span>
          <span class="lobby-team-name">${team.name} ${cpuBadge}</span>
          <span class="lobby-bst">${entry.wins}-${entry.losses} · PD ${entry.pointDiff > 0 ? '+' : ''}${entry.pointDiff}</span>
        </div>
        <div class="lobby-picks-grid">${picks || '<span class="tt-empty" style="padding:8px">No picks</span>'}</div>
      </div>`;
  }).join('');

  document.getElementById('btnContinue').textContent = `Continue to ${nextGen.label} →`;
  saveSeason(buildSeasonState(SEASON_PHASES.BETWEEN_DRAFTS, 'complete'));
}

async function continueToNextGen() {
  const nextOrder = season?.nextDraftOrder?.length
    ? [...season.nextDraftOrder]
    : computeNextDraftOrder();

  currentGenIdx++;
  draftNumber++;
  currentRound = 0;
  currentPickInRound = 0;
  cpuThinking = false;
  selectedBattleLogs = { season: null, playoff: null };
  faDropId = null;
  faNotice = '';
  clearBattlePlaybackTimer();
  battlePlayback = { scope: null, gameId: null, stepIdx: 0, playing: false, timer: null };

  draftOrderIndices = [...nextOrder];
  setNextDraftOrder(nextOrder);
  resetWaiverOrderForDraft();
  syncDraftedIdsWithOwnership();

  document.getElementById('lobbyScreen').style.display = 'none';
  await loadGen(currentGenIdx);

  buildSnakeOrder();
  document.getElementById('typeFilter').innerHTML = '<option value="">All Types</option>';
  populateTypeFilter();

  document.getElementById('loadingScreen').style.display = 'none';
  document.getElementById('draftScreen').style.display = 'flex';

  refreshHeader();
  refreshSnakeBar();
  refreshGrid();
  refreshTeams();
  if (isMobile()) initMobileTabs();
  saveSeason(buildSeasonState(SEASON_PHASES.DRAFT, 'inProgress'));
  triggerCpuIfNeeded();
}

function endSeason() {
  document.getElementById('lobbyScreen').style.display = 'none';
  showComplete();
}

// ── Filters / Sort ──
function filterSearch(val) { curSearch = val.toLowerCase(); refreshGrid(); }
function filterType(val)   { curType = val; refreshGrid(); }
function sortBy(val)       { curSort = val; refreshGrid(); }

// ── Complete Screen (final) ──
function showComplete() {
  document.getElementById('draftScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
  document.getElementById('freeAgentScreen').style.display = 'none';
  document.getElementById('seasonScreen').style.display = 'none';
  document.getElementById('playoffScreen').style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'none';
  document.getElementById('completeScreen').style.display = 'flex';

  const regularSeasonStandings = buildRegularSeasonStandings(getCurrentDraftSchedule());
  const hasSeasonResults = regularSeasonStandings.some(entry => entry.wins || entry.losses);
  const playoffOrder = computePlayoffDraftOrder();
  const hasPlayoffResults = isPlayoffsComplete() && playoffOrder.length;
  const ranked = hasPlayoffResults
    ? [...playoffOrder].reverse().map(idx => {
        const standing = regularSeasonStandings.find(entry => entry.teamIdx === idx);
        return {
          team: teams[idx],
          idx,
          totalBst: teamTotalBst(teams[idx]),
          record: standing ? `${standing.wins}-${standing.losses}` : null,
          pointDiff: standing?.pointDiff ?? 0,
        };
      })
    : hasSeasonResults
    ? regularSeasonStandings.map(entry => ({
        team: teams[entry.teamIdx],
        idx: entry.teamIdx,
        totalBst: entry.totalBst,
        record: `${entry.wins}-${entry.losses}`,
        pointDiff: entry.pointDiff,
      }))
    : [...teams]
        .map((team, idx) => ({ team, idx, totalBst: teamTotalBst(team), record: null, pointDiff: 0 }))
        .sort((a, b) => b.totalBst - a.totalBst);
  const champ = ranked[0];
  syncSeason(SEASON_PHASES.COMPLETE, 'complete');
  season.champion = champ
    ? {
        teamIdx: champ.idx,
        name: champ.team.name,
        totalBst: champ.totalBst,
        record: champ.record,
        pointDiff: champ.pointDiff,
        decidedBy: hasPlayoffResults ? 'playoffs' : hasSeasonResults ? 'regularSeasonRecord' : 'totalBst',
      }
    : null;
  clearSeason();

  const MEDALS = ['🏆', '🥈', '🥉'];
  const grid = document.getElementById('compGrid');
  grid.innerHTML = '';

  ranked.forEach(({ team, totalBst, record, pointDiff }, rank) => {
    const cpuLabel = team.isCpu ? ` ${cpuBadgeHtml(team, 'complete-cpu-personality')}` : '';
    const picks = team.picks.map(p => {
      const g = getGen(p.id);
      return `
        <div class="comp-pick">
          <img src="${p.sprite}" alt="${p.name}">
          <div class="comp-pick-info">
            <div class="comp-pick-name">${p.name}</div>
            <div class="comp-pick-types">${typePills(p.types)}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
            <div class="comp-pick-bst-val">${p.bst}</div>
            <span style="font-size:9px;font-weight:700;padding:2px 5px;border-radius:4px;background:${g.color};color:#000">${g.short}</span>
          </div>
        </div>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'comp-team';
    el.innerHTML = `
      <div class="comp-team-head">
        <div style="width:13px;height:13px;border-radius:50%;background:${team.color};flex-shrink:0"></div>
        ${MEDALS[rank] ? MEDALS[rank] + ' ' : ''}${team.name}${cpuLabel}
        <div class="comp-bst-total">${record ? `${record} · PD ${pointDiff > 0 ? '+' : ''}${pointDiff}` : `TOTAL ${totalBst}`}</div>
      </div>
      <div class="comp-picks">${picks}</div>
    `;
    grid.appendChild(el);
  });
}

// ── Restart ──
function restart() {
  allPokemon = []; teams = []; draftedIds.clear(); snakeOrder = [];
  draftOrderIndices = []; currentGenIdx = 0; draftNumber = 1;
  numRounds = DRAFT_ROUNDS; currentRound = 0; currentPickInRound = 0; cpuThinking = false; season = null;
  selectedBattleLogs = { season: null, playoff: null };
  clearBattlePlaybackTimer();
  battlePlayback = { scope: null, gameId: null, stepIdx: 0, playing: false, timer: null };
  _savedForResume = null;
  curSort = 'recommended'; curSearch = ''; curType = '';
  faSort = 'recommended'; faSearch = ''; faType = ''; faTeamIdx = 0; faHistoryDraft = 'current'; faHistoryTeam = 'all'; faHistoryMove = 'all'; faDropId = null; faNotice = ''; faCpuThinking = false; faCpuPassStreak = 0;
  document.getElementById('typeFilter').innerHTML = '<option value="">All Types</option>';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('completeScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
  document.getElementById('freeAgentScreen').style.display = 'none';
  document.getElementById('seasonScreen').style.display = 'none';
  document.getElementById('playoffScreen').style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'none';
  document.getElementById('resumeScreen').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'flex';
  updateRounds();
  renderNameInputs();
}

// ── Mobile tab switcher ──────────────────────────────────────────────────
function isMobile() { return window.innerWidth <= 640; }

function initMobileTabs() {
  const draftBody = document.querySelector('.draft-body');

  // Only inject once
  if (document.querySelector('.mobile-tabs')) {
    setMobileTab('pokemon');
    return;
  }

  const tabs = document.createElement('div');
  tabs.className = 'mobile-tabs';
  tabs.innerHTML = `
    <button class="mobile-tab active" data-tab="pokemon" onclick="setMobileTab('pokemon')">⚔ POKÉMON</button>
    <button class="mobile-tab" data-tab="teams" onclick="setMobileTab('teams')">🛡 ROSTERS</button>
  `;
  // Insert before draft-body
  draftBody.parentNode.insertBefore(tabs, draftBody);
  setMobileTab('pokemon');
}

function setMobileTab(tab) {
  document.querySelectorAll('.mobile-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  const pokemon = document.querySelector('.pokemon-panel');
  const teams = document.querySelector('.teams-panel');
  if (isMobile()) {
    pokemon.classList.toggle('active', tab === 'pokemon');
    teams.classList.toggle('active', tab === 'teams');
  } else {
    pokemon.classList.remove('active');
    teams.classList.remove('active');
  }
}

// Switch to rosters tab after a pick so user can see their new Pokémon
function flashRosterTab() {
  if (!isMobile()) return;
  setMobileTab('teams');
  setTimeout(() => setMobileTab('pokemon'), 1200);
}

// ── Init ──
// ── Resume Screen ──
let _savedForResume = null;

function getSavedDraftRecord(saved) {
  const drafts = saved.season?.drafts ?? [];
  const activeId = saved.draftNumber ?? saved.season?.currentDraftId;
  return drafts.find(d => d.id === activeId) ?? drafts[drafts.length - 1] ?? null;
}

function normalizeSavedState(saved) {
  const draft = getSavedDraftRecord(saved);
  const seasonTeams = saved.season?.teams ?? [];
  const hasSavedTeams = Array.isArray(saved.teams) && saved.teams.length > 0;
  const normalizedTeams = normalizeSavedTeamList(hasSavedTeams ? saved.teams : seasonTeams, hasSavedTeams ? seasonTeams : []);
  const normalizedSeason = normalizeSavedSeason(saved, normalizedTeams);
  return {
    ...saved,
    version: SAVE_VERSION,
    season: normalizedSeason,
    currentGenIdx: saved.currentGenIdx ?? normalizedSeason?.currentGenIdx ?? draft?.genIdx ?? 0,
    draftNumber: saved.draftNumber ?? normalizedSeason?.currentDraftId ?? draft?.id ?? 1,
    numTeams: saved.numTeams ?? normalizedSeason?.settings?.numTeams ?? normalizedTeams.length,
    numRounds: saved.numRounds ?? normalizedSeason?.settings?.numRounds ?? DRAFT_ROUNDS,
    teams: normalizedTeams,
    draftedIds: saved.draftedIds ?? draft?.draftedIds ?? [],
    snakeOrder: saved.snakeOrder ?? draft?.snakeOrder ?? [],
    draftOrderIndices: saved.draftOrderIndices ?? draft?.order ?? normalizedSeason?.nextDraftOrder ?? [],
    currentRound: saved.currentRound ?? draft?.currentRound ?? 0,
    currentPickInRound: saved.currentPickInRound ?? draft?.currentPickInRound ?? 0,
  };
}

async function init() {
  await openDB();

  const saved = loadSeason();
  if (saved) {
    _savedForResume = normalizeSavedState(saved);
    saveSeason(_savedForResume);
    showResumeScreen(_savedForResume);
    return;
  }

  updateTeamCount(4);
  updateRounds();
  renderNameInputs();
  document.getElementById('setupScreen').style.display = 'flex';
}

function showResumeScreen(saved) {
  const gen = GENS[saved.currentGenIdx ?? 0];
  const round = saved.currentRound + 1;
  const totalRounds = saved.numRounds;
  const phase = saved.season?.phase ?? saved.status;

  const badge = document.getElementById('resumeGenBadge');
  badge.textContent = gen.short;
  badge.style.background = gen.color;

  document.getElementById('resumeMetaTitle').textContent =
    'Draft ' + (saved.draftNumber ?? 1) + ' · ' + gen.label;
  document.getElementById('resumeMetaSub').textContent =
    phase === SEASON_PHASES.ROSTER_LOCK
      ? 'Active roster lock  ·  ' + saved.numTeams + ' teams'
    : phase === SEASON_PHASES.REGULAR_SEASON
      ? 'Regular season  ·  ' + saved.numTeams + ' teams'
      : phase === SEASON_PHASES.PLAYOFFS
        ? 'Playoffs  ·  ' + saved.numTeams + ' teams'
      : 'Round ' + Math.min(round, totalRounds) + ' of ' + totalRounds + '  ·  ' + saved.numTeams + ' teams';

  const teamsEl = document.getElementById('resumeTeams');
  teamsEl.innerHTML = saved.teams.map(t => {
    const pickCount = t.picks.length;
    const spriteSlots = t.picks.slice(0, 8).map(id =>
      '<img class="resume-sprite" ' +
      'src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png" ' +
      'alt="" onerror="this.style.opacity=0">'
    ).join('');
    const cpuBadge = cpuBadgeHtml(t, 'resume-cpu-personality');
    return '<div class="resume-team-row">' +
      '<div class="resume-team-dot" style="background:' + t.color + '"></div>' +
      '<div class="resume-team-name">' + t.name + ' ' + cpuBadge + '</div>' +
      '<div class="resume-sprites">' + spriteSlots + '</div>' +
      '<div class="resume-pick-count">' + pickCount + ' pick' + (pickCount !== 1 ? 's' : '') + '</div>' +
      '</div>';
  }).join('');

  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('resumeScreen').style.display = 'flex';
}

function resumeDraft() {
  document.getElementById('resumeScreen').style.display = 'none';
  if (_savedForResume) restoreSeason(_savedForResume);
}

function discardAndNew() {
  clearSeason();
  _savedForResume = null;
  document.getElementById('resumeScreen').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'flex';
  updateTeamCount(4);
  updateRounds();
}

async function restoreSeason(saved) {
  const normalized = normalizeSavedState(saved);
  season = normalized.season ?? null;
  currentGenIdx = normalized.currentGenIdx ?? 0;
  draftNumber = normalized.draftNumber ?? 1;
  numTeams = normalized.numTeams;
  numRounds = normalized.numRounds;
  currentRound = normalized.currentRound;
  currentPickInRound = normalized.currentPickInRound;
  snakeOrder = normalized.snakeOrder;
  draftOrderIndices = normalized.draftOrderIndices ?? [];
  draftedIds = new Set(normalized.draftedIds);

  teams = await Promise.all(normalized.teams.map(async (t) => ({
    ...t,
    picks: (await Promise.all(t.picks.map(hydrateSavedPokemon))).filter(Boolean),
  })));
  normalizeCpuPersonalities(teams);
  syncDraftedIdsWithOwnership();

  await loadGen(currentGenIdx);
  buildSnakeOrder();
  document.getElementById('typeFilter').innerHTML = '<option value="">All Types</option>';
  populateTypeFilter();

  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('loadingScreen').style.display = 'none';

  if (currentRound >= numRounds) {
    const hasMoreGens = currentGenIdx < GENS.length - 1;
    const phase = season?.phase ?? normalized.status;
    if (phase === SEASON_PHASES.ROSTER_LOCK || phase === SEASON_PHASES.DRAFT) {
      showRosterScreen();
    } else if (phase === SEASON_PHASES.REGULAR_SEASON || !isRegularSeasonComplete()) {
      showSeasonScreen();
    } else if (phase === SEASON_PHASES.PLAYOFFS) {
      showPlayoffScreen();
    } else if (hasMoreGens && phase === SEASON_PHASES.BETWEEN_DRAFTS) {
      showLobby();
    } else {
      showComplete();
    }
    return;
  }

  document.getElementById('draftScreen').style.display = 'flex';
  refreshHeader();
  refreshSnakeBar();
  refreshGrid();
  refreshTeams();
  if (isMobile()) initMobileTabs();
  triggerCpuIfNeeded();
}

init();
