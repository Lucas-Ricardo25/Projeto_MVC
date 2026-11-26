/**
 * reader.js
 * Módulo de Interface e Ajustes de Leitura (Reader View) do Silver Fox Archives.
 * Controla tamanho de fonte, família tipográfica, progresso de leitura e preferências do leitor.
 */

window.ReaderManager = {
    // Configurações e chaves padrão de armazenamento
    STORAGE_KEY_SETTINGS: "silver_fox_reader_settings",
    
    // Valores padrão para o leitor
    defaultSettings: {
        fontSize: 18,       // Tamanho em px (min: 14px, max: 26px)
        fontFamily: "serif", // 'serif' (Spectral) ou 'sans' (Sistema)
        containerWidth: 800  // Largura máxima do leitor em px
    },

    /**
     * Inicializa os controles e ouvintes do leitor na página
     */
    init() {
        this.readerContainer = document.getElementById("readerContent");
        this.readerWrapper = document.getElementById("readerWrapper");
        
        // Se a página atual não possuir um container de leitura, encerra
        if (!this.readerContainer) return;

        this.settings = this.loadSettings();
        this.applySettings();
        this.bindControls();
        this.initProgressBar();
    },

    /**
     * Carrega as preferências salvas do leitor
     */
    loadSettings() {
        if (window.StorageManager) {
            const saved = window.StorageManager.getLocal(this.STORAGE_KEY_SETTINGS, true);
            return saved ? { ...this.defaultSettings, ...saved } : { ...this.defaultSettings };
        }
        const data = localStorage.getItem(this.STORAGE_KEY_SETTINGS);
        return data ? { ...this.defaultSettings, ...JSON.parse(data) } : { ...this.defaultSettings };
    },

    /**
     * Salva as preferências atuais
     */
    saveSettings() {
        if (window.StorageManager) {
            window.StorageManager.setLocal(this.STORAGE_KEY_SETTINGS, this.settings);
        } else {
            localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
        }
    },

    /**
     * Aplica as configurações visuais ao container de texto
     */
    applySettings() {
        if (this.readerContainer) {
            this.readerContainer.style.fontSize = `${this.settings.fontSize}px`;
            this.readerContainer.style.lineHeight = "1.8";

            if (this.settings.fontFamily === "serif") {
                this.readerContainer.style.fontFamily = "var(--vmw-font-primary, 'Spectral', Georgia, serif)";
            } else {
                this.readerContainer.style.fontFamily = "var(--vmw-font-sans, system-ui, sans-serif)";
            }
        }

        if (this.readerWrapper) {
            this.readerWrapper.style.maxWidth = `${this.settings.containerWidth}px`;
            this.readerWrapper.style.margin = "0 auto";
        }

        this.updateControlUI();
    },

    /**
     * Aumenta o tamanho do texto
     */
    increaseFontSize() {
        if (this.settings.fontSize < 26) {
            this.settings.fontSize += 2;
            this.applySettings();
            this.saveSettings();
        }
    },

    /**
     * Diminui o tamanho do texto
     */
    decreaseFontSize() {
        if (this.settings.fontSize > 14) {
            this.settings.fontSize -= 2;
            this.applySettings();
            this.saveSettings();
        }
    },

    /**
     * Alterna a família tipográfica (Serif <-> Sans-serif)
     */
    toggleFontFamily() {
        this.settings.fontFamily = this.settings.fontFamily === "serif" ? "sans" : "serif";
        this.applySettings();
        this.saveSettings();
    },

    /**
     * Atualiza os indicadores de controle na interface (se existirem)
     */
    updateControlUI() {
        const fontDisplay = document.getElementById("fontSizeDisplay");
        if (fontDisplay) {
            fontDisplay.textContent = `${this.settings.fontSize}px`;
        }

        const fontBtn = document.getElementById("btnToggleFont");
        if (fontBtn) {
            fontBtn.textContent = this.settings.fontFamily === "serif" ? "Fonte: Serif" : "Fonte: Sans";
        }
    },

    /**
     * Registra os eventos nos botões da barra de ferramentas do leitor
     */
    bindControls() {
        const btnIncrease = document.getElementById("btnFontIncrease");
        const btnDecrease = document.getElementById("btnFontDecrease");
        const btnFontToggle = document.getElementById("btnToggleFont");

        if (btnIncrease) {
            btnIncrease.addEventListener("click", () => this.increaseFontSize());
        }

        if (btnDecrease) {
            btnDecrease.addEventListener("click", () => this.decreaseFontSize());
        }

        if (btnFontToggle) {
            btnFontToggle.addEventListener("click", () => this.toggleFontFamily());
        }
    },

    /**
     * Inicializa a barra de progresso de leitura vinculada à rolagem da página
     */
    initProgressBar() {
        const progressBar = document.getElementById("readingProgressBar");
        if (!progressBar) return;

        window.addEventListener("scroll", () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight <= 0) return;

            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        });
    }
};

// Executa a inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    window.ReaderManager.init();
});