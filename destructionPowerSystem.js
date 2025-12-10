// Divine Powers and Destruction System
class DestructionPowerSystem {
    constructor(game) {
        this.game = game;
        this.activePowers = [];
        this.powerCooldowns = {};
        
        this.powers = {
            meteor: {
                name: 'Meteor Strike',
                description: 'Call down a meteor to destroy area',
                emoji: '☄️',
                radius: 15,
                damage: 150,
                cooldown: 30000, // 30 seconds
                effect: 'explosion',
                affectsBuildingsAndCreatures: true
            },
            nuke: {
                name: 'Nuclear Explosion',
                description: 'Devastate a large area with radiation',
                emoji: '💣',
                radius: 25,
                damage: 300,
                cooldown: 60000, // 1 minute
                effect: 'nuclear',
                affectsBuildingsAndCreatures: true,
                causesRadiation: true
            },
            dragon: {
                name: 'Dragon Strike',
                description: 'Summon a dragon to attack',
                emoji: '🐉',
                radius: 12,
                damage: 200,
                cooldown: 45000,
                effect: 'dragonfire',
                summonsDragon: true
            },
            ufo: {
                name: 'UFO Abduction',
                description: 'UFO abducts creatures and destroys buildings',
                emoji: '🛸',
                radius: 20,
                damage: 180,
                cooldown: 50000,
                effect: 'ufo',
                abductsCreatures: true
            },
            plague: {
                name: 'Plague',
                description: 'Spread disease through an area',
                emoji: '☠️',
                radius: 18,
                damage: 100,
                cooldown: 40000,
                effect: 'plague',
                spreadsPossible: true
            },
            tsunami: {
                name: 'Tsunami',
                description: 'Create massive waves',
                emoji: '🌊',
                radius: 20,
                damage: 120,
                cooldown: 35000,
                effect: 'tsunami'
            },
            lightning: {
                name: 'Lightning Storm',
                description: 'Rain lightning on target area',
                emoji: '⚡',
                radius: 10,
                damage: 80,
                cooldown: 25000,
                effect: 'lightning'
            },
            volcano: {
                name: 'Volcano Eruption',
                description: 'Trigger a volcanic eruption',
                emoji: '🌋',
                radius: 22,
                damage: 200,
                cooldown: 50000,
                effect: 'volcano'
            },
            earthquake: {
                name: 'Earthquake',
                description: 'Shake the ground',
                emoji: '📍',
                radius: 30,
                damage: 50,
                cooldown: 40000,
                effect: 'earthquake'
            },
            wildfire: {
                name: 'Wildfire',
                description: 'Ignite forests and structures',
                emoji: '🔥',
                radius: 16,
                damage: 130,
                cooldown: 35000,
                effect: 'wildfire',
                spreadsOverTime: true
            }
        };
    }

    triggerPower(powerName, x, y) {
        const power = this.powers[powerName];
        if (!power) return false;

        // Check cooldown
        if (this.powerCooldowns[powerName] && Date.now() - this.powerCooldowns[powerName] < power.cooldown) {
            return false;
        }

        // Execute the power
        this.executePower(powerName, x, y, power);
        this.powerCooldowns[powerName] = Date.now();
        return true;
    }

    executePower(powerName, x, y, power) {
        const gridX = Math.floor(x);
        const gridY = Math.floor(y);

        // Damage creatures in radius
        if (power.affectsBuildingsAndCreatures || powerName === 'lightning') {
            this.game.creatures.forEach(creature => {
                const distance = Math.hypot(creature.x - gridX, creature.y - gridY);
                if (distance <= power.radius) {
                    creature.health -= power.damage * (1 - distance / power.radius);
                    if (creature.health < 0) creature.health = 0;
                }
            });
        }

        // Destroy buildings
        if (power.affectsBuildingsAndCreatures) {
            this.game.buildings = this.game.buildings.filter(building => {
                const distance = Math.hypot(building.x - gridX, building.y - gridY);
                if (distance <= power.radius) {
                    this.game.createExplosionParticles(building.x, building.y, 8);
                    return false; // Remove building
                }
                return true;
            });
        }

        // Terrain destruction
        this.destroyTerrain(gridX, gridY, power.radius, powerName);

        // Special effects
        this.createPowerEffect(gridX, gridY, power);

        // Summon creatures if applicable
        if (power.summonsDragon) {
            this.spawnDragon(gridX, gridY);
        }
        if (power.abductsCreatures) {
            this.abductCreatures(gridX, gridY, power.radius);
        }

        // Kingdom reputation changes
        this.affectKingdoms(gridX, gridY, power.radius);
    }

