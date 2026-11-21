# Site Réussite Internationale

Site de l'agence Réussite Internationale (études en Chine) : accueil, simulateur d'universités, espace élève, guide, inscription WhatsApp.

- `index.html`, `style.css`, `app.js` : le site (une page, écrans par ancre `#accueil`, `#simulateur`, `#suivi`, `#espace`, `#guide`, `#inscription`).
- `data.js` : toutes les données modifiables (WhatsApp, pack, **liste des universités**, dossiers de démonstration).
- `espace-agence/index.html` : copie de l'espace agence (ne fonctionne que publié sur claude.ai, base de données privée).

## Mise à jour hebdomadaire de la liste des universités

Une tâche planifiée revérifie la liste `UNIVERSITES` de `data.js` chaque semaine. Règles :

1. Ne lire les prix que sur des **pages officielles** des universités (domaine `.edu.cn` ou site officiel). Les sites d'agences (CUCAS, SICAS, guides) peuvent servir de piste, jamais de source.
2. Pour chaque entrée vérifiée : mettre à jour `scolarite` (RMB par an ; pour une année de langue, 2 semestres), `verifie` (ex. `"nov. 2026"`, ou `"page de 2025"` si la page n'est pas de l'année en cours) et `source` (lien exact).
3. Un prix introuvable sur une page officielle reste `verifie: false` (affiché « Estimation à confirmer »). Ne jamais inventer un prix ni une source.
4. Ajouter de nouvelles formations utiles aux étudiants africains (médecine, pharmacie, informatique, génie, commerce, langue chinoise, masters), en priorité celles demandées via « + Autre ».
5. `selectivite` (1 sûr à 4 très sélective) et `moyenneMin` sont des estimations de l'agence : rester prudent (universités du top 10 = 3 ou 4).
6. Le dortoir et la vie quotidienne sont des estimations, sauf si la page officielle donne le prix.
7. Vérifier que le site marche (`node --check app.js`, simulateur testé), puis faire un commit sur la branche du projet.
