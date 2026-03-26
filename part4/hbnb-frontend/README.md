# hbnb-frontend

Frontend React du projet HBnB, construit avec Vite.  
L'application consomme l'API du backend `part4/hbnb-backend` et affiche les places, leurs details, les commentaires, et les interactions principales cote client.

## Stack

- React
- Vite
- React Router
- Framer Motion
- Tailwind CSS
- Lucide React

## Lancement

Prerequis :

- Node.js
- npm
- backend lance sur le port attendu par `src/constants.jsx`

Installation et demarrage :

```bash
npm install
npm run dev
```

Build production :

```bash
npm run build
```

Preview :

```bash
npm run preview
```

## Fonctionnalites actuelles

- affichage des places depuis l'API
- affichage des details d'une place
- affichage des commentaires d'une place
- animations de transition cote frontend
- likes stockes localement
- partage rapide de l'id d'une place

## Structure

- `src/App.jsx` : routing principal
- `src/feature/HomePage.jsx` : page d'accueil et liste des places
- `src/components/Comments.jsx` : panneau de commentaires
- `src/components/LoginScreen.jsx` : ecran de connexion

## Todo

- [ ] Integrer correctement le login avec stockage du token et gestion de session
- [ ] Proteger les actions backend qui necessitent un utilisateur connecte
- [ ] Afficher l'etat connecte/deconnecte dans le header
- [ ] Creer un formulaire propre de creation de commentaire
- [ ] Enregistrer un commentaire dans la base de donnees
- [ ] Modifier un commentaire dans la base de donnees
- [ ] Supprimer un commentaire depuis le frontend
- [ ] Relier les likes et bookmarks a de vraies donnees backend si necessaire
- [ ] Mettre `owner_id` partout ou choisir une convention unique (`owner_id` ou `user_id`) et l'appliquer partout
- [ ] Harmoniser les formats de reponse backend/frontend
- [ ] Ajouter une page par user avec ses informations et ses places
- [ ] Permettre d'ouvrir le profil owner depuis une place
- [ ] Gerer les erreurs API proprement avec messages visibles
- [ ] Gerer les etats de chargement de facon coherente sur toutes les pages
- [ ] Corriger la restauration/gestion du scroll entre les pages
- [ ] Verifier toutes les `key` React dans les listes
- [ ] Nettoyer les noms de composants et de variables pour rester coherents
- [ ] Ajouter la creation et la modification de place depuis le frontend
- [ ] Ajouter des tests minimums sur les composants critiques

## Notes

- le frontend depend fortement de la structure exacte des reponses backend
- avant d'ajouter des features, fixer une convention stable pour les champs API est recommande
