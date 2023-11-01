var bestMovies = []; // Liste globale pour stocker les meilleurs films.

function fetchMoviesWithIMDBScore(minScore, url) {
    // Utilisez l'URL fournie ou l'URL de base si elle n'est pas fournie.
    url = url || 'http://localhost:8000/api/v1/titles/?imdb_score_min=' + minScore;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            var movies = responseData.results;

            // Ajoutez les films de cette page à la liste globale.
            bestMovies = bestMovies.concat(movies);

            if (responseData.next) {
                // Si la page suivante existe, effectuez une nouvelle requête.
                fetchMoviesWithIMDBScore(minScore, responseData.next);
            } else {
                // Toutes les pages ont été récupérées, filtrez les meilleurs films.
                filterBestMovies(minScore);
            }
        } else {
            console.log('Erreur de requête : ' + xhr.status);
        }
    };
    xhr.send();
}

function filterBestMovies(minScore) {
    // Filtrer les films ayant un score IMDb de plus de minScore.
    var filteredMovies = bestMovies.filter(function(movie) {
        return movie.imdb_score > minScore;
    });

    // Triez les films par score IMDb de manière décroissante.
    filteredMovies.sort(function(a, b) {
        return b.imdb_score - a.imdb_score;
    });

    // Mettez à jour la div "bestMovie" avec le premier film.
    if (filteredMovies.length > 0) {
        updateBestMovieDiv(filteredMovies[0]);
    }

    // Mettez à jour la div "bestMovies" avec les 7 films suivants.
    if (filteredMovies.length > 1) {
        updateBestMoviesDiv(filteredMovies.slice(1, 8));
    }
}

function updateBestMovieDiv(movie) {
    var bestMovieDiv = document.getElementById("bestMovie");
    var h1 = '<h1>' + movie.title + '</h1>';
    var imgBestMovie = '<img src="' + movie.image_url + '" alt="' + h1 +'"></img>';

    htmlContent = h1 + imgBestMovie ;
    bestMovieDiv.innerHTML = htmlContent; // Mettez à jour le contenu de la div avec le nouveau contenu.
}

function updateBestMoviesDiv(movies) {
    var bestMoviesDiv = document.getElementById("bestMovies");
    var carrouselContainer = document.getElementById("bestMovies-container"); // Div pour les images.
    var htmlContent = '<h2>Films les mieux notés</h2><ul>';
    for (var i = 0; i < movies.length; i++) {
        // Ajoutez l'image du film à carrousel-container.
        htmlContent += '<img src="' + movies[i].image_url + '" alt="' + movies[i].title + '">';
    }
    htmlContent += '</ul>';
    bestMoviesDiv.innerHTML = htmlContent; // Mettez à jour le contenu de la div avec le nouveau contenu.

    // Assurez-vous que les images sont affichées dans carrousel-container.
    carrouselContainer.innerHTML = htmlContent;
}

// Lancez la récupération des films avec un score minimum de 9.
fetchMoviesWithIMDBScore(9);