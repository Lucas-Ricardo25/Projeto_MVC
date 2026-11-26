/**
 * data.js
 * Camada de dados do Silver Fox Archives (window.Library).
 *
 * - Lê os dados publicados de data/library.js (window.LIBRARY_SEED)
 * - Aplica por cima as alterações feitas no Painel Admin (guardadas no
 *   localStorage do navegador do autor), para pré-visualização
 * - Exporta o resultado como um novo library.js para publicação
 * - Controla a sessão do autor (compartilhada entre abas)
 *
 * IMPORTANTE: o localStorage é local de cada navegador. Os visitantes só
 * veem o que estiver em data/library.js publicado.
 */
(function () {
    const OVERRIDE_KEY = "sf_library_override";
    const SESSION_KEY = "sf_author_session";
    const EDIT_KEY = "sf_direct_edit";

    // Raiz do site, calculada a partir do caminho deste script (funciona em qualquer subpasta)
    const scriptEl = document.currentScript;
    const ROOT = scriptEl && scriptEl.src
        ? scriptEl.src.replace(/js\/core\/data\.js(\?.*)?$/, "")
        : "";

    const STATUS = {
        andamento:    { label: "Em Andamento", badge: "bg-primary" },
        concluido:    { label: "Concluído",    badge: "bg-success" },
        planejamento: { label: "Planejamento", badge: "bg-secondary" },
        pausado:      { label: "Pausado",      badge: "bg-warning text-dark" }
    };

    // Cores de selo (tag) usadas em artigos da wiki e fichas
    const BADGES = {
        primary:   { label: "Dourado",  cls: "bg-primary" },
        secondary: { label: "Cinza",    cls: "bg-secondary" },
        success:   { label: "Verde",    cls: "bg-success" },
        warning:   { label: "Amarelo",  cls: "bg-warning text-dark" },
        danger:    { label: "Vermelho", cls: "bg-danger" },
        info:      { label: "Azul",     cls: "bg-info text-dark" },
        dark:      { label: "Escuro",   cls: "bg-dark border border-secondary" }
    };

    const SHEET_TYPES = {
        personagem: { label: "Personagens", singular: "Personagem", icon: "🧙" },
        raca:       { label: "Raças",       singular: "Raça",       icon: "👥" },
        artefato:   { label: "Artefatos",   singular: "Artefato",   icon: "⚔️" }
    };

    const clone = (v) => JSON.parse(JSON.stringify(v));

    function readOverride() {
        try {
            const raw = localStorage.getItem(OVERRIDE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function writeOverride(partial) {
        const next = Object.assign({}, readOverride() || {}, partial);
        try {
            localStorage.setItem(OVERRIDE_KEY, JSON.stringify(next));
            return true;
        } catch (e) {
            console.error("Library: não foi possível salvar", e);
            return false;
        }
    }

    const seed = () => clone(window.LIBRARY_SEED || {});

    /** Lista do override (se existir) ou do arquivo publicado */
    function list(name) {
        const o = readOverride();
        if (o && Array.isArray(o[name])) return o[name];
        const s = seed();
        return Array.isArray(s[name]) ? s[name] : [];
    }

    const Library = {
        ROOT,
        STATUS,
        BADGES,
        SHEET_TYPES,

        /* ---------- utilitários ---------- */
        /** Escapa texto antes de inserir em innerHTML (evita XSS) */
        esc(value) {
            return String(value == null ? "" : value)
                .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        },
        /** Caminho relativo à raiz do site -> URL utilizável a partir de qualquer página */
        url(path) {
            if (!path) return "";
            if (/^(https?:|data:|\/\/)/.test(path)) return path;
            return ROOT + path.replace(/^\/+/, "");
        },
        slugify(text) {
            return String(text || "")
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        },
        /** Gera um id único (slug do texto) dentro de uma lista de objetos com .id */
        uniqueId(text, items, fallback) {
            const base = this.slugify(text) || fallback || "item";
            let id = base, n = 2;
            while (items.some((i) => i.id === id)) id = base + "-" + n++;
            return id;
        },
        statusInfo(key) {
            return STATUS[key] || { label: key || "—", badge: "bg-secondary" };
        },
        badgeClass(color) {
            return (BADGES[color] || BADGES.secondary).cls;
        },
        formatDate(iso) {
            if (!iso) return "";
            const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
            return isNaN(d) ? iso : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
        },
        /** Texto em parágrafos (linha em branco separa; quebra simples vira <br>), sempre escapado */
        paragraphsHTML(text) {
            return String(text || "").replace(/\r\n/g, "\n")
                .split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
                .map((p) => `<p>${this.esc(p).replace(/\n/g, "<br>")}</p>`).join("");
        },

        /* ---------- leitura ---------- */
        getConfig() {
            const o = readOverride();
            return Object.assign({}, seed().config, (o && o.config) || {});
        },
        getCategories() { return list("categories"); },
        getBooks() { return list("books"); },
        getBook(id) { return this.getBooks().find((b) => b.id === id) || null; },
        getCategory(id) { return this.getCategories().find((c) => c.id === id) || null; },

        getWikiCategories() { return list("wikiCategories"); },
        getWikiCategory(id) { return this.getWikiCategories().find((c) => c.id === id) || null; },
        getWiki() { return list("wiki"); },
        getWikiArticle(id) { return this.getWiki().find((a) => a.id === id) || null; },

        getSheets() { return list("sheets"); },
        getSheet(id) { return this.getSheets().find((s) => s.id === id) || null; },

        bookUrl(id) { return ROOT + "pages/livro.html?id=" + encodeURIComponent(id); },
        readUrl(bookId, chapterId) {
            return ROOT + "pages/ler.html?livro=" + encodeURIComponent(bookId) + "&cap=" + encodeURIComponent(chapterId);
        },
        wikiUrl(id) { return ROOT + "pages/wiki-artigo.html?id=" + encodeURIComponent(id); },
        sheetUrl(id) { return ROOT + "pages/ficha-detalhe.html?id=" + encodeURIComponent(id); },

        /* ---------- escrita (somente neste navegador) ---------- */
        saveBooks(books) { return writeOverride({ books }); },
        saveCategories(categories) { return writeOverride({ categories }); },
        saveWiki(wiki) { return writeOverride({ wiki }); },
        saveWikiCategories(wikiCategories) { return writeOverride({ wikiCategories }); },
        saveSheets(sheets) { return writeOverride({ sheets }); },
        saveConfig(config) { return writeOverride({ config }); },
        hasLocalChanges() { return readOverride() !== null; },
        discardLocalChanges() { localStorage.removeItem(OVERRIDE_KEY); },

        /* ---------- sessão do autor (compartilhada entre abas) ---------- */
        author: {
            isLoggedIn() {
                try {
                    const s = JSON.parse(localStorage.getItem(SESSION_KEY));
                    if (s && s.until > Date.now()) return true;
                } catch (e) { /* ignora */ }
                localStorage.removeItem(SESSION_KEY);
                return false;
            },
            login(hours) {
                localStorage.setItem(SESSION_KEY, JSON.stringify({ until: Date.now() + (hours || 8) * 3600000 }));
            },
            logout() {
                localStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(EDIT_KEY);
            },
            editEnabled() {
                return this.isLoggedIn() && localStorage.getItem(EDIT_KEY) === "1";
            },
            setEdit(on) {
                if (on) localStorage.setItem(EDIT_KEY, "1"); else localStorage.removeItem(EDIT_KEY);
            }
        },

        /* ---------- exportar / importar ---------- */
        snapshot() {
            return {
                version: 1,
                config: this.getConfig(),
                categories: this.getCategories(),
                books: this.getBooks(),
                wikiCategories: this.getWikiCategories(),
                wiki: this.getWiki(),
                sheets: this.getSheets()
            };
        },
        /** Gera o conteúdo completo de um novo data/library.js */
        exportJS() {
            const header =
                "/**\n * data/library.js – gerado pelo Painel Admin em " + new Date().toLocaleString("pt-BR") +
                "\n * Substitua o arquivo data/library.js do site por este e publique.\n */\n";
            return header + "window.LIBRARY_SEED = " + JSON.stringify(this.snapshot(), null, 4) + ";\n";
        },
        exportJSON() { return JSON.stringify(this.snapshot(), null, 2); },
        /** Importa um backup .json. Partes ausentes (ex.: backup antigo sem wiki) mantêm o valor atual. */
        importJSON(text) {
            const data = JSON.parse(text);
            if (!data || !Array.isArray(data.books) || !Array.isArray(data.categories)) {
                throw new Error("Arquivo inválido: faltam 'books' e/ou 'categories'.");
            }
            const next = {
                config: Object.assign({}, seed().config, data.config || {}),
                categories: data.categories,
                books: data.books
            };
            ["wikiCategories", "wiki", "sheets"].forEach((k) => { if (Array.isArray(data[k])) next[k] = data[k]; });
            writeOverride(next);
        },
        download(filename, text, mime) {
            const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        },

        /* ---------- renderização compartilhada ---------- */
        /** Cartão de livro (Início, Livros e Favoritos) */
        bookCardHTML(book) {
            const st = this.statusInfo(book.status);
            const cat = this.getCategory(book.category);
            const hasProgress = book.progress && book.progress.total > 0;
            const cover = book.cover
                ? `<img src="${this.esc(this.url(book.cover))}" alt="Capa de ${this.esc(book.title)}" class="book-cover-img" loading="lazy" onerror="this.parentNode.classList.add('book-cover--empty');this.remove()">`
                : "";
            const readable = (book.chapters && book.chapters.length) || book.pdf || book.epub;
            return `
            <article class="service-card book-card h-100 p-0 border rounded-3 shadow-sm d-flex flex-column" data-book-id="${this.esc(book.id)}">
                <a href="${this.esc(this.bookUrl(book.id))}" class="book-cover ${book.cover ? "" : "book-cover--empty"}" aria-label="Abrir ${this.esc(book.title)}">${cover}<span class="book-cover-fallback" aria-hidden="true">📖</span></a>
                <div class="p-4 d-flex flex-column flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${st.badge}">${this.esc(st.label)}</span>
                        <small class="text-muted">${hasProgress ? `Cap. ${book.progress.current} / ${book.progress.total}` : ""}</small>
                    </div>
                    <h3 class="h4"><a href="${this.esc(this.bookUrl(book.id))}" class="text-decoration-none book-title-link">${this.esc(book.title)}</a></h3>
                    <p class="text-muted small mb-3">${this.esc(book.subtitle || (cat ? cat.name : ""))}</p>
                    <p class="mb-4 flex-grow-1">${this.esc(book.synopsis)}</p>
                    <div class="d-flex gap-2">
                        <a href="${this.esc(this.bookUrl(book.id))}" class="btn btn-sm ${readable ? "btn-primary-custom" : "btn-outline-primary"} flex-grow-1 text-center">${readable ? "Ler / Detalhes" : "Saiba Mais"}</a>
                        <button type="button" class="btn btn-sm btn-outline-warning" data-favorite-id="${this.esc(book.id)}" aria-label="Favoritar ${this.esc(book.title)}">☆ Favoritar</button>
                    </div>
                </div>
            </article>`;
        },

        /** Cartão de artigo da wiki */
        wikiCardHTML(a) {
            return `
            <article class="service-card wiki-card h-100 p-4 border rounded-3 shadow-sm d-flex flex-column" data-wiki-id="${this.esc(a.id)}">
                <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
                    <span class="badge ${this.badgeClass(a.tagColor)}">${this.esc(a.tag || "Artigo")}</span>
                    ${a.period ? `<small class="text-muted">${this.esc(a.period)}</small>` : ""}
                </div>
                <h3 class="h4"><a href="${this.esc(this.wikiUrl(a.id))}" class="text-decoration-none book-title-link">${this.esc(a.title)}</a></h3>
                ${a.subtitle ? `<p class="text-muted small mb-2">${this.esc(a.subtitle)}</p>` : ""}
                <p class="flex-grow-1">${this.esc(a.summary)}</p>
                <a href="${this.esc(this.wikiUrl(a.id))}" class="btn btn-sm btn-outline-primary align-self-start mt-2">Ler artigo →</a>
            </article>`;
        },

        /** Cartão de ficha (personagem, raça ou artefato) */
        sheetCardHTML(s) {
            const attrs = (s.attributes || []).map((x) =>
                `<li><strong>${this.esc(x.label)}:</strong> ${this.esc(x.value)}</li>`).join("");
            return `
            <article class="service-card sheet-card h-100 p-4 border rounded-3 shadow-sm d-flex flex-column" data-sheet-id="${this.esc(s.id)}">
                <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
                    <span class="badge ${this.badgeClass(s.tagColor)}">${this.esc(s.tag || (SHEET_TYPES[s.type] || {}).singular || "Ficha")}</span>
                    <small class="text-muted">${this.esc(s.meta || "")}</small>
                </div>
                <h3 class="h4"><a href="${this.esc(this.sheetUrl(s.id))}" class="text-decoration-none book-title-link">${this.esc(s.name)}</a></h3>
                ${s.subtitle ? `<p class="text-muted small mb-3">${this.esc(s.subtitle)}</p>` : ""}
                <p class="flex-grow-1">${this.esc(s.summary)}</p>
                <div>
                    ${attrs ? `<hr class="border-secondary opacity-25"><ul class="list-unstyled small text-muted mb-3">${attrs}</ul>` : ""}
                    <a href="${this.esc(this.sheetUrl(s.id))}" class="btn btn-sm btn-outline-primary w-100">Ver ficha completa →</a>
                </div>
            </article>`;
        }
    };

    window.Library = Library;
})();
