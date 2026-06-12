# SitSpot — Application mobile

## Comment lancer l'app (étape par étape)

### 1. Installer Node.js (si pas encore fait)
→ Va sur **nodejs.org** et télécharge la version **LTS**. Installe-la normalement.

### 2. Ouvrir un Terminal
Sur Mac : Cmd + Espace → tape "Terminal" → Entrée

### 3. Aller dans le dossier de l'app
```
cd "/Users/robin/Documents/SitSpot projet/SitSpotApp"
```

### 4. Installer les dépendances (une seule fois)
```
npm install
```
(ça télécharge tous les outils nécessaires — peut prendre 2-3 minutes)

### 5. Lancer l'app
```
npx expo start
```

Un QR code apparaît dans le terminal.

### 6. Voir l'app sur ton téléphone
- Télécharge **Expo Go** sur l'App Store (iPhone) ou Google Play (Android)
- Scanne le QR code avec l'appareil photo (iPhone) ou Expo Go (Android)
- L'app s'ouvre sur ton téléphone ! 🎉

---

## Structure des fichiers

```
SitSpotApp/
├── App.js              ← Point d'entrée, gestion de l'état global
├── src/
│   ├── theme.js        ← Couleurs, polices, espacement
│   ├── data.js         ← Données de démonstration (bancs fictifs)
│   ├── components.js   ← Composants réutilisables (boutons, tags, etc.)
│   ├── MapCanvas.js    ← Carte SVG + marqueurs
│   ├── TabBar.js       ← Barre de navigation en bas
│   ├── MapScreen.js    ← Écran principal (carte)
│   ├── BenchSheet.js   ← Fiche détaillée d'un banc
│   ├── FiltersSheet.js ← Panneau de filtres
│   ├── AddReviewModal.js   ← Formulaire d'avis
│   ├── AddBenchModal.js    ← Formulaire d'ajout de banc
│   ├── AuthModal.js        ← Connexion / inscription
│   └── ProfileScreen.js    ← Profil utilisateur
```
