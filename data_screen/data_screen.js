document.addEventListener("DOMContentLoaded", () => {
    const inputNome = document.querySelector('.card_nome_cliente input');
    const inputZap = document.querySelector('.card_zap_cliente input');
    const cardsEntrega = document.querySelectorAll('.opcao-entrega-container .card-opcao');
    const cardsPagamento = document.querySelectorAll('.opcao-pagamento-container .card-opcao');
    const containerTroco = document.querySelector('.troco');
    const cardTroco = document.querySelector('.card_troco_cliente');
    const inputTroco = document.querySelector('.card_troco_cliente input');
    const containerPix = document.querySelector('.pix-qrcode-container');
    const pixQrcodeDiv = document.getElementById('pix-qrcode');
    const pixCopiaCola = document.getElementById('pix-copia-cola');

    const CHAVE_PIX = '10034348514';
    const NOME_RECEBEDOR = 'MATHEUS RIAN LEITE DE SO';
    const CIDADE_RECEBEDOR = 'PAULO AFONSO';

    let tipoEntrega = 'Retirar';
    let formaPagamento = 'Dinheiro';

    function pegarTotalCarrinho() {
        const salvo = localStorage.getItem('carrinhoSalgaZap');
        if (!salvo) return 0;
        const produtos = JSON.parse(salvo);
        let total = 0;
        for (let nome in produtos) {
            total += produtos[nome].qtd * produtos[nome].preco;
        }
        return total;
    }

    function crc16(str) {
        let crc = 0xFFFF;
        for (let i = 0; i < str.length; i++) {
            crc ^= str.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    function campo(id, valor) {
        const tamanho = valor.length.toString().padStart(2, '0');
        return id + tamanho + valor;
    }

    function gerarPayloadPix(chave, nome, cidade, valor) {
        const chaveNormalizada = chave.replace(/[^\d]/g, '');
        const gui = campo('00', 'br.gov.bcb.pix');
        const chaveCampo = campo('01', chaveNormalizada);
        const merchantAccount = campo('26', gui + chaveCampo);
        const mcc = campo('52', '0000');
        const moeda = campo('53', '986');
        const valorFormatado = valor.toFixed(2);
        const valorCampo = campo('54', valorFormatado);
        const pais = campo('58', 'BR');
        const nomeCampo = campo('59', nome);
        const cidadeCampo = campo('60', cidade);
        const txid = campo('05', '***');
        const dadosAdicionais = campo('62', txid);

        let payload = '000201' + merchantAccount + mcc + moeda + valorCampo + pais + nomeCampo + cidadeCampo + dadosAdicionais + '6304';
        const checksum = crc16(payload);
        return payload + checksum;
    }

    function gerarQrCodePix() {
        const total = pegarTotalCarrinho();
        if (total <= 0) {
            containerPix.style.display = 'none';
            return;
        }

        const payload = gerarPayloadPix(CHAVE_PIX, NOME_RECEBEDOR, CIDADE_RECEBEDOR, total);

        pixQrcodeDiv.innerHTML = '';
        new QRCode(pixQrcodeDiv, {
            text: payload,
            width: 200,
            height: 200
        });

        pixCopiaCola.innerText = payload;
        containerPix.style.display = 'block';
    }

    function atualizarVisibilidade() {
        if (formaPagamento === 'Dinheiro') {
            containerTroco.style.display = 'block';
            cardTroco.style.display = 'block';
            containerPix.style.display = 'none';
        } else if (formaPagamento === 'Pix') {
            containerTroco.style.display = 'none';
            cardTroco.style.display = 'none';
            gerarQrCodePix();
        } else {
            containerTroco.style.display = 'none';
            cardTroco.style.display = 'none';
            containerPix.style.display = 'none';
        }
    }

    cardsEntrega.forEach(card => {
        card.addEventListener('click', () => {
            cardsEntrega.forEach(c => c.classList.remove('ativo'));
            card.classList.add('ativo');
            tipoEntrega = card.querySelector('.opcao-texto').innerText.trim();
        });
    });

    cardsPagamento.forEach(card => {
        card.addEventListener('click', () => {
            cardsPagamento.forEach(c => c.classList.remove('ativo'));
            card.classList.add('ativo');
            formaPagamento = card.querySelector('span').innerText.trim();
            atualizarVisibilidade();
        });
    });

    function salvarDadosPedido() {
        const dadosAntigos = JSON.parse(localStorage.getItem('dadosPedidoSalgaZap') || '{}');
        const dados = {
            nome: inputNome.value.trim(),
            whatsapp: inputZap.value.trim(),
            tipoEntrega: tipoEntrega,
            formaPagamento: formaPagamento,
            troco: inputTroco.value.trim(),
            observacoes: dadosAntigos.observacoes || ''
        };
        localStorage.setItem('dadosPedidoSalgaZap', JSON.stringify(dados));
    }

    const botaoRevisar = document.querySelector('.revisar_pedido');
    if (botaoRevisar) {
        botaoRevisar.addEventListener('click', salvarDadosPedido);
    }

    atualizarVisibilidade();
});