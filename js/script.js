function fetchAllMovies(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            var films = responseData.results;

            // Choix du meilleur film
            var bestMovie = bestMovies(films)

            if (bestMovie) {
                var baliseBestMovie = document.getElementById("bestMovie");
                var h1 = baliseBestMovie.querySelector("h1");
                var img = baliseBestMovie.querySelector("img");

                h1.textContent = bestMovie.title; // Met le titre comme texte de h1
                img.src = bestMovie.image_url; // Remplace la source de l'image
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
    var bestMovie = null;
    var highestImdbScore = 0;

    films.forEach(function(film) {
        if (film.imdb_score >= 9.4) {
            if (film.imdb_score > highestImdbScore) {
                bestMovie = film;
                highestImdbScore = film.imdb_score;
            }
        }
    });
    return bestMovie
}

fetchAllMovies('http://localhost:8000/api/v1/titles');









//
// var films = responseData.results;
    
// var filmList = document.getElementById('film-list');

// films.forEach(function(film) {
//     if (film.imdb_score >=8.5) {
//         var div = document.createElement('div');
//         var p = document.createElement('p');
//         p.textContent = film.title + ' ' + film.imdb_score;
//         div.appendChild(p)
//         filmList.appendChild(div);
//     }
// });
// if (responseData.next) {
//     fetchAllMovies(responseData.next)
// }



// let contenuTitre = "Azertype"
//let contenuParagraphe = "L'application pour apprendre à taper plus vite !"

//let div = `
//    <div>
//         <h1>${contenuTitre}</h1>
//         <p>${contenuParagraphe}</p>
//     </div>
//     `;

// let body = document.querySelector("body")
// body.innerHTML = div


// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'http://localhost:8000/api/v1/titles', true); // Le troisième paramètre est true pour une requête asynchrone
// xhr.onload = function() {
//   if (xhr.status === 200) {
//     var data = JSON.parse(xhr.responseText);
//     // Traitez les données ici
//     var filmList = document.getElementById('film-list');
//     let contenuParagraphe = data('title')
        
//     let div = `
//         <div>
//             <p>${contenuParagraphe}</p>
//         </div>
//         `;

//     let body = document.querySelector("body")
//     body.innerHTML = div
//   } else {
//     console.log('Erreur de requête : ' + xhr.status);
//   }
// };
// xhr.send();
// // Le script continue à s'exécuter ici sans attendre la réponse du serveur.
