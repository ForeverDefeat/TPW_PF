import { BannerService } from "../services/BannerService.js";

export const BannerController = {

    async getAll(req, res) {
        const banners = await BannerService.list();
        res.json({ ok: true, banners });
    },

    async create(req, res) {
        const { title, sort_order } = req.body;

        if (!req.file)
            return res.status(400).json({ ok: false, message: "Imagen obligatoria" });

        const image_url = `/uploads/${req.file.filename}`;

        const id = await BannerService.create({
            image_url,
            title,
            sort_order: sort_order || 0
        });

        res.json({ ok: true, message: "Banner creado", id });
    },

    async update(req, res) {
        const { title, sort_order } = req.body;
        const data = { title, sort_order };

        if (req.file) data.image_url = `/uploads/${req.file.filename}`;

        await BannerService.update(req.params.id, data);

        res.json({ ok: true, message: "Banner actualizado" });
    },

    async delete(req, res) {
        await BannerService.delete(req.params.id);
        res.json({ ok: true, message: "Banner desactivado" });
    }

};
