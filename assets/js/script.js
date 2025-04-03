document.addEventListener('DOMContentLoaded', function () {
  // 1. Definição das variáveis
  const API_KEY = '9bbf7d734588f0a01ba0510c39e7e786';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  const carouselContent = document.getElementById('carousel-content');
  const searchBar = document.getElementById('search-bar');
  const backToTopButton = document.getElementById('back-to-top');

  // 2. Função para buscar filmes da API
  function fetchMovies(endpoint, callback, params = '') {
    fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR${params}`)
      .then((response) => response.json())
      .then((data) => callback(data.results))
      .catch((error) => console.error('Erro ao buscar filmes:', error));
  }

  // 3. Exibir filmes no carrossel
  function displayCarousel(movies) {
    if (carouselContent) {
      carouselContent.innerHTML =
        movies.length > 0
          ? movies
              .map(
                (movie, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${IMAGE_BASE_URL}${
                  movie.backdrop_path
                }" class="d-block w-100" alt="${movie.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${movie.title}</h5>
                </div>
            </div>
          `,
              )
              .join('')
          : '<p>Não há filmes para exibir no momento.</p>';
    }
  }

  // 4. Exibir filmes na lista
  function displayMovies(movies) {
    if (movieList) {
      movieList.innerHTML =
        movies.length > 0
          ? movies
              .map(
                (movie) => `
            <div class="col-md-4 mb-4">
                <div class="card" onclick="showMovieDetails(${movie.id})">
                    <img src="${IMAGE_BASE_URL}${
                  movie.poster_path
                }" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">${movie.overview.substring(
                          0,
                          100,
                        )}...</p>
                    </div>
                </div>
            </div>
          `,
              )
              .join('')
          : '<p>Nenhum filme encontrado.</p>';
    }
  }

  // 5. Mostrar detalhes do filme e redirecionar
  function showMovieDetails(movieId) {
    localStorage.setItem('selectedMovie', movieId);
    window.location.href = 'detalhes.html';
  }

  // 6. Implementar funcionalidade de pesquisa
  if (searchBar) {
    let searchTimeout;
    searchBar.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
          fetchMovies(
            '/search/movie',
            displayMovies,
            `&query=${encodeURIComponent(searchTerm)}`,
          );
        }
      }, 500);
    });
  }

  // 7. Carregar filmes populares e filmes em exibição
  fetchMovies('/movie/popular', displayCarousel);
  fetchMovies('/movie/now_playing', displayMovies);

  // 8. Botão de voltar ao topo
  window.addEventListener('scroll', function () {
    backToTopButton.style.display = window.scrollY > 200 ? 'block' : 'none';
  });

  backToTopButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
