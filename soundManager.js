// Sound Manager - handles background music and effects
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.backgroundOscillator = null;
        this.backgroundGain = null;
        this.isPlaying = false;
        this.zoomThreshold = 1.5; // Sound only plays when zoomed >= 1.5x
        this.lastSoundEffect = 0;
        this.soundCooldown = 300; // ms between sound effects
        
        this.initAudio();
    }

    initAudio() {
        // Initialize Web Audio API
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.log('Web Audio API not supported');
            return;
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3; // 30% volume
        this.masterGain.connect(this.audioContext.destination);
    }

    playBackgroundMusic(zoom) {
        if (!this.audioContext || zoom < this.zoomThreshold) {
            this.stopBackgroundMusic();
            return;
        }

        if (!this.isPlaying) {
            this.startBackgroundMusic();
        }
    }

    startBackgroundMusic() {
        if (this.isPlaying || !this.audioContext) return;

        try {
            this.backgroundGain = this.audioContext.createGain();
            this.backgroundGain.gain.value = 0.15; // Quiet background
            this.backgroundGain.connect(this.masterGain);

            // Create ambient music using multiple oscillators for depth
            const now = this.audioContext.currentTime;

            // Base frequency (low tone)
            const bass = this.audioContext.createOscillator();
            bass.type = 'sine';
            bass.frequency.value = 55; // A1
            bass.connect(this.backgroundGain);
            bass.start(now);
            this.backgroundOscillator = bass;

            // Harmonic layer
            const harmonic = this.audioContext.createOscillator();
            harmonic.type = 'sine';
            harmonic.frequency.value = 110; // A2
            const harmonicGain = this.audioContext.createGain();
            harmonicGain.gain.value = 0.5;
            harmonic.connect(harmonicGain);
            harmonicGain.connect(this.backgroundGain);
            harmonic.start(now);

            this.isPlaying = true;
        } catch (e) {
            console.log('Background music error:', e);
        }
    }

    stopBackgroundMusic() {
        if (this.isPlaying && this.backgroundOscillator) {
            try {
                this.backgroundOscillator.stop();
                this.isPlaying = false;
            } catch (e) {
                // Already stopped
            }
        }
    }

    playCreatureSound(zoom, creatureType = 'generic') {
        if (!this.audioContext || zoom < this.zoomThreshold) return;

        const now = Date.now();
        if (now - this.lastSoundEffect < this.soundCooldown) return;
        this.lastSoundEffect = now;

        try {
            const oscGain = this.audioContext.createGain();
            oscGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            oscGain.connect(this.masterGain);

            const osc = this.audioContext.createOscillator();
            osc.connect(oscGain);

            // Different sounds for different creatures
            let baseFreq = 400;
            let duration = 0.1;

            switch (creatureType) {
                case 'human':
                    baseFreq = 350 + Math.random() * 150;
                    duration = 0.12;
                    osc.type = 'sine';
                    break;
                case 'wolf':
                    baseFreq = 200 + Math.random() * 150;
                    duration = 0.15;
                    osc.type = 'square';
                    break;
                case 'bird':
                case 'eagle':
                    baseFreq = 800 + Math.random() * 400;
                    duration = 0.08;
                    osc.type = 'sine';
                    break;
                case 'fish':
                    baseFreq = 600 + Math.random() * 300;
                    duration = 0.1;
                    osc.type = 'triangle';
                    break;
                case 'bear':
                    baseFreq = 150 + Math.random() * 100;
                    duration = 0.2;
                    osc.type = 'sine';
                    break;
                case 'deer':
                    baseFreq = 500 + Math.random() * 200;
                    duration = 0.1;
                    osc.type = 'sine';
                    break;
                default:
                    baseFreq = 400 + Math.random() * 200;
                    duration = 0.1;
                    osc.type = 'sine';
            }

            osc.frequency.value = baseFreq;
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log('Creature sound error:', e);
        }
    }

    playHazardSound(zoom, hazardType = 'generic') {
        if (!this.audioContext || zoom < this.zoomThreshold) return;

        const now = Date.now();
        if (now - this.lastSoundEffect < this.soundCooldown) return;
        this.lastSoundEffect = now;

        try {
            const oscGain = this.audioContext.createGain();
            oscGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            oscGain.connect(this.masterGain);

            const osc = this.audioContext.createOscillator();
            osc.connect(oscGain);

            let baseFreq = 100;
            let duration = 0.3;

            switch (hazardType) {
                case 'meteor':
                    baseFreq = 300;
                    duration = 0.4;
                    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
                    osc.type = 'sine';
                    break;
                case 'lightning':
                    baseFreq = 800 + Math.random() * 400;
                    duration = 0.05;
                    osc.type = 'square';
                    break;
                case 'volcano':
                    baseFreq = 80;
                    duration = 0.5;
                    osc.type = 'sine';
                    break;
                case 'earthquake':
                    baseFreq = 40 + Math.random() * 20;
                    duration = 0.6;
                    osc.type = 'sine';
                    break;
                default:
                    baseFreq = 200;
                    duration = 0.2;
                    osc.type = 'sine';
            }

            if (hazardType !== 'meteor') {
                osc.frequency.value = baseFreq;
            }

            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log('Hazard sound error:', e);
        }
    }

    destroy() {
        this.stopBackgroundMusic();
        if (this.audioContext) {
            try {
                this.audioContext.close();
            } catch (e) {
                // Already closed
            }
        }
    }
}
