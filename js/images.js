// let currentIndex = 0;
// const items = document.querySelectorAll('.box img');
// const numItems = items.length;
// const next = document.getElementById('d');
// const prev = document.getElementById('g');

// next.addEventListener('click', showNext);
// prev.addEventListener('click', showPrev);

// function showNext() {
//     items[currentIndex].style.display = 'none';
//     currentIndex = (currentIndex + 1) % numItems;
//     items[currentIndex].style.display = 'inline-block';
    
//     // Empêcher la rotation au-delà de la 7ème image
//     if (currentIndex === 7) {
//         next.style.display = 'none'; // Cacher la flèche droite
//     }
//     prev.style.display = 'inline-block'; // Afficher la flèche gauche
// }

// function showPrev() {
//     items[currentIndex].style.display = 'none';
//     currentIndex = (currentIndex - 1 + numItems) % numItems;
//     items[currentIndex].style.display = 'inline-block';

//     // Empêcher la rotation en arrière de la 1ère image
//     if (currentIndex === 0) {
//         prev.style.display = 'none'; // Cacher la flèche gauche
//     }
//     next.style.display = 'inline-block'; // Afficher la flèche droite
// }

// // Initialisation : Afficher les 4 premières images
// for (let i = 0; i < 4; i++) {
//     items[i].style.display = 'inline-block';
// }

// // Cacher la flèche gauche au démarrage (car nous sommes à la 1ère image)
// prev.style.display = 'none';
