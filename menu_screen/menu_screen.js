document.addEventListener("DOMContentLoaded", () => {
    const botoesFiltro = document.querySelectorAll('.button-filter-food button');
    const containersSalgados = document.querySelectorAll('.container-foods');
    const barraPesquisa = document.querySelector('.search-bar input');
    const tituloPagina = document.getElementById('titulo-pagina');
    
    const btnCarrinhoTopo = document.querySelector('.carrinho');
    const btnFinshBase = document.querySelector('.finsh_button');

    let categoriaAtual = 'todos';
    let textoPesquisa = '';

    const produtos = {
        "Coxinha de Frango": { preco: 4.00, qtd: 0 },
        "Esfiha de carne": { preco: 3.50, qtd: 0 },
        "Kibe frito": { preco: 3.50, qtd: 0 },
        "Risole de queijo": { preco: 4.00, qtd: 0 },
        "Pizza de calabresa": { preco: 5.00, qtd: 0 },
        "Donut": { preco: 5.00, qtd: 0 },
        "Buchada de bode": { preco: 50.00, qtd: 0 },
        "Coca cola 1L": { preco: 7.00, qtd: 0 },
        "Suco de fruta(sua escolha)": { preco: 6.00, qtd: 0 },
        "Coca cola 2L": { preco: 10.00, qtd: 0 },
        "Café preto": { preco: 2.00, qtd: 0 },
        "PF completo": { preco: 25.00, qtd: 0 }
    };

    const nomesCategorias = {
        'todos': 'Todos os itens',
        'fritos': 'Fritos',
        'assados': ' Assados',
        'doces': 'Doces',
        'bebidas': 'Bebidas',
        'marmitas': 'Marmitas',
        'especiais': 'Especiais da semana'
    };

    
    function carregarDoLocalStorage() {
        const salvo = localStorage.getItem('carrinhoSalgaZap');
        if (!salvo) return;

        const dadosSalvos = JSON.parse(salvo);
        for (let nome in dadosSalvos) {
            if (produtos[nome]) {
                produtos[nome].qtd = dadosSalvos[nome].qtd || 0;
            }
        }
    }

    
    function salvarNoLocalStorage() {
        localStorage.setItem('carrinhoSalgaZap', JSON.stringify(produtos));
    }

    function aplicarFiltros() {
        let itensVisiveis = 0;

        containersSalgados.forEach(container => {
            const card = container.querySelector('.card-item');
            if (!card) return;

            const categoriaCard = card.getAttribute('data-categoria');
            const nomeCard = card.querySelector('.nome-item').innerText.trim();

            const bateCategoria = (categoriaAtual === 'todos' || categoriaAtual === categoriaCard);
            const batePesquisa = nomeCard.toLowerCase().includes(textoPesquisa);

            if (bateCategoria && batePesquisa) {
                container.style.display = 'block';
                itensVisiveis++;
            } else {
                container.style.display = 'none';
            }
        });

        if (itensVisiveis === 0) {
            tituloPagina.innerText = 'Nenhum salgado encontrado 🔍';
        } else {
            tituloPagina.innerText = nomesCategorias[categoriaAtual] || 'Itens';
        }
    }

    function atualizarTotais() {
        let totalItens = 0;
        let totalDinheiro = 0;

        for (let nome in produtos) {
            totalItens += produtos[nome].qtd;
            totalDinheiro += produtos[nome].qtd * produtos[nome].preco;
        }

        const valorFormatado = totalDinheiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const textoItens = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;

        if (btnCarrinhoTopo) {
            btnCarrinhoTopo.innerText = `🛒 ${textoItens}`;
        }
        if (btnFinshBase) {
            btnFinshBase.innerHTML = `<b>🛒 ${textoItens} ${valorFormatado}</b>`;
        }
    }

    
    carregarDoLocalStorage();

    containersSalgados.forEach(container => {
        const card = container.querySelector('.card-item');
        if (!card) return;

        const nomeItem = card.querySelector('.nome-item').innerText.trim();
        const btnMais = container.querySelector('.btn-contador:not(.minus)');
        const btnMenos = container.querySelector('.minus');

        const spanQtd = document.createElement('span');
        spanQtd.className = 'qtd-numero';
        // <<< MUDANÇA: começa exibindo a quantidade já salva (não sempre '0')
        spanQtd.innerText = produtos[nomeItem] ? produtos[nomeItem].qtd : 0;
        spanQtd.style.margin = '0 10px';
        spanQtd.style.fontWeight = 'bold';
        container.querySelector('.contador-container').insertBefore(spanQtd, btnMais);

        btnMais.addEventListener('click', () => {
            if (produtos[nomeItem]) {
                produtos[nomeItem].qtd++;
                spanQtd.innerText = produtos[nomeItem].qtd;
                atualizarTotais();
                salvarNoLocalStorage(); 
            }
        });

        btnMenos.addEventListener('click', () => {
            if (produtos[nomeItem] && produtos[nomeItem].qtd > 0) {
                produtos[nomeItem].qtd--;
                spanQtd.innerText = produtos[nomeItem].qtd;
                atualizarTotais();
                salvarNoLocalStorage(); 
            }
        });
    });

    barraPesquisa.addEventListener('input', (evento) => {
        textoPesquisa = evento.target.value.toLowerCase().trim();
        aplicarFiltros();
    });

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            const botaoAtivo = document.querySelector('.button-filter-food button.active');
            if (botaoAtivo) botaoAtivo.classList.remove('active');
            botao.classList.add('active');

            categoriaAtual = botao.getAttribute('data-cat');
            aplicarFiltros();
        });
    });

    atualizarTotais();
});