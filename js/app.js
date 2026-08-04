import { RPGSystem } from './engine/RPGSystem.js';
import { AITutor } from './engine/AITutor.js';
import { CodeEditor } from './components/CodeEditor.js';
import { CodeGateScene } from '../games/CodeGate.js';

// Data 15 Bahasa Pemrograman
const LANGUAGES = [
    { id: 'python', name: 'Python Kingdom', icon: '🐍', desc: 'Bahasa paling mudah untuk pemula. Sintaksnya mirip bahasa Inggris.', locked: false },
    { id: 'javascript', name: 'JavaScript City', icon: '⚡', desc: 'Bahasa web. Membuat website hidup dan interaktif.', locked: false },
    { id: 'html', name: 'HTML Village', icon: '🧱', desc: 'Kerangka dasar semua website di dunia.', locked: false },
    { id: 'css', name: 'CSS Garden', icon: '🎨', desc: 'Mempercantik dan mewarnai halaman web.', locked: false },
    { id: 'sql', name: 'SQL Underground', icon: '🗄️', desc: 'Mengolah data dan database.', locked: true },
    { id: 'c', name: 'C Fortress', icon: '🏰', desc: 'Bahasa tingkat rendah, cepat dan kuat.', locked: true },
    { id: 'cpp', name: 'C++ Citadel', icon: '⚔️', desc: 'Untuk membuat game engine dan sistem.', locked: true },
    { id: 'java', name: 'Java Empire', icon: '☕', desc: 'Bahasa enterprise dan Android.', locked: true },
    { id: 'go', name: 'Go Island', icon: '🚀', desc: 'Bahasa modern buatan Google.', locked: true },
    { id: 'rust', name: 'Rust Mountain', icon: '🦀', desc: 'Aman, cepat, dan paralel.', locked: true },
    { id: 'php', name: 'PHP Desert', icon: '🐪', desc: 'Bahasa server web legendaris.', locked: true },
    { id: 'typescript', name: 'TypeScript Lab', icon: '🧪', desc: 'JavaScript dengan tipe data yang ketat.', locked: true },
    { id: 'kotlin', name: 'Kotlin Temple', icon: '🛕', desc: 'Modern, untuk Android dan backend.', locked: true },
    { id: 'swift', name: 'Swift Harbor', icon: '⛵', desc: 'Bahasa resmi untuk iOS dan Mac.', locked: true },
    { id: 'lua', name: 'Lua Sanctuary', icon: '🌙', desc: 'Bahasa scripting ringan untuk game.', locked: true }
];

// Data Pelajaran (Kombinasi instruksi ID + Kode/Output EN)
const LESSONS = [
    {
        id: 0,
        title: "Level 1: Hello World",
        theory: "Setiap programmer di dunia selalu memulai perjalanan mereka dengan satu magic spell (mantra) yang sama: `Hello World`.\n\nDi Python, kita menggunakan fungsi `print()` untuk menyuruh komputer menampilkan teks di layar. Teks yang ingin ditampilkan harus diapit oleh tanda kutip (\" \").\n\nContoh: `print(\"Hello\")`",
        story: "🎯 Misi:\nLengkapi kode di editor agar menghasilkan output persis seperti ini:\n\nHello World",
        expectedOutput: "Hello World",
        starterCode: "print(\"____\")",
        hints: [
            "Hapus garis bawah (____) di dalam tanda kutip.", 
            "Ganti dengan teks Hello World.", 
            "Pastikan ejaan dan huruf besarnya tepat.", 
            "Jawaban: print(\"Hello World\")"
        ]
    },
    {
        id: 1,
        title: "Level 2: Variables (Variabel)",
        theory: "Variabel adalah tempat untuk menyimpan data, seperti sebuah 'KOTAK' yang diberi label nama.\n\nJika kita tulis: `name = \"Arthur\"`\nArtinya kita membuat kotak bernama `name`, lalu memasukkan tulisan `Arthur` ke dalamnya. Saat kita `print(name)`, komputer akan mengambil isi kotak tersebut.",
        story: "🎯 Misi:\nBuat variabel bernama `name` dan isi dengan nama 'Code Master'. Lalu tampilkan variabel tersebut ke layar agar outputnya:\n\nCode Master",
        expectedOutput: "Code Master",
        starterCode: "# Ketik kodemu di bawah ini\n",
        hints: [
            "Buat variabel dengan format: name = \"...\"", 
            "Isi dengan Code Master di dalam tanda kutip.", 
            "Jangan lupa gunakan print(name) di baris kedua.", 
            "Jawaban:\nname = \"Code Master\"\nprint(name)"
        ]
    },
    {
        id: 2,
        title: "Level 3: Basic Math (Operasi Matematika)",
        theory: "Komputer adalah kalkulator super canggih. Kamu bisa langsung meminta Python menghitung angka tanpa tanda kutip.\n\nContoh: `print(10 + 5)` akan menghasilkan `15`. Tanda tambah (+) disebut operator.",
        story: "🎯 Misi:\nGunakan operator penjumlahan (+) di dalam fungsi print() agar komputer menghasilkan output:\n\n42",
        expectedOutput: "42",
        starterCode: "print(20 + __)",
        hints: [
            "Ganti garis bawah dengan angka.", 
            "Hasilnya harus 42. Jika 20 + x = 42, berarti x adalah...", 
            "22", 
            "Jawaban: print(20 + 22)"
        ]
    }
];

