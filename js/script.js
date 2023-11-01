function createCarouselImages(topMovies) {
    var carrouselContainer = document.getElementById('carrousel-container');
    var carrouselImages = carrouselContainer.querySelectorAll('img');
    var maxImages = 7;

    topMovies.slice(0, maxImages).forEach(function (film, index) {
        if (index < maxImages && carrouselImages[index]) {
            var img = carrouselImages[index]; // Récupérez l'image existante dans le carrousel
            img.src = film.image_url;
            img.setAttribute('data-movie-index', index);
        } else {
            return; // Sortir de la boucle forEach une fois que 7 images ont été ajoutées
        }
    });
}


function fetchAllMovies(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            var films = responseData.results;

            // Choix du meilleur film
            var topMovies = bestMovies(films);

            if (topMovies.length > 0) {
                createCarouselImages(topMovies);
            }

            if (responseData.next) {
                fetchAllMovies(responseData.next);
            }
        } else {
            console.log('Erreur de requête : ' + xhr.status);
        }
    };
    xhr.send();
}

function bestMovies(films) {
    return films
        .filter(function(film) {
            return film.imdb_score >= 9.4;
        })
        .sort(function(a, b) {
            return b.imdb_score - a.imdb_score;
        })
        .slice(0, 7); // Sélectionnez uniquement les 7 meilleurs films
}

fetchAllMovies('http://localhost:8000/api/v1/titles');
