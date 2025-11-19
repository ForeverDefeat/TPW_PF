async function loadComponent(containerId, filePath) {
    const container = document.querySelector(containerId);
    if (!container) return;

    const res = await fetch(filePath);
    const html = await res.text();
    container.innerHTML += html;    // ← IMPORTANTE: += para no reemplazar body
}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("#header-container", "components/header.html");
    await loadComponent("#sidebar-container", "components/sidebar.html");
    await loadComponent("#authArea", "components/auth.html");

    // Cargar modales en el <body>
    await loadComponent("body", "components/loginModal.html");
    await loadComponent("body", "components/registerModal.html");

    // Inicializar lógica de los modales
/*     import("./auth/loginModal.js").then(m => m.setupLoginModal());
    import("./auth/registerModal.js").then(m => m.setupRegisterModal()); */

    // 5) Cuando TODO está cargado → inicializar login y register
    const { setupLoginModal } = await import("./auth/loginModal.js");
    const { setupRegisterModal } = await import("./auth/registerModal.js");
    const { setupAuthUI } = await import("./auth/authUI.js");

    setupLoginModal();
    setupRegisterModal();
    setupAuthUI();
});