// Inclure la bibliothèque ColorThief
<script src="color-thief.min.js"></script>

// Fonction pour extraire la couleur dominante de l'image
function extractDominantColor(imageUrl) {
    var image = new Image();
    image.crossOrigin = "Anonymous"; // Activer le CORS pour éviter les problèmes de sécurité
    image.src = imageUrl;
    
    image.onload = function() {
        var colorThief = new ColorThief();
        var dominantColor = colorThief.getColor(image);
        var rgbColor = "rgb(" + dominantColor[0] + "," + dominantColor[1] + "," + dominantColor[2] + ")";
        
        // Appliquer la couleur dominante comme arrière-plan
        document.getElementById("best-movie").style.backgroundColor = rgbColor;
    };
}

// Exemple d'utilisation :
var imageUrl = "data/Filmandclapboard.jpg"; // L'URL de votre nouvelle image
extractDominantColor(imageUrl);
