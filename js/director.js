var goodMovies = []; // Liste globale pour stocker les meilleurs films.
var minScore = 7

function fetchMoviesWithDirector(director, url) {
    // Utilisez l'URL fournie ou l'URL de base si elle n'est pas fournie.
    url = url || 'http://localhost:8000/api/v1/titles/?director_contains=' + director;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            var movies = responseData.results;

            // Ajoutez les films de cette page à la liste globale.
            goodMovies = goodMovies.concat(movies);

            if (responseData.next) {
                // Si la page suivante existe, effectuez une nouvelle requête.
                fetchMoviesWithDirector(director, responseData.next);
            } else {
                // Toutes les pages ont été récupérées, filtrez les meilleurs films.
                filterBestMoviesWithDirector(minScore);
            }
        } else {
            console.log('Erreur de requête : ' + xhr.status);
        }
    };
    xhr.send();
}

function filterBestMoviesWithDirector(minScore) {
    // Triez les films par score IMDb de manière décroissante.
    goodMovies.sort(function(a, b) {
        return b.imdb_score - a.imdb_score;
    });

    // Mettez à jour la div "bestMovies" avec les 7 films.
    if (goodMovies.length > 1) {
        updateMoviesDiv(goodMovies.slice(0, 7));
    }
}

function updateMoviesDiv(movies) {
    var carrouselContainer = document.getElementById("director-container");
    var htmlContent = '<h2>Films de Christopher Nolan</h2><ul>';
    for (var i = 0; i < movies.length; i++) {
        // Ajoutez l'image du film à director-container.
        htmlContent += '<img src="' + movies[i].image_url + '" alt="' + movies[i].title + '">';
    }
    htmlContent += '</ul>';
    carrouselContainer.innerHTML = htmlContent; // Mettez à jour le contenu de la div avec le nouveau contenu.
}

// Lancez la récupération des films avec Nolan comme realisateur.
fetchMoviesWithDirector('nolan');