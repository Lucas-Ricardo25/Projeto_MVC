/**
 * dashboard.js – login e visão geral do painel (admin/index.html)
 */
document.addEventListener("DOMContentLoaded", () => {
    const A = window.AdminCore, L = A.L;
    const loginSection = document.getElementById("loginSection");
    const dashboard = document.getElementById("adminDashboard");

    function showDashboard() {
        loginSection.hidden = true;
        dashboard.hidden = false;
        A.renderHeader();
        A.renderBanner();
        renderStats();
        document.getElementById("passwordWarning").classList.toggle("d-none", !A.isDefaultPassword());
        document.getElementById("toggleDirectEdit").checked = L.author.editEnabled();
    }

    function renderStats() {
        const books = L.getBooks();
        const chapters = books.reduce((n, b) => n + (b.chapters || []).length, 0);
        const withText = books.reduce((n, b) => n + (b.chapters || []).filter((c) => c.content).length, 0);
        const cards = [
            [books.length, "Obras", "text-primary"],
            [withText + "/" + chapters, "Capítulos com texto", "text-primary"],
            [L.getWiki().length, "Artigos na Wiki", "text-primary"],
            [L.getSheets().length, "Fichas", "text-primary"]
        ];
        document.getElementById("statsRow").innerHTML = cards.map(([n, label, cls]) => `
            <div class="col-6 col-md-3">
                <div class="admin-stat p-3 text-center">
                    <span class="fs-3 d-block font-monospace ${cls}">${typeof n === "number" ? String(n).padStart(2, "0") : n}</span>
                    <small class="text-muted">${A.esc(label)}</small>
                </div>
            </div>`).join("");

        document.getElementById("statusBreakdown").innerHTML = Object.keys(L.STATUS).map((k) => {
            const n = books.filter((b) => b.status === k).length;
            return `<span class="badge ${L.STATUS[k].badge}">${A.esc(L.STATUS[k].label)}: ${n}</span>`;
        }).join("");
    }

    // ---------- login ----------
    if (A.isLoggedIn()) {
        showDashboard();
    } else {
        loginSection.hidden = false;
        document.getElementById("accessKey").focus();
    }

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("accessKey");
        const error = document.getElementById("loginError");
        if (await A.checkPassword(input.value)) {
            A.login();
            error.classList.add("d-none");
            input.value = "";
            showDashboard();
        } else {
            error.classList.remove("d-none");
            input.select();
        }
    });

    // ---------- edição direta ----------
    document.getElementById("toggleDirectEdit").addEventListener("change", (e) => {
        if (e.target.checked) {
            L.author.setEdit(true);
            A.toast("Edição direta ativada. Abra o site e clique nos textos para alterá-los.", "info");
        } else {
            L.author.setEdit(false);
            A.toast("Edição direta desativada.", "info");
        }
    });

    // ---------- abrir o site em modo de edição ----------
    document.getElementById("btnEditSite").addEventListener("click", () => {
        L.author.setEdit(true);
        location.href = L.ROOT + "pages/index.html";
    });

    // ---------- publicação e backup ----------
    document.getElementById("btnExportJS").addEventListener("click", () => A.exportLibrary());
    document.getElementById("btnExportJSON").addEventListener("click", () => {
        L.download("silver-fox-backup-" + A.today() + ".json", L.exportJSON(), "application/json");
        A.toast("Backup exportado.");
    });
    document.getElementById("btnDiscard").addEventListener("click", () => {
        if (!L.hasLocalChanges()) { A.toast("Não há alterações locais para descartar.", "info"); return; }
        A.discardChanges();
    });
    document.getElementById("importFile").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                L.importJSON(reader.result);
                A.toast("Backup importado. Lembre-se de exportar o library.js para publicar.");
                renderStats();
                A.changed();
            } catch (err) {
                A.toast("Não foi possível importar: " + err.message, "danger");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    });
});
