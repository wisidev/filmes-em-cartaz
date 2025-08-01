document.addEventListener('DOMContentLoaded', async () => {
  const API_KEY = '9bbf7d734588f0a01ba0510c39e7e786';
  const container = document.getElementById('lista-sessoes');
  const horariosFicticios = ['14:00', '16:30', '19:00', '21:30'];

  // Buscar lista de gêneros
  const responseGenres = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`,
  );
  const dataGenres = await responseGenres.json();
  const genresMap = {};
  dataGenres.genres.forEach((genre) => {
    genresMap[genre.id] = genre.name;
  });

  // Buscar os filmes em cartaz
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR`,
  );
  const data = await response.json();

  // Montar os cards
  data.results.forEach((filme) => {
    const card = document.createElement('div');
    card.classList.add('col-md-6');
    const dataHoje = new Date().toLocaleDateString('pt-BR');

    // Mapear gêneros
    const generos = filme.genre_ids.map((id) => genresMap[id]).join(', ');

    card.innerHTML = `
      <div class="card h-100 bg-cinza text-white">
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
                      data-filme-id="${filme.id}"
                      data-titulo="${filme.title}"
                      data-descricao="${filme.overview || 'Sem descrição.'}"
                      data-genero="${generos}">
                Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Evento de clique no botão "Detalhes"
  document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('btn-detalhes')) {
      const filmeId = e.target.getAttribute('data-filme-id');
      const titulo = e.target.getAttribute('data-titulo');
      const descricao = e.target.getAttribute('data-descricao');
      const genero = e.target.getAttribute('data-genero');

      // Buscar detalhes do filme
      const responseDetalhes = await fetch(
        `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${API_KEY}&language=pt-BR`,
      );
      const dados = await responseDetalhes.json();

      const duracao = dados.runtime ? `${dados.runtime} min` : 'Não informado';

      // Buscar classificação indicativa do Brasil
      const responseClassificacao = await fetch(
        `https://api.themoviedb.org/3/movie/${filmeId}/release_dates?api_key=${API_KEY}`,
      );
      const dataClassificacao = await responseClassificacao.json();

      let classificacao = 'Não informada';
      const brData = dataClassificacao.results.find(
        (entry) => entry.iso_3166_1 === 'BR',
      );
      if (brData && brData.release_dates.length > 0) {
        classificacao =
          brData.release_dates[0].certification || 'Não informada';
      }

      // Preencher o modal
      document.getElementById('modalDetalhesLabel').innerText = titulo;
      document.getElementById('modalDescricao').innerText = descricao;
      document.getElementById('modalDuracao').innerText = duracao;
      document.getElementById('modalClassificacao').innerText = classificacao;
      document.getElementById('modalGenero').innerText = genero;

      const modal = new bootstrap.Modal(
        document.getElementById('modalDetalhes'),
      );
      modal.show();
    }
  });

  // Filtro de busca
  const searchInput = document.getElementById('search-bar');

  searchInput.addEventListener('input', () => {
    const termo = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('#lista-sessoes .col-md-6');

    cards.forEach((card) => {
      const titulo = card.querySelector('.card-title').innerText.toLowerCase();
      const corresponde = titulo.includes(termo);

      card.style.display = corresponde ? 'block' : 'none';
    });
  });
});
