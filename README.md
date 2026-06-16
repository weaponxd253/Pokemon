# Pokémon Draft League

> Snake draft your way through the Pokémon generations. Build the strongest team, outsmart your opponents, and rule the league.

**[▶ Play the Live Demo](https://weaponxd253.github.io/Pokemon/)**

---

## What It Is

Pokémon Draft League is a browser-based snake draft simulator for 2–12 players (or CPU opponents). Each team takes turns picking Pokémon from a generation's full Pokédex in snake order — 1st picks first in odd rounds, last picks first in even rounds. Each generation draft gives every team six picks, then teams lock an active roster of six before the season plays out. Play through one generation or chain all four together into a full multi-generation season.

---

## Features

### Draft Engine
- **Snake draft order** — fully randomised first-pick order, reversed every round for fairness
- **2–12 teams** with custom names
- **Fixed 6-pick drafts** per team per generation
- **Active rosters of 6** for regular season and playoff simulations
- **CPU opponents** with a scoring heuristic that balances BST and type diversity with a jitter to keep picks unpredictable
- **Real-time draft board** showing every pick in the snake order, with the current pick highlighted

### Multi-Generation Season
- Start at any generation (Kanto, Johto, Hoenn, Sinnoh)
- After each generation's draft, a **lobby screen** shows standings ranked by total Base Stat Total and sets the next draft order — worst BST picks first, giving weaker teams the advantage
- Continue drafting through all four generations or end the season early

### Pokémon Data
- Full Pokédex data pulled live from [PokéAPI](https://pokeapi.co/)
- **IndexedDB caching** — Pokémon are fetched once and stored locally, so subsequent loads are instant
- Filter by type, search by name or Pokédex number, sort by BST or alphabetically

### Session Persistence
- Draft state is saved to `localStorage` after every pick
- Close the tab mid-draft and pick up exactly where you left off via the **Resume Season** screen
- Correctly restores to the lobby or final results screen if the draft was already complete

### Mobile Ready
- Responsive layout down to 375px
- Tab switcher on mobile separates the Pokémon grid and the Rosters panel
- After each pick, the roster briefly flashes so you can see your new addition before returning to the draft board
- Touch-friendly tap targets throughout

---

## How to Play

1. **Set up your league** — choose the number of teams, name them, toggle any to CPU, and select the starting generation
2. **Draft** — click any Pokémon card to draft it for the current team. Each team gets six picks per generation
3. **Lock active rosters** — choose the six Pokémon that will compete in the season; CPU teams auto-select theirs
4. **Simulate the season** — play through the regular season and playoffs to crown a champion
5. **Between generations** — the lobby shows standings and the next draft order

---

## Running Locally

No build step, no dependencies. Just clone and open.

```bash
git clone https://github.com/weaponxd253/Pokemon.git
cd Pokemon
# Open index.html in your browser, or serve it locally:
npx serve .
# or
python3 -m http.server
```

> **Note:** The app fetches data from PokéAPI on first load. An internet connection is required until all Pokémon for a generation are cached.

---

## Project Structure

```
├── index.html      # All screen markup (setup, draft, lobby, complete, resume)
├── styles.css      # Full UI — dark theme, responsive breakpoints, animations
├── script.js       # Draft logic, CPU AI, rendering, session save/restore
└── storage.js      # IndexedDB Pokémon cache + localStorage season state
```

---

## Tech Stack

| Layer | What |
|---|---|
| Data | [PokéAPI](https://pokeapi.co/) REST API |
| Cache | IndexedDB (via raw IDB API in `storage.js`) |
| Session | `localStorage` — serialised draft state after every pick |
| Fonts | [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) · [Rajdhani](https://fonts.google.com/specimen/Rajdhani) |
| Framework | Vanilla JS — no build tools, no dependencies |

---

## Roadmap

- [ ] Battle simulator — pit drafted teams against each other
- [ ] Expanded generation support (Gen 5–9)
- [ ] Draft history and replay
- [ ] Shareable draft results via URL

---

## Credits

Pokémon data provided by [PokéAPI](https://pokeapi.co/). Pokémon and all related names are trademarks of Nintendo / Game Freak. This project is fan-made and not affiliated with or endorsed by Nintendo.
