# Developer Quick Reference - Phase 2

## 🛠️ Quick Code Reference

### Adding a New Creature Type

#### Step 1: Create Sprite
```javascript
// In spriteGenerator.js
generateMyCreature() {
    const canvas = this.createCanvas();
    const ctx = canvas.getContext('2d');
    
    // Draw your creature here
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 16, 16);
    
    return canvas;
}
```

#### Step 2: Register Sprite
```javascript
// In generateAllSprites() method
this.sprites.mycreature = this.generateMyCreature();
```

#### Step 3: Add to Spawn System
```javascript
// In updateGame(), random spawning section
const spawnLimits = {
    // ... existing creatures ...
    'mycreature': 20  // Add this line
};
```

#### Step 4: Add UI Button (optional)
```html
<!-- In index.html -->
<button onclick="game.currentCreature = 'mycreature'; game.spawnCreature(50, 50, 'mycreature', 5);">
    My Creature
</button>
```

---

### Adding a New Building Type

#### Step 1: Create Sprite
```javascript
// In spriteGenerator.js
generateMyBuilding() {
    const canvas = this.createCanvas();
    const ctx = canvas.getContext('2d');
    
    // Draw your building
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(0, 0, 16, 16);
    
    return canvas;
}
```

#### Step 2: Register Sprite
```javascript
// In generateAllSprites()
this.sprites.mybuilding = this.generateMyBuilding();
```

#### Step 3: Update constructBuilding()
```javascript
// In constructBuilding() method
if (buildingType === 'mybuilding') {
    building.specialProperty = value;  // Add custom properties
    tile.type = 'mybuilding';
}
```

#### Step 4: Update Rendering
```javascript
// In render() - buildings section
if (b.type === 'mybuilding') {
    // Custom rendering if needed
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.fillText('Special', b.x * 16, b.y * 16);
}
```

---

### Adding a New Hazard

#### Step 1: Create Handler
```javascript
// In game.js
myHazard(x, y, radius) {
    // Create particles
    for (let i = 0; i < 20; i++) {
        this.particles.push({
            x: x + (Math.random() - 0.5) * radius,
            y: y + (Math.random() - 0.5) * radius,
            life: 30,
            type: 'mytype'
        });
    }
    
    // Damage creatures in radius
    this.creatures.forEach(c => {
        const dist = Math.hypot(c.x - x, c.y - y);
        if (dist < radius) {
            c.health -= 20;
        }
    });
}
```

#### Step 2: Register in triggerHazard()
```javascript
// In triggerHazard() switch statement
case 'myhazard':
    this.myHazard(x, y, radius);
    break;
```

#### Step 3: Add Particle Color
```javascript
// In render() - particle rendering
} else if (p.type === 'mytype') {
    this.ctx.fillStyle = `rgba(255, 128, 0, ${alpha})`;
}
```

#### Step 4: Add UI Button (optional)
```html
<!-- In index.html -->
<button onclick="game.triggerHazard(Math.random() * game.gridWidth, Math.random() * game.gridHeight, 'myhazard');">
    My Hazard
</button>
```

---

### Adding a New Terrain Type

#### Step 1: Create Sprite
```javascript
// In spriteGenerator.js
generateMyTerrain() {
    const canvas = this.createCanvas();
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 16, 16);
    
    return canvas;
}
```

#### Step 2: Register Sprite
```javascript
// In generateAllSprites()
this.sprites.myterrain = this.generateMyTerrain();
```

#### Step 3: Add to Paintable Brushes (optional)
Update `index.html` with terrain button if desired.

#### Step 4: Handle in Collision (if blocking)
```javascript
// In collision detection
if (nextTile.type === 'myterrain' && shouldBlock) {
    canMove = false;
}
```

---

## 🔄 Common Modifications

### Changing Spawn Limits
```javascript
// In updateGame(), around line 730
const spawnLimits = {
    'human': 30,    // Change these numbers
    'elf': 25,      // to adjust populations
    // ...
};
```

