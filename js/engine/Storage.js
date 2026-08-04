// Mengelola LocalStorage & IndexedDB
export const Storage = {
    savePlayer(player) {
        localStorage.setItem('codequest_player', JSON.stringify(player));
    },
    getPlayer() {
        const data = localStorage.getItem('codequest_player');
        return data ? JSON.parse(data) : { level: 1, xp: 0, gold: 0, inventory: [] };
    },
    saveProgress(language, levelId) {
        localStorage.setItem(`codequest_progress_${language}`, JSON.stringify({ lastLevel: levelId }));
    },
    getProgress(language) {
        const data = localStorage.getItem(`codequest_progress_${language}`);
        return data ? JSON.parse(data) : { lastLevel: 1 };
    }
};