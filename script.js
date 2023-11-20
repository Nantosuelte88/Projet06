// Fonction pour récupérer une liste de films jusqu'à un nombre spécifié
async function fetchMovies(nbrMovies, url, listMovies) {
    const response = await fetch(url); // Effectuer une requête à l'API
    const movies = await response.json(); // Récupérer le contenu JSON de la réponse

    if (movies.results) {
        listMovies.push(...movies.results); // Ajouter les films à la liste

        // Récursivement, récupérer les films suivants s'il y en a et si la limite n'est pas atteinte
        if (listMovies.length < nbrMovies && movies.next) {
            return fetchMovies(nbrMovies, movies.next, listMovies);

        } else {
            return (listMovies.slice(0, nbrMovies)); // Retourner la liste tronquée au nombre requis
        }
    }
}

// Créer les images des films dans un carrousel
async function displayMoviePoster(movies, id, carouselId) {

    var moviesDiv = document.getElementById(id);
    var htmlContent = '';

    // Charger l'image de manière asynchrone
    for (var i = 0; i < movies.length; i++) {
        var imgMovie = await loadImagesSequentially(movies[i].image_url);

        // Construire le contenu HTML pour chaque film
        htmlContent += '<div class="slide slide' + id + '"> <img src="' + imgMovie + '" data-movie-id=' + movies[i].id + ' class="modal-trigger movieImage" alt="' + movies[i].title + '"></img></div>';
    }

    // Remplacer le contenu HTML de l'élément avec l'ID spécifié
    moviesDiv.innerHTML = htmlContent;

    // Initialiser le carrousel avec l'ID spécifié
    initCarousel(carouselId, id);
}

// Vérifier l'existence d'une image à partir d'une URL
function loadImagesSequentially(imgUrl) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.src = imgUrl;

        // Résoudre la promesse avec l'URL de l'image si chargée avec succès, sinon utiliser une image par défaut
        image.onload = function () {
            resolve(imgUrl);
        };

        image.onerror = function () {
            var newImgUrl = "data/image_non_valide.jpg";
            resolve(newImgUrl);
        };
    });
}


// Obtenir et afficher les détails du meilleur film et des 7 suivants
async function getBestMovies() {

    const allBestMovies = await fetchMovies(8, 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score', []);

    if (allBestMovies && allBestMovies.length > 0) {
        var bestMovie = allBestMovies[0];
        var bestMovieDiv = document.getElementById("bestMovie");
        var h1 = '<div><h1>' + bestMovie.title + '</h1>';
        var btn = '<button id="theMovie" class="default modal-btn modal-trigger">Play</button>';

        // Obtenir les détails complets du meilleur film et construire le HTML
        var infoForBestMovie = await getMovieDetails(bestMovie.url);
        var description = '<p>'+ infoForBestMovie.long_description + '</p></div>';
        var imgBestMovieURl = await loadImagesSequentially(bestMovie.image_url);
        var imgBestMovie = '<img src="' + imgBestMovieURl ; 
        var imageBestMovie = imgBestMovie + '" data-movie-id=' + bestMovie.id
        + ' alt="' + bestMovie.title + '"></img>';

        // Construire le contenu HTML complet
        var htmlContent = h1 + btn + description + imageBestMovie;
        bestMovieDiv.innerHTML = htmlContent;

        // Ajouter un événement au bouton 
        var btnModal = document.getElementById("theMovie");
        btnModal.addEventListener("click", function () {
            getMovieInfo(bestMovie.id);
            getModal();
        });

        // Créer les images des 7 films suivants dans la catégorie "Meilleurs films
        displayMoviePoster(allBestMovies.slice(1, 8), 'bestMovies', 'carouselBestMovies');
    }
}

// Obtenir les détails d'un film à partir de son URL
async function getMovieDetails(url) {
    const response = await fetch(url);
    return response.json();
}

// Les 7 meilleurs films d'animation
async function getMoviesByGenre() {

    try {
        const moviesByGenre = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?genre=animation&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByGenre, 'genre', 'carouselGenre');
    } catch (error) {
        throw error;
    }
}

// Les 7 meilleurs films de Nolan
async function getMoviesByDirector() {

    try {
        const moviesByDirector = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?director_contains=Nolan&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByDirector, 'director', 'carouselDirector');
    } catch (error) {
        throw error;
    }
}

