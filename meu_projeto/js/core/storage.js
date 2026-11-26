/**
 * storage.js
 * Módulo centralizado de gerenciamento de armazenamento local e de sessão.
 * Padroniza a leitura, escrita e limpeza de dados no navegador.
 */

window.StorageManager = {
    // ==========================================
    // 1. MANIPULAÇÃO DE LOCALSTORAGE (DADOS PERSISTENTES)
    // ==========================================
    setLocal(key, value) {
        try {
            const serializedValue = typeof value === "object" ? JSON.stringify(value) : value;
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error(`StorageManager Error (setLocal): ${error}`);
            return false;
        }
    },

    getLocal(key, isJson = false) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) return null;
            return isJson ? JSON.parse(value) : value;
        } catch (error) {
            console.error(`StorageManager Error (getLocal): ${error}`);
            return null;
        }
    },

    removeLocal(key) {
        localStorage.removeItem(key);
    },

    // ==========================================
    // 2. MANIPULAÇÃO DE SESSIONSTORAGE (SESSÃO ATUAL)
    // ==========================================
    setSession(key, value) {
        try {
            const serializedValue = typeof value === "object" ? JSON.stringify(value) : value;
            sessionStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error(`StorageManager Error (setSession): ${error}`);
            return false;
        }
    },

    getSession(key, isJson = false) {
        try {
            const value = sessionStorage.getItem(key);
            if (value === null) return null;
            return isJson ? JSON.parse(value) : value;
        } catch (error) {
            console.error(`StorageManager Error (getSession): ${error}`);
            return null;
        }
    },

    removeSession(key) {
        sessionStorage.removeItem(key);
    },

    // ==========================================
    // 3. MÉTODOS ESPECÍFICOS DO REPOSITÓRIO
    // ==========================================
    isAuthorLoggedIn() {
        return this.getSession("isAuthorLoggedIn") === "true";
    },

    isDirectEditEnabled() {
        return this.getSession("directEditEnabled") === "true";
    },

    isMaintenanceActive() {
        return this.getLocal("site_maintenance") === "on";
    }
};

// Log de inicialização do storage
console.log("📦 Silver Fox Archives: StorageManager ready.");