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

