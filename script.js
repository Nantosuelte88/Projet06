function fetchMovies(nbrMovies, url, listMovies) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var responsaData = JSON.parse(xhr.responseText);
                var movies = responsaData.results;

                console.log('Films dans fonction API', listMovies);

                listMovies.push(...movies);

                if (responsaData.next) {
                    fetchMovies(nbrMovies, responsaData.next, listMovies)
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve(listMovies.slice(0, nbrMovies));
                }
            } else {
                reject('Erreur de requête : ' + xhr.status);
            }
        };
        xhr.send();
    });
}

// Les 8 meilleurs films [LE meilleur + les 7 suivants] -> faire fonction pour prendre le meilleur d'entre eux
async function getBestMovies() {
    try {
        const bestMovies = await fetchMovies(8, 'http://localhost:8000/api/v1/titles/?imdb_score_min=9.3&sort_by=-imdb_score', []);
        return bestMovies;
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs films d'animation -> à verifier dans git API si il vaut mieux coupé par dat'e ou juste notes
async function getMoviesByGenre() {
    try {
        const moviesByGenre = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?min_year=2020&genre=animation&sort_by=-imdb_score', []);
        return moviesByGenre;
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs films de Nolan
async function getMoviesByDirector() {
    try {
        const moviesByDirector = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?director_contains=Nolan&imdb_score_min=7&sort_by=-imdb_score', []);
        return moviesByDirector;
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs Dramas Coréens
async function getMoviesByCountry() {
    try {
        const moviesByCountry = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?min_year=2019&genre_contains=drama&country_contains=korea&sort_by=-imdb_score', []);
        return moviesByCountry;
    } catch (error) {
        throw error;
    }
}

async function main() {
    try {
        const bestMovies = await getBestMovies();
        console.log('Meilleurs films:', bestMovies);

        const moviesByGenre = await getMoviesByGenre();
        console.log('Films d\'animation', moviesByGenre);

        const moviesByDirector = await getMoviesByDirector();
        console.log('Films de Nolan:', moviesByDirector);

        const moviesByCountry = await getMoviesByCountry();
        console.log('Les meilleurs dramas coréens', moviesByCountry)
    } catch (error) {
        console.error(error);
    }
}

main()
