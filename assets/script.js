document.addEventListener("DOMContentLoaded", function () {
    // 1. Definindo as variáveis de configuração e elementos do DOM
    const API_KEY = "9bbf7d734588f0a01ba0510c39e7e786";
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    const carouselContent = document.getElementById("carousel-content");
    const movieList = document.getElementById("movie-list");
    const searchBar = document.getElementById("search-bar");

    // 2. Função para buscar filmes da API
    function fetchMovies(endpoint, callback) {
        fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`)
            .then(response => response.json())
            .then(data => callback(data.results))
            .catch(error => console.error("Erro ao buscar filmes:", error));
    }
});