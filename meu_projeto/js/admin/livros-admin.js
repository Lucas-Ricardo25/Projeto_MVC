/**
 * livros-admin.js – cadastro, edição e exclusão de obras e capítulos.
 * Tudo é salvo no navegador do autor (window.Library); para publicar, exporte o library.js.
 */
document.addEventListener("DOMContentLoaded", () => {
    const A = window.AdminCore;
    if (!A.requireLogin()) return;
    const L = A.L;
    const $ = (id) => document.getElementById(id);

    let editingBookId = null;     // obra em edição (null = nova)
    let selectedBookId = null;    // obra com o painel de capítulos aberto
    let editingChapterId = null;

    const books = () => L.getBooks();
    const persist = (list) => {
        if (!L.saveBooks(list)) A.toast("Não foi possível salvar (armazenamento do navegador cheio ou bloqueado).", "danger");
        A.changed();
    };

    /* ============ OBRAS ============ */
    function fillSelects() {
        $("bkStatus").innerHTML = Object.keys(L.STATUS).map((k) => `<option value="${k}">${A.esc(L.STATUS[k].label)}</option>`).join("");
        $("bkCategory").innerHTML = L.getCategories().map((c) => `<option value="${A.esc(c.id)}">${A.esc(c.name)}</option>`).join("");
    }

    function uniqueId(title) {
        const base = L.slugify(title) || "obra";
        let id = base, n = 2;
        while (books().some((b) => b.id === id)) id = base + "-" + n++;
        return id;
    }

    function resetBookForm() {
        editingBookId = null;
        $("formBook").reset();
        $("bkCur").value = 0;
        $("bkTotal").value = 0;
        $("bookFormTitle").textContent = "Cadastrar nova obra";
        $("btnSaveBook").textContent = "Salvar obra";
        $("btnCancelBookEdit").hidden = true;
    }

    function editBook(id) {
        const b = L.getBook(id);
        if (!b) return;
        editingBookId = id;
        $("bkTitle").value = b.title;
        $("bkSubtitle").value = b.subtitle || "";
        $("bkStatus").value = b.status;
        $("bkCategory").value = b.category;
        $("bkSynopsis").value = b.synopsis;
        $("bkCur").value = (b.progress && b.progress.current) || 0;
        $("bkTotal").value = (b.progress && b.progress.total) || 0;
        $("bkPublished").value = b.publishedAt || "";
        $("bkCover").value = b.cover || "";
        $("bkPdf").value = b.pdf || "";
        $("bkEpub").value = b.epub || "";
        $("bookFormTitle").textContent = "Editando: " + b.title;
        $("btnSaveBook").textContent = "Salvar alterações";
        $("btnCancelBookEdit").hidden = false;
        $("bkTitle").focus();
        $("formBook").scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function renderBooks() {
        const list = books();
        $("bookCountBadge").textContent = list.length + (list.length === 1 ? " obra" : " obras");
        if (!list.length) {
            $("booksManagementList").innerHTML = `<p class="text-muted small text-center py-4 mb-0">Nenhuma obra cadastrada.</p>`;
            return;
        }
        $("booksManagementList").innerHTML = list.map((b) => {
            const st = L.statusInfo(b.status);
            const cat = L.getCategory(b.category);
            const n = (b.chapters || []).length;
            return `
            <div class="admin-list-item p-3 ${b.id === selectedBookId ? "is-selected" : ""}">
                <div class="d-flex justify-content-between align-items-start gap-3">
                    <div class="min-w-0">
                        <h3 class="h6 mb-1 text-primary">${A.esc(b.title)}</h3>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <span class="badge ${st.badge}">${A.esc(st.label)}</span>
                            <small class="text-muted">${A.esc(cat ? cat.name : "Sem categoria")} · ${n} cap. · <code>${A.esc(b.id)}</code></small>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap gap-1 justify-content-end">
                        <button type="button" class="btn btn-sm btn-outline-primary" data-act="chapters" data-id="${A.esc(b.id)}">Capítulos</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" data-act="edit" data-id="${A.esc(b.id)}">Editar</button>
                        <button type="button" class="btn btn-sm btn-outline-danger" data-act="delete" data-id="${A.esc(b.id)}" aria-label="Excluir ${A.esc(b.title)}">Excluir</button>
                    </div>
                </div>
            </div>`;
        }).join("");
    }

    $("formBook").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $("bkTitle").value.trim();
        const synopsis = $("bkSynopsis").value.trim();
        if (!title || !synopsis) { A.toast("Preencha título e sinopse.", "warning"); return; }

        const data = {
            title,
            subtitle: $("bkSubtitle").value.trim(),
            status: $("bkStatus").value,
            category: $("bkCategory").value,
            synopsis,
            progress: { current: Math.max(0, +$("bkCur").value || 0), total: Math.max(0, +$("bkTotal").value || 0) },
            publishedAt: $("bkPublished").value.trim(),
            cover: $("bkCover").value.trim(),
            pdf: $("bkPdf").value.trim(),
            epub: $("bkEpub").value.trim(),
            updatedAt: A.today()
        };

        const list = books();
        if (editingBookId) {
            const i = list.findIndex((b) => b.id === editingBookId);
            list[i] = Object.assign({}, list[i], data);
            A.toast(`Obra “${title}” atualizada.`);
        } else {
            list.push(Object.assign({ id: uniqueId(title), chapters: [] }, data));
            A.toast(`Obra “${title}” cadastrada.`);
        }
        persist(list);
        resetBookForm();
        renderBooks();
    });

    $("btnCancelBookEdit").addEventListener("click", resetBookForm);

    $("booksManagementList").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.dataset.act === "edit") editBook(id);
        if (btn.dataset.act === "chapters") openChapters(id);
        if (btn.dataset.act === "delete") {
            const b = L.getBook(id);
            if (!confirm(`Excluir a obra “${b.title}” e todos os seus capítulos? Esta ação só pode ser desfeita descartando as alterações locais.`)) return;
            persist(books().filter((x) => x.id !== id));
            if (selectedBookId === id) closeChapters();
            if (editingBookId === id) resetBookForm();
            renderBooks();
            A.toast("Obra excluída.", "info");
        }
    });

    /* ============ CAPÍTULOS ============ */
    function openChapters(id) {
        selectedBookId = id;
        const b = L.getBook(id);
        $("chaptersBookName").textContent = b.title;
        $("chaptersPanel").hidden = false;
        resetChapterForm();
        renderChapters();
        renderBooks();
        $("chaptersPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeChapters() {
        selectedBookId = null;
        $("chaptersPanel").hidden = true;
        renderBooks();
    }

    function resetChapterForm() {
        editingChapterId = null;
        $("formChapter").reset();
        const b = L.getBook(selectedBookId);
        const next = Math.max(0, ...((b && b.chapters) || []).map((c) => +c.number || 0)) + 1;
        $("chNumber").value = next;
        $("chDate").value = A.today();
        $("chapterFormTitle").textContent = "Novo capítulo";
        $("btnSaveChapter").textContent = "Salvar capítulo";
        $("btnCancelChapterEdit").hidden = true;
    }

    function renderChapters() {
        const b = L.getBook(selectedBookId);
        const list = ((b && b.chapters) || []).slice().sort((x, y) => x.number - y.number);
        if (!list.length) {
            $("chaptersList").innerHTML = `<p class="text-muted small mb-0">Nenhum capítulo ainda.</p>`;
            return;
        }
        $("chaptersList").innerHTML = list.map((c) => `
            <div class="admin-list-item p-3 d-flex justify-content-between align-items-center gap-3">
                <div>
                    <small class="text-muted d-block">Capítulo ${String(c.number).padStart(2, "0")}${c.date ? " · " + A.esc(L.formatDate(c.date)) : ""}</small>
                    <strong>${A.esc(c.title)}</strong>
                    <span class="badge ${c.content ? "bg-success" : "bg-secondary"} ms-2">${c.content ? "texto no site" : "só título / PDF"}</span>
                </div>
                <div class="d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-cact="edit" data-cid="${A.esc(c.id)}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-cact="delete" data-cid="${A.esc(c.id)}">Excluir</button>
                </div>
            </div>`).join("");
    }

    $("formChapter").addEventListener("submit", (e) => {
        e.preventDefault();
        const number = Math.floor(+$("chNumber").value);
        const title = $("chTitle").value.trim();
        if (!(number >= 1) || !title) { A.toast("Informe número e título do capítulo.", "warning"); return; }

        const list = books();
        const book = list.find((b) => b.id === selectedBookId);
        book.chapters = book.chapters || [];

        if (book.chapters.some((c) => +c.number === number && c.id !== editingChapterId)) {
            A.toast(`Já existe o capítulo ${number} nesta obra.`, "warning");
            return;
        }

        const data = { number, title, content: $("chContent").value.replace(/\r\n/g, "\n").trim(), date: $("chDate").value || A.today() };
        if (editingChapterId) {
            const i = book.chapters.findIndex((c) => c.id === editingChapterId);
            book.chapters[i] = Object.assign({}, book.chapters[i], data);
        } else {
            let cid = "c" + String(number).padStart(2, "0");
            while (book.chapters.some((c) => c.id === cid)) cid += "x";
            book.chapters.push(Object.assign({ id: cid }, data));
        }
        book.updatedAt = A.today();
        // mantém o "capítulo atual" da obra em dia
        if (!book.progress) book.progress = { current: 0, total: 0 };
        book.progress.current = Math.max(book.progress.current, number);

        persist(list);
        A.toast(`Capítulo ${number} salvo.`);
        resetChapterForm();
        renderChapters();
        renderBooks();
    });

    $("btnCancelChapterEdit").addEventListener("click", resetChapterForm);
    $("btnCloseChapters").addEventListener("click", closeChapters);

    $("chaptersList").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-cact]");
        if (!btn) return;
        const list = books();
        const book = list.find((b) => b.id === selectedBookId);
        const c = book.chapters.find((x) => x.id === btn.dataset.cid);
        if (!c) return;

        if (btn.dataset.cact === "edit") {
            editingChapterId = c.id;
            $("chNumber").value = c.number;
            $("chDate").value = c.date || "";
            $("chTitle").value = c.title;
            $("chContent").value = c.content || "";
            $("chapterFormTitle").textContent = "Editando capítulo " + c.number;
            $("btnSaveChapter").textContent = "Salvar alterações";
            $("btnCancelChapterEdit").hidden = false;
            $("chTitle").focus();
        } else if (confirm(`Excluir o capítulo ${c.number} – “${c.title}”?`)) {
            book.chapters = book.chapters.filter((x) => x.id !== c.id);
            book.updatedAt = A.today();
            persist(list);
            resetChapterForm();
            renderChapters();
            renderBooks();
            A.toast("Capítulo excluído.", "info");
        }
    });

    fillSelects();
    renderBooks();
});
