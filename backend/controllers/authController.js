// controllers/authController.js
import User from "../models/User.js";

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findByEmailAndPassword(email, password);

    if (!user) {
        return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });
    }

    return res.json({
        ok: true,
        user: {
            fullName: user.fullName,
            role: user.role
        }
    });
}

export async function register(req, res) {
    const { fullName, email, password } = req.body;

    await User.create(fullName, email, password);

    return res.json({ ok: true, message: "Usuario registrado" });
}
