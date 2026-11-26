/**
 * notifications.js
 * Módulo de Notificações, Toasts e Alertas Temporários.
 * Exibe mensagens de feedback visual elegantes no canto da tela sem interromper a navegação.
 */

window.NotificationManager = {
    // Container principal de notificações
    container: null,

    /**
     * Garante que o container de toasts exista no DOM
     */
    initContainer() {
        if (!this.container) {
            let existContainer = document.getElementById("toastNotificationContainer");
            if (!existContainer) {
                existContainer = document.createElement("div");
                existContainer.id = "toastNotificationContainer";
                existContainer.style.cssText = `
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 1090;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 360px;
                    pointer-events: none;
                `;
                document.body.appendChild(existContainer);
            }
            this.container = existContainer;
        }
    },

    /**
     * Exibe uma notificação do tipo Toast
     * @param {string} message - Texto da mensagem
     * @param {string} type - Tipo: 'success' | 'info' | 'warning' | 'danger'
     * @param {number} duration - Tempo de exibição em ms (Padrão: 3500ms)
     */
    show(message, type = "success", duration = 3500) {
        this.initContainer();

        // Mapeamento de cores e bordas alinhados ao tema
        const typeStyles = {
            success: { border: "#ab966f", bg: "#151518", icon: "✨", text: "#e6e6e6" },
            info:    { border: "#3b82f6", bg: "#151518", icon: "ℹ️", text: "#e6e6e6" },
            warning: { border: "#f59e0b", bg: "#151518", icon: "⚠️", text: "#e6e6e6" },
            danger:  { border: "#ef4444", bg: "#151518", icon: "🚨", text: "#e6e6e6" }
        };

        const config = typeStyles[type] || typeStyles.success;

        // Cria o elemento da notificação
        const toast = document.createElement("div");
        toast.style.cssText = `
            background-color: ${config.bg};
            color: ${config.text};
            border-left: 4px solid ${config.border};
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding: 12px 16px;
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 10px;
            pointer-events: auto;
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        const iconEl = document.createElement("span");
        iconEl.style.cssText = "font-size: 1.1rem; flex-shrink: 0;";
        iconEl.textContent = config.icon;
        const textEl = document.createElement("span");
        textEl.style.cssText = "flex-grow: 1; line-height: 1.4;";
        textEl.textContent = message;
        toast.setAttribute("role", type === "danger" || type === "warning" ? "alert" : "status");
        toast.append(iconEl, textEl);

        this.container.appendChild(toast);

        // Animação de entrada
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(0)";
        });

        // Remoção automática após a duração informada
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(30px)";
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    /**
     * Atalhos utilitários rápidos
     */
    success(msg) { this.show(msg, "success"); },
    info(msg) { this.show(msg, "info"); },
    warning(msg) { this.show(msg, "warning"); },
    danger(msg) { this.show(msg, "danger"); }
};

// Log de disponibilidade do módulo
console.log("🔔 Silver Fox Archives: NotificationManager pronto.");