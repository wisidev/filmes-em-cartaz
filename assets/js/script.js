document.addEventListener('DOMContentLoaded', function () {
  // 1. Definindo as variáveis de configuração e elementos do DOM
  const API_KEY = '9bbf7d734588f0a01ba0510c39e7e786';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  const carouselContent = document.getElementById('carousel-content');
  const movieList = document.getElementById('movie-list');
  const searchBar = document.getElementById('search-bar');

  // 2. Função para buscar filmes da API
  function fetchMovies(endpoint, callback) {
    fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`)
      .then((response) => response.json())
      .then((data) => callback(data.results))
      .catch((error) => console.error('Erro ao buscar filmes:', error));
  }

  // 3. Função para exibir filmes no carrossel
  function displayCarousel(movies) {
    if (carouselContent) {
      // Verifica se há filmes para exibir
      if (movies.length > 0) {
        carouselContent.innerHTML = movies
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
          .join('');
      } else {
        carouselContent.innerHTML = `<p>Não há filmes para exibir no momento.</p>`;
      }
    }
  }

  // 4. Função para exibir filmes na lista
  function displayMovies(movies) {
    if (movieList) {
      movieList.innerHTML = movies
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
        .join('');
    }
  }

  // 5. Função para mostrar detalhes do filme e redirecionar
  function showMovieDetails(movieId) {
    localStorage.setItem('selectedMovie', movieId);
    window.location.href = 'detalhes.html';
  }

  // 6. Implementar funcionalidade de pesquisa por filme
  if (searchBar) {
    let searchTimeout;
    searchBar.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        const searchTerm = searchBar.value.toLowerCase();
        fetchMovies('/search/movie', function (movies) {
          displayMovies(
            movies.filter((movie) =>
              movie.title.toLowerCase().includes(searchTerm),
            ),
          );
        });
      }, 500); // Adiciona debounce para evitar requisições excessivas
    });
  }

  // 7. Carregar filmes populares e filmes em exibição
  fetchMovies('/movie/popular', displayCarousel);
  fetchMovies('/movie/now_playing', displayMovies);
});

document.addEventListener('DOMContentLoaded', function () {
  const backToTopButton = document.getElementById('back-to-top');

  // Mostrar o botão quando o usuário rolar para baixo
  window.addEventListener('scroll', function () {
    if (window.scrollY > 200) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  // Ao clicar no botão, rolar para o topo
  backToTopButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
