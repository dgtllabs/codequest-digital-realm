import { RPGSystem } from './engine/RPGSystem.js';
import { AITutor } from './engine/AITutor.js';
import { CodeEditor } from './components/CodeEditor.js';
import { CodeGateScene } from '../games/CodeGate.js';
import pythonLessons from '../lessons/python.json' assert { type: 'json' };

class CodeQuestApp {
    constructor() {
        this.rpg = new RPGSystem();
        this.tutor = new AITutor();
        this.lessons = pythonLessons;
        this.currentLesson = null;
        this.hintIndex = 0;
        
        this.codeEditor = new CodeEditor('editor-container', 'python', 'vs-dark');
        this.phaserGame = null;
    }

    async init(language = 'python') {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('map-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        
        this.rpg.updateUI();
        this.currentLesson = this.lessons[0];
        
        if (!this.codeEditor.isReady) {
            await this.codeEditor.load();
        }
        
        this.initPhaserGame();
        this.setupEventListeners();
        this.renderLesson();
        this.switchPage('theory'); // Selalu mulai dari halaman teori
    }

    initPhaserGame() {
        if (this.phaserGame) return;
        const config = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width: '100%', height: '100%',
            scale: { mode: Phaser.Scale.RESIZE },
            physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
            scene: [CodeGateScene]
        };
        this.phaserGame = new Phaser.Game(config);
    }

    renderLesson() {
        document.getElementById('lesson-title').innerText = this.currentLesson.title;
        document.getElementById('lesson-theory').innerText = this.currentLesson.theory;
        document.getElementById('lesson-description').innerText = this.currentLesson.story;
        this.codeEditor.setValue(this.currentLesson.starterCode);
    }

    // Fungsi untuk berpindah halaman
    switchPage(pageName) {
        document.getElementById('page-theory').classList.toggle('active', pageName === 'theory');
        document.getElementById('page-practice').classList.toggle('active', pageName === 'practice');
    }

    setupEventListeners() {
        // Navigasi Halaman
        document.getElementById('goto-practice-btn').addEventListener('click', () => this.switchPage('practice'));
        document.getElementById('goto-theory-btn').addEventListener('click', () => this.switchPage('theory'));
        
        // Run dan Hint
        document.getElementById('run-code').addEventListener('click', () => this.runCode());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
    }

    runCode() {
        const code = this.codeEditor.getValue();
        let output = '';
        
        const printMatch = code.match(/print\(["'](.*)["']\)/);
        if (printMatch) output = printMatch[1];
        
        const varMatch = code.match(/=\s*["'](.*)["']/);
        if (varMatch && !printMatch) output = varMatch[1];

        const result = this.tutor.evaluate(code, this.currentLesson.expectedOutput, output, 'python');
        
        const tutorBox = document.getElementById('ai-tutor');
        tutorBox.className = 'tutor-box ' + result.status;
        tutorBox.innerHTML = `<p><b>AI Tutor:</b> ${result.message.replace(/\n/g, '<br>')}</p>`;

        if (result.status === 'success') {
            this.rpg.addXP(50);
            this.rpg.addGold(10);
            const activeScene = this.phaserGame.scene.scenes[0];
            if (activeScene && activeScene.unlockGate) activeScene.unlockGate();
            
            setTimeout(() => {
                if (this.lessons[this.currentLesson.id]) {
                    this.currentLesson = this.lessons[this.currentLesson.id];
                    this.renderLesson();
                    this.switchPage('theory'); // Kembali ke teori untuk level selanjutnya
                    if (activeScene && activeScene.scene) activeScene.scene.restart();
                }
            }, 3000);
        }
    }

    showHint() {
        if (this.hintIndex < this.currentLesson.hints.length) {
            alert(`Hint ${this.hintIndex + 1}: ${this.currentLesson.hints[this.hintIndex]}`);
            this.hintIndex++;
        } else {
            alert("Tidak ada hint lagi. Kamu pasti bisa!");
        }
    }
}

const app = new CodeQuestApp();

// Navigasi Awal
document.getElementById('start-game-btn').addEventListener('click', () => {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('map-screen').style.display = 'flex';
});

document.querySelectorAll('.kingdom-card').forEach(card => {
    card.addEventListener('click', () => {
        if (!card.classList.contains('locked')) {
            app.init(card.dataset.lang);
        }
    });
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
}
