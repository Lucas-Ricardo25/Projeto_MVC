/**
 * codex.js
 * Páginas dinâmicas da Wiki (pages/wiki.html) e das Fichas (pages/ficha.html),
 * além das páginas de detalhe (wiki-artigo.html e ficha-detalhe.html).
 * Tudo vem de data/library.js (editável pelo Painel Admin).
 */
window.CodexManager = {
    norm(s) {
        return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    },

    /** true se todas as palavras da busca aparecem no texto */
    matches(q, parts) {
        const words = this.norm(q).trim().split(/\s+/).filter(Boolean);
        if (!words.length) return true;
        const hay = this.norm(parts.join(" "));
        return words.every((w) => hay.includes(w));
    },

    syncUrl(state, defaults) {
        const p = new URLSearchParams();
        Object.keys(state).forEach((k) => { if (state[k] && state[k] !== defaults[k]) p.set(k, state[k]); });
        const qs = p.toString();
        history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    },

    init() {
        if (!window.Library) return;
        if (document.getElementById("wikiGrid")) this.initWiki();
        if (document.getElementById("sheetsGrid")) this.initSheets();
        if (document.getElementById("articleView")) this.renderArticle();
        if (document.getElementById("sheetView")) this.renderSheet();
    },

    /* ================= LISTA: WIKI ================= */
    initWiki() {
        const L = window.Library;
        const defaults = { cat: "all", q: "" };
        const p = new URLSearchParams(location.search);
        const state = { cat: p.get("cat") || "all", q: p.get("q") || "" };
        const input = document.getElementById("wikiSearch");
        const tabs = document.getElementById("wikiTabs");
        const grid = document.getElementById("wikiGrid");
        const none = document.getElementById("noWikiResults");
        const count = document.getElementById("wikiCount");
        input.value = state.q;

        const render = () => {
            const all = L.getWiki();
            const cats = L.getWikiCategories();

            // abas com contagem
            const tab = (id, icon, name, n) =>
                `<button type="button" class="codex-tab${state.cat === id ? " active" : ""}" data-cat="${L.esc(id)}" aria-pressed="${state.cat === id}">
                    <span>${icon ? L.esc(icon) + " " : ""}${L.esc(name)}</span><span class="count">${n}</span></button>`;
            tabs.innerHTML = tab("all", "📚", "Todos os artigos", all.length) +
                cats.map((c) => tab(c.id, c.icon, c.name, all.filter((a) => a.category === c.id).length)).join("");

            const visible = all.filter((a) =>
                (state.cat === "all" || a.category === state.cat) &&
                this.matches(state.q, [a.title, a.subtitle, a.summary, a.tag, a.period]));

            let html = "";
            cats.forEach((c) => {
                const items = visible.filter((a) => a.category === c.id);
                if (!items.length) return;
                html += `<section class="mb-5" aria-labelledby="cat-${L.esc(c.id)}">
                    <h2 id="cat-${L.esc(c.id)}" class="h3 mb-4 text-primary border-bottom pb-2">${L.esc(c.icon || "")} ${L.esc(c.name)}</h2>
                    <div class="row g-4">${items.map((a) => `<div class="col-md-6">${L.wikiCardHTML(a)}</div>`).join("")}</div>
                </section>`;
            });
            // artigos cuja categoria foi removida
            const orphans = visible.filter((a) => !cats.some((c) => c.id === a.category));
            if (orphans.length) {
                html += `<section class="mb-5"><h2 class="h3 mb-4 text-primary border-bottom pb-2">Outros</h2>
                    <div class="row g-4">${orphans.map((a) => `<div class="col-md-6">${L.wikiCardHTML(a)}</div>`).join("")}</div></section>`;
            }
            grid.innerHTML = html;
            none.classList.toggle("d-none", visible.length > 0);
            if (count) count.textContent = visible.length + (visible.length === 1 ? " artigo" : " artigos");
        };

        tabs.addEventListener("click", (e) => {
            const b = e.target.closest("[data-cat]");
            if (!b) return;
            state.cat = b.dataset.cat;
            this.syncUrl(state, defaults);
            render();
        });
        input.addEventListener("input", () => {
            state.q = input.value;
            this.syncUrl(state, defaults);
            render();
        });
        render();
    },

    /* ================= LISTA: FICHAS ================= */
    initSheets() {
        const L = window.Library;
        const defaults = { tipo: "all", q: "" };
        const p = new URLSearchParams(location.search);
        const state = { tipo: p.get("tipo") || "all", q: p.get("q") || "" };
        const input = document.getElementById("sheetSearch");
        const filters = document.getElementById("sheetFilters");
        const grid = document.getElementById("sheetsGrid");
        const none = document.getElementById("noSheets");
        const count = document.getElementById("sheetCount");
        input.value = state.q;

        const render = () => {
            const all = L.getSheets();
            const btn = (id, label, n) =>
                `<button type="button" class="btn btn-sm ${state.tipo === id ? "btn-primary-custom" : "btn-outline-secondary"}" data-tipo="${L.esc(id)}" aria-pressed="${state.tipo === id}">
                    ${L.esc(label)} <span class="opacity-75">(${n})</span></button>`;
            filters.innerHTML = btn("all", "Todos", all.length) +
                Object.keys(L.SHEET_TYPES).map((k) => btn(k, L.SHEET_TYPES[k].label, all.filter((s) => s.type === k).length)).join("");

            const visible = all.filter((s) =>
                (state.tipo === "all" || s.type === state.tipo) &&
                this.matches(state.q, [s.name, s.subtitle, s.summary, s.tag, s.meta,
                    (s.attributes || []).map((a) => a.label + " " + a.value).join(" ")]));

            grid.innerHTML = visible.map((s) => `<div class="col-md-6 col-lg-4">${L.sheetCardHTML(s)}</div>`).join("");
            none.classList.toggle("d-none", visible.length > 0);
            if (count) count.textContent = visible.length + (visible.length === 1 ? " ficha" : " fichas");
        };

        filters.addEventListener("click", (e) => {
            const b = e.target.closest("[data-tipo]");
            if (!b) return;
            state.tipo = b.dataset.tipo;
            this.syncUrl(state, defaults);
            render();
        });
        input.addEventListener("input", () => {
            state.q = input.value;
            this.syncUrl(state, defaults);
            render();
        });
        render();
    },

    /* ================= DETALHE: ARTIGO ================= */
    notFound(el, what, backHref, backLabel) {
        el.innerHTML = `
            <div class="text-center py-5">
                <span class="section-label">NÃO ENCONTRADO</span>
                <h1 class="display-6 mt-2 mb-3">${window.Library.esc(what)} se perdeu nas brumas</h1>
                <p class="text-muted mb-4">O endereço pode estar incorreto ou o item foi removido.</p>
                <a href="${backHref}" class="btn btn-primary-custom">${backLabel}</a>
            </div>`;
    },

    renderArticle() {
        const L = window.Library;
        const el = document.getElementById("articleView");
        const a = L.getWikiArticle(new URLSearchParams(location.search).get("id"));
        if (!a) { document.title = "Artigo não encontrado – " + L.getConfig().siteName; return this.notFound(el, "Este artigo", "wiki.html", "Voltar à Wiki"); }

        const cat = L.getWikiCategory(a.category);
        const sheet = L.getSheet(a.id);
        const related = L.getWiki().filter((x) => x.category === a.category && x.id !== a.id).slice(0, 4);
        document.title = a.title + " – " + L.getConfig().siteName;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", a.summary.slice(0, 155));

        el.innerHTML = `
            <nav aria-label="Trilha" class="small mb-4">
                <a href="wiki.html">Wiki</a>${cat ? ` › <a href="wiki.html?cat=${encodeURIComponent(cat.id)}">${L.esc(cat.name)}</a>` : ""}
            </nav>
            <header class="mb-4">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <span class="badge ${L.badgeClass(a.tagColor)}">${L.esc(a.tag || "Artigo")}</span>
                    ${a.period ? `<span class="text-muted small">• ${L.esc(a.period)}</span>` : ""}
                </div>
                <h1 class="display-5 font-primary fw-bold mb-2">${L.esc(a.title)}</h1>
                ${a.subtitle ? `<p class="text-muted mb-0">${L.esc(a.subtitle)}</p>` : ""}
            </header>
            <p class="lead mb-4" style="line-height:1.7;">${L.esc(a.summary)}</p>
            <div class="article-body">
                ${a.content ? L.paragraphsHTML(a.content)
                            : `<div class="wiki-note"><p class="mb-0 text-muted">O artigo completo ainda está sendo escrito. Volte em breve!</p></div>`}
            </div>
            ${sheet ? `<div class="wiki-note my-4"><strong>Ficha técnica:</strong> <a href="${L.esc(L.sheetUrl(sheet.id))}">${L.esc(sheet.name)}</a></div>` : ""}
            ${a.updatedAt ? `<p class="text-muted small mt-4">Atualizado em ${L.esc(L.formatDate(a.updatedAt))}</p>` : ""}
            ${related.length ? `
            <hr class="border-secondary border-opacity-10 my-5">
            <h2 class="h5 font-primary text-primary mb-3">Veja também</h2>
            <div class="row g-3">${related.map((r) => `<div class="col-md-6">${L.wikiCardHTML(r)}</div>`).join("")}</div>` : ""}
            <div class="mt-5"><a href="wiki.html" class="btn btn-outline-secondary btn-sm">← Voltar à Wiki</a></div>`;
    },

    /* ================= DETALHE: FICHA ================= */
    renderSheet() {
        const L = window.Library;
        const el = document.getElementById("sheetView");
        const s = L.getSheet(new URLSearchParams(location.search).get("id"));
        if (!s) { document.title = "Ficha não encontrada – " + L.getConfig().siteName; return this.notFound(el, "Esta ficha", "ficha.html", "Voltar às Fichas"); }

        const type = L.SHEET_TYPES[s.type] || { label: "Fichas", singular: "Ficha", icon: "📄" };
        const article = L.getWikiArticle(s.id);
        const related = L.getSheets().filter((x) => x.type === s.type && x.id !== s.id).slice(0, 3);
        document.title = s.name + " – " + L.getConfig().siteName;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", s.summary.slice(0, 155));

        const attrs = (s.attributes || []).filter((a) => a.label);
        el.innerHTML = `
            <nav aria-label="Trilha" class="small mb-4">
                <a href="ficha.html">Fichas</a> › <a href="ficha.html?tipo=${encodeURIComponent(s.type)}">${L.esc(type.label)}</a>
            </nav>
            <div class="row g-4 g-lg-5">
                <div class="col-lg-${s.image ? "8" : "12"}">
                    <header class="mb-4">
                        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                            <span class="badge ${L.badgeClass(s.tagColor)}">${L.esc(s.tag || type.singular)}</span>
                            ${s.meta ? `<span class="text-muted small">• ${L.esc(s.meta)}</span>` : ""}
                        </div>
                        <h1 class="display-5 font-primary fw-bold mb-2">${L.esc(s.name)}</h1>
                        ${s.subtitle ? `<p class="text-muted mb-0">${L.esc(s.subtitle)}</p>` : ""}
                    </header>
                    <p class="lead mb-4" style="line-height:1.7;">${L.esc(s.summary)}</p>
                    ${attrs.length ? `
                    <div class="codex-side p-4 mb-4">
                        <h2 class="h6 text-uppercase text-muted mb-3" style="letter-spacing:2px;">Ficha técnica</h2>
                        <dl class="attr-list">${attrs.map((a) => `<dt>${L.esc(a.label)}</dt><dd>${L.esc(a.value)}</dd>`).join("")}</dl>
                    </div>` : ""}
                    <div class="article-body">
                        ${s.content ? L.paragraphsHTML(s.content)
                                    : `<div class="wiki-note"><p class="mb-0 text-muted">A ficha completa ainda está sendo escrita. Volte em breve!</p></div>`}
                    </div>
                    ${article ? `<div class="wiki-note my-4"><strong>Artigo na Wiki:</strong> <a href="${L.esc(L.wikiUrl(article.id))}">${L.esc(article.title)}</a></div>` : ""}
                    ${s.updatedAt ? `<p class="text-muted small mt-4">Atualizado em ${L.esc(L.formatDate(s.updatedAt))}</p>` : ""}
                </div>
                ${s.image ? `<div class="col-lg-4"><img src="${L.esc(L.url(s.image))}" alt="${L.esc(s.name)}" class="rounded-3 border w-100" style="object-fit:cover;" onerror="this.closest('.col-lg-4').remove()"></div>` : ""}
            </div>
            ${related.length ? `
            <hr class="border-secondary border-opacity-10 my-5">
            <h2 class="h5 font-primary text-primary mb-3">Mais ${L.esc(type.label.toLowerCase())}</h2>
            <div class="row g-3">${related.map((r) => `<div class="col-md-6 col-lg-4">${L.sheetCardHTML(r)}</div>`).join("")}</div>` : ""}
            <div class="mt-5"><a href="ficha.html" class="btn btn-outline-secondary btn-sm">← Voltar às Fichas</a></div>`;
    }
};

document.addEventListener("DOMContentLoaded", () => window.CodexManager.init());
