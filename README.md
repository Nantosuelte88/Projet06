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

Ce projet est créé dans le cadre de la formation de Developpeur d'application Python proposé par [OpenClassrooms](https://openclassrooms.com/fr/).

### Le projet

Il est demandé de créer un site web permettant de visualiser en temps réel un classement de films.
Il faut pour cela récuperer les données des films depuis l'API à l'aide de requete AJAX et les afficher sur le site.

### Les exigeances  :
  + Utiliser l'API locale fournit
  + Utiliser du vanilla JavaScript, pas de framework autorisé
  + Se tenir à la maquette donné
  + Le site doit fonctionner de façon similaire sur au moins 3 navigateurs différents, tests effectués sur :
    * Google Chrome
    * Microsoft Edge
    * Opera
    * Mozilla Firefox

### Prérequis

Ce projet utilise une version de test de OCMovies-API créée par OpenClassrooms, que vous trouverez sur ce [lien](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR). Merci de vous conformer aux exigences requises pour utiliser l'API correctement.


> [!IMPORTANT]
> Necessite une version Python < 3.3 minimum.


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

Vous pouvez à présent ouvrir le site dans un navigateur.

<p align="center">
  <img alt="demo site internet JustStreamIt, header et Meilleur film" src="https://github.com/Nantosuelte88/Projet06/blob/main/data/screen01.png">
</p>

### Les categories

Le site a une première section contenant le film le mieux noté par score IMDb,
ensuite vous avez plusieurs categories :
  - les films les mieux notés
  - les films d'animation
  - les films de Christopher Nolan
  - les dramas Coréens

Chaque categorie contient les 7 meilleurs films de sa categorie, 4 sont visibles, les autres sont accessibles grace aux flèches

### Fonctionnalité

En cliquant sur l'une des images d'un film vous aurez accès à une fenetre modale contenant diverses informations sur le film, comme le titre, le score au box office, le pays d'origine ...
La fenêtre modale se ferme au clic

<p align="center">
  <img alt="Exemple d'information sur un film" src="https://github.com/Nantosuelte88/Projet06/blob/main/data/screen02.png">
</p>


## Langages utilisés

* HTML 5
* CSS 3
* JavaScript  

  
> README rédigé à l'aide de :
> - [Docs GitHub](https://docs.github.com/fr/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
> - [Template by PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
> - [Align items by DavidWells](https://gist.github.com/DavidWells/7d2e0e1bc78f4ac59a123ddf8b74932d)