### Adjusting Collision Detection
```javascript
// In updateGame(), around line 675
if (nextTile.type === 'mountain') {
    canMove = false;  // Change blocking behavior
}
```

### Modifying Building Construction Frequency
```javascript
// In updateBuildings(), around line 320
if (Math.random() < 0.0001) {  // Change 0.0001 (less = rarer)
    // building construction code
}
```

### Changing Game Speed
```javascript
// In UI or updateGame()
this.gameSpeed = 2;  // Default 1, higher = faster
```

### Adjusting Building Probability Distribution
```javascript
// In updateBuildings(), around line 330
const buildType = 
    Math.random() < 0.7 ? 'house' :       // 70% houses
    (Math.random() < 0.8 ? 'road' :       // 20% roads
     'townhall');                          // 10% town halls
```

---

## 📊 Key Data Structures

### Creature Object
```javascript
{
    x: number,           // Position (float)
    y: number,
    type: string,        // Creature type
    age: number,         // Frames lived
    energy: number,      // 0-200+
    speed: number,       // Pixels per frame
    direction: number,   // Radians 0-2π
    health: number       // 0-100
}
```

### Building Object
```javascript
{
    x: number,           // Grid position
    y: number,
    type: string,        // Building type
    owner: string,       // Race that built it
    age: number,         // Frames since construction
    population: number   // For houses (0-8)
}
```

### Particle Object
```javascript
{
    x: number,           // Position (grid)
    y: number,
    life: number,        // Frames remaining
    type: string         // Particle effect type
}
```

### Tile Object
```javascript
{
    type: string,        // Terrain/building type
    height: number,      // Elevation (unused)
    temperature: number, // Environment (unused)
    humidity: number,    // Environment (unused)
    hasForest: boolean,
    isMountain: boolean,
    isValidTile: boolean // World shape validation
}
```

---

## 🔍 Debugging Helpers

### Check Game State
```javascript
// In browser console
window.game.creatures.length              // Creature count
window.game.buildings.length              // Building count
window.game.grid[y][x]                   // Tile info
window.game.particles.length              // Particle count
window.game.year                          // Game year
```

### Manually Spawn
```javascript
// In console
window.game.spawnCreature(50, 50, 'human', 10);
window.game.constructBuilding(30, 30, 'house', 'human');
window.game.triggerHazard(40, 40, 'meteor');
```

### Toggle Pause
```javascript
window.game.togglePause();
```

### Set Game Speed
```javascript
window.game.gameSpeed = 5;  // Fast forward
```

### Clear Creatures
```javascript
window.game.creatures = [];
```

### Check Collision
```javascript
const x = 50, y = 50;
const tile = window.game.grid[Math.floor(y)][Math.floor(x)];
console.log(tile.type);  // See what's there
```

---

## 🎨 Sprite Creation Guide

### Canvas Setup
```javascript
const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
```

### Basic Drawing Commands
```javascript
// Fill rectangle
ctx.fillStyle = '#FF0000';
ctx.fillRect(x, y, width, height);

// Draw circle
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();

// Draw triangle
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.lineTo(x3, y3);
ctx.fill();

// Clear area
ctx.clearRect(x, y, width, height);
```

### Color Guidelines
- **Skin**: #F4A460, #FDBCB4
- **Wood**: #8B6F47, #CD853F
- **Stone**: #A9A9A9, #696969
- **Nature**: #4CAF50, #388E3C
- **Water**: #87CEEB, #4169E1

---

## ⚡ Performance Tips

### Optimize Loops
```javascript
// Bad: Check every creature every frame
for (let c of creatures) {
    doExpensiveCheck();
}

// Good: Limit expensive operations
if (updateCounter % 10 === 0) {  // Only every 10 frames
    for (let c of creatures) {
        doExpensiveCheck();
    }
}
```

