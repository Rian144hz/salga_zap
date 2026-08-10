document.addEventListener("DOMContentLoaded", () => {
    const botaoEntrar = document.getElementById("entrar");
    const campoNome = document.getElementById("nome");
    const campoWhats = document.getElementById("whats");

    botaoEntrar.addEventListener("click", () => {
        const nome = campoNome.value.trim();
        const whats = campoWhats.value.trim();

        if (!nome) {
            alert("Por favor, informe seu nome.");
            campoNome.focus();
            return;
        }

        localStorage.setItem("usuarioSalgaZap", JSON.stringify({ nome: nome, whats: whats }));
        window.location.href = "../menu_screen/menu_screen.html";
    });
});
