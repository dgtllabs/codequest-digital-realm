import { Storage } from './Storage.js';

export class RPGSystem {
    constructor() {
        this.player = Storage.getPlayer();
    }

    addXP(amount) {
        this.player.xp += amount;
        // Level sederhana: 100 XP per level
        while (this.player.xp >= this.player.level * 100) {
            this.player.xp -= this.player.level * 100;
            this.player.level += 1;
            alert(`Level Up! Kamu sekarang Level ${this.player.level}`);
        }
        this.updateUI();
        Storage.savePlayer(this.player);
    }

    addGold(amount) {
        this.player.gold += amount;
        this.updateUI();
        Storage.savePlayer(this.player);
    }

    updateUI() {
        document.getElementById('player-level').innerText = this.player.level;
        document.getElementById('player-xp').innerText = this.player.xp;
        document.getElementById('player-gold').innerText = this.player.gold;
    }
}