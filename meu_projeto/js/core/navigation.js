/**
 * navigation.js
 * Módulo de navegação, rolagem suave (smooth scroll) e controle de menus responsivos.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ROLAGEM SUAVE PARA ÂNCORAS INTERNAS
    // ==========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#" || !targetId.startsWith("#")) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Fecha o menu mobile do Bootstrap caso esteja aberto
                closeMobileMenu();
            }
        });
    });

    // ==========================================
    // 2. CONTROLE DO MENU MOBILE (BOOTSTRAP)
    // ==========================================
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    const closeMobileMenu = () => {
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            // Verifica se o Bootstrap está disponível globalmente
            if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            } else {
                navbarCollapse.classList.remove("show");
            }
        }
    };

    // Fecha o menu ao clicar em qualquer link de navegação em telas pequenas
    if (navbarCollapse) {
        navLinks.forEach(link => {
            // O botão do submenu (data-bs-toggle="dropdown") apenas abre o submenu
            if (link.hasAttribute("data-bs-toggle")) return;
            link.addEventListener("click", () => {
                if (window.innerWidth < 992) {
                    closeMobileMenu();
                }
            });
        });
    }
});