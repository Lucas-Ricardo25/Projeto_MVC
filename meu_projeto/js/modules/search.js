/**
 * search.js
 * Catálogo de obras: busca por texto, filtro de status e categoria,
 * ordenação e sincronização com a URL (?q=…&status=…&cat=…&ord=…).
 * Substitui o antigo par search.js + filters.js, que disputavam o mesmo
 * campo de busca e apagavam a lista de livros.
 *
 * Elementos esperados na página (todos opcionais, exceto #booksGrid):
 *   #booksGrid  #searchInput  #filterStatus  #filterCategory  #filterSort
 *   #noResults  #resultCount  #btnClearFilters
 */
window.SearchManager = {
    state: { q: "", status: "all", cat: "all", ord: "recentes" },

    init() {
        this.grid = document.getElementById("booksGrid");
        if (!this.grid || !window.Library) return;

        this.els = {
            q: document.getElementById("searchInput"),
            status: document.getElementById("filterStatus"),
            cat: document.getElementById("filterCategory"),
            ord: document.getElementById("filterSort"),
            none: document.getElementById("noResults"),
            count: document.getElementById("resultCount"),
            clear: document.getElementById("btnClearFilters")
        };

        this.fillSelects();
        this.readUrl();
        this.bind();
        this.render();
    },

    fillSelects() {
        const L = window.Library;
        if (this.els.status) {
            this.els.status.innerHTML = `<option value="all">Todos os status</option>` +
                Object.keys(L.STATUS).map((k) => `<option value="${k}">${L.esc(L.STATUS[k].label)}</option>`).join("");
        }
        if (this.els.cat) {
            this.els.cat.innerHTML = `<option value="all">Todas as categorias</option>` +
                L.getCategories().map((c) => `<option value="${L.esc(c.id)}">${L.esc(c.name)}</option>`).join("");
        }
    },

    readUrl() {
        const p = new URLSearchParams(location.search);
        this.state.q = p.get("q") || "";
        this.state.status = p.get("status") || "all";
        this.state.cat = p.get("cat") || "all";
        this.state.ord = p.get("ord") || "recentes";
        if (this.els.q) this.els.q.value = this.state.q;
        if (this.els.status) this.els.status.value = this.state.status;
        if (this.els.cat) this.els.cat.value = this.state.cat;
        if (this.els.ord) this.els.ord.value = this.state.ord;
    },

    writeUrl() {
        const p = new URLSearchParams();
        if (this.state.q) p.set("q", this.state.q);
        if (this.state.status !== "all") p.set("status", this.state.status);
        if (this.state.cat !== "all") p.set("cat", this.state.cat);
        if (this.state.ord !== "recentes") p.set("ord", this.state.ord);
        const qs = p.toString();
        history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    },

    bind() {
        const update = () => {
            this.state.q = this.els.q ? this.els.q.value : "";
            this.state.status = this.els.status ? this.els.status.value : "all";
            this.state.cat = this.els.cat ? this.els.cat.value : "all";
            this.state.ord = this.els.ord ? this.els.ord.value : "recentes";
            this.writeUrl();
            this.render();
        };
        ["q", "status", "cat", "ord"].forEach((k) => {
            const el = this.els[k];
            if (!el) return;
            el.addEventListener(k === "q" ? "input" : "change", update);
        });
        if (this.els.clear) {
            this.els.clear.addEventListener("click", () => {
                if (this.els.q) this.els.q.value = "";
                if (this.els.status) this.els.status.value = "all";
                if (this.els.cat) this.els.cat.value = "all";
                if (this.els.ord) this.els.ord.value = "recentes";
                update();
            });
        }
    },

    /** Remove acentos e caixa para comparar textos */
    norm(s) {
        return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    },

    filter() {
        const L = window.Library;
        const q = this.norm(this.state.q.trim());
        let books = L.getBooks().filter((b) => {
            if (this.state.status !== "all" && b.status !== this.state.status) return false;
            if (this.state.cat !== "all" && b.category !== this.state.cat) return false;
            if (!q) return true;
            const cat = L.getCategory(b.category);
            const hay = this.norm([b.title, b.subtitle, b.synopsis, cat ? cat.name : ""].join(" "));
            return q.split(/\s+/).every((word) => hay.includes(word));
        });

        const by = {
            recentes: (a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")),
            antigos:  (a, b) => String(a.updatedAt || "").localeCompare(String(b.updatedAt || "")),
            "az":     (a, b) => a.title.localeCompare(b.title, "pt-BR"),
            "za":     (a, b) => b.title.localeCompare(a.title, "pt-BR")
        };
        return books.sort(by[this.state.ord] || by.recentes);
    },

    render() {
        const L = window.Library;
        const books = this.filter();

        this.grid.innerHTML = books.map((b) => `<div class="col-md-6 col-lg-4">${L.bookCardHTML(b)}</div>`).join("");
        if (this.els.none) this.els.none.classList.toggle("d-none", books.length > 0);
        if (this.els.count) this.els.count.textContent = books.length + (books.length === 1 ? " obra" : " obras");

        const filtered = this.state.q || this.state.status !== "all" || this.state.cat !== "all";
        if (this.els.clear) this.els.clear.hidden = !filtered;

        if (window.FavoritesManager) window.FavoritesManager.refreshButtons();
    }
};

document.addEventListener("DOMContentLoaded", () => window.SearchManager.init());
