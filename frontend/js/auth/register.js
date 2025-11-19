import { registerUser } from "../api.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUser = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const res = await registerUser(newUser);

    if (res.ok) {
        alert("Cuenta creada. Inicia sesión.");
        window.location.href = "login.html";
    } else {
        alert(res.message);
    }
});
