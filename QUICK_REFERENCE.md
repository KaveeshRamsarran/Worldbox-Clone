# 🎯 Quick Reference Guide

## Starting the Game

1. Open `launcher.html` in your browser
2. Click **"Configure & Play"**
3. Choose world **Size** and **Shape**
4. Click **"Start Game"**

---

## Main Game Controls

### Basic Controls
- **Left Click & Drag** - Paint terrain with selected brush
- **Left Click** - Spawn creatures or trigger hazards
- **Right Click** - Cancel (context menu disabled)

### Tools
| Tool | Icon | Use |
|------|------|-----|
| Terrain | 🌱💧⛰️ | Paint landscape |
| Creatures | 👤🐺🐻 | Spawn beings |
| Hazards | ☄️🌊❄️ | Trigger disasters |
| Pause | ⏸️ | Freeze simulation |
| Speed | ⚡ | Adjust game speed |

### Keyboard Shortcuts
- **Pause Button** - Pause/Resume
- **Speed Control** - Cycle speeds (0.5x, 1x, 2x, 3x)
- **Brush Size** - Adjust painting area

---

## World Sizes

```
Small     → 400×300   (25×18 tiles)   - Quick gameplay
Medium    → 1000×600  (62×37 tiles)   - Balanced
Large     → 1400×840  (87×52 tiles)   - Epic scale
Huge      → 1800×1080 (112×67 tiles)  - Maximum
```

---

## World Shapes

```
Rectangular → Classic world layout
Circular    → Round planet feeling
Island      → One main landmass
Archipelago → Multiple island chains
```

---

## Creatures & Behaviors

### Original Races
| Name | Icon | Traits |
|------|------|--------|
| Human | 👤 | Balanced, adaptable |
| Elf | 👳 | Fast, agile |
| Dwarf | 🧔 | Strong, sturdy |
| Orc | 👹 | Aggressive, powerful |
| Undead | 💀 | Immortal |

### New Animals
| Name | Icon | Traits |
|------|------|--------|
| Wolf | 🐺 | Predator, pack hunter |
| Bear | 🐻 | Apex predator, slow |
| Deer | 🦌 | Herbivore, fast |
| Eagle | 🦅 | Flying, high speed |
| Fish | 🐟 | Aquatic, water-only |

### Creature Spawning
- Click creature button (select tool)
- Click on map (spawn location)
- Creatures spawn in groups
- Hover tooltip shows creature name

---

## Disasters & Effects

### Original Hazards
| Hazard | Icon | Effect | Radius |
|--------|------|--------|--------|
| Meteor | ☄️ | Creates lava, kills creatures | Medium |
| Plague | ☠️ | Damages creature health | Medium |
| Lightning | ⚡ | Destroys terrain, kills creatures | Small |
| Volcano | 🌋 | Lava flows, extreme damage | Large |

### New Hazards
| Hazard | Icon | Effect | Radius |
|--------|------|--------|--------|
| Tsunami | 🌊 | Floods terrain, water spread | Large |
| Blizzard | ❄️ | Slows creatures, damage | Medium |
| Earthquake | 📍 | Shuffles terrain randomly | Large |
| Wildfire | 🔥 | Burns vegetation, spreads | Medium |

### Triggering Hazards
1. Click hazard button
2. Click map location
3. Watch effects expand from center
4. Effects vary by hazard type

---

## Terrain Types

| Type | Icon | Color | Use |
|------|------|-------|-----|
| Grass | 🌱 | Green | Basic terrain |
| Dirt | 🟫 | Brown | Natural land |
| Stone | ⬜ | Gray | Rocky areas |
| Sand | 🟨 | Yellow | Beaches/deserts |
| Water | 💧 | Blue | Rivers/oceans |
| Lava | 🔥 | Red | Volcanic danger |
| Forest | 🌲 | Dark Green | Dense woodland |
| Mountain | ⛰️ | Dark Gray | High peaks |

---

## Sprite Editor

### Access
- **From Launcher:** Click "🎨 Sprite Editor"
- **From Game:** Click "🎨 Sprite Editor" in Actions

