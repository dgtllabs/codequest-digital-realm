export class ErrorAnalyzer {
    analyze(code, language) {
        if (language === 'python') {
            // Cek kutip tidak tertutup
            const openQuotes = (code.match(/"/g) || []).length;
            if (openQuotes % 2 !== 0) {
                return {
                    type: 'SyntaxError',
                    humanMessage: "Tanda kutip penutup belum ditemukan. Python bingung di mana teks berakhir.",
                    solution: "Pastikan setiap tanda kutip buka (\") memiliki pasangan tutup (\").",
                    example: 'print("Hello World")'
                };
            }
            // Cek typo pritn
            if (code.includes('pritn(')) {
                return {
                    type: 'TypoError',
                    humanMessage: "Sepertinya ada kesalahan ketik. Apakah yang dimaksud adalah 'print'?",
                    solution: "Ganti 'pritn' dengan 'print'.",
                    example: 'print("Hello World")'
                };
            }
            // Cek if x=5
            if (/if\s+\w+\s*=\s*\w+/i.test(code)) {
                return {
                    type: 'OperatorError',
                    humanMessage: "Gunakan operator '==' untuk membandingkan nilai, bukan '='.",
                    solution: "Tanda '=' digunakan untuk memberi nilai (assignment), '==' untuk mengecek apakah sama.",
                    example: 'if x == 5:'
                };
            }
        }
        return null;
    }
}