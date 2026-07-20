# Prism Motion — site portfolio

Site statique multi-pages (HTML/CSS/JS, aucune dépendance, aucune étape de build). Fonctionne sur n'importe quel hébergement statique.

6 pages : `index.html` (accueil), `contact.html`, `espace-client.html`, et 3 pages projet dans `projets/` (une par diapositive du carrousel "Projets en vedette").

## Avant mise en ligne, 6 choses à faire

### 1. Remplacer les photos de démonstration

Toutes les images viennent de `picsum.photos` (photos aléatoires, juste pour visualiser la mise en page). Dans `index.html`, remplacez chaque `src="https://picsum.photos/..."` par vos propres photos :

- Créez un dossier `assets/photos/` et déposez-y vos fichiers (`.jpg` ou `.webp`, compressés pour le web).
- Remplacez `src="https://picsum.photos/..."` par `src="assets/photos/votre-fichier.jpg"`.
- Sections concernées : Hero (1 photo centrale + 2 photos latérales), Services (4 photos), À propos (1 photo). Les cartes vidéo de la section "Projets en vedette" utilisent aussi une photo en `poster` (voir point 2).
- Chaque page projet (`projets/*.html`) utilise 6 photos de démonstration (photo principale, présentation "pellicule", 2 photos en grille, aperçu story, affiche) — voir point 3.

### 2. Ajouter vos vraies vidéos

La section "Projets en vedette" affiche 3 cartes vidéo plein écran. Pour l'instant chaque `<video>` n'a qu'une image de démonstration (`poster`, en niveaux de gris) et pas de fichier vidéo : ça s'affiche comme une photo statique tant qu'aucune vidéo n'est ajoutée.

Pour activer la vidéo sur une carte :
1. Déposez votre fichier (`.mp4`, compressé pour le web) dans `assets/video/`.
2. Dans `index.html`, à l'intérieur de la balise `<video muted loop playsinline ...>` correspondante, ajoutez :
   ```html
   <source src="assets/video/votre-fichier.mp4" type="video/mp4" />
   ```
3. Remplacez aussi le `poster="https://picsum.photos/..."` par une image extraite de votre vidéo (première image, format `.jpg`).

Les 3 emplacements sont repérés par un commentaire `<!-- Déposez le fichier vidéo réel dans assets/video/ et ajoutez-le ici -->`.

### 3. Compléter les pages projet

Le bouton "Voir le projet" de chaque diapositive de la section "Projets en vedette" ouvre une page dédiée dans `projets/` (`derby-regional.html`, `trail-des-cretes.html`, `tournoi-inter-clubs.html`). Chaque page présente le projet de plusieurs façons : photo principale, présentation façon pellicule, deux photos en grille, aperçu format story Instagram, affiche. Remplacez les photos `picsum.photos` par vos vraies photos comme au point 1, et adaptez les textes (mission, type, année, lieu) à la réalité du projet. Les liens "Projet précédent / Projet suivant" en bas de page font déjà le tour des 3 projets.

### 4. Configurer le formulaire de contact (Formspree)

1. Créez un compte gratuit sur [formspree.io](https://formspree.io).
2. Créez un formulaire, réglez l'email de réception sur votre adresse pro.
3. Copiez l'identifiant fourni (ex. `xyzabcde`).
4. Dans `contact.html`, remplacez `VOTRE_ID_FORMSPREE` dans la ligne :
   ```html
   <form ... action="https://formspree.io/f/VOTRE_ID_FORMSPREE" ...>
   ```
   par votre identifiant réel.

### 5. Mettre à jour vos coordonnées

L'email, le téléphone et l'Instagram de démonstration apparaissent dans le pied de page et le bouton Instagram flottant de chacune des 6 pages, plus dans la carte "Coordonnées directes" de `contact.html`. Cherchez et remplacez dans tous les fichiers `.html` (racine et `projets/`) :
- `contact@prismmotion.fr` → votre email pro réel
- `+33600000000` / `06 00 00 00 00` → votre numéro
- `instagram.com/prismmotion` / `@prismmotion` → votre compte Instagram réel

### 6. Ajouter votre logo

Le nom "PRISM MOTION" est affiché en texte pour l'instant (police du site), à 3 endroits par page (nav, menu mobile, footer) sur les 6 pages. Pour utiliser votre vrai logo :
1. Exportez-le en `.svg` ou `.png` (fond transparent), déposez-le dans `assets/logo/`.
2. Dans chaque fichier `.html`, remplacez le contenu de `class="nav-logo-mark"` (actuellement un carré "PM" en pointillés) par une balise `<img>` pointant vers votre fichier, en gardant une hauteur raisonnable (~28-32px).

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

Puis ouvrez `http://localhost:8000` (accueil), `http://localhost:8000/contact.html`, `http://localhost:8000/espace-client.html` et `http://localhost:8000/projets/derby-regional.html`.

## Déployer

Le dossier entier (`index.html`, `contact.html`, `espace-client.html`, `projets/`, `css/`, `js/`, `data/`, `assets/`) est le site. Trois options simples et gratuites :

- **Netlify** : glissez-déposez le dossier sur [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel** : `vercel deploy` depuis le dossier (nécessite un compte Vercel).
- **GitHub Pages** : poussez le dossier dans un repo GitHub, activez Pages sur la branche `main`.

À chaque fois que vous modifiez `codes.json` (nouveau client), une photo ou une vidéo, il faut redéployer (glisser-déposer à nouveau sur Netlify, ou `git push` si vous êtes sur GitHub Pages/Vercel connecté à un repo).

## Structure du projet

```
index.html                        accueil : nav, hero (parallaxe), projets (carrousel vidéo), services, à propos, footer
contact.html                       page contact : formulaire + coordonnées
espace-client.html                 page espace client : code -> lien de téléchargement
projets/derby-regional.html         page projet : Derby régional
projets/trail-des-cretes.html       page projet : Trail des Crêtes
projets/tournoi-inter-clubs.html    page projet : Tournoi inter-clubs
css/style.css                      design system (couleurs, typographie, composants)
js/main.js                         menu mobile, carrousels, animations au scroll, formulaire, espace client
data/codes.json                    codes client -> liens de téléchargement
assets/fonts/                      Space Grotesk + Space Mono auto-hébergées (woff2)
assets/icons/                      icônes Tabler (SVG, licence MIT) utilisées comme référence, inline dans le HTML
assets/logo/                       à compléter avec votre logo
assets/video/                      à créer, y déposer vos fichiers vidéo (voir point 2 ci-dessus)
```
