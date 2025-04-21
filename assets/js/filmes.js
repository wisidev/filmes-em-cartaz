document.addEventListener('DOMContentLoaded', async () => {
  const API_KEY = '9bbf7d734588f0a01ba0510c39e7e786';
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR`,
  );
  const data = await response.json();
  const container = document.getElementById('lista-sessoes');

  const horariosFicticios = ['14:00', '16:30', '19:00', '21:30'];

  data.results.forEach((filme) => {
    const card = document.createElement('div');
    card.classList.add('col-md-6');

    const dataHoje = new Date().toLocaleDateString('pt-BR');

    card.innerHTML = `
      <div class="card h-100">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w200${
              filme.poster_path
            }" class="img-fluid rounded-start" alt="${filme.title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${filme.title}</h5>
              <p class="card-text"><strong>Data:</strong> ${dataHoje}</p>
              <p class="card-text"><strong>Horários:</strong> ${horariosFicticios.join(
                ' | ',
              )}</p>
              <button class="btn btn-outline-primary mt-2 btn-detalhes" 
                      data-filme='${JSON.stringify({
                        titulo: filme.title,
                        descricao: filme.overview,
                        duracao: 'Não informado',
                        classificacao: filme.adult ? '18 anos' : 'Livre',
                      })}'>
                Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Evento para abrir o modal ao clicar no botão "Detalhes"
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-detalhes')) {
      const filme = JSON.parse(e.target.getAttribute('data-filme'));

      document.getElementById('modalDetalhesLabel').innerText = filme.titulo;
      document.getElementById('modalDescricao').innerText =
        filme.descricao || 'Sem descrição.';
      document.getElementById('modalDuracao').innerText = filme.duracao;
      document.getElementById('modalClassificacao').innerText =
        filme.classificacao;

      const modal = new bootstrap.Modal(
        document.getElementById('modalDetalhes'),
      );
      modal.show();
    }
  });
});
