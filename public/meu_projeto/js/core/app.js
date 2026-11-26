/**
 * app.js
 * Ponto de entrada da aplicação: aplica o tema salvo e as configurações globais.
 * (O destaque do item ativo do menu agora é feito em layout.js.)
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Tema salvo (o ThemeManager cuida da troca depois)
    const savedTheme = localStorage.getItem("site_theme") || "dark";
    document.documentElement.setAttribute("data-bs-theme", savedTheme);

    // 2. Título da aba com o nome do site configurado no admin
    if (window.Library) {
        const name = window.Library.getConfig().siteName;
        if (name && !document.title.includes(name)) {
            const base = document.title.split(" - ")[0].split(" – ")[0];
            document.title = base && base !== name ? `${base} – ${name}` : name;
        }
    }
});
