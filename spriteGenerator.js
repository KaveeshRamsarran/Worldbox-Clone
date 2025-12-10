// Sprite Generator - Creates pixelated 2D sprites
class SpriteGenerator {
    constructor(pixelSize = 16) {
        this.pixelSize = pixelSize;
        this.sprites = {};
        this.generateAllSprites();
        this.loadCustomSprites();
    }

    loadCustomSprites() {
        // Load custom sprites from localStorage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('sprite_')) {
                try {
                    const spriteData = JSON.parse(localStorage.getItem(key));
                    const sprite = this.buildSpriteFromData(spriteData);
                    this.sprites[spriteData.name] = sprite;
                } catch (e) {
                    console.error('Error loading custom sprite:', e);
                }
            }
        });
    }

    buildSpriteFromData(data) {
        const canvas = document.createElement('canvas');
        canvas.width = data.width * 16;
        canvas.height = data.height * 16;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        Object.entries(data.pixels || {}).forEach(([key, color]) => {
            const [x, y] = key.split(',').map(Number);
            ctx.fillStyle = color;
            ctx.fillRect(x * 16, y * 16, 16, 16);
        });

        return canvas;
    }

    generateAllSprites() {
        // Terrain sprites
        this.sprites.grass = this.generateGrass();
        this.sprites.dirt = this.generateDirt();
        this.sprites.stone = this.generateStone();
        this.sprites.sand = this.generateSand();
        this.sprites.water = this.generateWater();
        this.sprites.lava = this.generateLava();
        this.sprites.forest = this.generateForest();
        this.sprites.mountain = this.generateMountain();

        // Building sprites
        this.sprites.house = this.generateHouse();
        this.sprites.road = this.generateRoad();
        this.sprites.townhall = this.generateTownHall();
        this.sprites.farm = this.generateFarm();
        this.sprites.tower = this.generateTower();
        this.sprites.castle = this.generateCastle();
        this.sprites.market = this.generateMarket();
        this.sprites.temple = this.generateTemple();

        // Vehicle and transportation sprites
        this.sprites.boat = this.generateBoat();
        this.sprites.car = this.generateCar();

        // Weapon sprites
        this.sprites.sword = this.generateSword();
        this.sprites.axe = this.generateAxe();
        this.sprites.bow = this.generateBow();

        // Humanoid creature sprites
        this.sprites.human = this.generateHuman();
        this.sprites.elf = this.generateElf();
        this.sprites.dwarf = this.generateDwarf();
        this.sprites.orc = this.generateOrc();
        this.sprites.undead = this.generateUndead();
        
        // Animal sprites
        this.sprites.wolf = this.generateWolf();
        this.sprites.bear = this.generateBear();
        this.sprites.deer = this.generateDeer();
        this.sprites.eagle = this.generateEagle();
        this.sprites.fish = this.generateFish();
    }

    createCanvas(width = 16, height = 16) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    // Terrain generators
    generateGrass() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Base green
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, 16, 16);

        // Add darker spots for grass texture
        ctx.fillStyle = '#388E3C';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 2, 2);
        }

        // Add light spots
        ctx.fillStyle = '#81C784';
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 1, 1);
        }

        return canvas;
    }

    generateDirt() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, 0, 16, 16);

        // Add texture
        ctx.fillStyle = '#A0826D';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 1, 1);
        }

        ctx.fillStyle = '#6D5A47';
        for (let i = 0; i < 6; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 1, 1);
        }

        return canvas;
    }

    generateStone() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);

        // Add cracks
        ctx.strokeStyle = '#4A4A4A';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(2, 0);
        ctx.lineTo(8, 16);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(6, 16);
        ctx.stroke();

        // Add highlights
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(0, 0, 4, 4);
        ctx.fillRect(12, 12, 4, 4);

        return canvas;
    }

    generateSand() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#F4A460';
        ctx.fillRect(0, 0, 16, 16);

        // Add sandy texture
        ctx.fillStyle = '#E09447';
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 1, 1);
        }

        ctx.fillStyle = '#FFD89B';
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 1, 1);
        }

        return canvas;
    }

    generateWater() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#2196F3';
        ctx.fillRect(0, 0, 16, 16);

        // Water waves
        ctx.fillStyle = '#1976D2';
        ctx.fillRect(0, 2, 16, 2);
        ctx.fillRect(0, 6, 16, 2);
        ctx.fillRect(0, 10, 16, 2);

        // Highlights
        ctx.fillStyle = '#64B5F6';
        ctx.fillRect(2, 0, 3, 1);
        ctx.fillRect(8, 3, 3, 1);
        ctx.fillRect(13, 7, 3, 1);

        return canvas;
    }

    generateLava() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FF6B35';
        ctx.fillRect(0, 0, 16, 16);

        // Lava patterns
        ctx.fillStyle = '#FF8A50';
        for (let i = 0; i < 6; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 2, 2);
        }

        // Dark spots
        ctx.fillStyle = '#D63F1F';
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, 1, 1);
        }

        return canvas;
    }

    generateForest() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Base grass
        ctx.fillStyle = '#388E3C';
        ctx.fillRect(0, 0, 16, 16);

        // Tree top
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(6, 2, 4, 7);
        ctx.fillRect(5, 5, 6, 2);

        // Trunk
        ctx.fillStyle = '#8B6F47';
        ctx.fillRect(7, 8, 2, 8);

        return canvas;
    }

    generateMountain() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Grey mountain base
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(8, 3);
        ctx.lineTo(14, 12);
        ctx.lineTo(2, 12);
        ctx.fill();

        // White snow peak
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(8, 3);
        ctx.lineTo(11, 7);
        ctx.lineTo(5, 7);
        ctx.fill();

        return canvas;
    }

    // Building sprites
    generateHouse() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Base (foundation)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(6, 20, 20, 12);

        // Walls (wood)
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(6, 12, 20, 8);

        // Door
        ctx.fillStyle = '#654321';
        ctx.fillRect(14, 16, 4, 4);

        // Door handle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(16, 18, 2, 2);

        // Windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(8, 14, 4, 2);
        ctx.fillRect(20, 14, 4, 2);

        // Roof (triangular)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(4, 12);
        ctx.lineTo(16, 2);
        ctx.lineTo(28, 12);
        ctx.fill();

        // Roof peak highlight
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(12, 10);
        ctx.lineTo(16, 8);
        ctx.fill();

        return canvas;
    }

    generateRoad() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Base grass
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, 32, 32);

        // Road - light brown color
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(4, 12, 24, 8);

        // Road edge detail - darker brown
        ctx.fillStyle = '#A0826D';
        ctx.fillRect(4, 12, 24, 2);
        ctx.fillRect(4, 18, 24, 2);

        return canvas;
    }

    generateTownHall() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Base (foundation)
        ctx.fillStyle = '#696969';
        ctx.fillRect(4, 20, 24, 12);

        // Walls (stone)
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(4, 8, 24, 12);

        // Doors (2)
        ctx.fillStyle = '#654321';
        ctx.fillRect(10, 16, 4, 4);
        ctx.fillRect(18, 16, 4, 4);

        // Door handles
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(12, 18, 2, 2);
        ctx.fillRect(20, 18, 2, 2);

        // Windows (many)
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(6, 10, 2, 2);
        ctx.fillRect(10, 10, 2, 2);
        ctx.fillRect(14, 10, 2, 2);
        ctx.fillRect(18, 10, 2, 2);
        ctx.fillRect(22, 10, 2, 2);

        // Roof (peaked, larger)
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(2, 8);
        ctx.lineTo(16, 0);
        ctx.lineTo(30, 8);
        ctx.fill();

        // Roof accent
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(14, 2, 4, 4);

        // Flag pole
        ctx.fillStyle = '#696969';
        ctx.fillRect(14, 0, 4, 2);

        // Flag
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(18, 0, 4, 2);

        return canvas;
    }

    generateFarm() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Base field (brown dirt)
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(0, 0, 32, 32);

        // Crop rows (green)
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(0, i * 8, 32, 4);
        }

        // Barn (red)
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(4, 4, 12, 12);

        // Barn roof (dark red)
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(2, 4);
        ctx.lineTo(10, 0);
        ctx.lineTo(18, 4);
        ctx.fill();

        // Barn door (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(6, 7, 4, 6);

        // Silo (grey cylinder)
        ctx.fillStyle = '#A9A9A9';
        ctx.beginPath();
        ctx.arc(20, 10, 6, 0, Math.PI * 2);
        ctx.fill();

        // Silo top (cone)
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.moveTo(20, 4);
        ctx.lineTo(26, 10);
        ctx.lineTo(14, 10);
        ctx.fill();

        return canvas;
    }

    generateTower() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Tower base (grey stone)
        ctx.fillStyle = '#696969';
        ctx.fillRect(4, 10, 24, 22);

        // Tower walls (lighter grey)
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(6, 12, 20, 18);

        // Tower windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(8, 14, 3, 3);
        ctx.fillRect(21, 14, 3, 3);
        ctx.fillRect(8, 20, 3, 3);
        ctx.fillRect(21, 20, 3, 3);

        // Tower top (crenellations)
        ctx.fillStyle = '#696969';
        ctx.fillRect(4, 8, 6, 2);
        ctx.fillRect(14, 8, 6, 2);
        ctx.fillRect(22, 8, 6, 2);

        // Tower peak (pointed roof)
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(22, 8);
        ctx.lineTo(10, 8);
        ctx.fill();

        // Flag
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(16, 2, 2, 3);

        return canvas;
    }

    generateCastle() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Main castle walls
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 8, 32, 24);

        // Main gate (arch)
        ctx.fillStyle = '#654321';
        ctx.fillRect(12, 16, 8, 8);

        // Gate window
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(14, 18, 4, 4);

        // Left tower
        ctx.fillStyle = '#696969';
        ctx.fillRect(0, 4, 8, 28);
        ctx.fillRect(2, 2, 4, 2);

        // Right tower
        ctx.fillStyle = '#696969';
        ctx.fillRect(24, 4, 8, 28);
        ctx.fillRect(26, 2, 4, 2);

        // Walls and crenellations
        ctx.fillStyle = '#555555';
        ctx.fillRect(0, 6, 8, 2);
        ctx.fillRect(24, 6, 8, 2);

        // Center flag
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(16, 2, 2, 4);
        ctx.fillRect(18, 2, 2, 2);

        return canvas;
    }

    generateMarket() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Market stalls base
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(0, 12, 32, 20);

        // Tent roofs (colorful stripes)
        const colors = ['#FF6347', '#FFD700', '#32CD32', '#4169E1'];
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(i * 8, 12);
            ctx.lineTo(i * 8 + 4, 4);
            ctx.lineTo(i * 8 + 8, 12);
            ctx.fill();
        }

        // Counter
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(2, 20, 10, 6);
        ctx.fillRect(20, 20, 10, 6);

        // Goods (colorful boxes)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(4, 18, 6, 2);
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(22, 18, 6, 2);

        return canvas;
    }

    generateTemple() {
        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');

        // Temple base (light grey stone)
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(2, 10, 28, 22);

        // Temple entrance
        ctx.fillStyle = '#696969';
        ctx.fillRect(10, 14, 12, 14);

        // Temple door
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(12, 16, 8, 10);

        // Door handle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(19, 20, 1, 1);

        // Temple pillars
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(4, 12, 3, 18);
        ctx.fillRect(25, 12, 3, 18);

        // Temple roof (pyramid)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(30, 10);
        ctx.lineTo(2, 10);
        ctx.fill();

        // Roof decorations (holy symbols)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(15, 6, 2, 2);
        ctx.fillRect(14, 7, 4, 1);

        return canvas;
    }

    // Vehicle and Transportation sprites
    generateBoat() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Hull (brown wood)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(3, 8);
        ctx.lineTo(13, 8);
        ctx.lineTo(12, 12);
        ctx.lineTo(4, 12);
        ctx.fill();

        // Boat outline
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(3, 8);
        ctx.lineTo(13, 8);
        ctx.lineTo(12, 12);
        ctx.lineTo(4, 12);
        ctx.closePath();
        ctx.stroke();

        // Sail (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(8, 3);
        ctx.lineTo(10, 8);
        ctx.lineTo(8, 8);
        ctx.fill();

        // Mast (grey)
        ctx.fillStyle = '#696969';
        ctx.fillRect(7, 3, 2, 5);

        return canvas;
    }

    generateCar() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Car body (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(2, 6, 12, 6);

        // Car roof (darker red)
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(4, 3, 8, 3);

        // Windows (light blue)
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(5, 3, 3, 2);
        ctx.fillRect(9, 3, 3, 2);

        // Wheels (black)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(4, 12, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12, 12, 2, 0, Math.PI * 2);
        ctx.fill();

        // Wheel rims (grey)
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.arc(4, 12, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12, 12, 1.2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    // Weapon sprites
    generateSword() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Blade (silver)
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(7, 1, 2, 10);

        // Blade edge highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(7, 1, 1, 10);

        // Crossguard (gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(5, 10, 6, 1);

        // Handle (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(6, 11, 4, 4);

        // Pommel (gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(6, 14, 4, 1);

        return canvas;
    }

    generateAxe() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Axe head (dark grey)
        ctx.fillStyle = '#545454';
        ctx.beginPath();
        ctx.moveTo(4, 2);
        ctx.lineTo(12, 2);
        ctx.lineTo(10, 7);
        ctx.lineTo(6, 7);
        ctx.fill();

        // Axe edge highlight
        ctx.fillStyle = '#808080';
        ctx.fillRect(4, 2, 2, 5);

        // Handle (brown wood)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(7, 6, 2, 9);

        // Handle detail
        ctx.fillStyle = '#654321';
        ctx.fillRect(7, 9, 2, 1);
        ctx.fillRect(7, 12, 2, 1);

        return canvas;
    }

    generateBow() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Bow stave (brown wood)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(8, 8, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(7, 2, 2, 12);

        // Bow curve (darker)
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(8, 8, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Bowstring (white)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(8, 2);
        ctx.quadraticCurveTo(12, 8, 8, 14);
        ctx.stroke();

        // Arrow (yellow/orange)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(8, 7, 4, 1);

        // Arrow head (silver)
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(12, 7);
        ctx.lineTo(14, 7.5);
        ctx.lineTo(12, 8);
        ctx.fill();

        return canvas;
    }

    // Creature generators
    generateHuman() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Hair (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(6, 0, 4, 2);

        // Head (skin tone)
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(6, 1, 4, 3);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(7, 1, 1, 1);
        ctx.fillRect(9, 1, 1, 1);

        // Nose
        ctx.fillStyle = '#E8A050';
        ctx.fillRect(8, 2, 1, 1);

        // Body (shirt - blue)
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(5, 4, 6, 5);

        // Arms (skin)
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(3, 5, 2, 4);
        ctx.fillRect(11, 5, 2, 4);

        // Hands
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(3, 9, 2, 1);
        ctx.fillRect(11, 9, 2, 1);

        // Legs (pants - brown)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(6, 9, 2, 6);
        ctx.fillRect(8, 9, 2, 6);

        // Feet (shoes - black)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(6, 15, 2, 1);
        ctx.fillRect(8, 15, 2, 1);

        return canvas;
    }

    generateElf() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Hair (blonde)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(6, 0, 4, 2);

        // Head (pale skin)
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(6, 1, 4, 3);

        // Pointed ears
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(5, 2, 1, 2);
        ctx.fillRect(10, 2, 1, 2);

        // Eyes (green)
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(7, 2, 1, 1);
        ctx.fillRect(9, 2, 1, 1);

        // Body (green tunic)
        ctx.fillStyle = '#228B22';
        ctx.fillRect(5, 4, 6, 5);

        // Arms (pale)
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(3, 5, 2, 4);
        ctx.fillRect(11, 5, 2, 4);

        // Legs (green leggings)
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(6, 9, 2, 6);
        ctx.fillRect(8, 9, 2, 6);

        // Feet (green boots)
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(6, 15, 2, 1);
        ctx.fillRect(8, 15, 2, 1);

        return canvas;
    }

    generateDwarf() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Hair (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(6, 2, 4, 2);

        // Head (stocky)
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(6, 3, 4, 3);

        // Beard (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(6, 5, 4, 2);

        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(7, 4, 1, 1);
        ctx.fillRect(9, 4, 1, 1);

        // Body (orange tunic)
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(5, 6, 6, 5);

        // Arms (tan)
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(3, 7, 2, 4);
        ctx.fillRect(11, 7, 2, 4);

        // Belt (leather)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(5, 10, 6, 1);

        // Legs (brown pants)
        ctx.fillStyle = '#654321';
        ctx.fillRect(6, 11, 2, 5);
        ctx.fillRect(8, 11, 2, 5);

        return canvas;
    }

    generateOrc() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Hair (dark green)
        ctx.fillStyle = '#2F4F2F';
        ctx.fillRect(6, 0, 4, 2);

        // Head (green skin)
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(6, 1, 4, 3);

        // Eyes (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(7, 1, 1, 1);
        ctx.fillRect(9, 1, 1, 1);

        // Tusks (white)
        ctx.fillStyle = '#FFFFF0';
        ctx.fillRect(6, 3, 1, 1);
        ctx.fillRect(9, 3, 1, 1);

        // Body (dark brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(5, 4, 6, 5);

        // Arms (green)
        ctx.fillStyle = '#6B8E23';
        ctx.fillRect(3, 5, 2, 4);
        ctx.fillRect(11, 5, 2, 4);

        // Hands (green)
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(3, 9, 2, 1);
        ctx.fillRect(11, 9, 2, 1);

        // Legs (dark brown)
        ctx.fillStyle = '#3D3D1F';
        ctx.fillRect(6, 9, 2, 6);
        ctx.fillRect(8, 9, 2, 6);

        // Feet (gray)
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(6, 15, 2, 1);
        ctx.fillRect(8, 15, 2, 1);

        return canvas;
    }

    generateUndead() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Head (skull - bone color)
        ctx.fillStyle = '#D3D3D3';
        ctx.fillRect(6, 1, 4, 4);

        // Eye sockets (dark)
        ctx.fillStyle = '#000000';
        ctx.fillRect(7, 2, 1, 1);
        ctx.fillRect(9, 2, 1, 1);

        // Nose hole
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 3, 1, 1);

        // Jaw line
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(6, 4, 4, 1);

        // Teeth
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(6, 4, 1, 1);
        ctx.fillRect(9, 4, 1, 1);

        // Body (tattered robe - gray)
        ctx.fillStyle = '#696969';
        ctx.fillRect(5, 5, 6, 6);

        // Robe tears
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(5, 6, 1, 2);
        ctx.fillRect(10, 7, 1, 2);

        // Arms (skeletal - bone)
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(3, 6, 2, 4);
        ctx.fillRect(11, 6, 2, 4);

        // Hands (skeletal)
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(3, 10, 2, 1);
        ctx.fillRect(11, 10, 2, 1);

        // Legs (skeletal)
        ctx.fillStyle = '#808080';
        ctx.fillRect(6, 11, 2, 5);
        ctx.fillRect(8, 11, 2, 5);

        return canvas;
    }

    // Animal sprites
    generateWolf() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Back body (darker gray)
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(2, 7, 8, 5);

        // Front body (lighter gray)
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(8, 6, 5, 5);

        // Head (dark)
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(11, 4, 4, 4);

        // Snout (lighter)
        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(13, 5, 3, 2);

        // Ears (pointed)
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(11, 3, 1, 2);
        ctx.fillRect(13, 3, 1, 2);

        // Eyes (yellow)
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(12, 5, 1, 1);
        ctx.fillRect(14, 5, 1, 1);

        // Nose (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(14, 6, 1, 1);

        // Tail (curved)
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(1, 8, 2, 4);

        // Front legs
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(8, 11, 2, 5);
        ctx.fillRect(12, 11, 2, 5);

        // Back legs
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(4, 12, 2, 4);
        ctx.fillRect(6, 12, 2, 4);

        // Paws (darker)
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(8, 16, 2, 1);
        ctx.fillRect(12, 16, 2, 1);

        return canvas;
    }

    generateBear() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Body (dark brown fur)
        ctx.fillStyle = '#5A3D1F';
        ctx.fillRect(3, 6, 10, 8);

        // Head (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(8, 1, 5, 5);

        // Ears (rounded)
        ctx.fillStyle = '#654321';
        ctx.fillRect(8, 0, 2, 2);
        ctx.fillRect(11, 0, 2, 2);

        // Ear insides (lighter)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(8, 0, 1, 1);
        ctx.fillRect(11, 0, 1, 1);

        // Snout (lighter brown)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(9, 3, 3, 2);

        // Eyes (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 2, 1, 1);
        ctx.fillRect(11, 2, 1, 1);

        // Nose (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(10, 4, 1, 1);

        // Front legs (thick)
        ctx.fillStyle = '#4A3320';
        ctx.fillRect(4, 14, 3, 3);
        ctx.fillRect(9, 14, 3, 3);

        // Back/side body detail
        ctx.fillStyle = '#4A3320';
        ctx.fillRect(3, 12, 10, 2);

        // Paws (dark)
        ctx.fillStyle = '#1A0F0A';
        ctx.fillRect(4, 16, 3, 1);
        ctx.fillRect(9, 16, 3, 1);

        return canvas;
    }

    generateDeer() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Back body (reddish-brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(2, 8, 8, 5);

        // Front body (lighter)
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(8, 7, 4, 6);

        // Neck
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(10, 4, 2, 3);

        // Head (tan)
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(10, 2, 3, 4);

        // Snout (lighter tan)
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(12, 3, 2, 2);

        // Eyes (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(11, 3, 1, 1);

        // Nose (darker)
        ctx.fillStyle = '#654321';
        ctx.fillRect(13, 3, 1, 1);

        // Antlers (left)
        ctx.fillStyle = '#654321';
        ctx.fillRect(10, 0, 1, 2);
        ctx.fillRect(10, 1, 2, 1);

        // Antlers (right)
        ctx.fillStyle = '#654321';
        ctx.fillRect(12, 0, 1, 2);
        ctx.fillRect(11, 1, 2, 1);

        // White tail
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(2, 9, 1, 3);

        // Front legs (thin)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(9, 13, 1, 4);
        ctx.fillRect(11, 13, 1, 4);

        // Back legs (thin)
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(4, 13, 1, 4);
        ctx.fillRect(6, 13, 1, 4);

        // Hooves (dark)
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(9, 17, 1, 1);
        ctx.fillRect(11, 17, 1, 1);

        return canvas;
    }

    generateEagle() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Body (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(6, 8, 4, 5);

        // Chest (lighter brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(7, 9, 2, 3);

        // Head (dark)
        ctx.fillStyle = '#4A2511';
        ctx.fillRect(8, 5, 3, 4);

        // Beak (yellow)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(11, 6, 3, 1);
        ctx.fillRect(10, 7, 1, 1);

        // Eye (yellow)
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(10, 6, 1, 1);

        // Left wing (spread)
        ctx.fillStyle = '#654321';
        ctx.fillRect(1, 9, 5, 3);

        // Left wing detail
        ctx.fillStyle = '#4A2511';
        ctx.fillRect(1, 9, 5, 1);

        // Right wing (spread)
        ctx.fillStyle = '#654321';
        ctx.fillRect(10, 9, 5, 3);

        // Right wing detail
        ctx.fillStyle = '#4A2511';
        ctx.fillRect(10, 9, 5, 1);

        // Tail feathers (spread)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(5, 13, 4, 3);

        // Talons (gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(7, 12, 1, 2);
        ctx.fillRect(8, 12, 1, 2);

        return canvas;
    }

    generateFish() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');

        // Tail fin (left back)
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(1, 7, 2, 2);
        ctx.fillRect(1, 6, 2, 1);
        ctx.fillRect(1, 9, 2, 1);

        // Body (scales - orange)
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(3, 7, 8, 3);

        // Body highlight (lighter)
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(4, 7, 6, 1);

        // Head (orange)
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(11, 7, 3, 3);

        // Eye (black with white)
        ctx.fillStyle = '#000000';
        ctx.fillRect(12, 7, 1, 1);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(12, 7, 1, 1);

        // Gill (darker)
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(10, 8, 2, 1);

        // Dorsal fin (back top)
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(5, 6, 1, 1);
        ctx.fillRect(7, 6, 1, 1);

        // Dorsal fin (detail)
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(6, 5, 1, 1);

        // Bottom fin (front)
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(7, 10, 2, 1);

        // Tail fin (right back)
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(11, 7, 1, 3);
        ctx.fillRect(12, 6, 1, 1);
        ctx.fillRect(12, 10, 1, 1);

        // Belly (pale)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(4, 9, 6, 1);

        return canvas;
    }

    getSprite(type) {
        return this.sprites[type] || this.sprites.grass;
    }
}
