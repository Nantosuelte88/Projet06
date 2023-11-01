var goodMoviesCountry = []; // Liste globale pour stocker les meilleurs films.

function fetchMoviesWithCountry(minYear, genre, country, url) {
    // Utilisez l'URL fournie ou l'URL de base si elle n'est pas fournie.
    url = url || 'http://localhost:8000/api/v1/titles/?min_year=' + minYear + '&genre_contains=' + genre + '&country_contains=' + country;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            var movies = responseData.results;

            // Ajoutez les films de cette page à la liste globale.
            goodMoviesCountry = goodMoviesCountry.concat(movies);

            if (responseData.next) {
                // Si la page suivante existe, effectuez une nouvelle requête.
                fetchMoviesWithCountry(minYear, genre, country, responseData.next);
            } else {
                // Toutes les pages ont été récupérées, filtrez les meilleurs films.
                filterBestMoviesWithCountry();
            }
        } else {
            console.log('Erreur de requête : ' + xhr.status);
        }
    };
    xhr.send();
}

function filterBestMoviesWithCountry() {
    // Triez les films par score IMDb de manière décroissante.
    goodMoviesCountry.sort(function(a, b) {
        return b.imdb_score - a.imdb_score;
    });

    // Mettez à jour la div "bestMovies" avec les 7 films.
    if (goodMoviesCountry.length > 1) {
        updateMoviesDiv(goodMoviesCountry.slice(0, 7));
    }
}

function updateMoviesDiv(movies) {
    var bestMoviesDivCountry = document.getElementById("country");
    var carrouselContainer = document.getElementById("country-container");
    var htmlContent = '<h2>Drama Coréens</h2><ul>';
    for (var i = 0; i < movies.length; i++) {
        // Ajoutez l'image du film à country-container.
        htmlContent += '<img src="' + movies[i].image_url + '" alt="' + movies[i].title + '">';
    }
    htmlContent += '</ul>';
    bestMoviesDivCountry.innerHTML = htmlContent; // Mettez à jour le contenu de la div avec le nouveau contenu.

    carrouselContainer.innerHTML = htmlContent;
}

// Lancez la récupération des films avec Nolan comme realisateur.
fetchMoviesWithCountry(2019, 'drama', 'korea');