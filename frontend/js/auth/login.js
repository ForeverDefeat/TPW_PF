import { loginUser } from "../api.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await loginUser(email, password);

    if (res.ok) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", res.username);
        localStorage.setItem("userRole", res.role);

        window.location.href = "index.html";
    } else {
        alert(res.message);
    }
});
