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
        console.log('image url ?', movies[i].image_url);
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
            console.log('Image Ok');
            resolve(imgUrl);
        };

        image.onerror = function () {
            console.log("L'image n'existe pas");
            var newImgUrl = "data/base_movie.jpg";
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
        // console.log('id de bestmovie???', bestMovie);
        var bestMovieDiv = document.getElementById("bestMovie");
        var h1 = '<div><h1>' + bestMovie.title + '</h1>';
        var btn = '<button id="theMovie" class="default modal-btn modal-trigger">Play</button></div>';
        var imgBestMovieURl = await loadImagesSequentially(bestMovie.image_url);
        var imgBestMovie = '<img src="' + imgBestMovieURl ; // FAIRE UN FONCTION QUI TEST LES IMAGES
        var imageBestMovie = imgBestMovie + '" data-movie-id=' + bestMovie.id
            + ' class="movieImage" alt="' + bestMovie.title + '"></img>';


        htmlContent = h1 + btn + imageBestMovie;
        bestMovieDiv.innerHTML = htmlContent;

        // var btnModal = document.querySelector(".modal-trigger");

        var btnModal = document.getElementById("theMovie");
        btnModal.addEventListener("click", function () {
            getMovieInfo(bestMovie.id);
        });

        // Creation des 7 films suivants dans la categorie "Meilleurs films"
        displayMoviePoster(allBestMovies.slice(1, 8), 'bestMovies', 'carouselBestMovies');
        // initCarousel('carouselBestMovies', 'bestMovies');
    }
}


// Les 7 meilleurs films d'animation
async function getMoviesByGenre() {
    console.log('FONCTION getMoviesByGenre');
    try {
        const moviesByGenre = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?genre=animation&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByGenre, 'genre', 'carouselGenre');
        // initCarousel('carouselGenre', 'genre');
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
        // initCarousel('carouselDirector', 'director');
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
        // initCarousel('carouselCountry', 'country');
    } catch (error) {
        throw error;
    }
}

// Fonction TEST
async function getMovies2020() {
    console.log('FONCTION getMovies2020');
    try {
        const movies2020 = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?year=2020&sort_by=-imdb_score', []);
        displayMoviePoster(movies2020, '2020', 'carousel2020');
        // initCarousel('carouselCountry', 'country');
    } catch (error) {
        throw error;
    }
}


// Le Carrousel
function initCarousel(carouselID, categorieID) {
    console.log('FONCTION initCarousel');
    var slidesIDs = '.slide' + categorieID;
    let currentSlide = 0;
    // let slides;
    const numVisibleSlides = 4;

    function showSlide(index) {
        console.log('FONCTION showSlide');

        const slidesContainer = document.getElementById(categorieID);
        const slides = document.querySelectorAll(slidesIDs);

        //  A REVOIIIIIIIIR !!!! 
        // slidesContainer.classList.remove('translate-0', 'translate-25', 'translate-50');
        // const translationClass = `translate-${25 * index}`;
        // slidesContainer.classList.add(translationClass);

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
    async function getCarousel(categorieID) {
        console.log('FONCTION getCarousel');

        try {
            const carousel = document.querySelector(carouselID);
            slides = document.querySelectorAll('.slide');

            const arrowLeft = document.getElementById('g-' + categorieID);
            const arrowRight = document.getElementById('d-' + categorieID);

            // function updateButtons() {
            //     console.log('Current slide au début = ', currentSlide);
            //     if (currentSlide === 0) {
            //     console.log('Current slide ===0 ? -> ', currentSlide);

            //         arrowLeft.classList.toggle("active");
            //     }

            //     if (currentSlide === slides.length - numVisibleSlides) {
            //         console.log('current slide === machin chelou : ', currentSlide, slides.length, numVisibleSlides)
            //         arrowRight.classList.toggle("active");
            //     }
            // }

            arrowLeft.addEventListener('click', () => {
                if (currentSlide > 0) {
                    console.log('Current slide = 0 mais dans arrowleft ', currentSlide);
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    showSlide(currentSlide);
                }
                // updateButtons();
            });

            arrowRight.addEventListener('click', () => {
                if (currentSlide < slides.length - numVisibleSlides) {
                    console.log('Current slide dans arrowright ', currentSlide, slides.length, numVisibleSlides);

                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                }
                // updateButtons();
            });

            // updateButtons();
        } catch (error) {
            throw error;
        }
    }
    getCarousel(categorieID);
    // getMovieForInfos();
    // getModal();
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

        // Ajouter un écouteur d'événements pour l'overlay
        modalOverlay.addEventListener("click", () => {
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
                console.log("CLICK sur image");
                const movieID = movieImage.getAttribute('data-movie-id');
                console.log('Quel Id ?', movieID);

                await getMovieInfo(movieID);
                await getModal(() => {
                    // Ajouter une logique ici pour exécuter après la fermeture de la modal
                    console.log('Modal fermée');
                });
            });
        });

        console.log('Écouteurs d\'événements ajoutés pour les images.');
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
            var h1 = '<div class="infos"><h1>' + infosMovie.title + '</h1>';
            var imgMovieURl = await loadImagesSequentially(infosMovie.image_url);
            var imgMovie = '<div class="imageInfo"><img src="' + imgMovieURl + '" alt="' + infosMovie.title + '"></img></div>';
            var genre = '<p>Genre: ' + infosMovie.genres + '</p>';
            var date = '<p>Date: ' + infosMovie.date_published + '</p>';
            var rated = '<p>Note: ' + infosMovie.rated + '</p>';
            var scoreImdb = '<p>Score imdb: ' + infosMovie.imdb_score + '</p>';
            var director = '<p>Réalisateur.s: ' + infosMovie.director + '</p>';
            var actors = '<ul>Acteurs: ' + infosMovie.actors.map(actor => '<li>' + actor + '</li>').join('') + '</ul>';
            var duration = '<p>Durée du film: ' + infosMovie.duration + ' minutes</p>';
            var country = '<p> Pays d\'origine: ' + infosMovie.countries + '</p>';
            var boxOffice = '<p>Note au box office : ' + infosMovie.worlwide_gross_income + '</p>';
            var description = '<p>Description : ' + infosMovie.description + '</p></div>';

            htmlContent = h1 + genre + date + rated + scoreImdb + director + actors + duration + country + boxOffice + description + imgMovie;
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
        await getMovies2020();

        await getMovieForInfos();
    } catch (error) {
        console.error(error);
    }
}

main();