### Tools
| Tool | Icon | Function |
|------|------|----------|
| Pen | ✏️ | Draw pixels |
| Eraser | 🗑️ | Remove pixels |
| Bucket Fill | 🪣 | Fill areas |
| Pick Color | 🎯 | Copy color |

### Color Palettes
- **8 Basic:** Black, White, Red, Green, Blue, Yellow, Magenta, Cyan
- **8 Sprite:** Grass Green, Brown, Grays, Water Blue, Gold, Lava Orange

### Workflow
1. Set grid size (8-32 pixels)
2. Select color
3. Choose tool
4. Draw on canvas
5. Name sprite
6. Save to game
7. Download as PNG (optional)

### Color Hex Codes (Common)
```
#000000 - Black          #FFFFFF - White
#FF0000 - Red            #00FF00 - Green
#0000FF - Blue           #FFFF00 - Yellow
#4CAF50 - Grass Green    #8B7355 - Brown
#2196F3 - Water Blue     #FFD700 - Gold
#FF6B35 - Lava Orange    #808080 - Gray
```

---

## Statistics Panel

Displays real-time counts:
- **Population:** Total creatures
- **By Type:** Individual species counts
- **Year:** In-game time progression

Updates every frame as creatures are born/die.

---

## Game Settings

### Speed Control
```
0.5x  → Half speed (slow-motion)
1.0x  → Normal speed
2.0x  → Double speed
3.0x  → Triple speed (fast)
```

### Brush Size
```
1  → Single pixel
3  → Small area
5  → Medium area
10 → Large area
20 → Huge area
```

---

## Tips & Tricks

### Gameplay
- **Pause for Planning** - Stop time to design large areas
- **Use Disasters** - Create dramatic landscape changes
- **Monitor Stats** - Watch population trends
- **Mix Creatures** - Interesting ecosystems need variety

### Sprite Creation
- **Start Small** - 8×8 or 16×16 pixels
- **Use Contrast** - Distinct colors for clarity
- **Test Preview** - Check appearance before saving
- **Name Uniquely** - Avoid conflicts

### World Building
- **Small Worlds** - Easy to manage
- **Circular Shapes** - Natural boundaries
- **Island Chains** - Isolated populations
- **Archipelago** - Interesting topology

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Creatures not moving | Check game isn't paused |
| Sprites not showing | Ensure browser supports Canvas 2D |
| Slow performance | Reduce world size or creature count |
| Sprites not saving | Check browser storage isn't full |
| Changes lost | Browser may have cleared data |

---

## Keyboard Shortcuts Summary

| Action | Method |
|--------|--------|
| Pause/Resume | Click pause button |
| Change Speed | Click speed button / drag slider |
| Adjust Brush Size | Drag size slider |
| Access Sprite Editor | Click editor button |
| Clear Canvas | Use Clear World button |
| Generate Terrain | Use Generate Terrain button |

---

## Files Overview

| File | Purpose |
|------|---------|
| `launcher.html` | Game start screen |
| `index.html` | Main game interface |
| `spriteEditor.html` | Pixel art editor |
| `game.js` | Game logic & updates |
| `spriteGenerator.js` | Sprite rendering |
| `styles.css` | Visual styling |
| `EXPANSION_GUIDE.md` | Detailed features |
| `EXPANSION_SUMMARY.md` | Quick overview |

---

## Getting Help

### Documentation Files
- `README.md` - Original game info
- `FEATURES.md` - Feature list
- `EXPANSION_GUIDE.md` - New features guide
- `CUSTOMIZATION.md` - Modification guide
- `SETUP.md` - Installation guide

### Tips
- Hover over buttons for tooltips
- Check World Stats for real-time info
- Use pause to plan complex worlds
- Try each creature and hazard type

---

## Quick Start Scenario

1. **Open:** launcher.html
2. **Configure:** Large size, Rectangular shape
3. **Generate:** Start with "Generate Terrain"
4. **Spawn:** Add humans, elves, wolves, deer
5. **Observe:** Watch ecosystem develop
6. **Intervene:** Trigger a disaster!
7. **Create:** Make custom sprite in editor
8. **Repeat:** Start new world with different settings

---

**Have fun! 🌍✨**
