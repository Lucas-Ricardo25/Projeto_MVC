/**
 * admin-core.js
 * Núcleo do painel do autor: login, proteção das páginas, menu e avisos.
 * Substitui admin.js (que apenas simulava o salvamento dos formulários).
 *
 * AVISO HONESTO SOBRE SEGURANÇA: este painel roda 100% no navegador. A senha
 * protege contra curiosos, não contra quem entende de código – qualquer um pode
 * abrir o DevTools. Por isso o painel NÃO publica nada sozinho: ele edita uma
 * cópia no navegador do autor e gera um data/library.js novo para publicar.
 * Para proteção real, restrinja a pasta /admin no servidor/hospedagem.
 */
(function () {
    const L = window.Library;
    const HASH_KEY = "sf_admin_hash";
    // Senha inicial: "silverfox2026" – deve ser trocada em Configurações

    /* ---------- SHA-256 (usa SubtleCrypto; cai para implementação própria em http simples) ---------- */
    function sha256Fallback(str) {
        const rr = (v, n) => (v >>> n) | (v << (32 - n));
        const bytes = Array.from(unescape(encodeURIComponent(str))).map((c) => c.charCodeAt(0));
        const bitLen = bytes.length * 8;
        bytes.push(0x80);
        while (bytes.length % 64 !== 56) bytes.push(0);
        for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 255);
        const K = [], H = [];
        let n = 2, c = 0;
        const frac = (x) => ((x - Math.floor(x)) * 4294967296) | 0;
        while (c < 64) {
            let p = true;
            for (let d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; }
            if (p) { if (c < 8) H[c] = frac(Math.pow(n, 1 / 2)); K[c++] = frac(Math.pow(n, 1 / 3)); }
            n++;
        }
        for (let o = 0; o < bytes.length; o += 64) {
            const w = [];
            for (let i = 0; i < 16; i++) w[i] = (bytes[o + 4 * i] << 24) | (bytes[o + 4 * i + 1] << 16) | (bytes[o + 4 * i + 2] << 8) | bytes[o + 4 * i + 3];
            for (let i = 16; i < 64; i++) {
                const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
                const s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
                w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
            }
            let [a, b, cc, d, e, f, g, h] = H;
            for (let i = 0; i < 64; i++) {
                const t1 = (h + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
                const t2 = ((rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & b) ^ (a & cc) ^ (b & cc))) | 0;
                h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
            }
            H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
        }
        return H.map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
    }

    async function sha256(text) {
        if (window.crypto && crypto.subtle) {
            const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
            return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
        }
        return sha256Fallback(text);
    }

    const AdminCore = {
        L,
        esc: (s) => L.esc(s),
        toast: (msg, type) => window.NotificationManager ? window.NotificationManager.show(msg, type || "success") : alert(msg),

        /* ---------- sessão ---------- */
        isLoggedIn: () => L.author.isLoggedIn(),
        logout() {
            L.author.logout();
            location.href = L.ROOT + "admin/index.html";
        },
        async checkPassword(plain) {
            const stored = localStorage.getItem(HASH_KEY) || (await sha256("silverfox2026"));
            return (await sha256(plain)) === stored;
        },
        async setPassword(plain) {
            localStorage.setItem(HASH_KEY, await sha256(plain));
        },
        isDefaultPassword: () => !localStorage.getItem(HASH_KEY),
        login() { L.author.login(8); },

        /** Chame no topo das páginas internas: volta ao login se não houver sessão */
        requireLogin() {
            if (!this.isLoggedIn()) {
                location.replace(L.ROOT + "admin/index.html");
                return false;
            }
            return true;
        },

        /* ---------- cabeçalho do painel ---------- */
        renderHeader() {
            const el = document.getElementById("adminHeader");
            if (!el) return;
            const file = location.pathname.split("/").pop() || "index.html";
            const links = [
                ["index.html", "📊 Dashboard"],
                ["livros.html", "📚 Livros"],
                ["categorias.html", "🏷️ Categorias"],
                ["wiki.html", "🌍 Wiki"],
                ["fichas.html", "🧙 Fichas"],
                ["configuracoes.html", "⚙️ Configurações"]
            ];
            const logged = this.isLoggedIn();
            el.innerHTML = `
            <nav class="navbar navbar-expand-lg container py-3" aria-label="Navegação do painel">
                <a href="index.html" class="navbar-brand d-flex align-items-center gap-2">
                    <span class="logo">Silver Fox</span>
                    <span class="badge bg-warning text-dark fs-6 font-monospace">ADMIN</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminMenu" aria-controls="adminMenu" aria-expanded="false" aria-label="Alternar navegação">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="adminMenu">
                    <ul class="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
                        ${logged ? links.map(([href, label]) =>
                            `<li class="nav-item"><a href="${href}" class="nav-link${file === href ? " active fw-bold" : ""}">${label}</a></li>`).join("") : ""}
                        <li class="nav-item"><a href="../pages/index.html" class="nav-link">🌐 Ver site</a></li>
                        ${logged ? `<li class="nav-item"><button id="btnLogout" class="btn btn-sm btn-outline-danger">Sair</button></li>` : ""}
                    </ul>
                </div>
            </nav>`;
            const out = document.getElementById("btnLogout");
            if (out) out.addEventListener("click", () => this.logout());
        },

        /* ---------- aviso de alterações não publicadas ---------- */
        renderBanner() {
            const el = document.getElementById("adminBanner");
            if (!el) return;
            if (!L.hasLocalChanges()) { el.innerHTML = ""; return; }
            el.innerHTML = `
            <div class="unpublished-banner p-3 d-flex flex-wrap align-items-center justify-content-between gap-3" role="status">
                <span><strong>Alterações não publicadas.</strong> Elas existem só neste navegador. Para o público ver, exporte o <code>library.js</code> e substitua o arquivo em <code>data/</code>.</span>
                <span class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-primary-custom" id="bannerExport">Exportar library.js</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" id="bannerDiscard">Descartar</button>
                </span>
            </div>`;
            document.getElementById("bannerExport").addEventListener("click", () => this.exportLibrary());
            document.getElementById("bannerDiscard").addEventListener("click", () => this.discardChanges());
        },

        exportLibrary() {
            L.download("library.js", L.exportJS(), "text/javascript;charset=utf-8");
            this.toast("library.js exportado. Substitua data/library.js do site por ele.");
        },
        discardChanges() {
            if (!confirm("Descartar todas as alterações feitas neste navegador e voltar ao que está publicado em data/library.js?")) return;
            L.discardLocalChanges();
            location.reload();
        },

        /** Notifica que dados mudaram: atualiza o banner */
        changed() { this.renderBanner(); },

        today: () => new Date().toISOString().slice(0, 10)
    };

    window.AdminCore = AdminCore;
    document.addEventListener("DOMContentLoaded", () => {
        AdminCore.renderHeader();
        AdminCore.renderBanner();
    });
})();
