const TEAM_COLORS = [
  '#ff3b3b', '#4da6ff', '#ffd700', '#4dff91',
  '#ff7c4d', '#c97bff', '#ff9ec8', '#00e5d4'
];

const TYPE_COLORS = {
  normal:   '#A8A8A8', fire:     '#F08030', water:    '#6890F0',
  grass:    '#78C850', electric: '#F8D030', ice:      '#98D8D8',
  fighting: '#C03028', poison:   '#A040A0', ground:   '#E0C068',
  flying:   '#A890F0', psychic:  '#F85888', bug:      '#A8B820',
  rock:     '#B8A038', ghost:    '#705898', dragon:   '#7038F8',
  dark:     '#705848', steel:    '#B8B8D0', fairy:    '#EE99AC'
};

const DEFAULT_NAMES = [
  'Red Bulls', 'Blue Jays', 'Gold Rush', 'Green Wave',
  'Blaze Squad', 'Purple Haze', 'Pink Tide', 'Teal Force'
];

// ── State ──
let allPokemon = [];
let teams = [];
let numTeams = 4, numRounds = 4;
let currentRound = 0, currentPickInRound = 0;
let draftedIds = new Set();
let snakeOrder = [];
let curSort = 'bst-desc', curSearch = '', curType = '';

// ── Setup ──
function updateTeamCount(val) {
  numTeams = parseInt(val);
  document.getElementById('numTeamsVal').textContent = val;
  renderNameInputs();
}

function updateRounds(val) {
  numRounds = parseInt(val);
  document.getElementById('numRoundsVal').textContent = val;
}

function renderNameInputs() {
  const grid = document.getElementById('teamNamesGrid');
  const existing = [...grid.querySelectorAll('.team-name-field')].map(i => i.value);
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
    row.appendChild(dot);
    row.appendChild(inp);
    grid.appendChild(row);
  }
}

async function startDraft() {
  numTeams = parseInt(document.getElementById('numTeamsRange').value);
  numRounds = parseInt(document.getElementById('numRoundsRange').value);
  const limit = parseInt(document.getElementById('genSelect').value);

  const nameFields = document.querySelectorAll('.team-name-field');
  teams = Array.from({ length: numTeams }, (_, i) => ({
    name: nameFields[i]?.value.trim() || `Team ${i + 1}`,
    color: TEAM_COLORS[i],
    picks: []
  }));

  document.getElementById('setupScreen').style.display = 'none';
  const ls = document.getElementById('loadingScreen');
  ls.style.display = 'flex';

  await loadPokemonData(limit);
  buildSnakeOrder();
  populateTypeFilter();

  ls.style.display = 'none';
  const ds = document.getElementById('draftScreen');
  ds.style.display = 'flex';

  refreshHeader();
  refreshSnakeBar();
  refreshGrid();
  refreshTeams();
}

// ── Data Loading ──
async function loadPokemonData(limit) {
  allPokemon = [];

  const cached = await countCachedPokemon();
  const fullyCached = cached >= limit;

  if (fullyCached) {
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('loadCount').textContent = `${limit} cached`;
    for (let id = 1; id <= limit; id++) {
      const p = await getCachedPokemon(id);
      if (p) allPokemon.push(p);
    }
  } else {
    let loaded = 0;
    document.getElementById('loadCount').textContent = `0 / ${limit}`;
    const BATCH = 60;

    for (let i = 0; i < limit; i += BATCH) {
      const ids = Array.from(
        { length: Math.min(BATCH, limit - i) },
        (_, j) => i + j + 1
      );
      const results = await Promise.all(ids.map(async (id) => {
        const hit = await getCachedPokemon(id);
        if (hit) { loaded++; return hit; }

        const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(r => r.json());
        const parsed = parsePokemon(data);
        await putCachedPokemon(parsed);

        loaded++;
        const pct = Math.round((loaded / limit) * 100);
        document.getElementById('progressFill').style.width = `${pct}%`;
        document.getElementById('loadCount').textContent = `${loaded} / ${limit}`;
        document.getElementById('loadName').textContent = parsed.name;
        return parsed;
      }));
      allPokemon.push(...results);
    }
  }

  allPokemon.sort((a, b) => b.bst - a.bst);
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
    stats,
    bst
  };
}

// ── Snake Logic ──
function buildSnakeOrder() {
  snakeOrder = [];
  for (let r = 0; r < numRounds; r++) {
    for (let p = 0; p < numTeams; p++) {
      snakeOrder.push(r % 2 === 0 ? p : (numTeams - 1 - p));
    }
  }
}

