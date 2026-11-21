# Site Réussite Internationale

Site de l'agence Réussite Internationale (études en Chine) : accueil, simulateur d'universités, espace élève, guide, inscription WhatsApp.

- `index.html`, `style.css`, `app.js` : le site (une page, écrans par ancre `#accueil`, `#simulateur`, `#suivi`, `#espace`, `#guide`, `#inscription`).
- `data.js` : toutes les données modifiables (WhatsApp, pack, **liste des universités**, dossiers de démonstration).
- `admin.html` : espace agence (connexion par lien e-mail, réservé aux administrateurs) pour créer et suivre les dossiers.
- `config.js` : adresse du projet Supabase et clé **publique** (jamais la clé secrète).
- `supabase/schema.sql` : base de données (table des dossiers protégée, fonction `dossier_eleve` pour l'espace élève).

## Comment ça marche

1. L'agence inscrit l'élève dans `admin.html` ; un code aléatoire est créé (ex. RI-K7P3-9QX2).
2. L'élève tape ce code dans « Mon espace » sur le site : il voit son étape, ses documents, ses paiements et la prochaine action.
3. Le téléphone, les notes internes et les dépenses de l'agence ne sont jamais envoyés à l'élève.
4. Ajouter un administrateur : créer l'utilisateur dans Supabase (Authentication > Users), puis l'ajouter à la table `admins` (voir la fin de `schema.sql`).

## Mise à jour hebdomadaire de la liste des universités

Une tâche planifiée revérifie la liste `UNIVERSITES` de `data.js` chaque semaine. Règles :

1. Ne lire les prix que sur des **pages officielles** des universités (domaine `.edu.cn` ou site officiel). Les sites d'agences (CUCAS, SICAS, guides) peuvent servir de piste, jamais de source.
2. Pour chaque entrée vérifiée : mettre à jour `scolarite` (RMB par an ; pour une année de langue, 2 semestres), `verifie` (ex. `"nov. 2026"`, ou `"page de 2025"` si la page n'est pas de l'année en cours) et `source` (lien exact).
3. Un prix introuvable sur une page officielle reste `verifie: false` (affiché « Estimation à confirmer »). Ne jamais inventer un prix ni une source.
4. Ajouter de nouvelles formations utiles aux étudiants africains (médecine, pharmacie, informatique, génie, commerce, langue chinoise, masters), en priorité celles demandées via « + Autre ».
5. `selectivite` (1 sûr à 4 très sélective) et `moyenneMin` sont des estimations de l'agence : rester prudent (universités du top 10 = 3 ou 4).
6. Le dortoir et la vie quotidienne sont des estimations, sauf si la page officielle donne le prix.
7. Vérifier que le site marche (`node --check app.js`, simulateur testé), puis faire un commit sur la branche du projet.
