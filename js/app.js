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

// Data Pelajaran (Hardcode untuk menghindari error CORS JSON)
const LESSONS = [
    {
        id: 0,
        title: "Level 1: Sinyal Pertama",
        theory: "Komputer adalah mesin yang sangat pintar tapi butuh perintah yang tepat. Di Python, kita menggunakan fungsi `print()` untuk menyuruh komputer menampilkan teks di layar.\n\nAnalogi: Bayangkan `print()` adalah seorang kurir. Apa pun tulisan yang kamu berikan di dalam tanda kurung dan diapit tanda kutip (\" \"), akan disampaikannya ke layar.",
        story: "Gerbang Python Kingdom terkunci! Untuk membukanya, kita harus mengirimkan sinyal 'Halo Dunia!' ke terminal gerbang. Kode sudah disiapkan, tinggal tekan Run Code!",
        expectedOutput: "Halo Dunia!",
        starterCode: "print(\"Halo Dunia!\")",
        hints: ["Kamu tidak perlu mengetik apa-apa.", "Cukup tekan tombol Run Code.", "Pastikan kode tidak berubah.", "Kode: print(\"Halo Dunia!\")"]
    },
    {
        id: 1,
        title: "Level 2: Variabel",
        theory: "Variabel adalah tempat untuk menyimpan data. Bayangkan variabel seperti sebuah 'KOTAK' yang diberi label nama.\n\nJika kita tulis: `nama = \"Budi\"`\nArtinya kita membuat kotak bernama `nama`, lalu memasukkan tulisan `Budi` ke dalamnya.",
        story: "Museum Python butuh label. Buat variabel bernama `benda` dan isi dengan 'Pedang Kayu', lalu tampilkan!",
        expectedOutput: "Pedang Kayu",
        starterCode: "benda = \"Pedang Kayu\"\nprint(benda)",
        hints: ["Perhatikan huruf besar/kecil.", "Gunakan tanda kutip untuk teks.", "Variabel tanpa kutip, teks dengan kutip.", "Kode: benda = \"Pedang Kayu\""]
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
});
