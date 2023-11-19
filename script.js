async function fetchMovies(nbrMovies, url, listMovies) {
    console.log('FONCTION fetchMovies')

    const response = await fetch(url);
    const movies = await response.json();

    if (movies.results) {
        listMovies.push(...movies.results);

        if (listMovies.length < nbrMovies && movies.next) {
            return fetchMovies(nbrMovies, movies.next, listMovies);

        } else {
            return (listMovies.slice(0, nbrMovies));
        }
    }
}

async function displayMoviePoster(movies, id, carouselId) {
    console.log('FONCTION displayMoviePoster');

    var moviesDiv = document.getElementById(id);
    var htmlContent = '';

    for (var i = 0; i < movies.length; i++) {
        var imgMovie = await loadImagesSequentially(movies[i].image_url);
        htmlContent += '<div class="slide slide' + id + '"> <img src="' + imgMovie + '" data-movie-id=' + movies[i].id + ' class="modal-trigger movieImage" alt="' + movies[i].title + '"></img></div>';
    }

    moviesDiv.innerHTML = htmlContent;
    initCarousel(carouselId, id);
}

function loadImagesSequentially(imgUrl) {
    console.log('FONCTION loadImagesSequentially');

    return new Promise((resolve, reject) => {
        var image = new Image();
        image.src = imgUrl;

        image.onload = function () {
            resolve(imgUrl);
        };

        image.onerror = function () {
            var newImgUrl = "data/image_non_valide.jpg";
            resolve(newImgUrl);
        };
    });
}


// Les 8 meilleurs films [LE meilleur + les 7 suivants] -> faire fonction pour prendre le meilleur d'entre eux
async function getBestMovies() {
    console.log('FONCTION getBestMovies');

    const allBestMovies = await fetchMovies(8, 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score', []);

    if (allBestMovies && allBestMovies.length > 0) {
        var bestMovie = allBestMovies[0];
        var bestMovieDiv = document.getElementById("bestMovie");
        var h1 = '<div><h1>' + bestMovie.title + '</h1>';
        var btn = '<button id="theMovie" class="default modal-btn modal-trigger">Play</button></div>';
        var imgBestMovieURl = await loadImagesSequentially(bestMovie.image_url);
        var imgBestMovie = '<img src="' + imgBestMovieURl ; 
        var imageBestMovie = imgBestMovie + '" data-movie-id=' + bestMovie.id
            + ' alt="' + bestMovie.title + '"></img>';


        htmlContent = h1 + btn + imageBestMovie;
        bestMovieDiv.innerHTML = htmlContent;

        var btnModal = document.getElementById("theMovie");
        btnModal.addEventListener("click", function () {
            console.log("click btn meilleur film");
            getMovieInfo(bestMovie.id);
            getModal();
        });

        // Creation des 7 films suivants dans la categorie "Meilleurs films"
        displayMoviePoster(allBestMovies.slice(1, 8), 'bestMovies', 'carouselBestMovies');
    }
}


// Les 7 meilleurs films d'animation
async function getMoviesByGenre() {
    console.log('FONCTION getMoviesByGenre');
    try {
        const moviesByGenre = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?genre=animation&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByGenre, 'genre', 'carouselGenre');
    } catch (error) {
        throw error;
    }
}


// // Les 7 meilleurs films de Nolan
async function getMoviesByDirector() {
    console.log('FONCTION getMoviesByDirector');

    try {
        const moviesByDirector = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?director_contains=Nolan&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByDirector, 'director', 'carouselDirector');
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs Dramas Coréens
async function getMoviesByCountry() {
    console.log('FONCTION getMoviesByCountry');

    try {
        const moviesByCountry = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?genre_contains=drama&country_contains=korea&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByCountry, 'country', 'carouselCountry');
    } catch (error) {
        throw error;
    }
}

// Le Carrousel
function initCarousel(carouselID, categorieID) {
    console.log('FONCTION initCarousel');
    var slidesIDs = '.slide' + categorieID;
    let currentSlide = 0;
    let numVisibleSlides;

    function showSlide(index) {

        const slidesContainer = document.getElementById(categorieID);
        const slides = document.querySelectorAll(slidesIDs);

        //  A REVOIIIIIIIIR !!!! 
        // slidesContainer.classList.remove('translate-0', 'translate-25', 'translate-50');
        // const translationClass = `translate-${25 * index}`;
        // slidesContainer.classList.add(translationClass);

        slidesContainer.style.transform = `translateX(-${25 * index}%)`;
        const actualNumVisibleSlides = Math.min(numVisibleSlides, slides.length);

        // Ajoutez la classe "hidden" aux images invisibles
        for (let i = 0; i < slides.length; i++) {
            if (i < index || i >= index + actualNumVisibleSlides) {
                slides[i].classList.add('hidden');
            } else {
                // Retirez la classe "hidden" des images visibles
                slides[i].classList.remove('hidden');
            }
        }
    }
    async function getCarousel(categorieID, slidesIDs) {

        try {
            const carousel = document.querySelector(carouselID);
            slides = document.querySelectorAll(slidesIDs);
            numVisibleSlides = Math.min(4, slides.length);

            const arrowLeft = document.getElementById('g-' + categorieID);
            const arrowRight = document.getElementById('d-' + categorieID);

            arrowLeft.addEventListener('click', () => {
               
                currentSlide = (currentSlide - 1 + (slides.length - numVisibleSlides + 1)) % (slides.length - numVisibleSlides + 1);
                    showSlide(currentSlide);
            });

            arrowRight.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % (slides.length - numVisibleSlides + 1);
                    showSlide(currentSlide);
            });

        } catch (error) {
            throw error;
        }
    }
    getCarousel(categorieID, slidesIDs);
}


