// Lógica da tela de endereço de entrega.
const TAXA_ENTREGA = 7.00;

function formatarBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function pegarSubtotalCarrinho() {
  const salvo = localStorage.getItem("carrinhoSalgaZap");
  if (!salvo) return 0;
  const produtos = JSON.parse(salvo);
  let total = 0;
  for (const nome in produtos) {
    total += produtos[nome].qtd * produtos[nome].preco;
  }
  return total;
}

function atualizarResumoEndereco() {
  const subtotal = pegarSubtotalCarrinho();
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  if (subtotalEl) subtotalEl.textContent = formatarBRL(subtotal);
  if (totalEl) totalEl.textContent = formatarBRL(subtotal + TAXA_ENTREGA);
}


function confirmarEndereco() {
  const campos = {
    cep: document.querySelector(".card_cep_input input"),
    rua: document.querySelector(".card_avenida_input input"),
    numero: document.querySelector(".card_numero_input input"),
    complemento: document.querySelector(".card_complemento_input input"),
    bairro: document.querySelector(".card_bairro_input input"),
    cidade: document.querySelector(".card_cidade_input input"),
    estado: document.querySelector(".card_estado_input input"),
    referencia: document.querySelector(".card_referencia_input input"),
  };

  const obrigatorios = ["cep", "rua", "numero", "bairro", "cidade", "estado"];
  for (const chave of obrigatorios) {
    if (!campos[chave].value.trim()) {
      alert("Por favor, preencha o campo: " + chave.toUpperCase());
      campos[chave].focus();
      return;
    }
  }

  const endereco = {
    cep: campos.cep.value.trim(),
    rua: campos.rua.value.trim(),
    numero: campos.numero.value.trim(),
    complemento: campos.complemento.value.trim(),
    bairro: campos.bairro.value.trim(),
    cidade: campos.cidade.value.trim(),
    estado: campos.estado.value.trim().toUpperCase(),
    referencia: campos.referencia.value.trim(),
  };

  localStorage.setItem("enderecoSalgaZap", JSON.stringify(endereco));

  const dados = JSON.parse(localStorage.getItem("dadosPedidoSalgaZap") || "{}");
  dados.tipoEntrega = "Entrega";
  localStorage.setItem("dadosPedidoSalgaZap", JSON.stringify(dados));

  window.location.href = "data_screen.html";
}

document.addEventListener("DOMContentLoaded", atualizarResumoEndereco);
