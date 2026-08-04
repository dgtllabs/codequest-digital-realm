export class CodeEditor {
    constructor(containerId, language = 'python', theme = 'vs-dark') {
        this.containerId = containerId;
        this.language = language;
        this.theme = theme;
        this.editor = null;
        this.isReady = false;
    }

    // Memuat library Monaco secara dinamis
    async load() {
        return new Promise((resolve) => {
            require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
            
            require(['vs/editor/editor.main'], () => {
                this.editor = monaco.editor.create(document.getElementById(this.containerId), {
                    value: '',
                    language: this.language,
                    theme: this.theme,
                    automaticLayout: true, // Auto-resize
                    minimap: { enabled: false }, // Sembunyikan minimap untuk UI yang bersih
                    fontSize: "14px",
                    autoClosingBrackets: true, // Otomatis tutup kurung/quote
                    autoIndent: true, // Otomatis indent
                    tabSize: 4,
                    scrollBeyondLastLine: false,
                    lineNumbers: true, // Wajib ada
                    roundedSelection: true,
                    padding: { top: 10 }
                });
                this.isReady = true;
                resolve(this.editor);
            });
        });
    }

    // Mengambil teks kode dari editor
    getValue() {
        return this.isReady ? this.editor.getValue() : '';
    }

    // Memasukkan teks ke dalam editor
    setValue(code) {
        if (this.isReady) {
            this.editor.setValue(code);
        }
    }

    // Mengganti bahasa pemrograman (misal dari Python ke JS)
    setLanguage(language) {
        if (this.isReady) {
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
        }
    }

    // Mengganti tema (Dark/Light)
    setTheme(theme) {
        if (this.isReady) {
            monaco.editor.setTheme(theme);
        }
    }
}