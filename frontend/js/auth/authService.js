import { authSession } from "./authSession.js";

export const authService = {

    login(email, password) {

        // cuentas dummy
        if (email === "admin@turismo.com" && password === "admin123") {
            authSession.saveSession("Administrador", "admin");
            return { status: "ok", role: "admin" };
        }

        // Usuario normal
        if (email.includes("@")) {
            const username = email.split("@")[0];
            authSession.saveSession(username, "user");
            return { status: "ok", role: "user" };
        }

        return { status: "error", msg: "Credenciales inválidas" };
    },

    logout() {
        authSession.clear();
        window.location.reload();
    }

};
