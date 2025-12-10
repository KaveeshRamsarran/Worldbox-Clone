# Technical Architecture - Phase 2

## System Overview

The Worldbox Clone is built on an entity-component system with procedural world generation and real-time simulation.

```
┌─────────────────────────────────────────────────────────────┐
│                    Game Loop (RAF)                           │
│  • Update State (creatures, buildings, particles)           │
│  • Check Collisions & Interactions                          │
│  • Spawn New Entities                                        │
│  • Render to Canvas                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. World Grid (`game.js`)

```javascript
this.grid = [
  [
    {
      type: 'grass',           // terrain type
      height: 0,               // elevation (unused currently)
      temperature: 70,         // environmental (unused currently)
      humidity: 50,            // environmental (unused currently)
      hasForest: false,        // tree property
      isMountain: false,       // collision property
      isValidTile: true        // world shape validation
    },
    // ...
  ],
  // ...
]
```

**Grid Dimensions:**
- Small: 25 x 18 (400x300 pixels)
- Medium: 62 x 37 (1000x600 pixels) - Default
- Large: 87 x 52 (1400x840 pixels)
- Huge: 112 x 67 (1800x1080 pixels)

**Tile Types:**
- **Terrain**: grass, dirt, stone, sand, water, lava, forest, mountain
- **Buildings**: house, road, townhall
- **Properties**: Each tile can be painted or generated

### 2. Creatures (`game.js`)

```javascript
creature = {
  x: number,                   // float position (not grid-aligned)
  y: number,
  type: string,               // human|elf|dwarf|orc|undead|wolf|bear|deer|eagle|fish
  age: number,                // frames lived
  energy: number,             // 0-200+, decreases over time
  speed: number,              // pixels per frame (0.5-1.0)
  direction: number,          // radians (0-2π)
  health: number              // 0-100
}
```

**Lifespan:**
- Creatures age every frame
- Death triggers: energy ≤ 0, age > 1000, health ≤ 0
- Removed from creatures array when dead

**Movement:**
1. Calculate next position based on direction and speed
2. Check collision at destination tile
3. If valid: update position, apply terrain effects
4. If blocked: pick new random direction

**Interactions:**
- Water: -0.2 energy per frame
- Lava: -10 health per frame
- Reproduction: Energy > 150 && random < 0.001

### 3. Buildings (`game.js`)

```javascript
building = {
  x: number,                  // grid x position
  y: number,                  // grid y position
  type: string,               // house|road|townhall
  owner: string,              // race that built it: human|elf|dwarf|orc|undead
  age: number,                // frames since construction
  population: number          // for houses only (0-8)
}
```

**Construction Rules:**
- Only on grass or sand tiles
- Cannot overlap existing buildings
- No building on water, lava, mountains, or invalid tiles
- Coordinates must be within world bounds

**Building Types:**
- **House**: maxPopulation=8, starts with population=3, visual indicator
- **Road**: no special properties, visual pathway
- **Town Hall**: administrative center, no population

### 4. Particles (`game.js`)

```javascript
particle = {
  x: number,                  // position
  y: number,
  life: number,               // frames remaining (0-30)
  type: string                // fire|spark|water|snow|dust
}
```

**Created By:**
- Volcano eruptions (fire particles)
- Lightning strikes (spark particles)
- Tsunami waves (water particles)
- Blizzards (snow particles)
- Meteor impacts (dust particles)

---

## Game Loop Details

### `updateGame()` Method (game.js, lines 590-770)

**Execution Order:**

1. **Skip if Paused**: Return early if game is paused

2. **Update Creatures Loop** (for each creature):
   - Increment age
   - Decrease energy
   - Chance to change direction (2%)
   - **Collision Detection**:
     - Calculate next position
     - Check bounds
     - Check world shape validity
     - Check terrain type (block mountains)
     - Conditional position update or redirect
   - Apply terrain effects (water slow, lava damage)
   - Reproduction check (when energy > 150)
   - Death check (remove if dead)

3. **Update Particles Loop**:
   - Decrement life
   - Remove if life ≤ 0

4. **Update Buildings**:
   - Call `updateBuildings()` method
   - Humanoid creatures randomly construct

5. **Random Spawning** (every 2 seconds):
   - Count creatures by type
   - Check spawn probability (30%)
   - Verify population under cap (150 total)
   - Check type-specific limits
   - Find valid spawn location
   - Call `spawnCreature()`

6. **Year Counter** (every 60 frames = 1 second):
   - Increment year

7. **Update Statistics**:
   - Count creatures by type
   - Update UI elements

### `updateBuildings()` Method (game.js, lines 313-336)

**Execution Order:**

1. Loop through all creatures
2. Filter for humanoids only (5 races)
3. For each humanoid:
   - Random probability check (0.0001)
   - If triggered:
     - Calculate random nearby tile (±2.5 tiles)
     - Decide building type (70% house, 20% road, 10% townhall)
     - Call `constructBuilding()`

**Spawn Limits:**
- Humans: 30
- Elves: 25
- Dwarves: 20
- Orcs: 20
- Undead: 15
- Wolves: 15
- Bears: 8
- Deer: 25
- Eagles: 12
- Fish: 30

### Collision Detection (game.js, lines 669-688)

```javascript
// Calculate destination
const nextX = c.x + Math.cos(c.direction) * c.speed;
const nextY = c.y + Math.sin(c.direction) * c.speed;

