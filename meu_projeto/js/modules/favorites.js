/**
 * favorites.js
 * Favoritos do leitor (salvos no navegador).
 * Funciona com qualquer botão [data-favorite-id], inclusive os criados
 * dinamicamente (usa delegação de eventos).
 */
window.FavoritesManager = {
    STORAGE_KEY: "silver_fox_user_favorites",

    init() {
        this.refreshButtons();
        document.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-favorite-id]");
            if (!btn || btn.classList.contains("remove-fav")) return;
            e.preventDefault();
            this.toggleFavorite(btn.getAttribute("data-favorite-id"));
        });
        this.renderFavoritesList();
    },

    getFavorites() {
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            return Array.isArray(list) ? list.map(String) : [];
        } catch (e) {
            return [];
        }
    },

    saveFavorites(list) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            console.error("Favorites: não foi possível salvar", e);
        }
        window.dispatchEvent(new CustomEvent("favorites:changed", { detail: { count: list.length } }));
    },

    isFavorite(id) {
        return this.getFavorites().includes(String(id));
    },

    toggleFavorite(id) {
        id = String(id);
        const list = this.getFavorites();
        const index = list.indexOf(id);
        const nowFavorite = index === -1;
        if (nowFavorite) list.push(id); else list.splice(index, 1);
        this.saveFavorites(list);
        this.refreshButtons();

        if (window.NotificationManager) {
            if (nowFavorite) window.NotificationManager.success("Obra adicionada aos favoritos!");
            else window.NotificationManager.info("Obra removida dos favoritos.");
        }
        return nowFavorite;
    },

    /** Atualiza a aparência de todos os botões da página */
    refreshButtons() {
        document.querySelectorAll("[data-favorite-id]").forEach((btn) => {
            if (btn.classList.contains("remove-fav")) return;
            const fav = this.isFavorite(btn.getAttribute("data-favorite-id"));
            btn.classList.toggle("favorited", fav);
            btn.classList.toggle("btn-warning", fav);
            btn.classList.toggle("btn-outline-warning", !fav);
            btn.setAttribute("aria-pressed", fav ? "true" : "false");
            btn.textContent = fav ? "★ Favoritado" : "☆ Favoritar";
        });
    },

    /** Página de favoritos (pages/favoritos.html) */
    renderFavoritesList() {
        const container = document.getElementById("favoritesGrid");
        if (!container || !window.Library) return;

        const ids = this.getFavorites();
        const books = ids.map((id) => window.Library.getBook(id)).filter(Boolean);

        const clearBtn = document.getElementById("btnClearFavorites");
        if (clearBtn) clearBtn.hidden = books.length === 0;

        if (books.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted lead mb-2">Você ainda não possui obras favoritadas.</p>
                    <p class="text-muted small mb-4">Clique em “☆ Favoritar” nas obras que quiser acompanhar.</p>
                    <a href="livros.html" class="btn btn-primary-custom">Explorar Livros</a>
                </div>`;
            return;
        }

        container.innerHTML = books.map((b) => `<div class="col-md-6 col-lg-4">${window.Library.bookCardHTML(b)}</div>`).join("");
        this.refreshButtons();
    }
};

// Na página de favoritos, ao remover um item a lista é redesenhada
window.addEventListener("favorites:changed", () => window.FavoritesManager.renderFavoritesList());

document.addEventListener("DOMContentLoaded", () => window.FavoritesManager.init());
