# Projet 06 - JustStreamIt

<div align="center">
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Nantosuelte88/Projet06/blob/main/data/logo_fond_blanc.png">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/Nantosuelte88/Projet06/blob/main/data/16004298163529_P5.png">
  <img alt="Logo de JustStreamIt" src="https://github.com/Nantosuelte88/Projet06/blob/main/data/logo_fond_blanc.png">
</div>
<p align="center">
    “Tu ne sais pas quoi regarder pour passer une bonne soirée ? Alors JustStreamIt”
</p>

## Pour commencer

Ce projet est créé dans le cadre de la formation de Développeur d'application Python proposée par [OpenClassrooms](https://openclassrooms.com/fr/).

### Le projet

Il est demandé de créer un site web permettant de visualiser en temps réel un classement de films. 
Il faut, pour cela, récupérer les données des films depuis l'API à l'aide de requête AJAX et les afficher sur le site.

### Les exigences :
  + Utiliser l'API locale fournie.
  + Utiliser du JavaScript pur (vanilla JavaScript), aucun framework autorisé.
  + Se tenir à la maquette donnée.
  + Le site doit fonctionner de façon similaire sur au moins 3 navigateurs différents, tests effectués sur :
    * Google Chrome,
    * Microsoft Edge,
    * Opera,
    * Mozilla Firefox.

### Prérequis

Ce projet utilise une version de test de OCMovies-API créée par OpenClassrooms, que vous trouverez sur ce [lien](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR). Merci de vous conformer aux exigences requises pour utiliser l'API correctement.


> [!IMPORTANT]
> Nécessite une version de Python supérieure à 3.3.


### Installation

Pour créer l'environnement :
```
$ python -m venv env
```

Pour l'activer sur Unix et MacOS :
```
$ source env/bin/activate
```

Pour l'activer sur Windows (Pas de ".bat" sous Powershell) :
```
$ env\Scripts\activate.bat
```

Activer le serveur
```
$ python manage.py runserver
```

## Le site

Vous pouvez maintenant ouvrir le site dans un navigateur.

<p align="center">
  <img alt="Démo du site JustStreamIt, en-tête et meilleur film" src="https://github.com/Nantosuelte88/Projet06/blob/main/data/screen01.png">
</p>

### Les catégories

Le site a une première section contenant le film le mieux noté selon le score IMDb. Ensuite, vous trouverez plusieurs catégories :
  - Les films les mieux notés
  - Les films d'animation
  - Les films de Christopher Nolan
  - Les dramas coréens

Chaque section contient les 7 meilleurs films de sa catégorie, dont 4 sont visibles initialement. Les autres sont accessibles grâce aux flèches.

### Fonctionnalité

### Fonctionnalités

En cliquant sur l'une des images d'un film, vous aurez accès à une fenêtre modale contenant diverses informations sur le film, telles que le titre, le score au box-office, le pays d'origine, etc. La fenêtre modale se ferme au clic.

<p align="center">
  <img alt="Exemple d'information sur un film" src="https://github.com/Nantosuelte88/Projet06/blob/main/data/screen02.png">
</p>


## Langages Utilisés

* HTML 5
* CSS 3
* JavaScript  

  
> README rédigé à l'aide de :
> - [Docs GitHub](https://docs.github.com/fr/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
> - [Template by PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
> - [Align items by DavidWells](https://gist.github.com/DavidWells/7d2e0e1bc78f4ac59a123ddf8b74932d)
