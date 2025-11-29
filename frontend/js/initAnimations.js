document.addEventListener("componentsLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.25
    });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

    console.log("✔ Animaciones fade-in activadas");
});
