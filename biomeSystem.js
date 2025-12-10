// Advanced Biome System
class BiomeSystem {
    constructor() {
        this.biomes = this.initializeBiomes();
        this.biomeEffects = {};
    }

    initializeBiomes() {
        return {
            grassland: {
                name: 'Grassland',
                baseTerrains: ['grass'],
                color: '#90EE90',
                emoji: '🌱',
                resources: { food: 100, wood: 30 },
                creatures: ['human', 'deer', 'wolf'],
                temperature: 15,
                humidity: 60,
                fertility: 80,
                hazards: ['wildfire', 'plague']
            },
            forest: {
                name: 'Forest',
                baseTerrains: ['forest', 'grass'],
                color: '#228B22',
                emoji: '🌲',
                resources: { wood: 150, food: 70 },
                creatures: ['elf', 'wolf', 'deer', 'eagle'],
                temperature: 12,
                humidity: 75,
                fertility: 70,
                hazards: ['wildfire'],
                effects: {
                    magicalEnergy: 0.7,
                    nativeAdvantage: true // Elves get buff
                }
            },
            desert: {
                name: 'Desert',
                baseTerrains: ['sand'],
                color: '#FFD700',
                emoji: '🌵',
                resources: { gold: 120, stone: 100 },
                creatures: ['human', 'camel'],
                temperature: 40,
                humidity: 10,
                fertility: 10,
                hazards: ['wildfire', 'sandstorm'],
                effects: {
                    waterScarce: true,
                    heatDamage: 0.1
                }
            },
            infernal: {
                name: 'Infernal Wastes',
                baseTerrains: ['lava', 'stone'],
                color: '#FF4500',
                emoji: '🔥',
                resources: { stone: 200, gold: 80 },
                creatures: ['undead', 'demon'],
                temperature: 100,
                humidity: 0,
                fertility: 0,
                hazards: ['volcano', 'lightning'],
                effects: {
                    lavaDamage: 0.3,
                    heatDamage: 0.5,
                    corrupting: true
                }
            },
            mountain: {
                name: 'Mountain',
                baseTerrains: ['mountain', 'stone'],
                color: '#8B8B8B',
                emoji: '⛰️',
                resources: { stone: 200, gold: 100, iron: 150 },
                creatures: ['dwarf', 'eagle', 'bear'],
                temperature: 5,
                humidity: 50,
                fertility: 20,
                hazards: ['earthquake', 'avalanche'],
                effects: {
                    nativeAdvantage: true, // Dwarves
                    miningBonus: 1.5
                }
            },
            ocean: {
                name: 'Ocean',
                baseTerrains: ['water'],
                color: '#1E90FF',
                emoji: '🌊',
                resources: { food: 200, salt: 100 },
                creatures: ['fish'],
                temperature: 10,
                humidity: 100,
                fertility: 60,
                hazards: ['tsunami'],
                effects: {
                    aquaticOnly: true
                }
            },
            swamp: {
                name: 'Swamp',
                baseTerrains: ['water', 'grass', 'forest'],
                color: '#556B2F',
                emoji: '🪱',
                resources: { food: 90, wood: 110 },
                creatures: ['undead', 'wolf', 'fish'],
                temperature: 18,
                humidity: 95,
                fertility: 40,
                hazards: ['plague', 'tsunami'],
                effects: {
                    disease: 0.3,
                    slowMovement: true
                }
            },
            tundra: {
                name: 'Tundra',
                baseTerrains: ['grass', 'snow'],
                color: '#F0F8FF',
                emoji: '❄️',
                resources: { food: 50, fur: 100 },
                creatures: ['human', 'wolf', 'bear'],
                temperature: -20,
                humidity: 40,
                fertility: 30,
                hazards: ['blizzard'],
                effects: {
                    coldDamage: 0.2,
                    slowMovement: true
                }
            },
            volcanic: {
                name: 'Volcanic Region',
                baseTerrains: ['lava', 'stone', 'mountain'],
                color: '#DC143C',
                emoji: '🌋',
                resources: { stone: 250, iron: 100, gold: 80 },
                creatures: ['undead', 'demon'],
                temperature: 80,
                humidity: 5,
                fertility: 5,
                hazards: ['volcano', 'earthquake', 'wildfire'],
                effects: {
                    lavaDamage: 0.4,
                    geothermalEnergy: 2.0
                }
            },
            arcane: {
                name: 'Arcane Nexus',
                baseTerrains: ['stone', 'grass'],
                color: '#9370DB',
                emoji: '✨',
                resources: { mana: 200, stone: 80 },
                creatures: ['elf', 'human'],
                temperature: 15,
                humidity: 50,
                fertility: 60,
                hazards: [],
                effects: {
                    magicalEnergy: 1.5,
                    enhancesMagic: true
                }
            }
        };
    }

