async function loadComponent(containerId, filePath) {
    const container = document.querySelector(containerId);
    if (!container) return;

    const res = await fetch(filePath);
    const html = await res.text();
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("#header-container", "components/header.html");
    await loadComponent("#sidebar-container", "components/sidebar.html");
    await loadComponent("#authArea", "components/auth.html");

});
