document.addEventListener("DOMContentLoaded", () => {
    const qtdItensHeader = document.querySelector('.qtd_itens');
    const resumoLista = document.querySelector('.resumo-lista');
    const totalValor = document.querySelector('.total-valor');

    let produtos = {};

    const emojisProdutos = {
        "Coxinha de Frango": "🍗",
        "Esfiha de carne": "🥙",
        "Kibe frito": "🥩",
        "Risole de queijo": "🧀",
        "Pizza de calabresa": "🍕",
        "Donut": "🍩",
        "Buchada de bode": "🍲",
        "Coca cola 1L": "🫗",
        "Suco de fruta(sua escolha)": "🍹",
        "Coca cola 2L": "🫗",
        "Café preto": "☕",
        "PF completo": "🥡"
    };

    
    function paraNumero(valor) {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
            const limpo = valor.replace('R$', '').trim().replace(',', '.');
            const num = parseFloat(limpo);
            return isNaN(num) ? 0 : num;
        }
        return 0;
    }

    function carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinhoSalgaZap');

        if (carrinhoSalvo) {
            const bruto = JSON.parse(carrinhoSalvo);
            produtos = {};
            for (let nome in bruto) {
                produtos[nome] = {
                    preco: paraNumero(bruto[nome].preco),
                    qtd: parseInt(bruto[nome].qtd, 10) || 0
                };
            }
        } else {
            produtos = {
                "Coxinha de Frango": { preco: 4.00, qtd: 2 },
                "Kibe frito": { preco: 3.50, qtd: 1 }
            };
            localStorage.setItem('carrinhoSalgaZap', JSON.stringify(produtos));
        }

        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        const containersAntigos = document.querySelectorAll('.container-food');
        containersAntigos.forEach(el => el.remove());

        const obsHeader = document.querySelector('.obs_header');
        let totalGeral = 0;
        let totalItens = 0;
        let temItem = false;

        if (resumoLista) resumoLista.innerHTML = '';

        for (let nome in produtos) {
            const produto = produtos[nome];

            if (produto.qtd > 0) {
                temItem = true;
                totalItens += produto.qtd;
                const subtotal = produto.preco * produto.qtd;
                totalGeral += subtotal;

                const emoji = emojisProdutos[nome] || "🥟";

                const cardHtml = `
                    <div class="container-food" data-nome="${nome}">
                        <div class="card-item">
                            <div class="card-img">${emoji}</div>
                            <div class="card-info">
                                <h3 class="nome-item">${nome}</h3>
                                <p class="descricao-item">${produto.qtd}× R$ ${produto.preco.toFixed(2).replace('.', ',')} cada</p>
                            </div>
                            <div class="preco_header">
                                <div class="preco">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                                <div class="xis">✕</div>
                            </div>
                        </div>
                    </div>
                `;

                if (obsHeader) {
                    obsHeader.insertAdjacentHTML('beforebegin', cardHtml);
                }

                if (resumoLista) {
                    const resumoHtml = `
                        <div class="resumo-linha">
                            <span>${produto.qtd}× ${nome}</span>
                            <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                    `;
                    resumoLista.insertAdjacentHTML('beforeend', resumoHtml);
                }
            }
        }

        if (!temItem) {
            const vazioHtml = `
                <div class="container-food">
                    <p style="text-align: center; width: 100%; padding: 20px; color: #666;">Seu carrinho está vazio! 🛍️</p>
                </div>
            `;
            if (obsHeader) obsHeader.insertAdjacentHTML('beforebegin', vazioHtml);
            if (resumoLista) resumoLista.innerHTML = '<div class="resumo-linha"><span>Nenhum item</span><span>R$ 0,00</span></div>';
        }

        if (qtdItensHeader) {
            qtdItensHeader.innerText = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;
        }

        if (totalValor) {
            totalValor.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        }

        configurarBotoesDeletar();
    }

    function configurarBotoesDeletar() {
        const botoesXis = document.querySelectorAll('.xis');
        botoesXis.forEach(botao => {
            botao.addEventListener('click', (e) => {
                const containerFood = e.target.closest('.container-food');
                const nomeItem = containerFood.getAttribute('data-nome');

                if (produtos[nomeItem]) {
                    produtos[nomeItem].qtd = 0;
                    localStorage.setItem('carrinhoSalgaZap', JSON.stringify(produtos));
                    renderizarCarrinho();
                }
            });
        });
    }

    
    function salvarProduto(nome, preco, qtd) {
        const atual = JSON.parse(localStorage.getItem('carrinhoSalgaZap') || '{}');
        atual[nome] = { preco: paraNumero(preco), qtd: parseInt(qtd, 10) || 0 };
        localStorage.setItem('carrinhoSalgaZap', JSON.stringify(atual));
    }

    window.addEventListener('pageshow', carregarCarrinho);
    carregarCarrinho();
});