### Cache Values
```javascript
// Bad: Recalculate every iteration
for (let i = 0; i < array.length; i++) {
    const length = array.length;  // Recalculated
}

// Good: Cache values
const len = array.length;
for (let i = 0; i < len; i++) {
}
```

### Avoid Creating Objects in Loops
```javascript
// Bad: New object every iteration
for (let i = 0; i < 100; i++) {
    const obj = {};  // 100 new objects
}

// Good: Reuse or create outside
const obj = {};
for (let i = 0; i < 100; i++) {
    obj.value = i;
}
```

---

## 🧪 Testing Checklist

### When Adding New Feature:
- [ ] No syntax errors
- [ ] Functionality works as intended
- [ ] Doesn't break existing features
- [ ] Performance acceptable
- [ ] No memory leaks
- [ ] Error handling in place
- [ ] Documented in code
- [ ] Tested with multiple scenarios

---

## 📚 File Quick Reference

| Need | File | Lines |
|------|------|-------|
| Sprite | spriteGenerator.js | 100-900 |
| Game Logic | game.js | 1-950 |
| UI | index.html | 1-168 |
| Styling | styles.css | 1-200 |
| Launcher | launcher.html | 1-362 |

---

## 🚀 Common Tasks

### To Add 10 More Creatures:
1. Create sprite generator (5 min each = 50 min)
2. Register in generateAllSprites (1 min)
3. Add to spawn limits (1 min)
4. Create UI buttons (5 min)
5. **Total: ~1 hour**

### To Add 5 New Hazards:
1. Create hazard method (10 min each = 50 min)
2. Register in triggerHazard (1 min)
3. Create particles (5 min)
4. Create UI buttons (5 min)
5. **Total: ~1 hour**

### To Add Trading System:
1. Design trading logic (30 min)
2. Implement pathfinding (1 hour)
3. Create trade mechanics (1 hour)
4. Test and debug (30 min)
5. **Total: ~3 hours**

---

## 🎓 Code Examples

### Simple Creature Behavior
```javascript
// Random walk
if (Math.random() < 0.02) {
    creature.direction = Math.random() * Math.PI * 2;
}
creature.x += Math.cos(creature.direction) * creature.speed;
creature.y += Math.sin(creature.direction) * creature.speed;
```

### Damage in Radius
```javascript
creatures.forEach(c => {
    const dist = Math.hypot(c.x - centerX, c.y - centerY);
    if (dist < radius) {
        c.health -= damage;
    }
});
```

### Particle Trail
```javascript
for (let i = 0; i < 5; i++) {
    particles.push({
        x: creature.x,
        y: creature.y,
        life: 20,
        type: 'dust'
    });
}
```

---

## 🔗 Quick Links

- **Main Game**: index.html
- **Launcher**: launcher.html
- **Core Logic**: game.js
- **Graphics**: spriteGenerator.js
- **Styling**: styles.css
- **Sprite Editor**: spriteEditor.html

---

## 💡 Pro Tips

1. **Use Console Logging**: `console.log(variable)` for debugging
2. **Test Incrementally**: Build and test small changes
3. **Comment Your Code**: Future you will thank you
4. **Use Meaningful Names**: `creatureHealth` not `ch`
5. **Keep Methods Small**: One job per method
6. **Version Control**: Use Git to track changes
7. **Profile Performance**: Use browser DevTools

---

## 🆘 Common Issues & Fixes

### Issue: New creatures not appearing
**Fix**: Check if registered in `generateAllSprites()` and spawn limits added

### Issue: Sprite looks wrong
**Fix**: Verify canvas is 16x16 and fillRect/drawImage coordinates are correct

### Issue: Building not rendering
**Fix**: Check if sprite registered and building rendering code is in render()

### Issue: Performance drops
**Fix**: Check for expensive loops, reduce particle count, limit updates

### Issue: Collision not working
**Fix**: Verify terrain type check, ensure canMove logic is correct

---

**Happy Coding! 🚀**

For more details, see TECHNICAL_ARCHITECTURE.md
