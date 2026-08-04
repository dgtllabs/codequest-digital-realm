import { RPGSystem } from './engine/RPGSystem.js';
import { AITutor } from './engine/AITutor.js';
import { CodeEditor } from './components/CodeEditor.js';
import { CodeGateScene } from '../games/CodeGate.js';
import pythonLessons from '../lessons/python.json' assert { type: 'json' };

class CodeQuestApp {
    constructor() {
        this.rpg = new RPGSystem();
        this.tutor = new AITutor();
        this.currentLesson = pythonLessons[0];
        this.hintIndex = 0;
        
        // Inisialisasi Code Editor sebagai komponen terpisah
        this.codeEditor = new CodeEditor('editor-container', 'python', 'vs-dark');
        
        this.phaserGame = null;
    }

    async init() {
        this.rpg.updateUI();
        
        // Muat editor secara asynchronous
        await this.codeEditor.load();
        this.codeEditor.setValue(this.currentLesson.starterCode);
        
        this.initPhaserGame();
        this.setupEventListeners();
        this.renderLesson();
    }

    initPhaserGame() {
        const config = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width: '100%',
            height: '100%',
            scale: { mode: Phaser.Scale.RESIZE },
            physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
            scene: [CodeGateScene]
        };
        this.phaserGame = new Phaser.Game(config);
    }

    renderLesson() {
        document.getElementById('lesson-title').innerText = this.currentLesson.title;
        document.getElementById('lesson-description').innerText = this.currentLesson.story;
        
        // Gunakan method dari komponen CodeEditor
        this.codeEditor.setValue(this.currentLesson.starterCode);
    }

    setupEventListeners() {
        document.getElementById('run-code').addEventListener('click', () => this.runCode());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
    }

    runCode() {
        // Ambil kode dari komponen CodeEditor
        const code = this.codeEditor.getValue();
        let output = '';
        
        // Simulasi eksekusi kode (Regex sederhana untuk demo GitHub Pages)
        const printMatch = code.match(/print\(["'](.*)["']\)/);
        if (printMatch) output = printMatch[1];
        
        const varMatch = code.match(/=\s*["'](.*)["']/);
        if (varMatch && !printMatch) output = varMatch[1];

        // Evaluasi oleh AI Tutor
        const result = this.tutor.evaluate(code, this.currentLesson.expectedOutput, output, 'python');
        
        const tutorBox = document.getElementById('ai-tutor');
        tutorBox.className = 'tutor-box ' + result.status;
        tutorBox.innerHTML = `<p><b>AI Tutor:</b> ${result.message.replace(/\n/g, '<br>')}</p>`;

        if (result.status === 'success') {
            this.rpg.addXP(50);
            this.rpg.addGold(10);
            
            // Buka gerbang di game Phaser
            const activeScene = this.phaserGame.scene.scenes[0];
            activeScene.unlockGate();
            
            // Lanjut ke level berikutnya
            setTimeout(() => {
                if (pythonLessons[this.currentLesson.id]) {
                    this.currentLesson = pythonLessons[this.currentLesson.id];
                    this.renderLesson();
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

// Inisialisasi Aplikasi
const app = new CodeQuestApp();
window.addEventListener('DOMContentLoaded', () => app.init());

// Register Service Worker untuk PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
}