import { ErrorAnalyzer } from './ErrorAnalyzer.js';

export class AITutor {
    constructor() {
        this.analyzer = new ErrorAnalyzer();
    }

    evaluate(code, expectedOutput, actualOutput, language) {
        // 1. Cek error statis dulu
        const error = this.analyzer.analyze(code, language);
        if (error) {
            return {
                status: 'error',
                message: `❌ ${error.type}: ${error.humanMessage}\n💡 Solusi: ${error.solution}\n✅ Contoh: ${error.example}`
            };
        }

        // 2. Cek output
        if (actualOutput.trim() === expectedOutput.trim()) {
            return {
                status: 'success',
                message: "✅ Luar biasa! Kode kamu benar. Konsep ini sangat penting untuk perjalananmu selanjutnya."
            };
        } else {
            return {
                status: 'error',
                message: `🤔 Output belum sesuai. Diharapkan: "${expectedOutput}", tapi dapat: "${actualOutput}". Periksa lagi logika cetakmu.`
            };
        }
    }
}