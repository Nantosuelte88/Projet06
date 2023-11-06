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
        htmlContent += '<div class="slide"><img id="movieImage" src="' + movies[i].image_url + '" data-movie-url=' + movies[i].url + ' alt="' + movies[i].title + '"></div>';
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
        var btn = '<button id="theMovie" class="default modal-btn modal-trigger">Play</button></div>';
        var imageBestMovie = '<img src="' + bestMovie.image_url + ' alt="' + bestMovie.title + '"></img>';

        htmlContent = h1 + btn + imageBestMovie;
        bestMovieDiv.innerHTML = htmlContent;

        getMovieInfo(bestMovie.url);

        // Creation des 7 films suivants dans la categorie "Meilleurs films"
        displayMoviePoster(allBestMovies.slice(1, 8), 'bestMovies')
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs films d'animation -> à verifier dans git API si il vaut mieux coupé par dat'e ou juste notes
async function getMoviesByGenre() {
    try {
        const moviesByGenre = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?min_year=2020&genre=animation&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByGenre, 'genre');
    } catch (error) {
        throw error;
    }
}


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


async function getModal() {
    try {

        const modalContainer = document.querySelector(".modal-container");
        const modalTriggers = document.querySelectorAll(".modal-trigger");
        const closeModalButton = document.querySelector(".close-modal");
        
        modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))
        closeModalButton.addEventListener("click", toggleModal);
    
        function toggleModal(){
            modalContainer.classList.toggle("active")
        };
    } catch (error) {
        throw error;
    }

}

async function getMovieInfo(url) {
    console.log(url)
    var infoMovieDiv = document.getElementById("infoMovie");
    var htmlContent = '';
    console.log('URL ? :', url)

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var responsaData = JSON.parse(xhr.responseText);
            var infosMovie = responsaData;

            if (infosMovie) {

                console.log('resultat?', infosMovie);

                if (infosMovie.results = "null") {
                    infosMovie.results = "Information non fournie";
                }

                var h1 = '<div class="infos"><h1>' + infosMovie.title + '</h1>';
                var imgMovie = '<div class="imageInfo"><img src="' + infosMovie.image_url + ' alt="' + infosMovie.title + '"></img></div>';
                var genre = '<p>Genre: ' + infosMovie.genres + '</p>';
                var date = '<p>Date: ' + infosMovie.date_published + '</p>';
                var rated = '<p>Note: ' + infosMovie.rated + '</p>'; // FZIRE IF POUR METTRE "tous publics"
                var scoreImdb = '<p>Score imdb: ' + infosMovie.imdb_score + '</p>';
                var director = '<p>Réalisateur.s: ' + infosMovie.director + '</p>';
                var actors = '<ul>Acteurs: ';
                for (var i = 0; i < infosMovie.actors.length; i++) {
                    actors += '<li>' +infosMovie.actors[i] + '</li>';
                };
                var duration = '</ul><p>Durée du film: ' + infosMovie.duration + ' minutes</p>';
                var country = '<p> Pays d\'origine: ' + infosMovie.countries + '</p>';
                var boxOffice = '<p>Note au box office : ' + infosMovie.worlwide_gross_income + '</p>';
                var description = '<p>Description : ' + infosMovie.description + '</p></div>';
    
                // console.log(h1,imgMovie, genre, date, rated, scoreImdb, director)
    
                htmlContent = h1 + genre + date + rated + scoreImdb + director + actors + duration + country + boxOffice + description + imgMovie;
                infoMovieDiv.innerHTML = htmlContent;

            } else {
                console.log('Aucune information trouvée pour ce film.');
            }


        } else {
            reject('Erreur de requête : ' + xhr.status);
        }
    };
    xhr.send();
}

async function getMovieForInfos() {
    var movieImages = document.querySelectorAll('#movieImage');
  
    movieImages.forEach(function (movieImage) {
      movieImage.addEventListener('click', function() {
        var movieURL = movieImage.getAttribute('data-movie-url');
        console.log('url bon film?', movieURL);
        getMovieInfo(movieURL)
      });
    });
  }


async function main() {
    try {
        const bestMovies = await getBestMovies();
        // console.log('Meilleurs films:', bestMovies);

        const moviesByGenre = await getMoviesByGenre();
        // // console.log('Films d\'animation', moviesByGenre);

        // const moviesByDirector = await getMoviesByDirector();
        // // console.log('Films de Nolan:', moviesByDirector);

        // const moviesByCountry = await getMoviesByCountry();
        // // console.log('Les meilleurs dramas coréens', moviesByCountry)

        const carousel = await getCarousel();
        await getModal();
        await getMovieForInfos();
    } catch (error) {
        console.error(error);
    }
}

main()