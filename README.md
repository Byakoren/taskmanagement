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
       Roïssath : Devops
       Thomas : Github, workflow 
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

### Configuration CI/CD

Les pipelines GitHub Actions sont dans [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/deploy.yml](.github/workflows/deploy.yml) et [.github/workflows/monitoring.yml](.github/workflows/monitoring.yml).

#### 1. Intégration Continue (CI)
- Déclenchement sur PR vers `develop`/`main`
- Backend :
   - installation dépendances
   - `npm run lint`
   - `npm run test`
   - `npm run test:coverage`
- Frontend :
   - installation dépendances
   - `npm run lint`
   - `npm run test -- --run`
   - `npm run test:coverage -- --run`
- Artifacts de couverture uploadés automatiquement.

#### 2. Déploiement Continu (CD)
- Déclenchement sur push de `main`
- Build frontend Vite
- Déploiement automatique sur GitHub Pages via Actions

#### 3. Monitoring
- Workflow planifié toutes les 30 minutes
- Vérification d'un endpoint de santé (healthcheck)
- Échec du job si le service ne répond pas avec un code HTTP `200`

### Forking workflow (étapes Git)

1. Créer/positionner la branche feature depuis `develop`
2. Commiter les changements
3. Pousser la branche
4. Ouvrir une PR vers `develop`
5. Après validation, merger ensuite `develop` vers `main`