    destroyTerrain(x, y, radius, powerName) {
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const distance = Math.hypot(dx, dy);
                if (distance > radius) continue;

                const gridX = Math.floor(x + dx);
                const gridY = Math.floor(y + dy);

                if (gridX < 0 || gridX >= this.game.gridWidth || gridY < 0 || gridY >= this.game.gridHeight) continue;

                if (this.game.grid[gridY] && this.game.grid[gridY][gridX]) {
                    const tile = this.game.grid[gridY][gridX];
                    
                    switch (powerName) {
                        case 'meteor':
                        case 'nuke':
                            tile.type = 'stone'; // Crater
                            break;
                        case 'volcano':
                            tile.type = 'lava';
                            break;
                        case 'tsunami':
                            tile.type = 'water';
                            break;
                        case 'wildfire':
                            if (tile.type === 'forest') {
                                tile.type = 'dirt';
                            }
                            break;
                        case 'earthquake':
                            if (tile.type === 'grass' || tile.type === 'dirt') {
                                tile.type = 'stone';
                            }
                            break;
                    }
                }
            }
        }
    }

    createPowerEffect(x, y, power) {
        const particleCount = Math.floor(power.radius * 2);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            const distance = Math.random() * power.radius;

            this.game.particles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 60,
                maxLife: 60,
                type: power.effect,
                size: Math.random() * 2 + 1,
                color: this.getEffectColor(power.effect)
            });
        }
    }

    getEffectColor(effect) {
        const colors = {
            explosion: '#FF6600',
            nuclear: '#00FF00',
            dragonfire: '#FF3300',
            ufo: '#00FFFF',
            plague: '#660066',
            tsunami: '#0066FF',
            lightning: '#FFFF00',
            volcano: '#FF9900',
            earthquake: '#999999',
            wildfire: '#FF3300'
        };
        return colors[effect] || '#FFFFFF';
    }

    spawnDragon(x, y) {
        // Dragon is a special creature
        this.game.creatures.push({
            x: x,
            y: y,
            type: 'dragon',
            race: 'dragon',
            age: 100,
            health: 500,
            maxHealth: 500,
            speed: 0.15,
            direction: Math.random() * Math.PI * 2,
            isAggressive: true,
            isDragon: true,
            stats: { strength: 20, intelligence: 10, speed: 8 },
            traits: ['flying', 'firebreathing', 'terrifying']
        });
    }

    abductCreatures(x, y, radius) {
        const creaturesInRange = this.game.creatures.filter(c => {
            const distance = Math.hypot(c.x - x, c.y - y);
            return distance <= radius;
        });

        // Remove 60% of creatures in range
        creaturesInRange.forEach((creature, index) => {
            if (Math.random() < 0.6) {
                const idx = this.game.creatures.indexOf(creature);
                if (idx > -1) {
                    this.game.creatures.splice(idx, 1);
                }
            }
        });
    }

    affectKingdoms(x, y, radius) {
        this.game.civSystem.kingdoms.forEach(kingdom => {
            const distance = Math.hypot(kingdom.centerX - x, kingdom.centerY - y);
            if (distance <= radius * 2) {
                // Reduce happiness and resources
                kingdom.happiness -= Math.floor((radius - distance) / radius * 30);
                kingdom.resources.gold -= Math.floor(Math.random() * 50);
                kingdom.population -= Math.floor(Math.random() * 10);
                
                if (kingdom.happiness < 0) kingdom.happiness = 0;
                if (kingdom.population < 0) kingdom.population = 0;
            }
        });
    }

    getPowerCooldownPercent(powerName) {
        const power = this.powers[powerName];
        if (!power || !this.powerCooldowns[powerName]) return 100;

        const elapsed = Date.now() - this.powerCooldowns[powerName];
        const percent = Math.min(100, (elapsed / power.cooldown) * 100);
        return percent;
    }

    isReady(powerName) {
        return this.getPowerCooldownPercent(powerName) >= 100;
    }
}

// Export for use in other files
window.DestructionPowerSystem = DestructionPowerSystem;
