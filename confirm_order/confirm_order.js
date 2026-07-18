
const WHATSAPP_NUMERO_LOJA = "75991857605";

function formatarBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function carregarPedido() {
  const carrinho = JSON.parse(localStorage.getItem("carrinhoSalgaZap") || "{}");
  const dados = JSON.parse(localStorage.getItem("dadosPedidoSalgaZap") || "{}");
  const endereco = JSON.parse(localStorage.getItem("enderecoSalgaZap") || "null");

  const itens = [];
  let subtotal = 0;
  for (const nome in carrinho) {
    const p = carrinho[nome];
    if (p.qtd > 0) {
      const sub = p.qtd * p.preco;
      subtotal += sub;
      itens.push({ nome, qtd: p.qtd, preco: p.preco, subtotal: sub });
    }
  }

  const tipoEntrega = dados.tipoEntrega || "Retirar";
  const taxa = tipoEntrega === "Entrega" ? 7.0 : 0;
  const total = subtotal + taxa;

  return {
    itens,
    subtotal,
    taxa,
    total,
    nome: dados.nome,
    whatsapp: dados.whatsapp,
    tipoEntrega,
    endereco,
    formaPagamento: dados.formaPagamento || "Dinheiro",
    troco: dados.troco,
    observacoes: dados.observacoes || "",
  };
}

function renderizarConfirmacao(pedido) {
  
  const numero = "#" + Math.floor(1000 + Math.random() * 9000);
  const numEl = document.querySelector(".pedido-numero");
  if (numEl) numEl.textContent = numero;

  
  const corpo = document.querySelector(".card-pedido-corpo");
  if (corpo) {
    corpo.innerHTML = "";
    if (pedido.itens.length === 0) {
      corpo.innerHTML =
        '<div class="pedido-item-linha"><span class="item-nome">Seu carrinho está vazio</span></div>';
    } else {
      pedido.itens.forEach((i) => {
        const linha = document.createElement("div");
        linha.className = "pedido-item-linha";
        linha.innerHTML =
          '<span class="item-nome">' +
          i.qtd +
          "× " +
          i.nome +
          '</span><span class="item-preco">' +
          formatarBRL(i.subtotal) +
          "</span>";
        corpo.appendChild(linha);
      });
    }
  }


  const info = document.querySelector(".nome_cliente_pedido");
  if (info) {
    let html = "<p>👤 " + (pedido.nome || "Cliente") + "</p>";
    if (pedido.whatsapp) html += "<p>📱 " + pedido.whatsapp + "</p>";
    html += "<p>💳 " + pedido.formaPagamento + "</p>";
    html += "<p>🚚 " + pedido.tipoEntrega + "</p>";
    if (pedido.tipoEntrega === "Entrega" && pedido.endereco) {
      const e = pedido.endereco;
      html +=
        "<p>📍 " +
        e.rua +
        ", " +
        e.numero +
        (e.complemento ? " (" + e.complemento + ")" : "") +
        " — " +
        e.bairro +
        ", " +
        e.cidade +
        "/" +
        e.estado +
        "</p>";
    }
    if (pedido.observacoes) html += "<p>📝 " + pedido.observacoes + "</p>";
    info.innerHTML = html;
  }

  
  const totalEl = document.querySelector(".preco_total p");
  if (totalEl) totalEl.textContent = formatarBRL(pedido.total);
}

function montarTextoWhatsApp(pedido) {
  const linhas = [];
  linhas.push("*🥟 NOVO PEDIDO — Salga-Zap*");
  linhas.push("");
  linhas.push("*Itens:*");
  pedido.itens.forEach((i) => {
    linhas.push("• " + i.qtd + "× " + i.nome + " — " + formatarBRL(i.subtotal));
  });
  linhas.push("");
  linhas.push("*Subtotal:* " + formatarBRL(pedido.subtotal));
  if (pedido.tipoEntrega === "Entrega") {
    linhas.push("*Taxa de entrega:* " + formatarBRL(pedido.taxa));
  }
  linhas.push("*Total:* " + formatarBRL(pedido.total));
  linhas.push("");
  linhas.push("*Cliente:* " + (pedido.nome || "Não informado"));
  if (pedido.whatsapp) linhas.push("*WhatsApp:* " + pedido.whatsapp);
  linhas.push("*Entrega:* " + pedido.tipoEntrega);
  if (pedido.tipoEntrega === "Entrega" && pedido.endereco) {
    const e = pedido.endereco;
    let end = e.rua + ", " + e.numero;
    if (e.complemento) end += " (" + e.complemento + ")";
    end += " — " + e.bairro + ", " + e.cidade + "/" + e.estado + " — CEP " + e.cep;
    if (e.referencia) end += " — Ref: " + e.referencia;
    linhas.push("*Endereço:* " + end);
  }
  linhas.push("*Pagamento:* " + pedido.formaPagamento);
  if (pedido.formaPagamento === "Dinheiro" && pedido.troco) {
    linhas.push("*Troco para:* " + pedido.troco);
  }
  if (pedido.observacoes) linhas.push("*Obs:* " + pedido.observacoes);
  return linhas.join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
  const pedido = carregarPedido();
  renderizarConfirmacao(pedido);

  // Enviar pedido pelo WhatsApp.
  const btnZap = document.querySelector(".button_zap");
  if (btnZap) {
    btnZap.style.cursor = "pointer";
    btnZap.addEventListener("click", () => {
      const texto = montarTextoWhatsApp(pedido);
      const url =
        "https://wa.me/" +
        WHATSAPP_NUMERO_LOJA +
        "?text=" +
        encodeURIComponent(texto);
      window.open(url, "_blank");
    });
  }

  const btnNovamente = document.querySelector(".button_comprar_again");
  if (btnNovamente) {
    btnNovamente.addEventListener("click", () => {
      localStorage.removeItem("carrinhoSalgaZap");
      localStorage.removeItem("dadosPedidoSalgaZap");
      localStorage.removeItem("enderecoSalgaZap");
    });
  }
});
