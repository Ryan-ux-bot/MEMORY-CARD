🎮 Memory Card Game

Un jeu de memory (paires de cartes) interactif développé avec React.js et Vite. Choisissez votre difficulté et votre thème, puis retrouvez toutes les paires en un minimum de coups et de temps !


Afficher l'image

✨ Fonctionnalités
🎚️ 4 niveaux de difficulté : Facile (6 paires), Moyen (8 paires), Difficile (12 paires), Expert (18 paires)
🎨 4 thèmes visuels : Fruits, Animaux, Nourriture, Drapeaux
⏱️ Suivi en temps réel : score, nombre de coups et chronomètre
🔊 Effets sonores générés dynamiquement via la Web Audio API
🎉 Animation de confettis à la victoire (canvas-confetti)
📱 Interface responsive et design sombre moderne
🛠️ Stack technique
React.js (Hooks : useState, useEffect, useRef)
Vite — bundler et serveur de développement
CSS3 — mise en page et animations
canvas-confetti — animation de victoire
🚀 Installation
bash


# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

L'application sera accessible sur http://localhost:5173.

📁 Structure du projet
src/
├── components/
│   ├── Card.jsx           # Composant carte individuelle
│   ├── GameHeader.jsx     # En-tête : score, coups, chrono, sélecteurs
│   └── WinMessage.jsx     # Message de fin de partie
├── App.jsx                # Logique principale du jeu
├── index.css
└── main.jsx
🎯 Améliorations futures
 Mode multijoueur
 Thèmes personnalisés (upload d'images)
 Mode sombre / clair
👤 Auteur

Rayen Bouyahia Étudiant en Licence Informatique — ISI, Université de Tunis El Manar LinkedIn · GitHub · Portfolio

📄 Licence

Ce projet est open source et disponible sous licence MIT.
