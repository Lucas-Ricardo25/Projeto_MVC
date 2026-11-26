/**
 * wiki-admin.js – artigos e categorias da Wiki
 */
document.addEventListener("DOMContentLoaded", () => {
    const A = window.AdminCore;
    if (!A.requireLogin()) return;
    const L = A.L;
    const $ = (id) => document.getElementById(id);

    let editingId = null;     // artigo em edição
    let editingCatId = null;  // categoria em edição

    const persist = (list) => { if (!L.saveWiki(list)) A.toast("Não foi possível salvar.", "danger"); A.changed(); };
    const persistCats = (list) => { if (!L.saveWikiCategories(list)) A.toast("Não foi possível salvar.", "danger"); A.changed(); };

    function fillSelects() {
        const cats = L.getWikiCategories();
        const current = $("wkCategory").value;
        $("wkCategory").innerHTML = cats.map((c) => `<option value="${A.esc(c.id)}">${A.esc((c.icon || "") + " " + c.name)}</option>`).join("");
        if (current) $("wkCategory").value = current;
        $("wkTagColor").innerHTML = Object.keys(L.BADGES).map((k) => `<option value="${k}">${A.esc(L.BADGES[k].label)}</option>`).join("");
        const f = $("wikiFilterCat").value || "all";
        $("wikiFilterCat").innerHTML = `<option value="all">Todas</option>` + cats.map((c) => `<option value="${A.esc(c.id)}">${A.esc(c.name)}</option>`).join("");
        $("wikiFilterCat").value = cats.some((c) => c.id === f) ? f : "all";
    }

    /* ================= ARTIGOS ================= */
    function resetForm() {
        editingId = null;
        $("formWiki").reset();
        $("wikiFormTitle").textContent = "Novo artigo";
        $("btnSaveWiki").textContent = "Salvar artigo";
        $("btnCancelWikiEdit").hidden = true;
    }

    function render() {
        const filter = $("wikiFilterCat").value;
        const all = L.getWiki();
        const items = all.filter((a) => filter === "all" || a.category === filter);
        $("wikiCountBadge").textContent = items.length + (items.length === 1 ? " artigo" : " artigos");
        $("wikiManagementList").innerHTML = items.length ? items.map((a) => {
            const cat = L.getWikiCategory(a.category);
            return `
            <div class="admin-list-item p-3 d-flex justify-content-between align-items-start gap-3">
                <div>
                    <h3 class="h6 mb-1 text-primary">${A.esc(a.title)}</h3>
                    <div class="d-flex flex-wrap gap-2 align-items-center">
                        <span class="badge ${L.badgeClass(a.tagColor)}">${A.esc(a.tag || "Artigo")}</span>
                        <small class="text-muted">${A.esc(cat ? cat.name : "Sem categoria")}${a.content ? "" : " · só resumo"}</small>
                    </div>
                </div>
                <div class="d-flex flex-wrap gap-1 justify-content-end">
                    <a class="btn btn-sm btn-outline-secondary" href="${A.esc(L.wikiUrl(a.id))}">Ver</a>
                    <button type="button" class="btn btn-sm btn-outline-primary" data-act="edit" data-id="${A.esc(a.id)}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-act="delete" data-id="${A.esc(a.id)}">Excluir</button>
                </div>
            </div>`;
        }).join("") : `<p class="text-muted small text-center py-4 mb-0">Nenhum artigo nesta categoria.</p>`;
    }

    $("formWiki").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $("wkTitle").value.trim();
        const summary = $("wkSummary").value.trim();
        if (!title || !summary) { A.toast("Preencha título e resumo.", "warning"); return; }
        if (!$("wkCategory").value) { A.toast("Crie uma categoria antes de cadastrar artigos.", "warning"); return; }

        const data = {
            title, summary,
            category: $("wkCategory").value,
            tag: $("wkTag").value.trim(),
            tagColor: $("wkTagColor").value,
            subtitle: $("wkSubtitle").value.trim(),
            period: $("wkPeriod").value.trim(),
            content: $("wkContent").value.replace(/\r\n/g, "\n").trim(),
            updatedAt: A.today()
        };
        const list = L.getWiki().slice();
        if (editingId) {
            const i = list.findIndex((a) => a.id === editingId);
            list[i] = Object.assign({}, list[i], data);
            A.toast(`Artigo “${title}” atualizado.`);
        } else {
            list.push(Object.assign({ id: L.uniqueId(title, list, "artigo") }, data));
            A.toast(`Artigo “${title}” criado.`);
        }
        persist(list);
        resetForm();
        render();
        fillSelects();
    });

    $("btnCancelWikiEdit").addEventListener("click", resetForm);
    $("wikiFilterCat").addEventListener("change", render);

    $("wikiManagementList").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const a = L.getWikiArticle(btn.dataset.id);
        if (!a) return;
        if (btn.dataset.act === "edit") {
            editingId = a.id;
            $("wkTitle").value = a.title;
            $("wkCategory").value = a.category;
            $("wkTag").value = a.tag || "";
            $("wkTagColor").value = a.tagColor || "secondary";
            $("wkSubtitle").value = a.subtitle || "";
            $("wkPeriod").value = a.period || "";
            $("wkSummary").value = a.summary;
            $("wkContent").value = a.content || "";
            $("wikiFormTitle").textContent = "Editando: " + a.title;
            $("btnSaveWiki").textContent = "Salvar alterações";
            $("btnCancelWikiEdit").hidden = false;
            $("wkTitle").focus();
            $("formWiki").scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (confirm(`Excluir o artigo “${a.title}”?`)) {
            persist(L.getWiki().filter((x) => x.id !== a.id));
            if (editingId === a.id) resetForm();
            render();
            A.toast("Artigo excluído.", "info");
        }
    });

    /* ================= CATEGORIAS ================= */
    function resetCat() {
        editingCatId = null;
        $("formWikiCat").reset();
        $("btnSaveWikiCat").textContent = "Adicionar";
        $("btnCancelWikiCat").hidden = true;
    }

    function renderCats() {
        const used = (id) => L.getWiki().filter((a) => a.category === id).length;
        $("wikiCatList").innerHTML = L.getWikiCategories().map((c) => `
            <div class="admin-list-item p-2 ps-3 d-flex justify-content-between align-items-center gap-3">
                <span>${A.esc(c.icon || "")} <strong>${A.esc(c.name)}</strong> <small class="text-muted">· ${used(c.id)} artigo(s)</small></span>
                <span class="d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-cact="edit" data-id="${A.esc(c.id)}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-cact="delete" data-id="${A.esc(c.id)}">Excluir</button>
                </span>
            </div>`).join("") || `<p class="text-muted small mb-0">Nenhuma categoria.</p>`;
    }

    $("formWikiCat").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("wcName").value.trim();
        if (!name) { A.toast("Informe o nome da categoria.", "warning"); return; }
        const list = L.getWikiCategories().slice();
        const icon = $("wcIcon").value.trim();
        if (editingCatId) {
            const i = list.findIndex((c) => c.id === editingCatId);
            list[i] = Object.assign({}, list[i], { name, icon });
        } else {
            list.push({ id: L.uniqueId(name, list, "categoria"), name, icon });
        }
        persistCats(list);
        A.toast(`Categoria “${name}” salva.`);
        resetCat();
        renderCats();
        fillSelects();
        render();
    });

    $("btnCancelWikiCat").addEventListener("click", resetCat);

    $("wikiCatList").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-cact]");
        if (!btn) return;
        const c = L.getWikiCategory(btn.dataset.id);
        if (!c) return;
        if (btn.dataset.cact === "edit") {
            editingCatId = c.id;
            $("wcIcon").value = c.icon || "";
            $("wcName").value = c.name;
            $("btnSaveWikiCat").textContent = "Salvar";
            $("btnCancelWikiCat").hidden = false;
            $("wcName").focus();
        } else {
            const n = L.getWiki().filter((a) => a.category === c.id).length;
            if (n > 0) { A.toast(`“${c.name}” tem ${n} artigo(s). Mova ou exclua os artigos antes.`, "warning"); return; }
            if (!confirm(`Excluir a categoria “${c.name}”?`)) return;
            persistCats(L.getWikiCategories().filter((x) => x.id !== c.id));
            renderCats();
            fillSelects();
            A.toast("Categoria excluída.", "info");
        }
    });

    fillSelects();
    render();
    renderCats();
});