// La fenêtre modale

async function getModal(callback) {
    try {
        const modalContainer = document.querySelector(".modal-container");
        modalContainer.classList.toggle("active");

        const closeModalButton = document.querySelector(".close-modal");
        const modalOverlay = document.querySelector(".overlay.modal-trigger");

        // Ajouter un écouteur d'événements pour le bouton de fermeture
        closeModalButton.addEventListener("click", () => {
            modalContainer.classList.remove("active");
            // Appeler le callback si fourni
            if (typeof callback === 'function') {
                callback();
            }
        });
//from modalOverlay to modalContainer = changer pour gerer le clic out
        // Ajouter un écouteur d'événements pour l'overlay
        modalContainer.addEventListener("click", () => {
            modalContainer.classList.remove("active");
            // Appeler le callback si fourni
            if (typeof callback === 'function') {
                callback();
            }
        });

    } catch (error) {
        throw error;
    }
}


async function waitForElements() {
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const movieImages = document.querySelectorAll('.movieImage');
            if (movieImages.length > 0) {
                clearInterval(intervalId);
                resolve(movieImages);
            }
        }, 100);
    });
}

async function getMovieForInfos() {
    try {
        const movieImages = await waitForElements();
        movieImages.forEach(movieImage => {
            movieImage.addEventListener('click', async function () {
                const movieID = movieImage.getAttribute('data-movie-id');

                await getMovieInfo(movieID);
                await getModal();
            });
        });

    } catch (error) {
        throw error;
    }
}

async function getMovieInfo(id) {
    console.log('FONCTION getMovieInfo');
    try {
        var url = 'http://localhost:8000/api/v1/titles/' + id;
        var infoMovieDiv = document.getElementById("infoMovie");
        var htmlContent = '';

        const response = await fetch(url);
        const infosMovie = await response.json();

        if (infosMovie) {
            var h2 = '<div class="infos"><h2>' + infosMovie.title + '</h2>';
            var imgMovieURl = await loadImagesSequentially(infosMovie.image_url);
            var imgMovie = '<div class="imageInfo"><img src="' + imgMovieURl + '" alt="' + infosMovie.title + '"></img></div>';
            var genre = '<div class="boxes"><div class="firstBox"><div class="inline"><h3>Genre:</h3><p> ' + infosMovie.genres + '</p></div>';
            var date = '<div class="inline"><h3>Date:</h3><p>' + infosMovie.date_published + '</p></div>';
            var rated = '<div class="inline"><h3>Note:</h3><p>' + infosMovie.rated + '</p></div>';
            var scoreImdb = '<div class="inline"><h3>Score imdb:</h3><p>' + infosMovie.imdb_score + '</p></div>';
            var director = '<div class="inline"><h3>Réalisation:</h3><p>' + infosMovie.director + '</p></div></div>';
            var actors = '<div class="secondBox"><div class="inline"><h3>Acteurs:</h3><ul>' + infosMovie.actors.map(actor => '<li>' + actor + '</li>').join('') + '</ul></div>';
            var duration = '<div class="inline"><h3>Durée du film:</h3><p>' + infosMovie.duration + ' minutes</p></div>';
            var country = '<div class="inline"><h3>Pays d\'origine:</h3><p>' + infosMovie.countries + '</p></div>';
            var boxOffice = '<div class="inline"><h3>Note au box office:</h3><p>' + infosMovie.worlwide_gross_income + '</p></div></div></div>';
            var description = '<div class="inline description"><h3>Description:</h3><p class="description">' + infosMovie.description + '</p></div></div>';

            htmlContent = h2 + genre + date + rated + scoreImdb + director + actors + duration + country + boxOffice + description + imgMovie;
            infoMovieDiv.innerHTML = htmlContent;

        } else {
            console.log('Aucune information trouvée pour ce film.');
        }
    } catch (error) {
        throw error;
    }
}


async function main() {
    console.log('FONCTION main');
    
    try {
        // Appeler les autres fonctions avec les films chargés
        await getBestMovies();
        await getMoviesByGenre();
        await getMoviesByDirector();
        await getMoviesByCountry();

        await getMovieForInfos();
    } catch (error) {
        console.error(error);
    }
}

main();