function currentPickNum() { return currentRound * numTeams + currentPickInRound; }
function currentTeamIdx() { return snakeOrder[currentPickNum()]; }

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
  const total = numRounds * numTeams;
  const pick = currentPickNum();
  const team = teams[currentTeamIdx()];
  const picker = document.getElementById('dhPicker');
  picker.textContent = team.name + "'s Pick";
  picker.style.color = team.color;
  document.getElementById('dhSub').textContent =
    `Round ${currentRound + 1}  ·  Pick ${currentPickInRound + 1} of ${numTeams}`;
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
    pip.title = teams[ti].name;
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
      card.addEventListener('click', () => draftPokemon(poke));
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
    const picks = team.picks.length
      ? team.picks.map(p => `
          <div class="mini-chip">
            <img src="${p.sprite}" alt="${p.name}">
            <span>${p.name}</span>
          </div>`).join('')
      : '<span class="tt-empty">No picks yet</span>';
    tile.innerHTML = `
      <div class="tt-head">
        <div class="tt-dot" style="background:${team.color}"></div>
        <div class="tt-name">${team.name}</div>
        <div class="tt-count">${team.picks.length}/${numRounds}</div>
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
  draftedIds.add(poke.id);

  const card = document.querySelector(`.poke-card[data-id="${poke.id}"]`);
  if (card) card.classList.add('drafted');

  currentPickInRound++;
  if (currentPickInRound >= numTeams) {
    currentPickInRound = 0;
    currentRound++;
  }

  if (currentRound >= numRounds) {
    showComplete();
    return;
  }

  refreshHeader();
  refreshSnakeBar();
  refreshTeams();
  saveSeason(buildSeasonState());
}

function buildSeasonState() {
  return {
    version: 1,
    currentGen: parseInt(document.getElementById('genSelect').value),
    draftNumber: 1,
    numTeams, numRounds,
    teams: teams.map(t => ({ ...t, picks: t.picks.map(p => p.id ?? p) })),
    draftedIds: [...draftedIds],
    snakeOrder,
    currentRound,
    currentPickInRound,
    status: 'drafting',
  };
}

// ── Filters / Sort ──
function filterSearch(val) { curSearch = val.toLowerCase(); refreshGrid(); }
function filterType(val)   { curType = val; refreshGrid(); }
function sortBy(val)       { curSort = val; refreshGrid(); }

// ── Complete Screen ──
function showComplete() {
  document.getElementById('draftScreen').style.display = 'none';
  const screen = document.getElementById('completeScreen');
  screen.style.display = 'flex';

  const ranked = [...teams].sort((a, b) =>
    b.picks.reduce((s, p) => s + p.bst, 0) - a.picks.reduce((s, p) => s + p.bst, 0)
  );

  const MEDALS = ['🏆', '🥈', '🥉'];
  const grid = document.getElementById('compGrid');
  grid.innerHTML = '';

  ranked.forEach((team, rank) => {
    const totalBst = team.picks.reduce((s, p) => s + p.bst, 0);
    const picks = team.picks.map(p => `
      <div class="comp-pick">
        <img src="${p.sprite}" alt="${p.name}">
        <div class="comp-pick-info">
          <div class="comp-pick-name">${p.name}</div>
          <div class="comp-pick-types">${typePills(p.types)}</div>
        </div>
        <div class="comp-pick-bst-val">${p.bst}</div>
      </div>
    `).join('');

    const el = document.createElement('div');
    el.className = 'comp-team';
    el.innerHTML = `
      <div class="comp-team-head">
        <div style="width:13px;height:13px;border-radius:50%;background:${team.color};flex-shrink:0"></div>
        ${MEDALS[rank] ? MEDALS[rank] + ' ' : ''}${team.name}
        <div class="comp-bst-total">TOTAL ${totalBst}</div>
      </div>
      <div class="comp-picks">${picks}</div>
    `;
    grid.appendChild(el);
  });
}

// ── Restart ──
function restart() {
  allPokemon = []; teams = []; draftedIds.clear(); snakeOrder = [];
  currentRound = 0; currentPickInRound = 0;
  curSort = 'bst-desc'; curSearch = ''; curType = '';
  document.getElementById('typeFilter').innerHTML = '<option value="">All Types</option>';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('completeScreen').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'flex';
  renderNameInputs();
}

// ── Init ──
async function init() {
  await openDB();

  const saved = loadSeason();
  if (saved) {
    const resume = confirm(
      `Resume draft? ${saved.teams.map(t => t.name).join(', ')} — Round ${saved.currentRound + 1}`
    );
    if (resume) {
      restoreSeason(saved);
      return;
    } else {
      clearSeason();
    }
  }

  updateTeamCount(4);
}

async function restoreSeason(saved) {
  numTeams = saved.numTeams;
  numRounds = saved.numRounds;
  currentRound = saved.currentRound;
  currentPickInRound = saved.currentPickInRound;
  snakeOrder = saved.snakeOrder;
  draftedIds = new Set(saved.draftedIds);

  teams = await Promise.all(saved.teams.map(async (t) => ({
    ...t,
    picks: await Promise.all(t.picks.map(id => getCachedPokemon(id))),
  })));

  await loadPokemonData(saved.currentGen);
  buildSnakeOrder();
  populateTypeFilter();

  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('draftScreen').style.display = 'flex';

  refreshHeader();
  refreshSnakeBar();
  refreshGrid();
  refreshTeams();
}

init();
