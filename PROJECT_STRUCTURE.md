# Structure du Projet Roulette Manager

## Structure des Dossiers

### Arborescence Complète

roulette-manager/              # Répertoire racine du projet
├── node_modules/             # Dépendances du projet (géré par npm)
├── public/                   # Fichiers statiques publics
├── src/                      # Code source principal
│   ├── components/          # Composants React
│   │   ├── history/        # Composants liés à l'historique des numéros
│   │   │   └── HistoryDisplay.tsx    # Affichage de l'historique avec scroll
│   │   ├── layout/         # Composants de mise en page
│   │   │   └── MainLayout.tsx        # Layout principal de l'application
│   │   ├── manager/        # Composants de gestion
│   │   │   └── MethodManager.tsx     # Interface de contrôle des méthodes
│   │   ├── methods/        # Composants spécifiques aux méthodes
│   │   │   └── MethodView.tsx        # Interface d'une méthode de jeu
│   │   ├── roulette/       # Composants liés à la roulette
│   │   │   └── RouletteTable.tsx     # Table de roulette interactive
│   │   └── shared/         # Composants réutilisables (à implémenter)
│   ├── hooks/              # Hooks personnalisés (à implémenter)
│   ├── services/           # Services et logique métier (à implémenter)
│   ├── store/              # Gestion de l'état global
│   │   ├── useMethodStore.ts         # Store pour la gestion des méthodes
│   │   └── useStore.ts              # Store général (à implémenter)
│   ├── types/              # Définitions TypeScript
│   │   ├── manager.ts      # Types pour le gestionnaire
│   │   ├── methods.ts      # Types pour les méthodes
│   │   └── roulette.ts     # Types pour la roulette
│   ├── utils/              # Utilitaires
│   │   └── validation.ts   # Fonctions de validation
│   ├── App.css             # Styles globaux spécifiques
│   ├── App.tsx             # Composant racine React
│   ├── index.css           # Styles globaux et configuration Tailwind
│   ├── main.tsx            # Point d'entrée de l'application
│   └── vite-env.d.ts       # Déclarations d'environnement Vite
├── .gitignore              # Configuration Git
├── eslint.config.js        # Configuration ESLint
├── index.html              # Page HTML principale
├── package-lock.json       # Verrouillage des versions des dépendances
├── package.json            # Configuration du projet et dépendances
├── postcss.config.js       # Configuration PostCSS
├── README.md               # Documentation principale
├── tailwind.config.js      # Configuration Tailwind CSS
├── tsconfig.app.json       # Configuration TypeScript pour l'app
├── tsconfig.json           # Configuration TypeScript principale
├── tsconfig.node.json      # Configuration TypeScript pour Node
└── vite.config.ts          # Configuration Vite

## Notes Importantes

### À Implémenter
- `shared/` : Composants communs réutilisables
- `hooks/` : Hooks personnalisés pour la logique réutilisable
- `services/` : Services pour la logique métier des méthodes
- `useStore.ts` : Store général pour les fonctionnalités globales

### Points Clés
- La structure suit le pattern feature-first
- Les composants sont organisés par fonction
- La logique métier est séparée dans les stores et services
- Types stricts pour assurer la qualité du code