// =====================================================
//  DONNÉES DU SITE — à mettre à jour par l'agence
// =====================================================

// Coordonnées (numéro WhatsApp au format international, sans + ni espaces)
const WHATSAPP_NUMERO = "8617822243713";
const WHATSAPP_AFFICHE = "+86 178 2224 3713";

// Lien vers l'espace agence (privé : seul le propriétaire du compte claude.ai peut l'ouvrir)
const LIEN_ESPACE_AGENCE = "https://claude.ai/artifact/DyeMoi5zp4FKGpN2HMqGqF";
const EMAIL_CONTACT = "contact@reussite-internationale.com";

// Taux de conversion utilisé pour les estimations (à revérifier régulièrement)
const TAUX_RMB_FCFA = 86;

// Pack de l'agence
const PACK = {
  total: 1500000,
  tranches: [
    { montant: 500000, quand: "À la signature du contrat" },
    { montant: 700000, quand: "À l'admission + JW202" },
    { montant: 300000, quand: "Au visa X1, avant le vol" },
  ],
};

// -----------------------------------------------------
//  Universités utilisées par le simulateur
//  - scolarite / dortoir : en RMB par an
//  - vie : budget de vie estimé par mois (nourriture, transport, téléphone), en RMB
//  - selectivite : 1 = vœu sûr, 2 = équilibre, 3 = ambitieux, 4 = très sélective
//  - moyenneMin : moyenne /20 à partir de laquelle les chances sont correctes
//  - verifie : true si la scolarité a été vérifiée sur le site officiel (avec la date)
//    false = estimation à confirmer avant de la donner à un client
// -----------------------------------------------------
const UNIVERSITES = [
  // Aéronautique — scolarités vérifiées en novembre 2026
  { nom: "Shenyang Aerospace University (SAU)", ville: "Shenyang", domaine: "Aéronautique", niveau: "Licence", programme: "Ingénierie aéronautique", langue: "Anglais", duree: "4 ans", scolarite: 18000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 10, verifie: "nov. 2026" },
  { nom: "Nanjing University of Aeronautics and Astronautics (NUAA)", ville: "Nanjing", domaine: "Aéronautique", niveau: "Licence", programme: "Ingénierie aérospatiale", langue: "Anglais", duree: "4 ans", scolarite: 23900, dortoir: 4000, vie: 1600, selectivite: 2, moyenneMin: 12, verifie: "nov. 2026" },
  { nom: "Northwestern Polytechnical University (NPU)", ville: "Xi'an", domaine: "Aéronautique", niveau: "Licence", programme: "Ingénierie aéronautique", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 5000, vie: 1500, selectivite: 3, moyenneMin: 13.5, verifie: "nov. 2026" },
  { nom: "Beihang University", ville: "Pékin", domaine: "Aéronautique", niveau: "Licence", programme: "Ingénierie aéronautique", langue: "Anglais", duree: "4 ans", scolarite: 30000, dortoir: 9000, vie: 2200, selectivite: 4, moyenneMin: 15, verifie: "nov. 2026" },

  // Estimations à confirmer
  { nom: "Jiangsu University", ville: "Zhenjiang", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 32000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 11, verifie: false },
  { nom: "China Medical University", ville: "Shenyang", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 38000, dortoir: 6000, vie: 1500, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Wenzhou Medical University", ville: "Wenzhou", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 35000, dortoir: 6000, vie: 1700, selectivite: 2, moyenneMin: 12.5, verifie: false },
  { nom: "Nanjing University of Information Science and Technology", ville: "Nanjing", domaine: "Informatique et génie", niveau: "Licence", programme: "Informatique", langue: "Anglais", duree: "4 ans", scolarite: 20000, dortoir: 4500, vie: 1600, selectivite: 1, moyenneMin: 10, verifie: false },
  { nom: "Wuhan University of Technology", ville: "Wuhan", domaine: "Informatique et génie", niveau: "Licence", programme: "Informatique / Génie civil", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 5000, vie: 1500, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Harbin Institute of Technology", ville: "Harbin", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie mécanique / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 28000, dortoir: 6000, vie: 1500, selectivite: 3, moyenneMin: 14, verifie: false },
  { nom: "Dalian University of Technology", ville: "Dalian", domaine: "Commerce et gestion", niveau: "Licence", programme: "Commerce international", langue: "Anglais", duree: "4 ans", scolarite: 24000, dortoir: 6000, vie: 1600, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Shanghai University", ville: "Shanghai", domaine: "Commerce et gestion", niveau: "Licence", programme: "Gestion / Économie", langue: "Anglais", duree: "4 ans", scolarite: 24000, dortoir: 9000, vie: 2400, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Wuhan University of Technology", ville: "Wuhan", domaine: "Informatique et génie", niveau: "Master", programme: "Master Informatique", langue: "Anglais", duree: "2 à 3 ans", scolarite: 26000, dortoir: 5000, vie: 1500, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Nanjing University of Aeronautics and Astronautics (NUAA)", ville: "Nanjing", domaine: "Aéronautique", niveau: "Master", programme: "Master Ingénierie aérospatiale", langue: "Anglais", duree: "2 à 3 ans", scolarite: 30000, dortoir: 4000, vie: 1600, selectivite: 3, moyenneMin: 13, verifie: false },
  { nom: "Dalian University of Technology", ville: "Dalian", domaine: "Commerce et gestion", niveau: "Master", programme: "MBA international", langue: "Anglais", duree: "2 ans", scolarite: 40000, dortoir: 6000, vie: 1600, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Tianjin Normal University", ville: "Tianjin", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois intensif (1 an)", langue: "Chinois", duree: "1 an", scolarite: 16000, dortoir: 6000, vie: 1700, selectivite: 1, moyenneMin: 8, verifie: false },
  { nom: "Beijing Language and Culture University", ville: "Pékin", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois intensif (1 an)", langue: "Chinois", duree: "1 an", scolarite: 26000, dortoir: 12000, vie: 2200, selectivite: 1, moyenneMin: 8, verifie: false },
];

// -----------------------------------------------------
//  Espace élève — DONNÉES DE DÉMONSTRATION
//  Attention : ce fichier est public. Pour de vrais élèves, il faudra relier
//  le site à une base de données privée (étape suivante).
//  sexe : "F" ou "M" (choisit l'avatar)
//  etape : 1 Diagnostic, 2 Choix des vœux, 3 Dossier, 4 Admission et visa, 5 Accueil en Chine
//  paiements : liste libre (le nombre de tranches et les montants peuvent changer)
// -----------------------------------------------------
const DOSSIERS = {
  "RI-DEMO-1": {
    prenom: "Aïcha", sexe: "F", universite: "Nanjing University of Aeronautics and Astronautics (NUAA)", programme: "Licence Ingénierie aérospatiale", ville: "Nanjing",
    etape: 3, maj: "18 nov. 2026",
    prochaine: "Envoyer la traduction certifiée de votre relevé de notes du bac.",
    paiements: [
      { libelle: "À la signature", montant: 500000, payee: true },
      { libelle: "À l'admission + JW202", montant: 700000, payee: false },
      { libelle: "Au visa X1, avant le vol", montant: 300000, payee: false },
    ],
    documents: [
      { nom: "Passeport", ok: true }, { nom: "Diplôme et relevés du bac", ok: true },
      { nom: "Lettre de motivation (Study Plan)", ok: true }, { nom: "Traduction certifiée du relevé", ok: false },
      { nom: "Certificat médical", ok: false }, { nom: "Casier judiciaire", ok: false },
    ],
  },
  "RI-DEMO-2": {
    prenom: "Koffi", sexe: "M", universite: "Shenyang Aerospace University (SAU)", programme: "Licence Ingénierie aéronautique", ville: "Shenyang",
    etape: 4, maj: "20 nov. 2026",
    prochaine: "Rendez-vous au centre des visas pour déposer votre demande de visa X1.",
    paiements: [
      { libelle: "Acompte", montant: 400000, payee: true },
      { libelle: "Deuxième versement", montant: 400000, payee: true },
      { libelle: "Troisième versement", montant: 400000, payee: false },
      { libelle: "Solde avant le vol", montant: 300000, payee: false },
    ],
    documents: [
      { nom: "Passeport", ok: true }, { nom: "Admission Notice", ok: true }, { nom: "Formulaire JW202", ok: true },
      { nom: "Photos d'identité", ok: true }, { nom: "Formulaire de visa rempli", ok: false },
    ],
  },
  "RI-DEMO-3": {
    prenom: "Mariam", sexe: "F", universite: "Jiangsu University", programme: "Médecine générale (MBBS)", ville: "Zhenjiang",
    etape: 5, termine: true, maj: "15 nov. 2026",
    prochaine: "Bienvenue en Chine ! Ouverture de votre compte bancaire cette semaine.",
    paiements: [
      { libelle: "À la signature", montant: 500000, payee: true },
      { libelle: "À l'admission + JW202", montant: 700000, payee: true },
      { libelle: "Au visa X1, avant le vol", montant: 300000, payee: true },
    ],
    documents: [
      { nom: "Visa X1", ok: true }, { nom: "Billet d'avion", ok: true }, { nom: "Carte SIM chinoise", ok: true },
      { nom: "Compte bancaire", ok: false }, { nom: "Permis de séjour", ok: false },
    ],
  },
};

const ETAPES = [
  { titre: "Diagnostic", texte: "Entretien de 30 min : notes, anglais, budget, passeport.", rassure: "Nous faisons connaissance et vérifions ensemble les possibilités." },
  { titre: "Choix des vœux", texte: "3 universités : une sûre, une équilibrée, une ambitieuse.", rassure: "Nous choisissons avec vous les universités qui vous correspondent." },
  { titre: "Dossier", texte: "Traductions, lettre de motivation, recommandations, dépôt.", rassure: "Votre dossier est en préparation. Nous vérifions chaque document avant l'envoi." },
  { titre: "Admission et visa", texte: "Admission Notice, formulaire JW202, puis visa X1.", rassure: "L'université a répondu : nous vous accompagnons pour le visa." },
  { titre: "Accueil en Chine", texte: "Aéroport, dortoir, banque, carte SIM, permis de séjour.", rassure: "Vous êtes en Chine ! Nous vous aidons à bien vous installer." },
];
