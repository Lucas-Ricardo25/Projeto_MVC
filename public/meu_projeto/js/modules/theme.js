/**
 * theme.js
 * Módulo de gerenciamento e alternância de temas (Dark / Light) do Silver Fox Archives.
 * Integra-se ao StorageManager e ao Bootstrap 5.3 data-bs-theme.
 */

window.ThemeManager = {
    // Chave padrão para o localStorage
    STORAGE_KEY: "site_theme",

    /**
     * Inicializa o tema ao carregar a página
     */
    init() {
        const savedTheme = this.getPreferredTheme();
        this.applyTheme(savedTheme);
        this.bindEvents();
    },

    /**
     * Recupera o tema salvo ou retorna o padrão ('dark')
     */
    getPreferredTheme() {
        if (window.StorageManager) {
            return window.StorageManager.getLocal(this.STORAGE_KEY) || "dark";
        }
        return localStorage.getItem(this.STORAGE_KEY) || "dark";
    },

    /**
     * Aplica o tema ao elemento <html> do documento
     * @param {string} theme - 'dark' ou 'light'
     */
    applyTheme(theme) {
        document.documentElement.setAttribute("data-bs-theme", theme);
        
        if (window.StorageManager) {
            window.StorageManager.setLocal(this.STORAGE_KEY, theme);
        } else {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }

        // Atualiza a interface (botões de toggle ou selects, se existirem)
        this.updateUI(theme);
    },

    /**
     * Alterna entre os temas 'dark' e 'light'
     */
    toggleTheme() {
        const currentTheme = this.getPreferredTheme();
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        this.applyTheme(newTheme);
    },

    /**
     * Atualiza elementos da interface relacionados ao tema
     * @param {string} theme 
     */
    updateUI(theme) {
        // Atualiza seletores de tema (ex: admin/configuracoes.html)
        const themeSelect = document.getElementById("defaultTheme");
        if (themeSelect) {
            themeSelect.value = theme;
        }

        // Atualiza ícones ou textos de botões de alternância se existirem na página
        const toggleBtns = document.querySelectorAll(".btn-theme-toggle");
        toggleBtns.forEach(btn => {
            btn.textContent = theme === "dark" ? "🌙 Escuro" : "☀️ Claro";
        });
    },

    /**
     * Registra os eventos de clique nos botões e seletores de tema
     */
    bindEvents() {
        // Evento em botões de alternância direta
        document.querySelectorAll(".btn-theme-toggle").forEach(btn => {
            btn.addEventListener("click", () => this.toggleTheme());
        });

        // Evento em select de configurações
        const themeSelect = document.getElementById("defaultTheme");
        if (themeSelect) {
            themeSelect.addEventListener("change", (e) => {
                this.applyTheme(e.target.value);
            });
        }
    }
};

// Executa a inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    window.ThemeManager.init();
});