// Les 7 meilleurs Dramas Coréens
async function getMoviesByCountry() {

    try {
        const moviesByCountry = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?genre_contains=drama&country_contains=korea&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByCountry, 'country', 'carouselCountry');
    } catch (error) {
        throw error;
    }
}

// Initialiser le carrousel avec un identifiant et l'identifiant de la catégorie
function initCarousel(carouselID, categorieID) {

    var slidesIDs = '.slide' + categorieID;
    let currentSlide = 0;
    let numVisibleSlides;

    // Afficher une diapositive spécifique en fonction de l'index
    function showSlide(index) {

        const slidesContainer = document.getElementById(categorieID);
        const slides = document.querySelectorAll(slidesIDs);

        // Retirer les classes de translation existantes
        slidesContainer.classList.remove('translate-0', 'translate-25', 'translate-50', 'translate-75');
        
        // Ajouter la classe de translation en fonction de l'index
        const translationClass = `translate-${25 * index}`;
        slidesContainer.classList.add(translationClass);

        const actualNumVisibleSlides = Math.min(numVisibleSlides, slides.length);

        // Masquer ou afficher les diapositives en fonction de l'index
        for (let i = 0; i < slides.length; i++) {
            if (i < index || i >= index + actualNumVisibleSlides) {
                slides[i].classList.add('hidden');
            } else {
                slides[i].classList.remove('hidden');
            }
        }
    }

    // Obtenir et configurer les interactions du carrousel
    async function getCarousel(categorieID, slidesIDs) {
        try {
            const carousel = document.querySelector(carouselID);
            slides = document.querySelectorAll(slidesIDs);
            numVisibleSlides = Math.min(4, slides.length);

            const arrowLeft = document.getElementById('g-' + categorieID);
            const arrowRight = document.getElementById('d-' + categorieID);

            // Événements pour naviguer à gauche et à droite
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

    // Appeler la fonction pour configurer le carrousel
    getCarousel(categorieID, slidesIDs);
}


// Gérer l'affichage et la fermeture de la fenêtre modale
async function getModal(callback) {
    try {
        const modalContainer = document.querySelector(".modal-container");
        modalContainer.classList.toggle("active");
        const closeModalButton = document.querySelector(".close-modal");

        // Ajouter un écouteur d'événements pour fermer la fenêtre modale lors du clic sur le bouton de fermeture
        closeModalButton.addEventListener("click", () => {
            modalContainer.classList.remove("active");
            if (typeof callback === 'function') {
                callback();
            }
        });

        modalContainer.addEventListener("click", () => {
            modalContainer.classList.remove("active");
            // if (typeof callback === 'function') {
            //     callback();
            // }
        });

    } catch (error) {
        throw error;
    }
}

// Attendre que les éléments avec la classe '.movieImage' soient présents dans le document
async function waitForElements() {
    return new Promise((resolve) => {
        // Définir un intervalle pour vérifier la présence des éléments
        const intervalId = setInterval(() => {
            const movieImages = document.querySelectorAll('.movieImage');
            if (movieImages.length > 0) {
                // Arrêter l'intervalle et résoudre la promesse avec les éléments trouvés
                clearInterval(intervalId);
                resolve(movieImages);
            }
        }, 100); // Vérifier toutes les 100 millisecondes
    });
}

// Obtenir les informations du film lors du clic sur une image
async function getMovieForInfos() {
    try {
        // Attendre que les éléments avec la classe '.movieImage' soient présents dans le document
        const movieImages = await waitForElements();

        // Ajouter un écouteur d'événements à chaque image de film
        movieImages.forEach(movieImage => {
            movieImage.addEventListener('click', async function () {
                // Obtenir l'identifiant du film à partir de l'attribut 'data-movie-id'
                const movieID = movieImage.getAttribute('data-movie-id');

                await getMovieInfo(movieID);
                await getModal();
            });
        });

    } catch (error) {
        throw error;
    }
}

// Obtenir les informations détaillées d'un film en utilisant son identifiant
async function getMovieInfo(id) {
    try {
        var url = 'http://localhost:8000/api/v1/titles/' + id;
        console.log('Bonne url ?', url);
        var infoMovieDiv = document.getElementById("infoMovie");
        var htmlContent = '';

        // Requête pour obtenir les informations du film
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

// Fonction principale pour charger et afficher les films
async function main() {
    try {
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
