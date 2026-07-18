
document.addEventListener("DOMContentLoaded", () => {
  const linkProsseguir = document.querySelector(".prosseguir_pagamento");

  if (linkProsseguir) {
    linkProsseguir.addEventListener("click", () => {
      const dados = JSON.parse(localStorage.getItem("dadosPedidoSalgaZap") || "{}");
      dados.formaPagamento = "Cartão";
      localStorage.setItem("dadosPedidoSalgaZap", JSON.stringify(dados));
      
    });
  }
});
