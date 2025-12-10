import { GalleryRepository } from "../repositories/GalleryRepository.js";

export class GalleryService {

    static async getGallery(destinationId) {
        return await GalleryRepository.getByDestination(destinationId);
    }

    static async addImage(destinationId, filename) {
        const imageUrl = `/uploads/${filename}`;
        return await GalleryRepository.addImage(destinationId, imageUrl);
    }

    static async deleteImage(id) {
        return await GalleryRepository.deleteImage(id);
    }
}
