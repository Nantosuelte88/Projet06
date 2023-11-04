function fetchMovies(nbrMovies, url, listMovies) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var responsaData = JSON.parse(xhr.responseText);
                var movies = responsaData.results;

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

function displayMoviePoster(movies, id) {
    var moviesDiv = document.getElementById(id);
    var htmlContent = '';
    for (var i = 0; i < movies.length; i++) {
        htmlContent += '<div class="slide"><img src="' + movies[i].image_url + '" alt="' + movies[i].title + '"></div>';
    }
    moviesDiv.innerHTML = htmlContent;

}

// Les 8 meilleurs films [LE meilleur + les 7 suivants] -> faire fonction pour prendre le meilleur d'entre eux
async function getBestMovies() {
    try {
        const allBestMovies = await fetchMovies(8, 'http://localhost:8000/api/v1/titles/?imdb_score_min=9.3&sort_by=-imdb_score', []);
        
        // Creation du h1 , du bouton et de l'image du meilleur film
        var bestMovie = allBestMovies[0] 
        var bestMovieDiv = document.getElementById("bestMovie");
        var h1 = '<div><h1>' + bestMovie.title + '</h1>';
        var btn = '<button class="default">Play</button></div>';
        var imageBestMovie = '<img src="' + bestMovie.image_url + ' alt="' + bestMovie.title + '"></img>';

        htmlContent = h1 + btn + imageBestMovie;
        bestMovieDiv.innerHTML = htmlContent;

        // Creation des 7 films suivants dans la categorie "Meilleurs films"
        displayMoviePoster(allBestMovies.slice(1, 8), 'bestMovies')
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs films d'animation -> à verifier dans git API si il vaut mieux coupé par dat'e ou juste notes
// async function getMoviesByGenre() {
//     try {
//         const moviesByGenre = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?min_year=2020&genre=animation&sort_by=-imdb_score', []);
//         displayMoviePoster(moviesByGenre, 'genre');
//     } catch (error) {
//         throw error;
//     }
// }


// // Les 7 meilleurs films de Nolan
// async function getMoviesByDirector() {
//     try {
//         const moviesByDirector = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?director_contains=Nolan&imdb_score_min=7&sort_by=-imdb_score', []);
//         displayMoviePoster(moviesByDirector, 'director');
//     } catch (error) {
//         throw error;
//     }
// }


// // Les 7 meilleurs Dramas Coréens
// async function getMoviesByCountry() {
//     try {
//         const moviesByCountry = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?min_year=2019&genre_contains=drama&country_contains=korea&sort_by=-imdb_score', []);
//         displayMoviePoster(moviesByCountry, 'country');
//     } catch (error) {
//         throw error;
//     }
// }

let currentSlide = 0;        
const numVisibleSlides = 4;
let slides;

function showSlide(index) {
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');

    slidesContainer.style.transform = `translateX(-${25 * index}%)`;

    // Ajoutez la classe "hidden" aux images invisibles
    for (let i = 0; i < slides.length; i++) {
        if (i < index || i >= index + numVisibleSlides) {
            slides[i].classList.add('hidden');
        
        } else {
            // Retirez la classe "hidden" des images visibles
            slides[i].classList.remove('hidden');
        }
    }
}

async function getCarousel() {
    try {
        const carousel = document.querySelector('.carousel');

        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');

        slides = document.querySelectorAll('.slide');

        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    } catch (error) {
        throw error;
    }
}



async function main() {
    try {
        const bestMovies = await getBestMovies();
        // console.log('Meilleurs films:', bestMovies);

        // const moviesByGenre = await getMoviesByGenre();
        // // console.log('Films d\'animation', moviesByGenre);

        // const moviesByDirector = await getMoviesByDirector();
        // // console.log('Films de Nolan:', moviesByDirector);

        // const moviesByCountry = await getMoviesByCountry();
        // // console.log('Les meilleurs dramas coréens', moviesByCountry)

        const carousel = await getCarousel();
    } catch (error) {
        console.error(error);
    }
}

main()
