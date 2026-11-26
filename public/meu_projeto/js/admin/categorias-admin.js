/**
 * categorias-admin.js – CRUD de categorias (usadas nos filtros e nas obras)
 */
document.addEventListener("DOMContentLoaded", () => {
    const A = window.AdminCore;
    if (!A.requireLogin()) return;
    const L = A.L;
    const $ = (id) => document.getElementById(id);
    let editingId = null;

    const persist = (list) => {
        if (!L.saveCategories(list)) A.toast("Não foi possível salvar.", "danger");
        A.changed();
    };
    const usage = (id) => L.getBooks().filter((b) => b.category === id).length;

    function reset() {
        editingId = null;
        $("formCategory").reset();
        $("catSlug").value = "";
        $("catFormTitle").textContent = "Nova categoria";
        $("btnCancelCatEdit").hidden = true;
    }

    function render() {
        const list = L.getCategories();
        $("categoryCountBadge").textContent = list.length + (list.length === 1 ? " categoria" : " categorias");
        $("categoriesManagementList").innerHTML = list.length ? list.map((c) => {
            const n = usage(c.id);
            return `
            <div class="admin-list-item p-3 d-flex justify-content-between align-items-start gap-3">
                <div>
                    <h3 class="h6 mb-1 text-primary">${A.esc(c.name)}</h3>
                    <small class="text-muted d-block">${A.esc(c.description || "Sem descrição")}</small>
                    <small class="text-muted"><code>${A.esc(c.id)}</code> · ${n} ${n === 1 ? "obra" : "obras"}</small>
                </div>
                <div class="d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-act="edit" data-id="${A.esc(c.id)}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-act="delete" data-id="${A.esc(c.id)}">Excluir</button>
                </div>
            </div>`;
        }).join("") : `<p class="text-muted small text-center py-4 mb-0">Nenhuma categoria cadastrada.</p>`;
    }

    $("catName").addEventListener("input", () => {
        if (!editingId) $("catSlug").value = L.slugify($("catName").value);
    });

    $("formCategory").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("catName").value.trim();
        if (!name) { A.toast("Informe o nome da categoria.", "warning"); return; }
        const list = L.getCategories().slice();
        const description = $("catDesc").value.trim();

        if (editingId) {
            const i = list.findIndex((c) => c.id === editingId);
            list[i] = Object.assign({}, list[i], { name, description });
        } else {
            let id = L.slugify(name) || "categoria", n = 2;
            const base = id;
            while (list.some((c) => c.id === id)) id = base + "-" + n++;
            list.push({ id, name, description });
        }
        persist(list);
        A.toast(`Categoria “${name}” salva.`);
        reset();
        render();
    });

    $("btnCancelCatEdit").addEventListener("click", reset);

    $("categoriesManagementList").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const c = L.getCategory(btn.dataset.id);
        if (!c) return;

        if (btn.dataset.act === "edit") {
            editingId = c.id;
            $("catName").value = c.name;
            $("catSlug").value = c.id;
            $("catDesc").value = c.description || "";
            $("catFormTitle").textContent = "Editando: " + c.name;
            $("btnCancelCatEdit").hidden = false;
            $("catName").focus();
        } else {
            const n = usage(c.id);
            if (n > 0) {
                A.toast(`“${c.name}” está em uso por ${n} ${n === 1 ? "obra" : "obras"}. Mude a categoria delas antes de excluir.`, "warning");
                return;
            }
            if (!confirm(`Excluir a categoria “${c.name}”?`)) return;
            persist(L.getCategories().filter((x) => x.id !== c.id));
            render();
            A.toast("Categoria excluída.", "info");
        }
    });

    render();
});
