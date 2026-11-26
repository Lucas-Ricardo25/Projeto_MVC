/**
 * layout.js
 * Cabeçalho e rodapé compartilhados por todas as páginas públicas.
 * Edite os links do menu e do rodapé AQUI (um único lugar) em vez de em cada página.
 *
 * Uso na página:
 *   <header id="siteHeader" class="site-header sticky-top"></header>
 *   <footer id="siteFooter" class="site-footer"></footer>
 * Opcional: <body data-nav="livros"> para forçar o item de menu ativo.
 */
(function () {
    const scriptEl = document.currentScript;
    const ROOT = scriptEl && scriptEl.src ? scriptEl.src.replace(/js\/core\/layout\.js(\?.*)?$/, "") : "";
    const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const L = window.Library;

    const cfg = (L && L.getConfig()) || { shortName: "Silver Fox", siteName: "Silver Fox Archives", tagline: "", author: "Silver Fox" };

    /* ---------- estrutura do menu ---------- */
    // Um item com "children" vira submenu. Mantém o menu enxuto: só 5 entradas na barra.
    const NAV = [
        { key: "inicio",    label: "Início",     href: "pages/index.html" },
        { key: "livros",    label: "Livros",     href: "pages/livros.html" },
        { key: "universo",  label: "Universo",   children: [
            { key: "wiki",         label: "Wiki & Mundo",         desc: "Reinos, eras e culturas",   icon: "🌍", href: "pages/wiki.html" },
            { key: "ficha",        label: "Fichas & Personagens", desc: "Personagens, raças e itens", icon: "🧙", href: "pages/ficha.html" },
            { key: "curiosidades", label: "Curiosidades",         desc: "Bastidores do autor",        icon: "💡", href: "pages/curiosidades.html" }
        ]},
        { key: "novidades", label: "Novidades",  href: "pages/novidades.html" },
        { key: "contato",   label: "Contato",    href: "pages/contato.html" }
    ];

    // Páginas internas que pertencem a um item de menu
    const ALIAS = { livro: "livros", ler: "livros", "wiki-artigo": "wiki", "ficha-detalhe": "ficha" };

    function currentKey() {
        if (document.body.dataset.nav) return document.body.dataset.nav;
        const file = (location.pathname.split("/").pop() || "").replace(".html", "");
        if (location.pathname.includes("/livros/")) return "livros";
        return ALIAS[file] || file;
    }

    function favCount() {
        try { return (JSON.parse(localStorage.getItem("silver_fox_user_favorites")) || []).length; }
        catch (e) { return 0; }
    }

    /* ---------- cabeçalho ---------- */
    function renderHeader(el) {
        const active = currentKey();

        const items = NAV.map((n) => {
            if (!n.children) {
                const on = n.key === active;
                return `<li class="nav-item"><a href="${ROOT}${n.href}" class="nav-link${on ? " active" : ""}"${on ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`;
            }
            const childActive = n.children.some((c) => c.key === active);
            return `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle${childActive ? " active" : ""}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" id="dd-${n.key}">${esc(n.label)}</a>
                <ul class="dropdown-menu dropdown-menu-lg-end site-dropdown" aria-labelledby="dd-${n.key}">
                    ${n.children.map((c) => `
                    <li><a class="dropdown-item${c.key === active ? " active" : ""}" href="${ROOT}${c.href}"${c.key === active ? ' aria-current="page"' : ""}>
                        <span class="dd-icon" aria-hidden="true">${c.icon}</span>
                        <span><span class="dd-title">${esc(c.label)}</span><small class="dd-desc">${esc(c.desc)}</small></span>
                    </a></li>`).join("")}
                </ul>
            </li>`;
        }).join("");

        const fav = favCount();
        const favActive = active === "favoritos";

        el.innerHTML = `
        <nav class="navbar navbar-expand-lg container" aria-label="Navegação principal">
            <a href="${ROOT}index.html" class="navbar-brand"><span class="logo">${esc(cfg.shortName)}</span></a>

            <div class="d-flex align-items-center gap-2 order-lg-last">
                <a href="${ROOT}pages/favoritos.html" class="nav-icon-btn d-lg-none${favActive ? " active" : ""}" title="Favoritos" aria-label="Favoritos">
                    ♥<span class="badge rounded-pill fav-count" ${fav ? "" : "hidden"}>${fav}</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
                    aria-controls="menu" aria-expanded="false" aria-label="Alternar navegação">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

            <div class="collapse navbar-collapse" id="menu">
                <ul class="navbar-nav ms-lg-auto align-items-lg-center gap-lg-1">
                    ${items}
                    <li class="nav-item d-none d-lg-block ms-lg-2">
                        <a href="${ROOT}pages/favoritos.html" class="nav-icon-btn${favActive ? " active" : ""}" title="Meus favoritos" aria-label="Favoritos">
                            ♥<span class="badge rounded-pill fav-count" ${fav ? "" : "hidden"}>${fav}</span>
                        </a>
                    </li>
                    <li class="nav-item d-none d-lg-block">
                        <a href="${ROOT}pages/autor.html" class="nav-icon-btn${active === "autor" ? " active" : ""}" title="Perfil do Autor" aria-label="Perfil do Autor">
                            <span style="filter:grayscale(100%) brightness(110%);">🦊</span>
                        </a>
                    </li>
                    <li class="nav-item d-lg-none nav-extra">
                        <a href="${ROOT}pages/autor.html" class="nav-link${active === "autor" ? " active" : ""}">🦊 Sobre o autor</a>
                    </li>
                </ul>
            </div>
        </nav>`;
    }

    /* ---------- rodapé ---------- */
    function renderFooter(el) {
        el.className = "site-footer";
        const year = new Date().getFullYear();
        const books = L ? L.getBooks().slice()
            .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0, 3) : [];

        const link = (href, label) => `<li><a href="${ROOT}${href}">${esc(label)}</a></li>`;

        el.innerHTML = `
        <div class="container footer-main">
            <div class="row g-4 g-lg-5">
                <div class="col-lg-4">
                    <a href="${ROOT}index.html" class="logo footer-logo d-inline-block mb-2">${esc(cfg.siteName)}</a>
                    <p class="text-muted small mb-3" style="max-width:340px;">${esc(cfg.tagline)}</p>
                    ${books.length ? `
                    <h2 class="footer-title">Últimas obras</h2>
                    <ul class="footer-links footer-links--books">
                        ${books.map((b) => `<li><a href="${esc(L.bookUrl(b.id))}">${esc(b.title)}</a></li>`).join("")}
                    </ul>` : ""}
                </div>
                <nav class="col-6 col-md-4 col-lg-2" aria-label="Explorar">
                    <h2 class="footer-title">Explorar</h2>
                    <ul class="footer-links">
                        ${link("pages/index.html", "Início")}
                        ${link("pages/livros.html", "Livros & Obras")}
                        ${link("pages/novidades.html", "Novidades")}
                        ${link("pages/favoritos.html", "Meus favoritos")}
                    </ul>
                </nav>
                <nav class="col-6 col-md-4 col-lg-3" aria-label="Universo">
                    <h2 class="footer-title">Universo</h2>
                    <ul class="footer-links">
                        ${link("pages/wiki.html", "Wiki & Mundo")}
                        ${link("pages/ficha.html", "Fichas & Personagens")}
                        ${link("pages/curiosidades.html", "Curiosidades")}
                    </ul>
                </nav>
                <nav class="col-12 col-md-4 col-lg-3" aria-label="Projeto">
                    <h2 class="footer-title">Projeto</h2>
                    <ul class="footer-links">
                        ${link("pages/sobre.html", "Sobre o projeto")}
                        ${link("pages/autor.html", "O autor")}
                        ${link("pages/contato.html", "Contato")}
                        ${link("pages/patrocinio.html", "Apoiar o projeto")}
                    </ul>
                </nav>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                <small class="text-muted">© ${year} ${esc(cfg.author || "Silver Fox")}. Todos os direitos reservados.</small>
                <small class="footer-legal d-flex flex-wrap justify-content-center gap-3">
                    <a href="${ROOT}pages/politica-privacidade.html">Política de Privacidade</a>
                    <a href="${ROOT}pages/termos-uso.html">Termos de Uso</a>
                    <a href="#topo" data-scroll-top>Voltar ao topo ↑</a>
                </small>
            </div>
        </div>`;

        const top = el.querySelector("[data-scroll-top]");
        if (top) top.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    }

    const header = document.getElementById("siteHeader");
    const footer = document.getElementById("siteFooter");
    if (header) renderHeader(header);
    if (footer) renderFooter(footer);

    // Link "pular para o conteúdo" (acessibilidade por teclado)
    const main = document.querySelector("main");
    if (main) {
        if (!main.id) main.id = "conteudo";
        const skip = document.createElement("a");
        skip.href = "#" + main.id;
        skip.className = "skip-link";
        skip.textContent = "Pular para o conteúdo";
        document.body.insertBefore(skip, document.body.firstChild);
    }

    // Mantém o contador de favoritos atualizado
    window.addEventListener("favorites:changed", (e) => {
        document.querySelectorAll(".fav-count").forEach((b) => {
            b.textContent = e.detail.count;
            b.hidden = !e.detail.count;
        });
    });

    // Links/botões sem destino (href="#"): avisa em vez de "pular" para o topo
    // (o botão do submenu "Universo" também usa href="#", por isso é ignorado)
    document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href="#"]');
        if (!a || a.matches("[data-bs-toggle]")) return;
        e.preventDefault();
        if (window.NotificationManager) window.NotificationManager.info("Este conteúdo estará disponível em breve.");
    });
})();
