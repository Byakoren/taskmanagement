# taskmanagement
Application de gestion de tâches

#### Tâches à réaliser :
1. **Création du repository GitHub**
   - Un membre crée le repo principal lien du repo (https://github.com/Byakoren/taskmanagement)
    
   - Configuration des permissions et/ou des branches
        Utilisation du Forking workflow avec une branch Develop d'où on part sur nos différentes branches par feature. La branch main sera MR à la fin de develop. Chaque feature doit passer par une MR sur Develop.

   - Mise en place du README.md avec la documentation du projet

2. **Configuration du workflow**
   - Choix du workflow Git
        Forking workflow comme dit plus haut, avec une branch Develop d'où on part sur nos différentes branches par feature. La branch main sera MR à la fin de develop. Chaque feature doit passer par une MR sur Develop.

   - Configuration des règles de protection de branche(s)
        MR à chaque fois sur Develop, et MR de Develop vers main à la fin du projet. Pas de push direct sur main ou develop, tout doit passer par une MR.

3. **Organisation des équipes**
   - Attribution des rôles : Tests, DevOps, etc...
       AbdelKrim : Tests
       Roïssath : Devops, Selenium
       Thomas : Github, workflow,ESLint
   - Création des issues pour chaque fonctionnalité/tâche/étape

   #### Structure technique :
```
projet-gestionnaire-taches/
├── frontend/         
├── backend/           
├── tests/            # Tests automatisés
├── README            # Analyse, interprétations, résultats
└── .github/          # Workflows GitHub Actions
```

## 2. DevOps

Pour la partie DevOps, j'ai mis en place trois workflows GitHub Actions : un pour la CI, un pour le déploiement et un pour le monitoring. Ils se trouvent dans [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/deploy.yml](.github/workflows/deploy.yml) et [.github/workflows/monitoring.yml](.github/workflows/monitoring.yml).

### Intégration continue

La CI se lance automatiquement sur les pull requests vers `develop` et `main`.

- côté backend : installation des dépendances, lint avec ESLint puis exécution des tests ;
- côté frontend : installation des dépendances, lint, tests unitaires, couverture puis vérification du build ;
- le rapport de couverture frontend est conservé comme artefact GitHub Actions.

Pour cela, une configuration ESLint a été ajoutée dans [backend/.eslintrc.cjs](backend/.eslintrc.cjs) et [frontend/.eslintrc.cjs](frontend/.eslintrc.cjs).

Des tests ont aussi été ajoutés pour que la pipeline puisse réellement vérifier le projet :

- backend : [backend/tests/auth.integration.test.js](backend/tests/auth.integration.test.js) et [backend/tests/tasks.integration.test.js](backend/tests/tasks.integration.test.js) ;
- frontend : [frontend/src/components/Login.unit.test.js](frontend/src/components/Login.unit.test.js) et [frontend/src/components/TaskList.unit.test.js](frontend/src/components/TaskList.unit.test.js).

### Déploiement continu

Le déploiement se fait automatiquement lors d'un push sur `main`. Le workflow construit le frontend avec Vite puis le publie sur GitHub Pages.

### Monitoring

Un workflow de monitoring est exécuté toutes les 30 minutes. Il appelle l'endpoint `/health` du backend et vérifie que le service répond bien avec un code `200`. Pour cela, il faut configurer le secret GitHub `HEALTHCHECK_URL`.

### Workflow Git utilisé

On a travaillé avec un forking workflow : création d'une branche depuis `develop`, développement de la fonctionnalité, push de la branche, puis ouverture d'une pull request vers `develop`. Une fois la branche validée, la mise en production se fait ensuite via `main`.

## 3. Tests et qualité

Trois types de tests ont été mis en place pour couvrir les différentes couches de l'application.

### Tests unitaires (frontend)

Framework : Vitest + React Testing Library

Fichiers :
- [frontend/src/components/Login.unit.test.js](frontend/src/components/Login.unit.test.js)
- [frontend/src/components/TaskList.unit.test.js](frontend/src/components/TaskList.unit.test.js)

Lancer les tests :
```bash
cd frontend
npm run test -- --run
npm run test:coverage -- --run
```

### Tests d'intégration (backend)

Framework : Jest + Supertest

Fichiers :
- [backend/tests/auth.integration.test.js](backend/tests/auth.integration.test.js)
- [backend/tests/tasks.integration.test.js](backend/tests/tasks.integration.test.js)

Lancer les tests :
```bash
cd backend
npm run test -- --runInBand
npm run test:coverage -- --runInBand
```

### Tests E2E Selenium

Framework : Selenium WebDriver avec Chrome headless

Fichier : [tests/selenium/task-flow.e2e.test.js](tests/selenium/task-flow.e2e.test.js)

Scénario testé : connexion avec les identifiants admin, navigation vers le dashboard, création d'une tâche, vérification que la tâche apparaît sur le board.

Installation (à faire une seule fois) :
```bash
cd tests
npm install
```

Lancer le test :
```bash
cd tests
npm run test:e2e
```

La commande démarre automatiquement le backend sur le port 3001 et le frontend sur le port 3000, attend que les deux serveurs soient prêts, exécute le scénario Selenium, puis arrête les serveurs.

Identifiants utilisés par le test :
- Email : `admin@test.com`
- Mot de passe : `password`

### Configuration ESLint

Une configuration ESLint a été ajoutée sur les deux parties du projet :
- [backend/.eslintrc.cjs](backend/.eslintrc.cjs) : règles backend avec support des globals Jest
- [frontend/.eslintrc.cjs](frontend/.eslintrc.cjs) : règles frontend avec support des globals Vitest et React

Commandes utiles :
```bash
# Frontend
cd frontend
npm install
npm run lint
npm run lint:fix

# Backend
cd ../backend
npm install
npm run lint
npm run lint:fix
```

Cette partie correspond à la demande du projet sur l'analyse de code avec ESLint :
- vérification automatique du code côté frontend et backend ;
- exécution locale possible avant commit ;
- exécution aussi dans la CI avant merge.

### Couverture de code

La couverture est générée avec les commandes `test:coverage` et conservée comme artefact dans la pipeline CI. Résultats obtenus :
- Backend : 7 tests passés, ~81.9% de couverture
- Frontend : 4 tests passés, ~100% sur les composants testés
- E2E : scénario complet validé (login → création tâche)
