
//  NE MARCHE PAS -> rien ne s'affiche

var goodGenre = []; // Liste globale pour stocker les meilleurs films.
minScore = 7

function fetchMoviesWithGenre(genre, url) {
    // Utilisez l'URL fournie ou l'URL de base si elle n'est pas fournie.
    url = url || 'http://localhost:8000/api/v1/genres/?name_contains=' + genre;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            var movies = responseData.results;

            // Ajoutez les films de cette page à la liste globale.
            goodGenre = goodGenre.concat(movies);

            if (responseData.next) {
                // Si la page suivante existe, effectuez une nouvelle requête.
                fetchMoviesWithGenre(genre, responseData.next);
            } else {
                // Toutes les pages ont été récupérées, filtrez les meilleurs films.
                filterBestMoviesinGenre(minScore);
            }
        } else {
            console.log('Erreur de requête : ' + xhr.status);
        }
    };
    xhr.send();
}

function filterBestMoviesinGenre(minScore) {
    // Filtrer les films ayant un score IMDb de plus de minScore.
    var filteredMovies = goodGenre.filter(function(movie) {
        return movie.imdb_score > minScore;
    });

    // Triez les films par score IMDb de manière décroissante.
    filteredMovies.sort(function(a, b) {
        return b.imdb_score - a.imdb_score;
    });


    // Mettez à jour la div "animation" avec les 7 films.
    if (filteredMovies.length > 1) {
        updateGenreDiv(filteredMovies.slice(0, 7));
    }
}

function updateGenreDiv(movies) {
    var carrouselContainer = document.getElementById("carrousel-container"); // Div pour les images.
    var htmlContent = '<ul>';
    for (var i = 0; i < movies.length; i++) {
        // Ajoutez l'image du film à carrousel-container.
        htmlContent += '<li><img src="' + movies[i].image_url + '" alt="' + movies[i].title + '"></li>';
    }
    htmlContent += '</ul>';
    carrouselContainer.innerHTML = htmlContent; // Mettez à jour le contenu de la div avec le nouveau contenu.
}


// Lancez la récupération des films avec un score minimum de 9.
fetchMoviesWithGenre('animation');
