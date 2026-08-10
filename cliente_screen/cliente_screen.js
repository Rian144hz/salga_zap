document.addEventListener("DOMContentLoaded", () => {
    const nomeEl = document.getElementById("nome");
    const whatsEl = document.getElementById("whats");
    const botaoSair = document.getElementById("sair");

    const usuario = JSON.parse(localStorage.getItem("usuarioSalgaZap") || "null");

    if (usuario && usuario.nome) {
        nomeEl.innerText = usuario.nome;
        whatsEl.innerText = usuario.whats || "não informado";
    } else {
        nomeEl.innerText = "Visitante";
        whatsEl.innerText = "não informado";
    }

    botaoSair.addEventListener("click", () => {
        localStorage.removeItem("usuarioSalgaZap");
        window.location.href = "../login_screen/login_screen.html";
    });
});
