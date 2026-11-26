/**
 * configuracoes-admin.js – identidade do site, manutenção e troca de senha
 */
document.addEventListener("DOMContentLoaded", () => {
    const A = window.AdminCore;
    if (!A.requireLogin()) return;
    const L = A.L;
    const $ = (id) => document.getElementById(id);

    // carrega valores atuais
    const cfg = L.getConfig();
    $("siteName").value = cfg.siteName || "";
    $("shortName").value = cfg.shortName || "";
    $("tagline").value = cfg.tagline || "";
    $("siteAuthor").value = cfg.author || "";
    $("siteEmail").value = cfg.email || "";
    $("maintenanceSelect").value = cfg.maintenance ? "on" : "off";

    $("formSiteSettings").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = $("siteEmail").value.trim();
        if (!$("siteName").value.trim() || !$("shortName").value.trim() || !$("siteAuthor").value.trim()) {
            A.toast("Preencha nome do site, nome curto e autor.", "warning");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) { A.toast("Informe um e-mail válido.", "warning"); return; }

        const turningOn = $("maintenanceSelect").value === "on" && !cfg.maintenance;
        if (!L.saveConfig({
            siteName: $("siteName").value.trim(),
            shortName: $("shortName").value.trim(),
            tagline: $("tagline").value.trim(),
            author: $("siteAuthor").value.trim(),
            email,
            maintenance: $("maintenanceSelect").value === "on"
        })) { A.toast("Não foi possível salvar.", "danger"); return; }

        A.changed();
        A.toast(turningOn
            ? "Salvo. Manutenção só vale para visitantes após exportar e publicar o library.js."
            : "Configurações salvas.");
    });

    $("formPassword").addEventListener("submit", async (e) => {
        e.preventDefault();
        const current = $("pwCurrent").value, next = $("pwNew").value, confirmPw = $("pwConfirm").value;
        if (!(await A.checkPassword(current))) { A.toast("A senha atual está incorreta.", "danger"); return; }
        if (next.length < 8) { A.toast("A nova senha precisa ter pelo menos 8 caracteres.", "warning"); return; }
        if (next !== confirmPw) { A.toast("A confirmação não confere com a nova senha.", "warning"); return; }
        if (next === "silverfox2026") { A.toast("Escolha uma senha diferente da inicial.", "warning"); return; }
        await A.setPassword(next);
        $("formPassword").reset();
        A.toast("Senha alterada com sucesso.");
    });
});
