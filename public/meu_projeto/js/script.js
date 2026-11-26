document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // CABEÇALHO AO ROLAR A PÁGINA
    // ========================================

    const header = document.querySelector(".site-header");

    function handleHeaderScroll() {

        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }

    }

    window.addEventListener("scroll", handleHeaderScroll, {
        passive: true
    });

    handleHeaderScroll();


    // ========================================
    // ANIMAÇÃO DOS ELEMENTOS (REVEAL)
    // ========================================

    // Seleciona todas as seções e cartões do novo layout para aplicar a animação
    const animatedElements = document.querySelectorAll(
        ".hero-section, .books-section, .wiki-section, .sheets-section, .trivia-section, .service-card, .card, .contact-section"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, obs) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    obs.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.10
        });

        animatedElements.forEach(element => {
            element.classList.add("reveal");
            observer.observe(element);
        });

    } else {

        animatedElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    // ========================================
    // BOTÃO VOLTAR AO TOPO
    // ========================================

    const backToTop = document.createElement("button");

    backToTop.id = "backToTop";
    backToTop.type = "button";
    backToTop.setAttribute("aria-label", "Voltar ao topo");
    backToTop.innerHTML = "↑";

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    }, {
        passive: true
    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});
