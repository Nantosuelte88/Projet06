async function fetchMovies(nbrMovies, url, listMovies) {

    const response = await fetch(url);
    const movies = await response.json();
    // console.log('avant if', movies)
    // console.log('results?', movies.results)

    if (movies.results) {
        listMovies.push(...movies.results);

        if (listMovies.length < nbrMovies && movies.next) {
            // console.log('taille listMovies', listMovies.length);
            // console.log('ya un nesxt', listMovies);
            return fetchMovies(nbrMovies, movies.next, listMovies);

        } else {
            // console.log('assez de films? ', listMovies.length);
            // console.log('quels films? ', listMovies);
            // console.log('test slice', listMovies.slice(0, nbrMovies))
            return (listMovies.slice(0, nbrMovies));
        }
    }
}



function displayMoviePoster(movies, id) {
    var moviesDiv = document.getElementById(id);
    var htmlContent = '';

    // Fonction récursive pour charger les images une par une
    function loadImagesSequentially(index) {
        if (index < movies.length) {
            var imgMovie = movies[index].image_url;
            var image = new Image();
            image.src = imgMovie;

            image.onload = function() {
                // console.log('Image Ok');
                htmlContent += '<div class="slide slide' + id + '"> <img src="' + imgMovie + '" id="movieImage" data-movie-id=' + movies[index].id + ' class="modal-trigger" alt="' + movies[index].title + '"></img></div>';
                // Charger l'image suivante de manière récursive
                loadImagesSequentially(index + 1);
            };

            image.onerror = function() {
                // console.log("L'image n'existe pas");
                // En cas d'erreur, utiliser l'image par défaut
                var imgMovie = "data/base_movie.jpg";
                htmlContent += '<div class="slide slide' + id + '"> <img src="' + imgMovie + '" id="movieImage" data-movie-id=' + movies[index].id + ' class="modal-trigger" alt="' + movies[index].title + '"></img></div>';
                // Charger l'image suivante de manière récursive
                loadImagesSequentially(index + 1);
            };
        } else {
            // Toutes les images ont été chargées, mettre à jour le contenu HTML
            moviesDiv.innerHTML = htmlContent;
        }
    }

    // Commencer le chargement des images à partir de l'index 0
    loadImagesSequentially(0);
}

// Les 8 meilleurs films [LE meilleur + les 7 suivants] -> faire fonction pour prendre le meilleur d'entre eux
async function getBestMovies() {
    const allBestMovies = await fetchMovies(8, 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score', []);
    
    // Creation du h1 , du bouton et de l'image du meilleur film
    // console.log('lesmeilleurs films ?', allBestMovies);

    if (allBestMovies && allBestMovies.length > 0) {
        var bestMovie = allBestMovies[0];
        // console.log('id de bestmovie???', bestMovie);
        var bestMovieDiv = document.getElementById("bestMovie");
        var h1 = '<div><h1>' + bestMovie.title + '</h1>';
        var btn = '<button id="theMovie" class="default modal-btn modal-trigger">Play</button></div>';
        var imgBestMovie = (`<img src=${bestMovie.image_url}`)??(`<img src="data/base_movie.jpg"`); // FAIRE UN FONCTION QUI TEST LES IMAGES
        var imageBestMovie = imgBestMovie + '" data-movie-id=' + bestMovie.id 
        + ' class="modal-trigger" alt="' + bestMovie.title + '"></img>';

        // var imageBestMovie = '<img src=' + bestMovie.image_url + '" data-movie-url=' + bestMovie.url 
        // + ' class="modal-trigger" alt="' + bestMovie.title + '"></img>'; 

        htmlContent = h1 + btn + imageBestMovie;
        bestMovieDiv.innerHTML = htmlContent;

        var btnModal = document.querySelector(".modal-trigger");
        btnModal.addEventListener("click", function() {
            getMovieInfo(bestMovie.id);
        }) ;

        // Creation des 7 films suivants dans la categorie "Meilleurs films"
        displayMoviePoster(allBestMovies.slice(1, 8), 'bestMovies');
        initCarousel('carouselBestMovies', 'bestMovies');

    }
}


// Les 7 meilleurs films d'animation
async function getMoviesByGenre() {
    try {
        const moviesByGenre = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?genre=animation&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByGenre, 'genre');
        initCarousel('carouselGenre', 'genre');
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs films de Nolan
async function getMoviesByDirector() {
    try {
        const moviesByDirector = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?director_contains=Nolan&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByDirector, 'director');
        initCarousel('carouselDirector', 'director');
    } catch (error) {
        throw error;
    }
}


// Les 7 meilleurs Dramas Coréens
async function getMoviesByCountry() {
    try {
        const moviesByCountry = await fetchMovies(7, 'http://localhost:8000/api/v1/titles/?genre_contains=drama&country_contains=korea&sort_by=-imdb_score', []);
        displayMoviePoster(moviesByCountry, 'country');
        initCarousel("carouselCountry", 'country');
    } catch (error) {
        throw error;
    }
}




// Le Carrousel
function initCarousel(carouselID, categorieID) {
    var slidesIDs = '.slide' + categorieID;
    let currentSlide = 0;   
    // let slides;
    const numVisibleSlides = 4;


    function showSlide(index) {
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
}
     



// La fenêtre modale

async function getModal() {
    try {

        const modalContainer = document.querySelector(".modal-container");
        const modalTriggers = document.querySelectorAll(".modal-trigger");
        const closeModalButton = document.querySelector(".close-modal");
        
        modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))
        closeModalButton.addEventListener("click", toggleModal);
    
        function toggleModal(){
            modalContainer.classList.toggle("active");
        };
    } catch (error) {
        throw error;
    }

}

async function getMovieInfo(id) {
    console.log(id)
    var url = 'http://localhost:8000/api/v1/titles/' + id;
    var infoMovieDiv = document.getElementById("infoMovie");
    var htmlContent = '';
    // console.log('URL ? :', url)
    const response = await fetch(url);
    const infosMovie = await response.json();

    if (infosMovie) {

        console.log('resultat?', infosMovie);
        console.log(infosMovie.title);

        var h1 = '<div class="infos"><h1>' + infosMovie.title + '</h1>';
        var imgMovie = '<div class="imageInfo"><img src="' + (infosMovie.image_url??"data/base_movie.jpg") + ' alt="' + infosMovie.title + '"></img></div>';
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

}

async function getMovieForInfos() {
    var movieImages = document.querySelectorAll('#movieImage');
  
    movieImages.forEach(function (movieImage) {
      movieImage.addEventListener('click', function() {
        var movieID = movieImage.getAttribute('data-movie-id');
        console.log('url bon film?', movieID);
        getMovieInfo(movieID)
      });
    });
  }

async function main() {
    try {
        await getBestMovies();
        // console.log('Meilleurs films:', bestMovies);

        await getMoviesByGenre();
        // // console.log('Films d\'animation', moviesByGenre);

        await getMoviesByDirector();
        // // console.log('Films de Nolan:', moviesByDirector);

        await getMoviesByCountry();
        // // console.log('Les meilleurs dramas coréens', moviesByCountry)

        // await getCarousel();
        await getModal();
        await getMovieForInfos();
    } catch (error) {
        console.error(error);
    }
}

main()