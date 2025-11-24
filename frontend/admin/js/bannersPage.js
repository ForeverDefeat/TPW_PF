/**
 * @file bannersPage.js
 * @description Controlador del módulo "Banners" en el Admin Panel
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ============================================================================
   INICIALIZAR PÁGINA
============================================================================ */

export function initBannersPage() {
    renderBanners();
    setupAddBannerButton();
}

/* ============================================================================
   RENDERIZAR TABLA
============================================================================ */

async function renderBanners() {
    const tbody = document.getElementById("bannerTableBody"); 
    tbody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;

    const res = await apiGet("/banners");
    const banners = Array.isArray(res.banners) ? res.banners : [];

    tbody.innerHTML = "";

    banners.forEach(b => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${b.id}</td>
            <td><img src="${b.image_url}" class="admin-thumb"></td>
            <td>${b.title ?? "-"}</td>
            <td>${b.sort_order}</td>
            <td>
                <button class="admin-btn small edit-banner-btn" data-id="${b.id}">Editar</button>
                <button class="admin-btn small danger delete-banner-btn" data-id="${b.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    setupEditButtons();
    setupDeleteButtons();
}

/* ============================================================================
   AÑADIR BANNER
============================================================================ */

function setupAddBannerButton() {
    const btn = document.getElementById("btnAddBanner");
    if (!btn) return;

    btn.onclick = async () => {
        const container = document.getElementById("bannerModalContainer");

        const html = await fetch("components/modals/modalAddBanner.html").then(r => r.text());
        container.innerHTML = html;

        document.getElementById("closeAddBanner").onclick = () => {
            container.innerHTML = "";
        };

        document.getElementById("formAddBanner").onsubmit = async (e) => {
            e.preventDefault();

            const fd = new FormData();
            fd.append("title", document.getElementById("bannerTitle").value);
            fd.append("sort_order", document.getElementById("bannerOrder").value);
            fd.append("image", document.getElementById("bannerImage").files[0]);

            await apiPostFile("/banners", fd);

            container.innerHTML = "";
            await renderBanners();
        };
    };
}

/* ============================================================================
   EDITAR BANNER
============================================================================ */

function setupEditButtons() {
    document.querySelectorAll(".edit-banner-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            const container = document.getElementById("bannerModalContainer");
            const html = await fetch("../components/modals/modalEditBanner.html").then(r => r.text());
            container.innerHTML = html;

            const res = await apiGet("/banners");
            const data = Array.isArray(res.banners) ? res.banners : [];
            const banner = data.find(b => b.id == id);

            document.getElementById("editBannerId").value = banner.id;
            document.getElementById("editBannerTitle").value = banner.title || "";
            document.getElementById("editBannerOrder").value = banner.sort_order;

            document.getElementById("closeEditBanner").onclick = () => {
                container.innerHTML = "";
            };

            document.getElementById("formEditBanner").onsubmit = async (e) => {
                e.preventDefault();

                const fd = new FormData();
                fd.append("title", document.getElementById("editBannerTitle").value);
                fd.append("sort_order", document.getElementById("editBannerOrder").value);

                const newImage = document.getElementById("editBannerImage").files[0];
                if (newImage) fd.append("image", newImage);

                await apiPutFile(`/banners/${id}`, fd);

                container.innerHTML = "";
                await renderBanners();
            };
        };
    });
}

/* ============================================================================
   ELIMINAR BANNER
============================================================================ */

function setupDeleteButtons() {
    document.querySelectorAll(".delete-banner-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Eliminar banner?")) return;

            await apiDelete(`/banners/${id}`);
            await renderBanners();
        };
    });
}
