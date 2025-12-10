// Main Game Logic
class WorldboxGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Load settings from sessionStorage
        const settings = JSON.parse(sessionStorage.getItem('gameSettings') || '{"worldSize":"medium","worldShape":"rectangular"}');
        this.worldSize = settings.worldSize;
        this.worldShape = settings.worldShape;
        
        // Set canvas size based on world size
        this.setCanvasSize();
        
        // Game state
        this.tileSize = 16;
        this.gridWidth = Math.floor(this.canvas.width / this.tileSize);
        this.gridHeight = Math.floor(this.canvas.height / this.tileSize);
        
        this.grid = [];
        this.creatures = [];
        this.particles = [];
        this.buildings = [];  // Array to store buildings
        
        this.isPaused = false;
        this.gameSpeed = 1;
        this.year = 0;
        this.updateCounter = 0;
        
        // UI state
        this.currentBrush = 'grass';
        this.currentCreature = 'human';
        this.currentHazard = null;
        this.brushSize = 3;
        
        // Sprite generator
        this.spriteGen = new SpriteGenerator();
        
        // FPS tracking
        this.frameCount = 0;
        this.lastFpsTime = Date.now();
        this.fps = 0;
        
        this.initializeGrid();
        this.setupEventListeners();
        this.setupUI();
        this.startGameLoop();
    }

    static getInstance() {
        if (!WorldboxGame.instance) {
            WorldboxGame.instance = new WorldboxGame();
        }
        return WorldboxGame.instance;
    }

    setCanvasSize() {
        const sizes = {
            small: { width: 400, height: 300 },
            medium: { width: 1000, height: 600 },
            large: { width: 1400, height: 840 },
            huge: { width: 1800, height: 1080 }
        };
        
        const size = sizes[this.worldSize] || sizes.medium;
        this.canvas.width = size.width;
        this.canvas.height = size.height;
    }

    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                const isValid = this.isValidTile(x, y);
                
                // Generate terrain based on noise-like pattern
                let terrainType = 'water';
                if (isValid) {
                    const noiseValue = this.perlinLike(x, y);
                    if (noiseValue < 0.3) {
                        terrainType = 'sand';
                    } else if (noiseValue < 0.6) {
                        terrainType = 'grass';
                    } else if (noiseValue < 0.8) {
                        terrainType = 'forest';
                    } else {
                        terrainType = 'mountain';
                    }
                }
                
                this.grid[y][x] = {
                    type: terrainType,
                    height: 0,
                    temperature: 70,
                    humidity: 50,
                    hasForest: terrainType === 'forest',
                    isMountain: terrainType === 'mountain',
                    isValidTile: isValid
                };
            }
        }
    }

    // Simple Perlin-like noise generator
    perlinLike(x, y) {
        const scale = 0.05;
        const n = Math.sin(x * scale) * Math.cos(y * scale) + Math.sin((x + y) * scale * 0.7) * Math.cos((x - y) * scale * 0.7);
        return (n + 2) / 4; // Normalize to 0-1
    }

    isValidTile(x, y) {
        if (this.worldShape === 'rectangular') {
            return true; // All tiles are valid land
        }
        
        const centerX = this.gridWidth / 2;
        const centerY = this.gridHeight / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        switch (this.worldShape) {
            case 'circular':
                return dist < Math.min(centerX, centerY) * 0.9;
            case 'island':
                return dist < Math.min(centerX, centerY) * 0.7;
            case 'archipelago':
                const islandDist = dist % 30;
                return islandDist < 15;
            default:
                return true;
        }
        // Invalid tiles will be automatically filled with water in initializeGrid
    }

    setupEventListeners() {
        // Canvas interaction
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
        this.canvas.addEventListener('mouseleave', () => this.isDrawing = false);

        // Brush selection
        document.querySelectorAll('.brush-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectBrush(e.target.closest('.brush-btn')));
        });

        // Creature selection
        document.querySelectorAll('.creature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCreature(e.target.closest('.creature-btn')));
        });

        // Hazard selection
        document.querySelectorAll('.hazard-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectHazard(e.target.closest('.hazard-btn')));
        });

        // Tool buttons - find pause button
        const pauseBtn = document.querySelector('[data-tool]');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }

        // Speed control
        document.getElementById('speed').addEventListener('change', (e) => {
            this.gameSpeed = parseFloat(e.target.value);
            document.getElementById('speedDisplay').textContent = e.target.value + 'x';
        });

        // Brush size
        document.getElementById('brushSize').addEventListener('change', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('brushSizeDisplay').textContent = e.target.value;
        });

        // Action buttons
        document.getElementById('clearBtn').addEventListener('click', () => this.clearWorld());
        document.getElementById('generateBtn').addEventListener('click', () => this.generateTerrain());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('spriteEditorBtn').addEventListener('click', () => window.open('spriteEditor.html', '_blank'));
    }

    setupUI() {
        // Initialize tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Default select grass brush
        document.querySelector('[data-brush="grass"]').classList.add('selected');
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    selectBrush(btn) {
        document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentBrush = btn.dataset.brush;
        this.currentCreature = null;
        this.currentHazard = null;
    }

    selectCreature(btn) {
        document.querySelectorAll('.creature-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentCreature = btn.dataset.creature;
        this.currentBrush = null;
        this.currentHazard = null;
    }

    selectHazard(btn) {
        document.querySelectorAll('.hazard-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentHazard = btn.dataset.hazard;
        this.currentBrush = null;
        this.currentCreature = null;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update crosshair
        document.querySelector('.crosshair').style.left = (x - 15) + 'px';
        document.querySelector('.crosshair').style.top = (y - 15) + 'px';

        // Update info bar
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        document.getElementById('mouseInfo').textContent = `X: ${gridX}, Y: ${gridY}`;

        // Handle continuous drawing
        if (this.isDrawing) {
            this.drawOnGrid(gridX, gridY);
        }
    }

    handleMouseDown(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        this.drawOnGrid(gridX, gridY);
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);

        if (this.currentCreature) {
            this.spawnCreature(gridX, gridY, this.currentCreature, 5);
        } else if (this.currentHazard) {
            this.triggerHazard(gridX, gridY, this.currentHazard);
        }
    }

    drawOnGrid(centerX, centerY) {
        const radius = this.brushSize;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = centerX + dx;
                const y = centerY + dy;

                if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
                    if (this.currentBrush) {
                        this.grid[y][x].type = this.currentBrush;
                        this.grid[y][x].hasForest = this.currentBrush === 'forest';
                        this.grid[y][x].isMountain = this.currentBrush === 'mountain';
                    }
                }
            }
        }
    }

    spawnCreature(x, y, type, count = 1) {
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 5;
            const offsetY = (Math.random() - 0.5) * 5;
            const gridX = Math.max(0, Math.min(this.gridWidth - 1, Math.floor(x + offsetX)));
            const gridY = Math.max(0, Math.min(this.gridHeight - 1, Math.floor(y + offsetY)));

            this.creatures.push({
                x: gridX,
                y: gridY,
                type: type,
                age: 0,
                energy: 100,
                speed: Math.random() * 0.1 + 0.05,
                direction: Math.random() * Math.PI * 2,
                health: 100
            });
        }
    }

    constructBuilding(x, y, buildingType, ownerRace = 'human') {
        const gridX = Math.floor(x);
        const gridY = Math.floor(y);

        // Check if tile is valid for building
        if (gridX < 0 || gridX >= this.gridWidth || gridY < 0 || gridY >= this.gridHeight) return;
        if (!this.isValidTile(gridX, gridY)) return;

        const tile = this.grid[gridY][gridX];
        // Buildings can only be built on grass or sand
        if (tile.type !== 'grass' && tile.type !== 'sand') return;

        // Check if space is already occupied by building
        if (this.buildings.some(b => b.x === gridX && b.y === gridY)) return;

        // Create building
        const building = {
            x: gridX,
            y: gridY,
            type: buildingType,
            owner: ownerRace,
            age: 0,
            population: 0  // For houses
        };

        // Building effects
        if (buildingType === 'house') {
            building.maxPopulation = 8;
            building.population = 3;
            tile.type = 'house';
        } else if (buildingType === 'townhall') {
            tile.type = 'townhall';
        } else if (buildingType === 'road') {
            tile.type = 'road';
        }

        this.buildings.push(building);
    }

    // Humanoid creatures randomly build around them
    updateBuildings() {
        // Humanoids occasionally build structures
        for (let humanoid of this.creatures) {
            const race = humanoid.type;
            if (['human', 'elf', 'dwarf', 'orc', 'undead'].includes(race) && Math.random() < 0.0001) {
                // Find empty nearby tiles for building
                const buildRadius = 5;
                const buildX = humanoid.x + (Math.random() - 0.5) * buildRadius * 2;
                const buildY = humanoid.y + (Math.random() - 0.5) * buildRadius * 2;

                const buildType = Math.random() < 0.7 ? 'house' : (Math.random() < 0.8 ? 'road' : 'townhall');
                this.constructBuilding(buildX, buildY, buildType, race);
            }
        }
    }

    triggerHazard(x, y, hazard) {
        const radius = 10;

        switch (hazard) {
            case 'meteor':
                this.createMeteor(x, y, radius);
                break;
            case 'plague':
                this.spreadPlague(x, y, radius);
                break;
            case 'lightning':
                this.strikeWithLightning(x, y, radius);
                break;
            case 'volcano':
                this.eruptVolcano(x, y, radius);
                break;
            case 'tsunami':
                this.triggerTsunami(x, y, radius);
                break;
            case 'blizzard':
                this.triggerBlizzard(x, y, radius);
                break;
            case 'earthquake':
                this.triggerEarthquake(x, y, radius);
                break;
            case 'wildfire':
                this.triggerWildfire(x, y, radius);
                break;
        }
    }

    createMeteor(x, y, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius) {
                    const gx = x + dx;
                    const gy = y + dy;
                    if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                        this.grid[gy][gx].type = 'lava';
                        this.particles.push({
                            x: gx,
                            y: gy,
                            type: 'fire',
                            life: 30
                        });
                    }
                }
            }
        }

        // Kill creatures in area
        this.creatures = this.creatures.filter(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            return dist > radius;
        });
    }

    spreadPlague(x, y, radius) {
        // Damage creatures
        this.creatures.forEach(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            if (dist <= radius) {
                c.health -= 50;
            }
        });

        // Remove dead creatures
        this.creatures = this.creatures.filter(c => c.health > 0);
    }

    strikeWithLightning(x, y, radius) {
        // Devastate area
        for (let dy = -radius / 2; dy <= radius / 2; dy++) {
            for (let dx = -radius / 2; dx <= radius / 2; dx++) {
                const gx = x + dx;
                const gy = y + dy;
                if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                    this.grid[gy][gx].type = 'dirt';
                    this.particles.push({
                        x: gx,
                        y: gy,
                        type: 'spark',
                        life: 20
                    });
                }
            }
        }

        this.creatures = this.creatures.filter(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            return dist > radius / 2;
        });
    }

    eruptVolcano(x, y, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius) {
                    const gx = x + dx;
                    const gy = y + dy;
                    if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                        this.grid[gy][gx].type = 'lava';
                        this.grid[gy][gx].temperature = 200;
                    }
                }
            }
        }

        this.creatures = this.creatures.filter(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            return dist > radius;
        });
    }

    triggerTsunami(x, y, radius) {
        // Find nearby water and convert to lava temporarily, destroy terrain
        for (let dy = -radius * 2; dy <= radius * 2; dy++) {
            for (let dx = -radius * 2; dx <= radius * 2; dx++) {
                const gx = x + dx;
                const gy = y + dy;
                if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= radius * 2) {
                        if (this.grid[gy][gx].type === 'sand' || this.grid[gy][gx].type === 'dirt') {
                            this.grid[gy][gx].type = 'water';
                            this.particles.push({
                                x: gx,
                                y: gy,
                                type: 'water',
                                life: 40
                            });
                        }
                    }
                }
            }
        }

        // Damage creatures
        this.creatures = this.creatures.filter(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            if (dist <= radius * 2) {
                c.health -= 60;
            }
            return c.health > 0;
        });
    }

    triggerBlizzard(x, y, radius) {
        // Cover terrain in snow (represented as light gray)
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const gx = x + dx;
                const gy = y + dy;
                if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= radius) {
                        // Temporarily damage creatures in blizzard
                        this.particles.push({
                            x: gx,
                            y: gy,
                            type: 'snow',
                            life: 50
                        });
                    }
                }
            }
        }

        // Slow down and damage creatures
        this.creatures.forEach(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            if (dist <= radius) {
                c.speed *= 0.5;
                c.health -= 30;
            }
        });

        this.creatures = this.creatures.filter(c => c.health > 0);
    }

    triggerEarthquake(x, y, radius) {
        // Randomly shuffle terrain
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const gx = x + dx;
                const gy = y + dy;
                if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                    // Randomly change terrain type
                    if (Math.random() < 0.3) {
                        const terrainTypes = ['dirt', 'stone', 'sand'];
                        this.grid[gy][gx].type = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
                    }
                    
                    this.particles.push({
                        x: gx,
                        y: gy,
                        type: 'dust',
                        life: 30
                    });
                }
            }
        }

        // Damage creatures
        this.creatures = this.creatures.filter(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            if (dist <= radius) {
                c.health -= 50;
            }
            return c.health > 0;
        });
    }

    triggerWildfire(x, y, radius) {
        // Spread fire through forests and grasslands
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const gx = x + dx;
                const gy = y + dy;
                if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= radius) {
                        const tile = this.grid[gy][gx];
                        if (tile.type === 'forest' || tile.type === 'grass') {
                            tile.type = 'dirt';
                            for (let i = 0; i < 3; i++) {
                                this.particles.push({
                                    x: gx,
                                    y: gy,
                                    type: 'fire',
                                    life: 50
                                });
                            }
                        }
                    }
                }
            }
        }

        // Damage creatures
        this.creatures = this.creatures.filter(c => {
            const dist = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
            if (dist <= radius) {
                c.health -= 70;
            }
            return c.health > 0;
        });
    }

    generateTerrain() {
        this.initializeGrid();

        // Generate basic terrain with Perlin-like noise (simplified)
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (!this.grid[y][x].isValidTile) {
                    this.grid[y][x].type = 'water';
                    continue;
                }

                const nx = x / this.gridWidth;
                const ny = y / this.gridHeight;
                const noise = this.simpleNoise(nx * 4, ny * 4);

                if (noise > 0.7) {
                    this.grid[y][x].type = 'mountain';
                    this.grid[y][x].isMountain = true;
                } else if (noise > 0.6) {
                    this.grid[y][x].type = 'forest';
                    this.grid[y][x].hasForest = true;
                } else if (noise > 0.5) {
                    this.grid[y][x].type = 'stone';
                } else if (noise > 0.4) {
                    this.grid[y][x].type = 'dirt';
                } else if (noise > 0.2) {
                    this.grid[y][x].type = 'sand';
                } else {
                    this.grid[y][x].type = 'water';
                }
            }
        }

        // Spawn initial humanoid creatures
        const humanoidTypes = ['human', 'elf', 'dwarf', 'orc'];
        humanoidTypes.forEach(type => {
            for (let i = 0; i < 3; i++) {
                const x = Math.floor(Math.random() * this.gridWidth);
                const y = Math.floor(Math.random() * this.gridHeight);
                if (this.grid[y][x].isValidTile) {
                    this.spawnCreature(x, y, type, 2);
                }
            }
        });

        // Spawn initial animals
        const animalTypes = ['wolf', 'bear', 'deer', 'eagle'];
        animalTypes.forEach(type => {
            for (let i = 0; i < 2; i++) {
                const x = Math.floor(Math.random() * this.gridWidth);
                const y = Math.floor(Math.random() * this.gridHeight);
                if (this.grid[y][x].isValidTile) {
                    this.spawnCreature(x, y, type, 3);
                }
            }
        });

        // Spawn fish in water
        for (let i = 0; i < 5; i++) {
            let x, y;
            for (let attempts = 0; attempts < 10; attempts++) {
                x = Math.floor(Math.random() * this.gridWidth);
                y = Math.floor(Math.random() * this.gridHeight);
                if (this.grid[y][x].type === 'water') break;
            }
            if (this.grid[y][x].type === 'water') {
                this.spawnCreature(x, y, 'fish', 4);
            }
        }
    }

    simpleNoise(x, y) {
        // Simple noise function for terrain generation
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    }

    updateGame() {
        if (this.isPaused) return;

        this.updateCounter++;
        
        // Update creatures
        for (let i = this.creatures.length - 1; i >= 0; i--) {
            const c = this.creatures[i];
            c.age++;
            c.energy -= 0.1;

            // Random movement
            if (Math.random() < 0.02) {
                c.direction = Math.random() * Math.PI * 2;
            }

            // Calculate next position
            const nextX = c.x + Math.cos(c.direction) * c.speed;
            const nextY = c.y + Math.sin(c.direction) * c.speed;
            
            // Check collision before moving
            const nextTileX = Math.floor(nextX);
            const nextTileY = Math.floor(nextY);
            
            // Check if next tile is valid and passable
            let canMove = true;
            if (nextTileX < 0 || nextTileX >= this.gridWidth || nextTileY < 0 || nextTileY >= this.gridHeight) {
                canMove = false; // Out of bounds
            } else if (!this.isValidTile(nextTileX, nextTileY)) {
                canMove = false; // Invalid based on world shape
            } else {
                // Check terrain type with aquatic restrictions
                const nextTile = this.grid[nextTileY][nextTileX];
                const isAquatic = c.type === 'fish';
                
                if (nextTile.type === 'mountain') {
                    canMove = false; // Can't walk through mountains
                } else if (nextTile.type === 'water') {
                    // Only aquatic creatures can move through water
                    canMove = isAquatic;
                } else if (isAquatic) {
                    // Aquatic creatures can only move through water
                    canMove = false;
                }
            }

            // Move if collision check passed
            if (canMove) {
                c.x = nextX;
                c.y = nextY;
            } else {
                // Pick a new random direction if blocked
                c.direction = Math.random() * Math.PI * 2;
            }

            // Keep creatures in bounds (fallback)
            c.x = Math.max(0, Math.min(this.gridWidth - 1, c.x));
            c.y = Math.max(0, Math.min(this.gridHeight - 1, c.y));

            // Death conditions
            if (c.energy <= 0 || c.age > 1000 || c.health <= 0) {
                this.creatures.splice(i, 1);
                continue;
            }

            // Creature interaction with terrain
            const terrainX = Math.floor(c.x);
            const terrainY = Math.floor(c.y);
            const tile = this.grid[terrainY][terrainX];

            if (tile.type === 'water') {
                c.energy -= 0.2; // Slow down in water
            }

            if (tile.type === 'lava') {
                c.health -= 10; // Lava damage
            }

            // Reproduction
            if (c.energy > 150 && Math.random() < 0.001) {
                this.spawnCreature(c.x, c.y, c.type, 1);
                c.energy -= 50;
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].life--;
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update buildings (humanoids build)
        this.updateBuildings();

        // Random mob spawning
        if (this.updateCounter % 120 === 0) { // Spawn check every 2 seconds
            const creatureTypes = ['human', 'elf', 'dwarf', 'orc', 'undead', 'wolf', 'bear', 'deer', 'eagle', 'fish'];
            
            // Count creatures by type
            const counts = {};
            creatureTypes.forEach(type => { counts[type] = 0; });
            this.creatures.forEach(c => { 
                if (counts[c.type] !== undefined) counts[c.type]++;
            });

            // Spawn limits and biome preferences
            const spawnLimits = {
                'human': 30, 'elf': 25, 'dwarf': 20, 'orc': 20, 'undead': 15,
                'wolf': 15, 'bear': 8, 'deer': 25, 'eagle': 12, 'fish': 30
            };

            // Randomly pick a creature type to spawn
            if (Math.random() < 0.3 && this.creatures.length < 150) {
                const typeToSpawn = creatureTypes[Math.floor(Math.random() * creatureTypes.length)];
                
                if (counts[typeToSpawn] < spawnLimits[typeToSpawn]) {
                    // Find a valid spawn location
                    let spawned = false;
                    for (let attempts = 0; attempts < 10; attempts++) {
                        const x = Math.random() * this.gridWidth;
                        const y = Math.random() * this.gridHeight;
                        const tile = this.grid[Math.floor(y)][Math.floor(x)];
                        
                        // Spawn in valid terrain based on creature type
                        let validTerrain = false;
                        
                        if (typeToSpawn === 'fish') {
                            // Fish only spawn in water
                            validTerrain = tile.type === 'water';
                        } else if (typeToSpawn === 'eagle') {
                            // Eagles can spawn almost anywhere except water
                            validTerrain = tile.type !== 'water' && tile.type !== 'lava' && tile.type !== 'mountain';
                        } else {
                            // All other creatures spawn on land (grass, sand, forest)
                            validTerrain = tile.type === 'grass' || tile.type === 'sand' || tile.type === 'forest';
                        }
                        
                        if (validTerrain) {
                            this.spawnCreature(x, y, typeToSpawn, 0.5);
                            spawned = true;
                            break;
                        }
                    }
                }
            }
        }

        // Update year counter
        if (this.updateCounter % 60 === 0) {
            this.year++;
        }

        this.updateStats();
    }

    updateStats() {
        const creatureCounts = {
            human: 0,
            elf: 0,
            dwarf: 0,
            orc: 0,
            undead: 0,
            wolf: 0,
            bear: 0,
            deer: 0,
            eagle: 0,
            fish: 0
        };

        this.creatures.forEach(c => {
            if (creatureCounts[c.type] !== undefined) {
                creatureCounts[c.type]++;
            }
        });

        const total = this.creatures.length;

        document.getElementById('populationCount').textContent = total;
        document.getElementById('humanCount').textContent = creatureCounts.human;
        document.getElementById('elfCount').textContent = creatureCounts.elf;
        document.getElementById('dwarfCount').textContent = creatureCounts.dwarf;
        document.getElementById('orcCount').textContent = creatureCounts.orc;
        document.getElementById('undeadCount').textContent = creatureCounts.undead;
        document.getElementById('wolfCount').textContent = creatureCounts.wolf;
        document.getElementById('bearCount').textContent = creatureCounts.bear;
        document.getElementById('deerCount').textContent = creatureCounts.deer;
        document.getElementById('eagleCount').textContent = creatureCounts.eagle;
        document.getElementById('fishCount').textContent = creatureCounts.fish;
        document.getElementById('yearCount').textContent = this.year;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const tile = this.grid[y][x];
                
                // For non-rectangular shapes, draw void outside valid tiles
                if (!tile.isValidTile) {
                    this.ctx.fillStyle = '#0a0a0a';
                    this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                    continue;
                }

                const sprite = this.spriteGen.getSprite(tile.type);
                this.ctx.drawImage(
                    sprite,
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }

        // Draw creatures
        this.creatures.forEach(c => {
            const sprite = this.spriteGen.getSprite(c.type);
            this.ctx.drawImage(
                sprite,
                Math.floor(c.x) * this.tileSize,
                Math.floor(c.y) * this.tileSize,
                this.tileSize,
                this.tileSize
            );

            // Draw health bar for low health
            if (c.health < 50) {
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(
                    Math.floor(c.x) * this.tileSize,
                    Math.floor(c.y) * this.tileSize - 3,
                    (this.tileSize * c.health) / 100,
                    2
                );
            }
        });

        // Draw buildings
        this.buildings.forEach(b => {
            const sprite = this.spriteGen.getSprite(b.type);
            this.ctx.drawImage(
                sprite,
                b.x * this.tileSize,
                b.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );

            // Draw building label above
            if (b.type === 'house' && b.population > 0) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.font = '8px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(
                    b.population,
                    b.x * this.tileSize + this.tileSize / 2,
                    b.y * this.tileSize - 3
                );
            }
        });

        // Draw particles
        this.particles.forEach(p => {
            const alpha = p.life / 30;
            if (p.type === 'fire') {
                this.ctx.fillStyle = `rgba(255, 107, 53, ${alpha})`;
            } else if (p.type === 'spark') {
                this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
            } else if (p.type === 'water') {
                this.ctx.fillStyle = `rgba(33, 150, 243, ${alpha})`;
            } else if (p.type === 'snow') {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            } else if (p.type === 'dust') {
                this.ctx.fillStyle = `rgba(200, 150, 100, ${alpha})`;
            }
            this.ctx.fillRect(p.x * this.tileSize + 4, p.y * this.tileSize + 4, 8, 8);
        });

        // Update FPS
        this.frameCount++;
        const now = Date.now();
        if (now - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
        }
        document.getElementById('fpsInfo').textContent = `FPS: ${this.fps}`;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.querySelector('[data-tool="pause"]');
        pauseBtn.classList.toggle('active', this.isPaused);
        pauseBtn.textContent = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
    }

    toggleSpeed() {
        // Cycle through speeds
        const speeds = [0.5, 1, 2, 3];
        const currentIndex = speeds.indexOf(this.gameSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.gameSpeed = speeds[nextIndex];
        document.getElementById('speed').value = this.gameSpeed;
        document.getElementById('speedDisplay').textContent = this.gameSpeed + 'x';
    }

    clearWorld() {
        this.initializeGrid();
        this.creatures = [];
        this.particles = [];
        this.year = 0;
    }

    reset() {
        this.clearWorld();
        this.generateTerrain();
    }

    startGameLoop() {
        const updateGame = () => {
            // Update multiple times per frame based on game speed
            const updates = Math.floor(this.gameSpeed);
            for (let i = 0; i < updates; i++) {
                this.updateGame();
            }

            this.render();
            requestAnimationFrame(updateGame);
        };

        updateGame();
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    let selectedSize = 'medium';
    let selectedShape = 'rectangular';
    
    // Setup launcher buttons for size
    document.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-size]').forEach(b => {
                b.style.backgroundColor = '';
                b.style.color = '';
                b.style.borderColor = '';
                b.classList.remove('selected');
            });
            btn.style.backgroundColor = '#4CAF50';
            btn.style.color = '#000';
            btn.style.borderColor = '#4CAF50';
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });
    
    // Setup launcher buttons for shape
    document.querySelectorAll('[data-shape]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-shape]').forEach(b => {
                b.style.backgroundColor = '';
                b.style.color = '';
                b.style.borderColor = '';
                b.classList.remove('selected');
            });
            btn.style.backgroundColor = '#4CAF50';
            btn.style.color = '#000';
            btn.style.borderColor = '#4CAF50';
            btn.classList.add('selected');
            selectedShape = btn.dataset.shape;
        });
    });
    
    // Start game button
    document.getElementById('startGameBtn').addEventListener('click', () => {
        // Save settings
        sessionStorage.setItem('gameSettings', JSON.stringify({
            worldSize: selectedSize,
            worldShape: selectedShape
        }));
        
        // Hide launcher and show game
        document.getElementById('launcherScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        // Initialize game
        const game = WorldboxGame.getInstance();
    });
});
