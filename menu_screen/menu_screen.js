const botoes = document.querySelectorAll('.button-filter-food button');
const itens = document.querySelectorAll('.item');

botoes.forEach(botao => {
  botao.addEventListener('click', () => {

    botoes.forEach(b => b.classList.remove('active'));
    botao.classList.add('active');

    const categoria = botao.dataset.cat;

    itens.forEach(item => {
      if (categoria === 'todos' || item.dataset.cat === categoria) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

  });
});