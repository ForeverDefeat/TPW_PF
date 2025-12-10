import { GalleryService } from "../services/GalleryService.js";

export class GalleryController {


    static async getByDestination(req, res) {
        const { destinationId } = req.params;
        const images = await GalleryService.getGallery(destinationId);

        res.json({
            ok: true,
            images
        });
    }

    static async uploadImages(req, res) {

        console.log("FILES RECIBIDOS:", req.files);
        console.log("BODY:", req.body);


        const { destinationId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No se enviaron imágenes"
            });
        }

        const uploaded = [];

        for (const file of req.files) {
            if (!file?.filename) continue;
            const result = await GalleryService.addImage(destinationId, file.filename);
            uploaded.push(result);
        }


        res.json({
            ok: true,
            message: "Imágenes subidas correctamente",
            images: uploaded
        });
    }

    static async delete(req, res) {
        const { id } = req.params;

        await GalleryService.deleteImage(id);

        res.json({
            ok: true,
            message: "Imagen eliminada"
        });
    }
}