// Get grid coordinates
const nextTileX = Math.floor(nextX);
const nextTileY = Math.floor(nextY);

// Validation checks
let canMove = true;

// 1. Bounds check
if (nextTileX < 0 || nextTileX >= gridWidth || 
    nextTileY < 0 || nextTileY >= gridHeight) {
  canMove = false;
}

// 2. World shape check
if (!this.isValidTile(nextTileX, nextTileY)) {
  canMove = false;
}

// 3. Terrain type check
if (canMove && grid[nextTileY][nextTileX].type === 'mountain') {
  canMove = false;
}

// Apply result
if (canMove) {
  c.x = nextX;
  c.y = nextY;
} else {
  c.direction = Math.random() * Math.PI * 2;  // New random direction
}
```

---

## Rendering Pipeline

### `render()` Method (game.js, lines 821-920)

**Execution Order:**

1. **Clear Canvas**: Fill with black (#0a0a0a)

2. **Draw Grid** (for each tile):
   - Check if tile is valid for world shape
   - If invalid: draw void (black)
   - If valid: get sprite and draw at position

3. **Draw Creatures** (for each creature):
   - Get sprite
   - Draw at floor(x) * tileSize, floor(y) * tileSize
   - If health < 50: draw red health bar above

4. **Draw Buildings** (for each building):
   - Get sprite
   - Draw at x * tileSize, y * tileSize
   - If house with population: draw population number

5. **Draw Particles** (for each particle):
   - Calculate alpha based on remaining life
   - Draw small colored square at position
   - Color varies by type (fire=orange, spark=yellow, etc.)

6. **FPS Counter**: Calculate and display frames per second

---

## Sprite Generation System

### `SpriteGenerator` Class (spriteGenerator.js)

**Architecture:**
```
SpriteGenerator
├── Terrain Sprites (8)
│   ├── generateGrass()
│   ├── generateDirt()
│   ├── generateStone()
│   ├── generateSand()
│   ├── generateWater()
│   ├── generateLava()
│   ├── generateForest()
│   └── generateMountain()
├── Building Sprites (3)
│   ├── generateHouse()
│   ├── generateRoad()
│   └── generateTownHall()
├── Humanoid Sprites (5)
│   ├── generateHuman()
│   ├── generateElf()
│   ├── generateDwarf()
│   ├── generateOrc()
│   └── generateUndead()
├── Animal Sprites (5)
│   ├── generateWolf()
│   ├── generateBear()
│   ├── generateDeer()
│   ├── generateEagle()
│   └── generateFish()
└── Custom Sprites (from localStorage)
```

**Sprite Dimensions:**
- All sprites: 16x16 pixels
- Canvas scaling: Rendered at tileSize (16 pixels) in game

**Custom Sprite Loading:**
```javascript
loadCustomSprites() {
  // Find all items with key 'sprite_*'
  // Parse JSON data
  // Reconstruct canvas from pixel data
  // Store in this.sprites[name]
}
```

---

## Data Flow Diagram

```
User Input (Mouse Click)
  ↓
