/**
 * global-admin.js
 * Recursos do autor aplicados ao site público:
 *   1. Modo manutenção (visitantes veem um aviso; o autor logado continua navegando)
 *   2. Barra do autor (voltar ao painel, ligar/desligar edição, sair)
 *   3. Modo de edição direta (o autor edita textos clicando neles)
 *
 * A sessão do autor fica no localStorage (compartilhada entre abas), por isso o
 * modo de edição continua funcionando ao abrir o site por qualquer link do painel.
 * Ela expira em 8 horas ou ao clicar em "Sair".
 */
(function () {
    const L = window.Library;
    if (!L) return;
    const ROOT = L.ROOT;
    const cfg = L.getConfig();
    const isAdminArea = /\/admin\//.test(location.pathname);
    const logged = L.author.isLoggedIn();

    // ==========================================
    // 1. MODO MANUTENÇÃO
    // ==========================================
    if (cfg.maintenance && !logged && !isAdminArea) {
        const esc = L.esc;
        document.documentElement.innerHTML = `
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Em manutenção – ${esc(cfg.siteName)}</title>
            </head>
            <body style="margin:0">
                <main style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#101013;color:#b4b2b0;font-family:Georgia,'Spectral',serif;text-align:center;padding:20px;">
                    <h1 style="color:#ab966f;font-size:2.5rem;margin-bottom:15px;">Site em Manutenção</h1>
                    <p style="font-size:1.1rem;max-width:500px;margin-bottom:25px;">O repositório literário está passando por atualizações e melhorias no momento. Retornaremos em breve.</p>
                    <a href="${esc(ROOT)}admin/index.html" style="color:#ab966f;font-size:.9rem;text-decoration:underline;">Acesso restrito para o autor</a>
                </main>
            </body>`;
        return;
    }

    if (isAdminArea || !logged) return;

    const editing = L.author.editEnabled();

    document.addEventListener("DOMContentLoaded", () => {
        // ==========================================
        // 2. BARRA DO AUTOR
        // ==========================================
        const bar = document.createElement("div");
        bar.className = "author-bar";
        bar.setAttribute("data-no-edit", "");
        bar.setAttribute("role", "region");
        bar.setAttribute("aria-label", "Barra do autor");

        const minimized = sessionStorage.getItem("authorBarMin") === "1";
        const render = () => {
            const isMin = sessionStorage.getItem("authorBarMin") === "1";
            if (isMin) {
                bar.innerHTML = `<button type="button" class="btn btn-sm btn-outline-primary" id="abMax" title="Mostrar barra do autor" aria-label="Mostrar barra do autor">🦊 ▸</button>`;
                bar.style.padding = "0.3rem";
                bar.style.width = "auto";
                bar.style.right = "auto";
            } else {
                bar.removeAttribute("style");
                bar.innerHTML = `
                    <span class="author-bar-label">🦊 Modo autor</span>
                    <a href="${L.esc(ROOT)}admin/index.html" class="btn btn-sm btn-outline-primary">⚙ Painel</a>
                    <button type="button" class="btn btn-sm ${editing ? "btn-edit-on" : "btn-outline-secondary"}" id="abEdit" aria-pressed="${editing}">✏️ Edição: ${editing ? "ligada" : "desligada"}</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" id="abExit">Sair</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" id="abMin" title="Minimizar" aria-label="Minimizar barra do autor">▾</button>`;
            }
        };
        render();
        document.body.appendChild(bar);

        bar.addEventListener("click", (e) => {
            const id = e.target.closest("button") && e.target.closest("button").id;
            if (id === "abEdit") { L.author.setEdit(!editing); location.reload(); }
            else if (id === "abExit") { L.author.logout(); location.reload(); }
            else if (id === "abMin") { sessionStorage.setItem("authorBarMin", "1"); render(); }
            else if (id === "abMax") { sessionStorage.removeItem("authorBarMin"); render(); }
        });

        // ==========================================
        // 3. EDIÇÃO DIRETA
        // ==========================================
        if (!editing) return;
        const main = document.querySelector("main");
        if (!main) return;

        // Não edita listas/áreas geradas pelos dados (isso se faz no painel)
        const SKIP = "[data-dynamic], [data-book-id], [data-wiki-id], [data-sheet-id], [data-no-edit], .book-card, .modal, form";
        const elements = Array.from(main.querySelectorAll("h1, h2, h3, h4, h5, p, .lead, .card-text"))
            .filter((el) => !el.closest(SKIP));

        // Chave estável: caminho da página + posição do elemento entre os editáveis
        const keyFor = (index) => "edit_" + location.pathname + "#" + index;

        elements.forEach((el, index) => {
            const key = keyFor(index);
            const saved = localStorage.getItem(key);
            if (saved !== null) el.innerHTML = saved;

            el.setAttribute("contenteditable", "true");
            el.style.outline = "1px dashed rgba(171, 150, 111, 0.4)";
            el.style.outlineOffset = "2px";

            el.addEventListener("blur", () => {
                localStorage.setItem(key, el.innerHTML);
                el.style.outlineColor = "#28a745";
                setTimeout(() => { el.style.outlineColor = "rgba(171, 150, 111, 0.4)"; }, 1500);
            });
        });

        if (window.NotificationManager) {
            window.NotificationManager.info("Edição ativa: clique nos textos para alterar (salvo só neste navegador).");
        }
    });
})();
