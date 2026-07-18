
document.addEventListener("DOMContentLoaded", () => {
  const LINK_MENU = "../menu_screen/menu_screen.html";
  const TEMPO_ESPERA = 5000;
  let redirecionou = false;

  function irParaMenu() {
    if (redirecionou) return;
    redirecionou = true;
    window.location.href = LINK_MENU;
  }

  const timer = setTimeout(irParaMenu, TEMPO_ESPERA);
  document.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => clearTimeout(timer));
  });
});