    getBiomeAt(game, x, y) {
        if (!game.grid[y] || !game.grid[y][x]) return null;
        
        const tile = game.grid[y][x];
        
        // Determine biome based on terrain and surrounding tiles
        if (tile.type === 'lava') return this.biomes.infernal;
        if (tile.type === 'water') return this.biomes.ocean;
        if (tile.type === 'mountain') return this.biomes.mountain;
        if (tile.type === 'sand') return this.biomes.desert;
        if (tile.type === 'forest') return this.biomes.forest;
        
        // Check surroundings for biome classification
        let waterNeighbors = 0;
        let forestNeighbors = 0;
        let mountainNeighbors = 0;
        
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const ny = y + dy;
                const nx = x + dx;
                if (ny >= 0 && ny < game.gridHeight && nx >= 0 && nx < game.gridWidth) {
                    const neighbor = game.grid[ny][nx];
                    if (neighbor.type === 'water') waterNeighbors++;
                    if (neighbor.type === 'forest') forestNeighbors++;
                    if (neighbor.type === 'mountain') mountainNeighbors++;
                }
            }
        }
        
        if (waterNeighbors >= 4 && tile.type === 'grass') return this.biomes.swamp;
        if (forestNeighbors >= 4 && tile.type === 'grass') return this.biomes.forest;
        if (mountainNeighbors >= 4 && tile.type === 'stone') return this.biomes.mountain;
        
        // Default
        if (tile.type === 'grass') return this.biomes.grassland;
        if (tile.type === 'stone') return this.biomes.mountain;
        
        return this.biomes.grassland;
    }

    applyBiomeEffects(creature, biome, game) {
        if (!biome || !biome.effects) return;

        const effects = biome.effects;

        // Temperature damage
        if (effects.coldDamage) {
            creature.health -= effects.coldDamage;
        }
        if (effects.heatDamage) {
            creature.health -= effects.heatDamage;
        }
        if (effects.lavaDamage) {
            creature.health -= effects.lavaDamage;
        }

        // Movement effects
        if (effects.slowMovement) {
            creature.speed *= 0.7;
        }

        // Disease
        if (effects.disease && Math.random() < effects.disease * 0.01) {
            creature.traits = creature.traits || [];
            if (!creature.traits.includes('diseased')) {
                creature.traits.push('diseased');
            }
        }

        // Corruption
        if (effects.corrupting && Math.random() < 0.05) {
            if (!creature.traits.includes('corrupted')) {
                creature.traits.push('corrupted');
                if (creature.type !== 'undead') {
                    creature.stats.intelligence = Math.max(0, creature.stats.intelligence - 2);
                }
            }
        }
    }

    getResourcesInBiome(biome, amount = 1) {
        const resources = {};
        Object.keys(biome.resources).forEach(resource => {
            resources[resource] = Math.floor(biome.resources[resource] * amount);
        });
        return resources;
    }

    isNativeCreature(creatureType, biome) {
        if (!biome) return true;
        if (!biome.creatures) return true;
        return biome.creatures.includes(creatureType);
    }

    getNativeAdvantage(creatureType, biome) {
        if (!this.isNativeCreature(creatureType, biome)) {
            return 0.7; // 30% penalty for non-native creatures
        }

        // Racial bonuses in specific biomes
        if (biome === this.biomes.forest && creatureType === 'elf') return 1.3;
        if (biome === this.biomes.mountain && creatureType === 'dwarf') return 1.3;
        if (biome === this.biomes.grassland && creatureType === 'human') return 1.1;
        if (biome === this.biomes.desert && creatureType === 'human') return 1.1;

        return 1.0; // No bonus
    }

    spreadBiomeProperties(game, x, y, biomeType, strength = 0.1) {
        // Gradually spread biome properties to neighboring tiles
        const biome = this.biomes[biomeType];
        if (!biome) return;

        for (let dx = -3; dx <= 3; dx++) {
            for (let dy = -3; dy <= 3; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || nx >= game.gridWidth || ny < 0 || ny >= game.gridHeight) continue;

                if (game.grid[ny] && game.grid[ny][nx]) {
                    if (Math.random() < strength) {
                        // Gradually change terrain
                        const targetType = biome.baseTerrains[Math.floor(Math.random() * biome.baseTerrains.length)];
                        game.grid[ny][nx].type = targetType;
                    }
                }
            }
        }
    }
}

// Export for use in other files
window.BiomeSystem = BiomeSystem;