class CodeQuestApp {
    constructor() {
        this.rpg = new RPGSystem();
        this.tutor = new AITutor();
        this.currentLesson = LESSONS[0];
        this.hintIndex = 0;
        this.codeEditor = new CodeEditor('editor-container', 'python', 'vs-dark');
        this.phaserGame = null;
    }

    async init(language = 'python') {
        this.switchScreen('app-screen');
        this.rpg.updateUI();
        
        if (!this.codeEditor.isReady) {
            await this.codeEditor.load();
        }
        
        this.initPhaserGame();
        
        // Jika game sudah ada, restart scenenya
        if (this.phaserGame && this.phaserGame.scene.scenes[0]) {
            this.phaserGame.scene.scenes[0].scene.start();
        }
        
        this.setupAppListeners();
        this.renderLesson();
        this.switchPage('theory'); // Selalu mulai dari halaman teori
    }

    initPhaserGame() {
        if (this.phaserGame) return;
        const config = {
            type: Phaser.AUTO, parent: 'game-container',
            width: '100%', height: '100%',
            scale: { mode: Phaser.Scale.RESIZE },
            physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
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

    switchPage(pageName) {
        document.getElementById('page-theory').classList.toggle('active', pageName === 'theory');
        document.getElementById('page-practice').classList.toggle('active', pageName === 'practice');
    }

    switchScreen(screenId, pushHistory = true) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        // Trik browser agar tombol back fisik berfungsi
        if (pushHistory) {
            history.pushState({ screen: screenId }, "", `#${screenId}`);
        }
    }

    setupAppListeners() {
        document.getElementById('goto-practice-btn').onclick = () => this.switchPage('practice');
        document.getElementById('goto-theory-btn').onclick = () => this.switchPage('theory');
        document.getElementById('run-code').onclick = () => this.runCode();
        document.getElementById('hint-btn').onclick = () => this.showHint();
        
        // TAMBAHKAN INI: Fungsi kembali ke peta
        document.getElementById('back-to-map-btn').onclick = () => {
            this.switchScreen('map-screen');
            // Hentikan game Phaser sementara agar tidak boros memori
            if (this.phaserGame) {
                this.phaserGame.scene.scenes[0].scene.stop();
            }
        };
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
        tutorBox.innerHTML = `<p><b>🤖 AI Tutor:</b> ${result.message.replace(/\n/g, '<br>')}</p>`;

        if (result.status === 'success') {
            this.rpg.addXP(50);
            this.rpg.addGold(10);
            const activeScene = this.phaserGame.scene.scenes[0];
            if (activeScene) activeScene.unlockGate();
            
            setTimeout(() => {
                if (LESSONS[this.currentLesson.id + 1]) {
                    this.currentLesson = LESSONS[this.currentLesson.id + 1];
                    this.renderLesson();
                    this.switchPage('theory');
                    if (activeScene) activeScene.scene.restart();
                }
            }, 3000);
        }
    }

    showHint() {
        if (this.hintIndex < this.currentLesson.hints.length) {
            alert(`Hint ${this.hintIndex + 1}: ${this.currentLesson.hints[this.hintIndex]}`);
            this.hintIndex++;
        } else {
            alert("Tidak ada hint lagi!");
        }
    }
}

// --- GLOBAL EVENT LISTENERS (Dijalankan saat halaman dimuat) ---
document.addEventListener('DOMContentLoaded', () => {
    const app = new CodeQuestApp();

    // 1. Tombol Masuk Dunia Digital
    document.getElementById('start-game-btn').addEventListener('click', () => {
        app.switchScreen('map-screen');
    });

    // 2. Render 15 Bahasa Pemrograman
    const grid = document.getElementById('kingdom-grid');
    LANGUAGES.forEach(lang => {
        const card = document.createElement('div');
        card.className = `kingdom-card ${lang.locked ? 'locked' : ''}`;
        card.innerHTML = `
            <span class="lang-icon">${lang.icon}</span>
            <h3>${lang.name}</h3>
            <p>${lang.desc}</p>
        `;
        if (!lang.locked) {
            card.addEventListener('click', () => app.init(lang.id));
        }
        grid.appendChild(card);
    });

    // 3. EVENT LISTENER UNTUK TOMBOL BACK FISIK HP/LAPTOP
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.screen) {
            // Kembalikan layar sesuai history tanpa menambah history baru
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(event.state.screen).classList.add('active');
            
            // Jika kembali ke peta, hentikan game Phaser agar tidak boros baterai/memori
            if (event.state.screen !== 'app-screen' && app.phaserGame) {
                const scene = app.phaserGame.scene.scenes[0];
                if (scene && scene.scene.isActive()) {
                    scene.scene.stop();
                }
            }
        } else {
            // Jika tidak ada state (kembali ke awal mula), tampilkan welcome screen
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('welcome-screen').classList.add('active');
        }
    });
});
