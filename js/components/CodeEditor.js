export class CodeEditor {
    constructor(containerId, language = 'python', theme = 'vs-dark') {
        this.containerId = containerId;
        this.language = language;
        this.theme = theme;
        this.editor = null;
        this.isReady = false;
    }

    async load() {
        return new Promise((resolve, reject) => {
            // Pastikan require ada
            if (typeof require === 'undefined') {
                console.error("Monaco Loader belum dimuat!");
                reject("Monaco not loaded");
                return;
            }

            require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
            
            require(['vs/editor/editor.main'], () => {
                const container = document.getElementById(this.containerId);
                if (!container) {
                    reject("Container tidak ditemukan!");
                    return;
                }

                this.editor = monaco.editor.create(container, {
                    value: '',
                    language: this.language,
                    theme: this.theme,
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: "14px",
                    autoClosingBrackets: true,
                    autoIndent: true,
                    tabSize: 4,
                    scrollBeyondLastLine: false,
                    lineNumbers: true,
                    readOnly: false, // PASTIKAN INI FALSE AGAR BISA DIKETIK
                    roundedSelection: true,
                    padding: { top: 10 }
                });
                this.isReady = true;
                
                // CEGAH PHASER MENCURI INPUT KEYBOARD DARI EDITOR
                container.addEventListener('mousedown', () => window.dispatchEvent(new KeyboardEvent('keyup')));
                container.addEventListener('keydown', (e) => e.stopPropagation());
                
                resolve(this.editor);
            });
        });
    }

    getValue() {
        return this.isReady ? this.editor.getValue() : '';
    }

    setValue(code) {
        if (this.isReady) {
            this.editor.setValue(code);
        }
    }
}
