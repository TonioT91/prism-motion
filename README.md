# Prism Motion — site portfolio

Site statique multi-pages (HTML/CSS/JS, aucune dépendance, aucune étape de build). Fonctionne sur n'importe quel hébergement statique.

9 pages : `index.html` (accueil), `contact.html`, `espace-client.html`, et 6 pages projet dans `projets/` (une par diapositive du carrousel "Projets en vedette") : Cyclisme, Tennis, Escalade de bloc, Kitesurf, Musculation & haltérophilie, Hyrox ("Crossfit pour tous").

Les vraies photos du photographe sont en place dans `assets/photos/` (hero, 6 projets, à propos, hors-projets). Il reste quelques informations de contact à personnaliser avant mise en ligne définitive — voir ci-dessous.

## Avant mise en ligne, ce qu'il reste à faire

### 1. Configurer le formulaire de contact (Formspree)

1. Créez un compte gratuit sur [formspree.io](https://formspree.io).
2. Créez un formulaire, réglez l'email de réception sur votre adresse pro (ou directement `antoine.tarrago@orange.fr` en attendant une adresse pro).
3. Copiez l'identifiant fourni (ex. `xyzabcde`).
4. Dans `contact.html`, remplacez `VOTRE_ID_FORMSPREE` dans la ligne :
   ```html
   <form ... action="https://formspree.io/f/VOTRE_ID_FORMSPREE" ...>
   ```
   par votre identifiant réel.

### 2. Mettre à jour vos coordonnées

L'email pro (`contact-tonio@prism-motion.com`) est déjà à jour dans le pied de page de chaque page et dans la carte "Coordonnées directes" de `contact.html`. Pensez à configurer une redirection de cette adresse vers `antoine.tarrago@orange.fr` dans votre panel d'hébergement.

Il reste à mettre à jour le téléphone de démonstration `+33600000000` / `06 00 00 00 00` → votre numéro, si vous souhaitez l'afficher.

Le lien Instagram (`https://www.instagram.com/trrg.photo`) est déjà à jour partout : pied de page, bouton flottant, et aperçus "story" de chaque page projet.

### 3. Ajouter votre logo

Le nom "PRISM MOTION" est affiché en texte pour l'instant (police du site), à 3 endroits par page (nav, menu mobile, footer) sur les 9 pages. Pour utiliser votre vrai logo :
1. Exportez-le en `.svg` ou `.png` (fond transparent), déposez-le dans `assets/logo/`.
2. Dans chaque fichier `.html`, remplacez le contenu de `class="nav-logo-mark"` (actuellement un carré "PM" en pointillés) par une balise `<img>` pointant vers votre fichier, en gardant une hauteur raisonnable (~28-32px).

### 4. Vidéo (optionnel, pas encore fait)

Les 6 cartes de la section "Projets en vedette" affichent une photo pour l'instant. Si vous voulez ajouter de la vidéo (par exemple les rushs Hyrox), il faudra les compresser pour le web (`ffmpeg` n'était pas disponible au moment de la construction du site) puis reprendre le pattern `<video muted loop playsinline poster="...">` utilisé précédemment.

## Photos

Toutes les photos réelles sont dans `assets/photos/`, redimensionnées et compressées pour le web (~2000px sur le plus grand côté, JPEG qualité 82, EXIF nettoyé) :

```
assets/photos/hero/          3 photos plein écran de la page d'accueil
assets/photos/cyclisme/      10 photos, projet Cyclisme
assets/photos/tennis/        10 photos, projet Tennis
assets/photos/bloc/          8 photos, projet Escalade de bloc
assets/photos/kitesurf/      8 photos, projet Kitesurf
assets/photos/musculation/   10 photos, projet Musculation & haltérophilie
assets/photos/hyrox/         11 photos, projet Hyrox / Crossfit pour tous
assets/photos/about/         portrait pour la section À propos
assets/photos/highlights/    6 photos hors-projets (rando/faune, feu, plongée) affichées dans la bande "Ailleurs, entre deux séances"
```

Pour changer une photo : remplacez le fichier correspondant (même nom) ou changez le `src="assets/photos/..."` dans le HTML concerné. Chaque page projet réutilise certaines photos entre les sections (photo principale, pellicule, grille, galerie circulaire, story, affiche, déclinaisons) — c'est voulu, ça représente le même reportage décliné pour différents usages.

## Espace client — comment ça marche

Le fichier `data/codes.json` contient la liste des codes actifs. Pas de stockage de photos sur le site : chaque code pointe simplement vers un lien externe (Google Drive, WeTransfer, Dropbox, Pixieset...).

Pour ajouter un client :
```json
"codes": {
  "TRAIL2026": {
    "label": "Trail des Crêtes, mai 2026",
    "url": "https://drive.google.com/votre-lien-de-partage"
  }
}
```

Après chaque séance : créez le lien de partage (Drive/WeTransfer...), ajoutez une ligne dans `codes.json`, redéployez le site (voir ci-dessous), puis communiquez le code au client par email. Le formulaire est sur `espace-client.html`.

Le code `DEMO2026` est un exemple à supprimer avant mise en ligne.

**Important : ce n'est pas un vrai contrôle d'accès.** N'importe qui qui devine ou trouve un code dans `codes.json` peut accéder au lien. C'est suffisant pour un usage "code donné en main propre à chaque client", mais ne mettez rien de sensible derrière sans protection supplémentaire côté Drive/WeTransfer (lien expirant, mot de passe).

## Tester en local

Ne pas ouvrir les fichiers `.html` en double-cliquant dessus : la vérification des codes (`data/codes.json`) ne fonctionnera pas en `file://`. Lancez un petit serveur local depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000` (accueil), `http://localhost:8000/contact.html`, `http://localhost:8000/espace-client.html` et par exemple `http://localhost:8000/projets/hyrox.html`.

## Déployer

Le dossier entier (`index.html`, `contact.html`, `espace-client.html`, `projets/`, `css/`, `js/`, `data/`, `assets/`) est le site.

- **GitHub Pages** : déjà connecté, `git push` déclenche le déploiement.
- **Hostinger** : déploiement Git configuré en mode manuel — après un `git push`, cliquez sur "Déployer" dans la section Git de hPanel (ou ré-uploadez un zip via le gestionnaire de fichiers si besoin).

À chaque fois que vous modifiez `codes.json` (nouveau client), une photo, ou le contenu d'une page, il faut redéployer.

## Structure du projet

```
index.html                    accueil : nav, hero (parallaxe), projets (carrousel photo), services, à propos, hors-projets, footer
contact.html                   page contact : formulaire + coordonnées
espace-client.html             page espace client : code -> lien de téléchargement
projets/cyclisme.html          page projet : Cyclisme
projets/tennis.html            page projet : Tennis
projets/bloc.html              page projet : Escalade de bloc
projets/kitesurf.html          page projet : Kitesurf
projets/musculation.html       page projet : Musculation & haltérophilie
projets/hyrox.html             page projet : Hyrox / Crossfit pour tous
css/style.css                  design system (couleurs, typographie, composants)
js/main.js                     menu mobile, carrousels, animations au scroll, formulaire, espace client
data/codes.json                codes client -> liens de téléchargement
assets/photos/                 photos réelles, organisées par section/projet (voir ci-dessus)
assets/fonts/                  Space Grotesk + Space Mono auto-hébergées (woff2)
assets/icons/                  icônes Tabler (SVG, licence MIT) utilisées comme référence, inline dans le HTML
assets/logo/                   à compléter avec votre logo
```
