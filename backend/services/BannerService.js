import { BannerRepository } from "../repositories/BannerRepository.js";

export class BannerService {

    static async list() {
        return BannerRepository.getAll();
    }

    static async create(data) {
        return BannerRepository.create(data);
    }

    static async update(id, data) {
        return BannerRepository.update(id, data);
    }

    static async delete(id) {
        return BannerRepository.softDelete(id);
    }
}
