# 📋 Fiche de Spécification — SitSpot
> Application mobile de localisation, notation et avis sur les bancs publics
> Version 1.0 — Destinée à Claude Code

---

## 1. Vue d'ensemble

**SitSpot** est une application mobile (iOS & Android) qui permet à tout utilisateur de :
- Trouver des bancs publics autour de sa position géographique
- Filtrer les bancs selon des critères (ombre, vue, calme, accessibilité…)
- Consulter des photos et les avis laissés par la communauté
- Contribuer : ajouter un banc, poster une photo, laisser une note et un commentaire

L'application fonctionne comme un **Google Maps communautaire dédié aux bancs**.

---


## 3. Fonctionnalités

### 3.1 Carte principale (écran d'accueil)

- Au lancement, l'app demande la permission de localisation
- La carte s'ouvre centrée sur la position de l'utilisateur
- Chaque banc est représenté par un **marqueur** sur la carte
- La couleur du marqueur reflète la note moyenne du banc :
  - 🟢 Vert : note ≥ 4/5
  - 🟡 Jaune : note entre 2.5 et 3.9/5
  - 🔴 Rouge : note < 2.5/5
  - ⚪ Gris : aucune note encore
- L'utilisateur peut zoomer/dézoomer et déplacer la carte librement
- Les marqueurs se rechargent automatiquement quand la zone visible change

### 3.2 Recherche et filtres

L'utilisateur peut filtrer les bancs visibles sur la carte selon :

| Filtre | Options |
|---|---|
| Distance | Dans un rayon de 200m / 500m / 1km / 5km |
| Ombrage | Ensoleillé / À l'ombre / Les deux |
| Vue | Vue sur parc / Vue sur eau / Vue sur rue |
| Accessibilité | Accessible PMR (oui/non) |
| Dossier | Avec dossier / Sans dossier |
| Note minimum | ≥ 3 étoiles / ≥ 4 étoiles |

Une barre de recherche permet aussi de chercher par nom de lieu ou adresse.

### 3.3 Fiche détaillée d'un banc

Au tap sur un marqueur, une fiche s'ouvre (bottom sheet) contenant :

**En-tête :**
- Nom du banc (ex. "Banc du kiosque à musique") ou adresse approximative si sans nom
- Note moyenne affichée en étoiles (ex. ⭐⭐⭐⭐ 4.2/5) + nombre d'avis
- Bouton "Itinéraire" (ouvre Google Maps / Apple Maps avec les coordonnées)

