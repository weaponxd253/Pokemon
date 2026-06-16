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

const GENS = [
  { num: 1, label: 'Gen 1 — Kanto',  short: 'G1', start: 1,   end: 151, color: '#ff6b6b' },
  { num: 2, label: 'Gen 2 — Johto',  short: 'G2', start: 152, end: 251, color: '#ffd93d' },
  { num: 3, label: 'Gen 3 — Hoenn',  short: 'G3', start: 252, end: 386, color: '#6bcb77' },
  { num: 4, label: 'Gen 4 — Sinnoh', short: 'G4', start: 387, end: 493, color: '#4d96ff' },
];

const MAX_TEAMS = 12;
const DRAFT_ROUNDS = 6;
const ACTIVE_ROSTER_SIZE = 6;

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
let curSort = 'bst-desc', curSearch = '', curType = '';
let cpuThinking = false;
let season = null;

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
  return team.picks
    .map(p => p?.id ?? p)
    .filter(id => Number.isInteger(id));
}

function serializeTeam(team) {
  return {
    name: team.name,
    color: team.color,
    isCpu: team.isCpu,
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
    draftedIds: [...draftedIds],
    picksByTeam: teams.map(teamPickIds),
  };
}

function createSeason() {
  return {
    version: 3,
    phase: SEASON_PHASES.DRAFT,
    startedAt: new Date().toISOString(),
    settings: {
      startGenIdx: currentGenIdx,
      numTeams,
      numRounds,
      activeRosterSize: ACTIVE_ROSTER_SIZE,
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

  activeSeason.version = 3;
  activeSeason.phase = phase;
  activeSeason.currentDraftId = draftNumber;
  activeSeason.currentGenIdx = currentGenIdx;
  activeSeason.settings ??= {};
  activeSeason.settings.numTeams = numTeams;
  activeSeason.settings.numRounds = numRounds;
  activeSeason.settings.activeRosterSize = ACTIVE_ROSTER_SIZE;
  activeSeason.settings.maxGenIdx ??= GENS.length - 1;
  activeSeason.teams = teams.map(serializeTeam);
  activeSeason.standings = buildSeasonStandings();
  activeSeason.schedule ??= [];
  activeSeason.results ??= [];
  activeSeason.playoffs ??= [];
  activeSeason.champions ??= [];
  activeSeason.champion ??= null;

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
    ...schedule.filter(game => game.simulated).map(game => ({
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
    })),
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
  const winnerIdx = Math.random() < score.chanceA ? game.teamAIdx : game.teamBIdx;
  const loserIdx = winnerIdx === game.teamAIdx ? game.teamBIdx : game.teamAIdx;
  const winnerRating = winnerIdx === game.teamAIdx ? ratingA : ratingB;
  const loserRating = loserIdx === game.teamAIdx ? ratingA : ratingB;
  const winnerEdge = winnerIdx === game.teamAIdx ? score.edgeA : score.edgeB;
  const baseWinnerScore = 72 + Math.round(winnerRating / 45) + Math.floor(Math.random() * 24);
  const ratingGap = Math.max(-10, Math.min(18, Math.round((winnerRating - loserRating) / 80)));
  const matchupGap = Math.round(winnerEdge * 8);
  const margin = Math.max(1, 4 + ratingGap + matchupGap + Math.floor(Math.random() * 14));
  const winnerScore = baseWinnerScore;
  const loserScore = Math.max(40, winnerScore - margin);

  game.ratingA = ratingA;
  game.ratingB = ratingB;
  game.winnerIdx = winnerIdx;
  game.scoreA = winnerIdx === game.teamAIdx ? winnerScore : loserScore;
  game.scoreB = winnerIdx === game.teamBIdx ? winnerScore : loserScore;
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
  numTeams = Math.min(MAX_TEAMS, parseInt(document.getElementById('numTeamsRange').value));
  numRounds = DRAFT_ROUNDS;
  updateRounds();

  const nameFields = document.querySelectorAll('.team-name-field');
  const cpuToggles = document.querySelectorAll('.cpu-toggle');
  teams = Array.from({ length: numTeams }, (_, i) => ({
    name: nameFields[i]?.value.trim() || `Team ${i + 1}`,
    color: TEAM_COLORS[i],
    isCpu: cpuToggles[i]?.dataset.cpu === 'true',
    picks: [],
    activeIds: [],
  }));

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

// ── CPU Logic ──
function cpuScore(poke, team) {
  const typesOwned = new Set(team.picks.flatMap(p => p.types));
  const newTypeBonus = poke.types.some(t => !typesOwned.has(t)) ? 55 : 0;
  const jitter = (Math.random() - 0.5) * 80;
  return poke.bst + newTypeBonus + jitter;
}

function cpuPick() {
  const team = teams[currentTeamIdx()];
  const available = allPokemon.filter(p => !draftedIds.has(p.id));
  if (!available.length) return;

  const scored = available
    .map(p => ({ poke: p, score: cpuScore(p, team) }))
    .sort((a, b) => b.score - a.score);

  const topN = Math.min(3, scored.length);
  const choice = scored[Math.floor(Math.random() * topN)].poke;
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
  picker.textContent = team.name + (team.isCpu ? ' (CPU)' : '') + "'s Pick";
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
    pip.className = 's-pip ' + (i < cur ? 'done' : i === cur ? 'current' : 'upcoming');
    pip.style.background = teams[ti].color;
    pip.title = teams[ti].name + (teams[ti].isCpu ? ' (CPU)' : '');
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
  if (curSort === 'bst-desc')     list.sort((a, b) => b.bst - a.bst);
  else if (curSort === 'bst-asc') list.sort((a, b) => a.bst - b.bst);
  else if (curSort === 'name')    list.sort((a, b) => a.name.localeCompare(b.name));
  else                            list.sort((a, b) => a.id - b.id);
  return list;
}

function refreshGrid() {
  const grid = document.getElementById('pokeGrid');
  grid.innerHTML = '';
  getDisplayList().forEach(poke => {
    const card = document.createElement('div');
    card.className = 'poke-card' + (draftedIds.has(poke.id) ? ' drafted' : '');
    card.dataset.id = poke.id;
    card.innerHTML = `
      <img src="${poke.sprite}" alt="${poke.name}" onerror="this.style.visibility='hidden'">
      <div class="pc-num">#${String(poke.id).padStart(3, '0')}</div>
      <div class="pc-name">${poke.name}</div>
      <div class="pc-types">${typePills(poke.types)}</div>
      <div class="pc-bst-lbl">BASE STAT TOTAL</div>
      <div class="pc-bst">${poke.bst}</div>
    `;
    if (!draftedIds.has(poke.id)) {
      card.addEventListener('click', () => {
        if (cpuThinking) return;
        draftPokemon(poke);
      });
    }
    grid.appendChild(card);
  });
}

function refreshTeams() {
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
    const cpuBadge = team.isCpu ? '<span class="tt-cpu-badge">CPU</span>' : '';
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
  teams[ti].picks.push(poke);
  if ((teams[ti].activeIds ?? []).length < ACTIVE_ROSTER_SIZE) {
    teams[ti].activeIds ??= [];
    teams[ti].activeIds.push(poke.id);
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
    version: 3,
    season: activeSeason,
    currentGenIdx,
    draftNumber,
    numTeams, numRounds,
    teams: teams.map(serializeTeam),
    draftedIds: [...draftedIds],
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
    const cpuBadge = team.isCpu ? '<span class="tt-cpu-badge">CPU</span>' : '';
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
  showSeasonScreen();
}

// ── Regular Season ──
function showSeasonScreen() {
  document.getElementById('draftScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
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
      <div class="season-team-name">${entry.name}${entry.isCpu ? ' <span class="tt-cpu-badge">CPU</span>' : ''}</div>
      <div class="season-record">${entry.wins}-${entry.losses}</div>
      <div class="season-stat">PF ${entry.pointsFor}</div>
      <div class="season-stat">PD ${entry.pointDiff > 0 ? '+' : ''}${entry.pointDiff}</div>
      <div class="season-rating">${entry.rating}</div>
    </div>
  `).join('');

  const weeks = [...new Set(schedule.map(game => game.week))];
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
          return `
            <div class="season-game${game.simulated ? ' simulated' : ''}">
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
          return `
            <div class="playoff-game${game.simulated ? ' simulated' : ''}">
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
      <span>${seed.name}${seed.isCpu ? ' <span class="tt-cpu-badge">CPU</span>' : ''}</span>
      <strong>${seed.wins}-${seed.losses}</strong>
    </div>
  `).join('');

  document.getElementById('playoffChampion').innerHTML = championIdx !== null && championIdx !== undefined
    ? `<div class="playoff-champ-label">Champion</div><div class="playoff-champ-name">${teams[championIdx].name}</div>`
    : '<div class="playoff-champ-label">Champion</div><div class="playoff-champ-name">TBD</div>';

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
      <span class="order-name">${entry.team.name}${entry.team.isCpu ? ' (CPU)' : ''}</span>
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
    const cpuBadge = team.isCpu ? '<span class="tt-cpu-badge">CPU</span>' : '';
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

  draftOrderIndices = [...nextOrder];
  setNextDraftOrder(nextOrder);

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
    const cpuLabel = team.isCpu ? ' <span style="font-size:10px;opacity:0.6">(CPU)</span>' : '';
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
  _savedForResume = null;
  curSort = 'bst-desc'; curSearch = ''; curType = '';
  document.getElementById('typeFilter').innerHTML = '<option value="">All Types</option>';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('completeScreen').style.display = 'none';
  document.getElementById('rosterScreen').style.display = 'none';
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
  return {
    ...saved,
    currentGenIdx: saved.currentGenIdx ?? saved.season?.currentGenIdx ?? draft?.genIdx ?? 0,
    draftNumber: saved.draftNumber ?? saved.season?.currentDraftId ?? draft?.id ?? 1,
    numTeams: saved.numTeams ?? saved.season?.settings?.numTeams ?? saved.teams?.length ?? seasonTeams.length,
    numRounds: saved.numRounds ?? saved.season?.settings?.numRounds ?? DRAFT_ROUNDS,
    teams: saved.teams ?? seasonTeams,
    draftedIds: saved.draftedIds ?? draft?.draftedIds ?? [],
    snakeOrder: saved.snakeOrder ?? draft?.snakeOrder ?? [],
    draftOrderIndices: saved.draftOrderIndices ?? draft?.order ?? saved.season?.nextDraftOrder ?? [],
    currentRound: saved.currentRound ?? draft?.currentRound ?? 0,
    currentPickInRound: saved.currentPickInRound ?? draft?.currentPickInRound ?? 0,
  };
}

async function init() {
  await openDB();

  const saved = loadSeason();
  if (saved) {
    _savedForResume = normalizeSavedState(saved);
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
    const cpuBadge = t.isCpu
      ? '<span class="tt-cpu-badge" style="font-size:6px">CPU</span>'
      : '';
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
