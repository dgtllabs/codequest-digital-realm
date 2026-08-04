export class CodeGateScene extends Phaser.Scene {
    constructor() {
        super('CodeGateScene');
    }

    create() {
        this.add.text(400, 100, 'Python Kingdom Gate', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        
        // Karakter
        this.player = this.add.rectangle(100, 400, 40, 40, 0xe94560);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Gerbang (Door)
        this.gate = this.add.rectangle(700, 400, 40, 80, 0x0f3460);
        this.physics.add.existing(this.gate, true);

        // Tanah
        this.ground = this.add.rectangle(400, 450, 800, 20, 0x555);
        this.physics.add.existing(this.gate, true);
        this.physics.add.collider(this.player, this.ground);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.isUnlocked = false;
    }

    update() {
        if (this.cursors.left.isDown) this.player.body.setVelocityX(-160);
        else if (this.cursors.right.isDown) this.player.body.setVelocityX(160);
        else this.player.body.setVelocityX(0);

        if (this.isUnlocked && this.player.x > 650) {
            this.add.text(400, 200, 'YOU ESCAPED!', { fontSize: '40px', fill: '#0f0' }).setOrigin(0.5);
            this.scene.pause();
        }
    }

    // Method ini dipanggil dari App.js saat kode benar
    unlockGate() {
        this.isUnlocked = true;
        this.gate.setFillStyle(0x00ff00);
        this.tweens.add({
            targets: this.gate,
            y: 350,
            duration: 1000,
            ease: 'Power2'
        });
    }
}