setupEventListeners() - routes to appropriate handler
  ├→ spawnCreature() - add to creatures array
  ├→ triggerHazard() - create particles, damage creatures
  ├→ paintTerrain() - update grid tiles
  └→ constructBuilding() - add to buildings array
  ↓
requestAnimationFrame()
  ↓
updateGame()
  ├→ Update all creatures
  │   ├→ Movement with collision
  │   ├→ Energy/health
  │   ├→ Death check
  │   └→ Reproduction
  ├→ Update all particles
  ├→ Update all buildings
  │   └→ Humanoids build randomly
  ├→ Random spawning
  └→ Statistics update
  ↓
render()
  ├→ Draw grid (terrain)
  ├→ Draw creatures
  ├→ Draw buildings
  └→ Draw particles
  ↓
Visual Output (Canvas)
```

---

## Performance Optimizations

### Current Approaches:

1. **Collision Detection**: Only checked on movement, not every frame
2. **Spawn Checking**: Limited to every 120 frames (2 second intervals)
3. **Building Updates**: Only check humanoid creatures (5 types)
4. **Spawn Attempts**: Limited to 10 attempts per spawn event
5. **Particle Cleanup**: Removed immediately when life ≤ 0

### Time Complexity:

- **Update Creatures**: O(n) where n = number of creatures
- **Update Buildings**: O(h*m) where h = humanoids, m = buildings
- **Update Particles**: O(p) where p = number of particles
- **Collision Check**: O(1) - single tile lookup
- **Spawn Check**: O(n*10) max per check = O(n)
- **Rendering**: O(w*h + c + b + p) where w/h = grid, c/b/p = entities

### Memory Usage:

- **Grid**: ~400-2000 tiles = ~20-100 KB (small data)
- **Creatures**: ~100 max = ~5 KB
- **Buildings**: ~20 avg = ~1 KB
- **Particles**: ~100 max = ~3 KB
- **Sprites**: ~16 sprites @ 16x16px = ~16 KB total

**Total**: ~50-150 KB typical, well within browser memory

---

## Event Handling

### Mouse Events (index.html):

```
mousedown → Track initial position
mousemove → Apply brush while held
mouseup → Stop applying brush
```

### Brush Types:

- **Terrain Painting**: Modify grid tiles in brush radius
- **Creature Spawning**: Create creatures near click
- **Hazard Triggering**: Create particles and damage

### Brush Radius:
- Default: 3 tiles
- Adjustable: 1-10 tiles via slider

---

## World Generation Algorithm

### Shape Validation (`isValidTile(x, y)`):

**Rectangular**:
```
Always true (entire map is valid)
```

**Circular**:
```
distance from center < 90% of min(width/2, height/2)
```

**Island**:
```
distance from center < 70% of min(width/2, height/2)
```

**Archipelago**:
```
(distance % 30) < 15  // Creates ring pattern
```

### Initial Generation:

1. Create grid with all tiles set to 'grass'
2. Apply noise function for terrain variation (in future)
3. Place mountains at random (in future)
4. Initialize creatures array (empty)
5. Wait for first spawn event or user action

---

## State Management

### SessionStorage (Launcher):
```javascript
{
  "worldSize": "medium",      // small|medium|large|huge
  "worldShape": "rectangular" // rectangular|circular|island|archipelago
}
```

### LocalStorage (Sprite Editor):
```javascript
{
  "sprite_customName1": {JSON sprite data},
  "sprite_customName2": {JSON sprite data},
  // ...
}
```

### Game State (In Memory):
```javascript
{
  world: grid,
  creatures: [array],
  buildings: [array],
  particles: [array],
  year: number,
  gameSpeed: number,
  isPaused: boolean
}
```

---

## Extensibility Points

### Adding New Creature Types:

1. Add sprite generator method in `spriteGenerator.js`
2. Add to `generateAllSprites()`
3. Add to spawn limits in `updateGame()`
4. Create UI button in `index.html` if desired

### Adding New Building Types:

1. Create sprite generator method
2. Add to `generateAllSprites()`
3. Create `constructBuilding()` handling
4. Update building rendering logic if special effects needed

### Adding New Hazards:

1. Create particle generation method (e.g., `createMyHazard()`)
2. Add to `triggerHazard()` switch statement
3. Create button in `index.html` if desired
4. Define particle effects and damage logic

### Adding New Terrain Types:

1. Create sprite generator method
2. Add to `generateAllSprites()`
3. Handle in collision detection if needed
4. Create UI brush button if paintable

---

## Known Limitations & Future Work

### Current Limitations:

1. **No Food Chain**: Creatures don't eat each other despite spawn
2. **No Resource System**: Buildings don't provide resources
3. **No Road Effects**: Creatures same speed on roads and grass
4. **No AI**: No pathfinding, purely random movement
5. **No Persistence**: Game state not saved (would need localStorage)
6. **No Sound**: Audio system not implemented
7. **No Multiplayer**: Single-player only

### Potential Improvements:

1. **Better Pathfinding**: A* algorithm to roads and buildings
2. **Resource Management**: Food production, trade, consumption
3. **Technology Trees**: Civilizations advance through ages
4. **Expanded Building Types**: Farms, walls, watchtowers, temples
5. **Disaster Chains**: Earthquakes trigger tsunamis, etc.
6. **Weather System**: Rain, snow, wind affecting behavior
7. **Save/Load**: Game state persistence
8. **Modding API**: Allow custom creatures, buildings, hazards

---

## Testing Checklist

### Functionality:
- [ ] Creatures spawn and move correctly
- [ ] Collision prevents mountain penetration
- [ ] Terrain effects (water slow, lava damage) work
- [ ] Buildings construct automatically
- [ ] Buildings display correctly
- [ ] Particles create and fade properly
- [ ] Population stats update accurately
- [ ] All hazards trigger as expected

### Performance:
- [ ] FPS stable at 30-60 with 100+ creatures
- [ ] No memory leaks over time
- [ ] Spawn system respects limits
- [ ] Grid rendering efficient

### Visuals:
- [ ] All sprites render correctly
- [ ] Buildings don't overlap rendering issues
- [ ] Particles visible and appropriate
- [ ] UI responsive

---

## Debugging Tips

### Common Issues:

**Creatures stuck on terrain:**
- Check collision detection logic
- Verify `isValidTile()` functioning
- Monitor direction changes

**Buildings not appearing:**
- Check `updateBuildings()` called
- Verify `constructBuilding()` logic
- Check building rendering in `render()`

**Spawning not working:**
- Check spawn probability tuning
- Verify population count tracking
- Check spawn limit enforcement

**Performance degradation:**
- Profile with browser DevTools
- Check number of entities
- Look for memory leaks

### Useful Console Commands:

```javascript
// Check game state
console.log(window.game.creatures.length);    // Creature count
console.log(window.game.buildings.length);    // Building count
console.log(window.game.grid[0][0]);         // Tile info

// Manually trigger events
window.game.spawnCreature(50, 50, 'human', 10);
window.game.triggerHazard(50, 50, 'meteor');
window.game.constructBuilding(30, 30, 'house', 'human');
```

---

## Code Quality

### Style Guidelines:

- **Naming**: camelCase for variables/methods, PascalCase for classes
- **Indentation**: 4 spaces
- **Comments**: Clear explanations for complex logic
- **File Organization**: Grouped by functionality
- **Error Handling**: Graceful degradation, no hard crashes

### Testing:

- Manual gameplay testing
- Browser console monitoring
- Performance profiling
- Edge case verification

---

This technical documentation should serve as a reference for understanding, extending, and maintaining the Worldbox Clone Phase 2 codebase.