**Photos :**
- Galerie horizontale scrollable des photos postées par les utilisateurs
- Tap sur une photo = vue plein écran
- Bouton "+ Ajouter une photo" (nécessite d'être connecté)

**Tags descriptifs :**
Badges visuels affichant les caractéristiques du banc :
`🌳 Ombragé` `♿ PMR` `🌊 Vue sur eau` `🔇 Calme` `🅿️ Parking proche`

**Avis utilisateurs :**
- Liste des avis : photo de profil + pseudo + note + date + commentaire
- Les avis les plus récents apparaissent en premier
- Bouton "Laisser un avis" (nécessite d'être connecté)

### 3.4 Laisser un avis

Formulaire accessible depuis la fiche d'un banc :

1. **Note** : sélecteur d'étoiles de 1 à 5 (obligatoire)
2. **Commentaire** : champ texte libre, 10 à 500 caractères (obligatoire)
3. **Tags** : sélection multiple parmi une liste de caractéristiques prédéfinies (facultatif) :
   - Ombragé, Ensoleillé, Vue agréable, Calme, Bruyant, Propre, Sale, Dossier confortable, PMR, Proche transports, Vue sur eau, Vue sur parc
4. **Photo** : possibilité d'ajouter 1 à 3 photos depuis la galerie ou l'appareil photo (facultatif)

Un utilisateur ne peut laisser **qu'un seul avis par banc** (il peut le modifier par la suite).

### 3.5 Ajouter un nouveau banc

Accessible via un bouton flottant "+" sur la carte :

1. L'utilisateur place un **pin** sur la carte à l'endroit exact du banc
2. Formulaire de création :
   - Nom du banc (facultatif)
   - Photo obligatoire (au moins 1)
   - Tags descriptifs (facultatif)
3. Le banc est soumis et apparaît immédiatement sur la carte
4. Le créateur est crédité comme "Ajouté par [pseudo]"

### 3.6 Authentification

**Inscription :**
- Email + mot de passe
- Ou connexion via Google (OAuth)
- Pseudo unique demandé à la création du compte

**Connexion :**
- Email + mot de passe
- Ou Google

**Sans compte :**
- L'utilisateur peut consulter la carte, les fiches et les avis
- Il ne peut pas ajouter de banc, poster une photo, ni laisser un avis
- Une invitation à créer un compte s'affiche s'il essaie de faire ces actions

### 3.7 Profil utilisateur

Page accessible depuis le menu :
- Photo de profil (modifiable)
- Pseudo
- Statistiques : nombre de bancs ajoutés, nombre d'avis postés
- Liste "Mes bancs ajoutés"
- Liste "Mes avis"
- Bouton de déconnexion

---

## 4. Navigation de l'application

```
App
├── Carte (écran principal)
│   ├── Filtres (bottom sheet)
│   └── Fiche banc (bottom sheet)
│       ├── Galerie photos (plein écran)
│       └── Laisser un avis (modal)
├── Ajouter un banc (modal, depuis bouton +)
├── Profil
│   ├── Mes bancs
│   └── Mes avis
└── Connexion / Inscription (si non connecté)
```

---



## 6. Règles métier

- Un utilisateur authentifié ne peut laisser **qu'un seul avis** par banc (contrainte unique sur bench_id + user_id)
- La `average_rating` d'un banc est recalculée automatiquement à chaque ajout/modification/suppression d'un avis (trigger Supabase)
- Une photo doit peser **moins de 5 Mo** et être au format JPG ou PNG
- Un banc ne peut pas être créé si ses coordonnées sont **identiques à un banc existant** (rayon de tolérance : 5 mètres)
- Les commentaires sont **limités à 500 caractères**
- Un utilisateur peut **modifier ou supprimer** son propre avis à tout moment
- Un utilisateur peut **signaler** un banc ou un avis inapproprié (bouton "Signaler")

---

## 7. Cas limites et gestion d'erreurs

| Situation | Comportement attendu |
|---|---|
| Pas de connexion internet | Message "Mode hors-ligne — impossible de charger les bancs" + dernières données en cache |
| Localisation refusée | Message explicatif + carte centrée sur Paris par défaut + bouton "Activer la localisation" |
| Aucun banc dans la zone affichée | Message "Aucun banc trouvé ici — soyez le premier à en ajouter un !" |
| Photo trop lourde (> 5 Mo) | Message d'erreur immédiat avant upload |
| Tentative de double avis | Redirige vers la modification de l'avis existant |
| Compte supprimé | Les avis et bancs créés restent, le pseudo devient "Utilisateur supprimé" |

---

## 8. Design et UX

- **Style** : épuré, moderne, couleurs douces (vert nature, beige, blanc)
- **Mode sombre** : supporté nativement
- **Langue** : Français (v1), architecture préparée pour l'internationalisation
- **Accessibilité** : textes lisibles ≥ 16px, contrastes WCAG AA, labels accessibles pour lecteurs d'écran

---

## 9. Ce qui est hors scope (v1)

Ces fonctionnalités ne font **pas** partie de la v1 et ne doivent pas être codées :
- Système de gamification (badges, points)
- Partage sur réseaux sociaux
- Mode AR (réalité augmentée)
- Notifications push
- Interface d'administration web
- Version web (seulement mobile v1)
- Paiement / monétisation

---

