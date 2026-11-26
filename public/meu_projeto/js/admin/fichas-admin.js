/**
 * fichas-admin.js – fichas de personagens, raças e artefatos
 */
document.addEventListener("DOMContentLoaded", () => {
    const A = window.AdminCore;
    if (!A.requireLogin()) return;
    const L = A.L;
    const $ = (id) => document.getElementById(id);
    let editingId = null;

    const persist = (list) => { if (!L.saveSheets(list)) A.toast("Não foi possível salvar.", "danger"); A.changed(); };

    /** "Nome: valor" (um por linha) <-> [{label, value}] */
    const parseAttrs = (text) => String(text || "").split(/\r?\n/).map((line) => {
        const i = line.indexOf(":");
        if (i === -1) return { label: line.trim(), value: "" };
        return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    }).filter((a) => a.label && a.value);
    const attrsToText = (attrs) => (attrs || []).map((a) => `${a.label}: ${a.value}`).join("\n");

    function fillSelects() {
        $("shType").innerHTML = Object.keys(L.SHEET_TYPES).map((k) => `<option value="${k}">${A.esc(L.SHEET_TYPES[k].singular)}</option>`).join("");
        $("shTagColor").innerHTML = Object.keys(L.BADGES).map((k) => `<option value="${k}">${A.esc(L.BADGES[k].label)}</option>`).join("");
        $("sheetFilterType").innerHTML = `<option value="all">Todos</option>` +
            Object.keys(L.SHEET_TYPES).map((k) => `<option value="${k}">${A.esc(L.SHEET_TYPES[k].label)}</option>`).join("");
    }

    function resetForm() {
        editingId = null;
        $("formSheet").reset();
        $("sheetFormTitle").textContent = "Nova ficha";
        $("btnSaveSheet").textContent = "Salvar ficha";
        $("btnCancelSheetEdit").hidden = true;
    }

    function render() {
        const filter = $("sheetFilterType").value;
        const items = L.getSheets().filter((s) => filter === "all" || s.type === filter);
        $("sheetCountBadge").textContent = items.length + (items.length === 1 ? " ficha" : " fichas");
        $("sheetManagementList").innerHTML = items.length ? items.map((s) => {
            const t = L.SHEET_TYPES[s.type] || { singular: s.type, icon: "📄" };
            return `
            <div class="admin-list-item p-3 d-flex justify-content-between align-items-start gap-3">
                <div>
                    <h3 class="h6 mb-1 text-primary">${A.esc(t.icon)} ${A.esc(s.name)}</h3>
                    <div class="d-flex flex-wrap gap-2 align-items-center">
                        <span class="badge ${L.badgeClass(s.tagColor)}">${A.esc(s.tag || t.singular)}</span>
                        <small class="text-muted">${A.esc(t.singular)} · ${(s.attributes || []).length} atributo(s)${s.content ? "" : " · só resumo"}</small>
                    </div>
                </div>
                <div class="d-flex flex-wrap gap-1 justify-content-end">
                    <a class="btn btn-sm btn-outline-secondary" href="${A.esc(L.sheetUrl(s.id))}">Ver</a>
                    <button type="button" class="btn btn-sm btn-outline-primary" data-act="edit" data-id="${A.esc(s.id)}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-act="delete" data-id="${A.esc(s.id)}">Excluir</button>
                </div>
            </div>`;
        }).join("") : `<p class="text-muted small text-center py-4 mb-0">Nenhuma ficha neste filtro.</p>`;
    }

    $("formSheet").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("shName").value.trim();
        const summary = $("shSummary").value.trim();
        if (!name || !summary) { A.toast("Preencha nome e resumo.", "warning"); return; }

        const data = {
            name, summary,
            type: $("shType").value,
            tag: $("shTag").value.trim(),
            tagColor: $("shTagColor").value,
            meta: $("shMeta").value.trim(),
            subtitle: $("shSubtitle").value.trim(),
            attributes: parseAttrs($("shAttrs").value),
            content: $("shContent").value.replace(/\r\n/g, "\n").trim(),
            image: $("shImage").value.trim(),
            updatedAt: A.today()
        };
        const list = L.getSheets().slice();
        if (editingId) {
            const i = list.findIndex((s) => s.id === editingId);
            list[i] = Object.assign({}, list[i], data);
            A.toast(`Ficha “${name}” atualizada.`);
        } else {
            list.push(Object.assign({ id: L.uniqueId(name, list, "ficha") }, data));
            A.toast(`Ficha “${name}” criada.`);
        }
        persist(list);
        resetForm();
        render();
    });

    $("btnCancelSheetEdit").addEventListener("click", resetForm);
    $("sheetFilterType").addEventListener("change", render);

    $("sheetManagementList").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const s = L.getSheet(btn.dataset.id);
        if (!s) return;
        if (btn.dataset.act === "edit") {
            editingId = s.id;
            $("shName").value = s.name;
            $("shType").value = s.type;
            $("shTag").value = s.tag || "";
            $("shTagColor").value = s.tagColor || "secondary";
            $("shMeta").value = s.meta || "";
            $("shSubtitle").value = s.subtitle || "";
            $("shSummary").value = s.summary;
            $("shAttrs").value = attrsToText(s.attributes);
            $("shContent").value = s.content || "";
            $("shImage").value = s.image || "";
            $("sheetFormTitle").textContent = "Editando: " + s.name;
            $("btnSaveSheet").textContent = "Salvar alterações";
            $("btnCancelSheetEdit").hidden = false;
            $("shName").focus();
            $("formSheet").scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (confirm(`Excluir a ficha “${s.name}”?`)) {
            persist(L.getSheets().filter((x) => x.id !== s.id));
            if (editingId === s.id) resetForm();
            render();
            A.toast("Ficha excluída.", "info");
        }
    });

    fillSelects();
    render();
});
