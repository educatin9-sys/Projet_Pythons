// =====================================================
//  DONNÉES DU SITE — à mettre à jour par l'agence
// =====================================================

// Coordonnées (numéro WhatsApp au format international, sans + ni espaces)
const WHATSAPP_NUMERO = "8617822243713";
const WHATSAPP_AFFICHE = "+86 178 2224 3713";

const EMAIL_CONTACT = "educatin9@gmail.com";

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
//  - verifie : date à laquelle la scolarité a été lue sur une page officielle
//    (ex. "nov. 2026"), ou false = estimation à confirmer avant de la donner à un client
//  - source : lien de la page officielle où le prix a été lu (quand il existe)
//  - Le dortoir est une estimation sauf mention contraire.
//  Liste actualisée chaque semaine par une tâche planifiée (voir README).
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

  // ---- Ajouts du 21 nov. 2026 : scolarités lues sur les pages officielles ----
  // Médecine
  { nom: "Xiamen University", ville: "Xiamen", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 38000, dortoir: 7000, vie: 1800, selectivite: 3, moyenneMin: 13.5, verifie: "nov. 2026", source: "https://mbbs.xmu.edu.cn/info/1211/3755.htm" },
  { nom: "Xi'an Jiaotong University", ville: "Xi'an", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 40000, dortoir: 6000, vie: 1500, selectivite: 3, moyenneMin: 13.5, verifie: "nov. 2026", source: "https://sie.xjtu.edu.cn/en/YXBK.pdf" },
  // Pharmacie
  { nom: "Jiangsu University", ville: "Zhenjiang", domaine: "Pharmacie", niveau: "Licence", programme: "Pharmacie", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 10.5, verifie: "nov. 2026", source: "https://oec.ujs.edu.cn/en/PROGRAMS/Bachelor.htm" },
  { nom: "China Pharmaceutical University", ville: "Nanjing", domaine: "Pharmacie", niveau: "Licence", programme: "Pharmacie / Pharmacie clinique", langue: "Anglais", duree: "4 ans", scolarite: 25000, dortoir: 6000, vie: 1600, selectivite: 2, moyenneMin: 12, verifie: "nov. 2026", source: "https://international.cpu.edu.cn/5b/d7/c399a89047/page.psp" },
  // Informatique et génie
  { nom: "Jiangsu University", ville: "Zhenjiang", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie civil", langue: "Anglais", duree: "4 ans", scolarite: 20000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 10, verifie: "nov. 2026", source: "https://oec.ujs.edu.cn/en/PROGRAMS/Bachelor.htm" },
  { nom: "Shanghai University of Engineering Science (SUES)", ville: "Shanghai", domaine: "Informatique et génie", niveau: "Licence", programme: "Intelligence artificielle", langue: "Anglais", duree: "4 ans", scolarite: 20000, dortoir: 1200, vie: 2400, selectivite: 1, moyenneMin: 10.5, verifie: "nov. 2026", source: "https://cie.sues.edu.cn/21908/list.htm" },
  { nom: "China University of Petroleum (Beijing)", ville: "Pékin", domaine: "Informatique et génie", niveau: "Licence", programme: "Informatique", langue: "Chinois et anglais", duree: "4 ans", scolarite: 25000, dortoir: 9000, vie: 2200, selectivite: 2, moyenneMin: 12, verifie: "nov. 2026", source: "https://cup.edu.cn/overseas/Admission/UP2/54ab5d4b8d334aa895da43a3b2bf428a.htm" },
  { nom: "Tsinghua University", ville: "Pékin", domaine: "Informatique et génie", niveau: "Licence", programme: "Informatique", langue: "Chinois et anglais", duree: "4 ans", scolarite: 30000, dortoir: 10000, vie: 2200, selectivite: 4, moyenneMin: 16, verifie: "page de sept. 2025", source: "https://international.join-tsinghua.edu.cn/info/1027/1020.htm" },
  { nom: "Tongji University", ville: "Shanghai", domaine: "Informatique et génie", niveau: "Master", programme: "Master Génie civil", langue: "Anglais", duree: "2 à 3 ans", scolarite: 35000, dortoir: 9000, vie: 2400, selectivite: 3, moyenneMin: 13, verifie: "page non datée", source: "https://study.tongji.edu.cn/en/CURRENT_STUDENTS/Free_Costs.htm" },
  // Commerce et gestion
  { nom: "Jiangsu University", ville: "Zhenjiang", domaine: "Commerce et gestion", niveau: "Licence", programme: "Économie et commerce international", langue: "Anglais", duree: "4 ans", scolarite: 18000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 10, verifie: "nov. 2026", source: "https://oec.ujs.edu.cn/en/PROGRAMS/Bachelor.htm" },
  { nom: "Zhejiang Gongshang University", ville: "Hangzhou", domaine: "Commerce et gestion", niveau: "Licence", programme: "Commerce international", langue: "Anglais", duree: "4 ans", scolarite: 18000, dortoir: 6000, vie: 1800, selectivite: 1, moyenneMin: 10, verifie: "nov. 2026", source: "https://sie.zjgsu.edu.cn/_upload/article/files/6c/86/85acca5748aab66706c31ef18d27/c549f768-d773-43ff-a345-9a59341f8150.pdf" },
  { nom: "Zhejiang Gongshang University", ville: "Hangzhou", domaine: "Commerce et gestion", niveau: "Master", programme: "Master Gestion des entreprises", langue: "Anglais", duree: "2 ans", scolarite: 25000, dortoir: 6000, vie: 1800, selectivite: 1, moyenneMin: 11, verifie: "nov. 2026", source: "https://sie.zjgsu.edu.cn/_upload/article/files/ce/00/f0aead0342bf8c9eb1bf8b66429b/1717e06d-3d1f-44c6-aafc-2f4b5bea003a.pdf" },
  // Année de langue chinoise (prix d'une année = 2 semestres)
  { nom: "Northwest A&F University", ville: "Yangling", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 12800, dortoir: 4000, vie: 1300, selectivite: 1, moyenneMin: 8, verifie: "nov. 2026", source: "https://gjs.nwafu.edu.cn/en/ApplicationGuide/fcfa62743393434a8fd599efa0cc5474.htm" },
  { nom: "Nankai University", ville: "Tianjin", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 14000, dortoir: 7000, vie: 1700, selectivite: 1, moyenneMin: 8, verifie: "nov. 2026", source: "https://ensie.nankai.edu.cn/info/1077/1132.htm" },
  { nom: "Zhejiang University", ville: "Hangzhou", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 18000, dortoir: 9000, vie: 1800, selectivite: 1, moyenneMin: 9, verifie: "nov. 2026", source: "https://iczu.zju.edu.cn/admissionsen/whinesewwanguagewwwwulturewwrograms/list.htm" },
  { nom: "Shanghai Jiao Tong University", ville: "Shanghai", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 21000, dortoir: 12000, vie: 2400, selectivite: 1, moyenneMin: 9, verifie: "nov. 2026", source: "https://en.sjtu.edu.cn/news-events/notice/2626" },
  { nom: "Donghua University", ville: "Shanghai", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois général (1 an)", langue: "Chinois", duree: "1 an", scolarite: 21600, dortoir: 10000, vie: 2400, selectivite: 1, moyenneMin: 8, verifie: "nov. 2026", source: "https://english.dhu.edu.cn/2021/0702/c5220a372805/page.htm" },
  { nom: "Beijing Normal University", ville: "Pékin", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 22400, dortoir: 12000, vie: 2200, selectivite: 1, moyenneMin: 9, verifie: "nov. 2026", source: "https://admission-is.bnu.edu.cn/english/admissionprogram/nondegreeprogram/chineselearningprogram/index.html" },
  { nom: "East China Normal University", ville: "Shanghai", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois standard (1 an)", langue: "Chinois", duree: "1 an", scolarite: 24000, dortoir: 12000, vie: 2400, selectivite: 1, moyenneMin: 8, verifie: "nov. 2026", source: "https://lxs.ecnu.edu.cn/en_admission_chinese_language_programs_standard_chinese_language_program/list.htm" },
  { nom: "Xiamen University", ville: "Xiamen", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 26000, dortoir: 8000, vie: 1800, selectivite: 1, moyenneMin: 8, verifie: "nov. 2026", source: "https://oec.xmu.edu.cn/en/Program1/Chinese_Language_Programs.htm" },
  // ---- Ajouts du 21 nov. 2026 (2e vague) : formations les plus demandées ----
  // verifie = page officielle ; false = chiffre de sites d'agences ou estimation, à confirmer
  { nom: "Fudan University", ville: "Shanghai", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 75000, dortoir: 12000, vie: 2400, selectivite: 4, moyenneMin: 15.5, verifie: "nov. 2026 (prix indicatif)", source: "https://iso.fudan.edu.cn/_upload/article/files/5f/66/4aee2d0c4b389ec2d922de9dc6d3/f3254ec3-a06d-43bb-8c5c-8b05daf9124b.pdf" },
  { nom: "Wuhan University", ville: "Wuhan", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 40000, dortoir: 6000, vie: 1600, selectivite: 3, moyenneMin: 14, verifie: false },
  { nom: "Tianjin Medical University", ville: "Tianjin", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 48000, dortoir: 7000, vie: 1700, selectivite: 3, moyenneMin: 13.5, verifie: false },
  { nom: "Southeast University", ville: "Nanjing", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 32800, dortoir: 6000, vie: 1600, selectivite: 3, moyenneMin: 13.5, verifie: false },
  { nom: "Harbin Medical University", ville: "Harbin", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 30000, dortoir: 5000, vie: 1400, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Huazhong University of Science and Technology", ville: "Wuhan", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 38000, dortoir: 6000, vie: 1600, selectivite: 3, moyenneMin: 14, verifie: false },
  { nom: "Central South University", ville: "Changsha", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 35000, dortoir: 6000, vie: 1500, selectivite: 3, moyenneMin: 13.5, verifie: false },
  { nom: "Sichuan University", ville: "Chengdu", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 45000, dortoir: 7000, vie: 1600, selectivite: 3, moyenneMin: 14, verifie: false },
  { nom: "Dalian Medical University", ville: "Dalian", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 30000, dortoir: 6000, vie: 1600, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Zhengzhou University", ville: "Zhengzhou", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 35000, dortoir: 5000, vie: 1400, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Jilin University", ville: "Changchun", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 37000, dortoir: 5000, vie: 1400, selectivite: 2, moyenneMin: 12.5, verifie: false },
  { nom: "Nanjing Medical University", ville: "Nanjing", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 40000, dortoir: 6000, vie: 1600, selectivite: 2, moyenneMin: 12.5, verifie: false },
  { nom: "Chongqing Medical University", ville: "Chongqing", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 40000, dortoir: 5500, vie: 1500, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Hebei Medical University", ville: "Shijiazhuang", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 33000, dortoir: 5000, vie: 1300, selectivite: 1, moyenneMin: 11, verifie: false },
  { nom: "Ningbo University", ville: "Ningbo", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 30000, dortoir: 6000, vie: 1700, selectivite: 1, moyenneMin: 11, verifie: false },
  { nom: "Qingdao University", ville: "Qingdao", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 35000, dortoir: 6000, vie: 1600, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Guangxi Medical University", ville: "Nanning", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 30000, dortoir: 4500, vie: 1300, selectivite: 1, moyenneMin: 10.5, verifie: false },
  { nom: "Kunming Medical University", ville: "Kunming", domaine: "Médecine", niveau: "Licence", programme: "Médecine générale (MBBS)", langue: "Anglais", duree: "6 ans", scolarite: 28000, dortoir: 4500, vie: 1300, selectivite: 1, moyenneMin: 10.5, verifie: false },
  { nom: "Peking University", ville: "Pékin", domaine: "Informatique et génie", niveau: "Licence", programme: "Sciences (informatique, mathématiques…)", langue: "Chinois", duree: "4 ans", scolarite: 30000, dortoir: 10000, vie: 2200, selectivite: 4, moyenneMin: 16, verifie: "page de 2024", source: "https://isd.pku.edu.cn/en/detail.php?id=746" },
  { nom: "Beijing Foreign Studies University", ville: "Pékin", domaine: "Informatique et génie", niveau: "Licence", programme: "Informatique (intelligence du langage)", langue: "Anglais", duree: "4 ans", scolarite: 26000, dortoir: 10000, vie: 2200, selectivite: 3, moyenneMin: 13.5, verifie: "nov. 2026", source: "https://osao.bfsu.edu.cn/info/2612/6772.htm" },
  { nom: "Shandong University", ville: "Jinan", domaine: "Informatique et génie", niveau: "Licence", programme: "Informatique", langue: "Chinois", duree: "4 ans", scolarite: 21000, dortoir: 6000, vie: 1500, selectivite: 3, moyenneMin: 13, verifie: "page 2025-2026", source: "https://www.istudy.sdu.edu.cn/__local/7/E9/3A/E4D038690FB3B70B43E971AEFED_46632763_185DE.pdf" },
  { nom: "University of Jinan", ville: "Jinan", domaine: "Informatique et génie", niveau: "Licence", programme: "Programmes en anglais (ingénierie)", langue: "Anglais", duree: "4 ans", scolarite: 20000, dortoir: 5000, vie: 1400, selectivite: 1, moyenneMin: 10, verifie: "page d'oct. 2025", source: "https://isao.ujn.edu.cn/English/HOME/FEES_AND_PAYMENT.htm" },
  { nom: "Beijing Institute of Technology", ville: "Pékin", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie mécanique / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 30000, dortoir: 10000, vie: 2200, selectivite: 3, moyenneMin: 14, verifie: false },
  { nom: "University of Science and Technology Beijing", ville: "Pékin", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie des matériaux / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 23300, dortoir: 9000, vie: 2200, selectivite: 2, moyenneMin: 12.5, verifie: false },
  { nom: "Beijing Jiaotong University", ville: "Pékin", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie électrique / Transports", langue: "Anglais", duree: "4 ans", scolarite: 33800, dortoir: 9000, vie: 2200, selectivite: 3, moyenneMin: 13, verifie: false },
  { nom: "Wuhan University of Technology", ville: "Wuhan", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie électrique", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 5000, vie: 1500, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Nanjing University of Science and Technology", ville: "Nanjing", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie mécanique / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 24000, dortoir: 5500, vie: 1600, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Hohai University", ville: "Nanjing", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie civil / hydraulique", langue: "Anglais", duree: "4 ans", scolarite: 24000, dortoir: 5500, vie: 1600, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Chang'an University", ville: "Xi'an", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie civil / Routes et ponts", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 5000, vie: 1400, selectivite: 1, moyenneMin: 10.5, verifie: false },
  { nom: "Harbin Engineering University", ville: "Harbin", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie naval / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 5000, vie: 1400, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Jiangnan University", ville: "Wuxi", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie alimentaire / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 5500, vie: 1600, selectivite: 1, moyenneMin: 10.5, verifie: false },
  { nom: "Zhejiang University of Technology", ville: "Hangzhou", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie mécanique / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 6000, vie: 1800, selectivite: 1, moyenneMin: 10.5, verifie: false },
  { nom: "Hunan University", ville: "Changsha", domaine: "Informatique et génie", niveau: "Licence", programme: "Génie civil / Informatique", langue: "Anglais", duree: "4 ans", scolarite: 26000, dortoir: 6000, vie: 1500, selectivite: 3, moyenneMin: 13, verifie: false },
  { nom: "Tongji University", ville: "Shanghai", domaine: "Informatique et génie", niveau: "Licence", programme: "Architecture", langue: "Anglais", duree: "5 ans", scolarite: 33800, dortoir: 9000, vie: 2400, selectivite: 3, moyenneMin: 13.5, verifie: false },
  { nom: "Northeast Forestry University", ville: "Harbin", domaine: "Informatique et génie", niveau: "Licence", programme: "Informatique / Génie civil", langue: "Anglais", duree: "4 ans", scolarite: 18000, dortoir: 4500, vie: 1300, selectivite: 1, moyenneMin: 10, verifie: false },
  { nom: "University of International Business and Economics (UIBE)", ville: "Pékin", domaine: "Commerce et gestion", niveau: "Licence", programme: "Commerce international / Économie", langue: "Anglais", duree: "4 ans", scolarite: 49750, dortoir: 10000, vie: 2200, selectivite: 3, moyenneMin: 13.5, verifie: "page de 2024", source: "https://sie.uibe.edu.cn/en/docs//2024-06/ec6865deead541938d1eae13956ebbe5.pdf" },
  { nom: "Beijing Foreign Studies University", ville: "Pékin", domaine: "Commerce et gestion", niveau: "Licence", programme: "Gestion (marketing international)", langue: "Anglais", duree: "4 ans", scolarite: 39900, dortoir: 10000, vie: 2200, selectivite: 3, moyenneMin: 13, verifie: "nov. 2026", source: "https://osao.bfsu.edu.cn/info/2612/6772.htm" },
  { nom: "Nanjing University of Finance and Economics", ville: "Nanjing", domaine: "Commerce et gestion", niveau: "Licence", programme: "Gestion des entreprises", langue: "Anglais", duree: "4 ans", scolarite: 17000, dortoir: 5500, vie: 1600, selectivite: 1, moyenneMin: 10, verifie: false },
  { nom: "Wuhan University of Technology", ville: "Wuhan", domaine: "Commerce et gestion", niveau: "Licence", programme: "Économie et commerce international", langue: "Anglais", duree: "4 ans", scolarite: 20000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 10.5, verifie: false },
  { nom: "Shanghai University of International Business and Economics", ville: "Shanghai", domaine: "Commerce et gestion", niveau: "Licence", programme: "Commerce international", langue: "Anglais", duree: "4 ans", scolarite: 25000, dortoir: 9000, vie: 2400, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Dongbei University of Finance and Economics", ville: "Dalian", domaine: "Commerce et gestion", niveau: "Licence", programme: "Finance / Comptabilité", langue: "Anglais", duree: "4 ans", scolarite: 24000, dortoir: 6000, vie: 1600, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Jiangxi University of Finance and Economics", ville: "Nanchang", domaine: "Commerce et gestion", niveau: "Licence", programme: "Commerce international", langue: "Anglais", duree: "4 ans", scolarite: 18000, dortoir: 4500, vie: 1300, selectivite: 1, moyenneMin: 10, verifie: false },
  { nom: "Dalian Maritime University", ville: "Dalian", domaine: "Commerce et gestion", niveau: "Licence", programme: "Logistique / Transport maritime", langue: "Anglais", duree: "4 ans", scolarite: 22000, dortoir: 6000, vie: 1600, selectivite: 1, moyenneMin: 10.5, verifie: false },
  { nom: "Peking University", ville: "Pékin", domaine: "Informatique et génie", niveau: "Master", programme: "Master Informatique", langue: "Anglais", duree: "3 ans", scolarite: 50000, dortoir: 10000, vie: 2200, selectivite: 4, moyenneMin: 15.5, verifie: "nov. 2026", source: "https://isd.pku.edu.cn/en/detail.php?id=739" },
  { nom: "Zhejiang University", ville: "Hangzhou", domaine: "Informatique et génie", niveau: "Master", programme: "Master Informatique", langue: "Anglais", duree: "3 ans", scolarite: 36800, dortoir: 9000, vie: 1800, selectivite: 4, moyenneMin: 15, verifie: "nov. 2026", source: "https://iczu.zju.edu.cn/_upload/article/files/32/c1/d48dfe1349279755c872b98ce7e1/aae5a919-1f07-4115-bb1c-db41ea36e1b0.pdf" },
  { nom: "Zhejiang University", ville: "Hangzhou", domaine: "Informatique et génie", niveau: "Master", programme: "Master Électronique / Circuits intégrés", langue: "Anglais", duree: "3 ans", scolarite: 36800, dortoir: 9000, vie: 1800, selectivite: 4, moyenneMin: 15, verifie: "nov. 2026", source: "https://iczu.zju.edu.cn/_upload/article/files/32/c1/d48dfe1349279755c872b98ce7e1/aae5a919-1f07-4115-bb1c-db41ea36e1b0.pdf" },
  { nom: "Zhejiang University", ville: "Hangzhou", domaine: "Informatique et génie", niveau: "Master", programme: "Master Automatique (contrôle)", langue: "Anglais", duree: "3 ans", scolarite: 36800, dortoir: 9000, vie: 1800, selectivite: 4, moyenneMin: 15, verifie: "nov. 2026", source: "https://iczu.zju.edu.cn/_upload/article/files/32/c1/d48dfe1349279755c872b98ce7e1/aae5a919-1f07-4115-bb1c-db41ea36e1b0.pdf" },
  { nom: "Peking University", ville: "Pékin", domaine: "Commerce et gestion", niveau: "Master", programme: "Global MBA (Guanghua)", langue: "Anglais", duree: "2 ans", scolarite: 94000, dortoir: 10000, vie: 2200, selectivite: 4, moyenneMin: 15, verifie: "nov. 2026 (188 000 RMB au total)", source: "https://isd.pku.edu.cn/en/detail.php?id=746" },
  { nom: "Northwestern Polytechnical University (NPU)", ville: "Xi'an", domaine: "Aéronautique", niveau: "Master", programme: "Master Ingénierie aéronautique", langue: "Anglais", duree: "2 à 3 ans", scolarite: 33000, dortoir: 5000, vie: 1500, selectivite: 3, moyenneMin: 13, verifie: false },
  { nom: "Beijing Jiaotong University", ville: "Pékin", domaine: "Informatique et génie", niveau: "Master", programme: "Master Génie logiciel", langue: "Anglais", duree: "2 à 3 ans", scolarite: 35000, dortoir: 9000, vie: 2200, selectivite: 3, moyenneMin: 13, verifie: false },
  { nom: "Chongqing University", ville: "Chongqing", domaine: "Informatique et génie", niveau: "Master", programme: "Master Génie civil", langue: "Anglais", duree: "2 à 3 ans", scolarite: 35000, dortoir: 6000, vie: 1500, selectivite: 3, moyenneMin: 13, verifie: "page de 2023", source: "https://study.cqu.edu.cn/e2023/Application/Tuition_and_Accommodation_Fees.htm" },
  { nom: "Hohai University", ville: "Nanjing", domaine: "Informatique et génie", niveau: "Master", programme: "Master Génie hydraulique", langue: "Anglais", duree: "2 à 3 ans", scolarite: 30000, dortoir: 5500, vie: 1600, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Jiangsu University", ville: "Zhenjiang", domaine: "Informatique et génie", niveau: "Master", programme: "Master Informatique", langue: "Anglais", duree: "3 ans", scolarite: 25000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 11, verifie: false },
  { nom: "Wuhan University of Technology", ville: "Wuhan", domaine: "Commerce et gestion", niveau: "Master", programme: "MBA international", langue: "Anglais", duree: "2 ans", scolarite: 30000, dortoir: 5000, vie: 1500, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "China Medical University", ville: "Shenyang", domaine: "Médecine", niveau: "Master", programme: "Master Santé publique", langue: "Anglais", duree: "3 ans", scolarite: 35000, dortoir: 6000, vie: 1500, selectivite: 2, moyenneMin: 12, verifie: false },
  { nom: "Fudan University", ville: "Shanghai", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 21000, dortoir: 12000, vie: 2400, selectivite: 1, moyenneMin: 9, verifie: "nov. 2026 (prix indicatif)", source: "https://iso.fudan.edu.cn/_upload/article/files/6c/1a/768aabfc4c3ea4a07e95870751e5/3b0afe4f-f0c9-4496-80df-9eed6ea61d42.pdf" },
  { nom: "Tongji University", ville: "Shanghai", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 16400, dortoir: 10000, vie: 2400, selectivite: 1, moyenneMin: 8, verifie: false },
  { nom: "Xi'an Jiaotong University", ville: "Xi'an", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 15000, dortoir: 5000, vie: 1500, selectivite: 1, moyenneMin: 8, verifie: false },
  { nom: "Tsinghua University", ville: "Pékin", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 25200, dortoir: 12000, vie: 2200, selectivite: 1, moyenneMin: 9, verifie: false },
  { nom: "Kunming University", ville: "Kunming", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 16000, dortoir: 4000, vie: 1300, selectivite: 1, moyenneMin: 8, verifie: false },
  { nom: "Wuhan University", ville: "Wuhan", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 18000, dortoir: 6000, vie: 1600, selectivite: 1, moyenneMin: 8, verifie: false },
  { nom: "Sun Yat-sen University", ville: "Canton", domaine: "Langue chinoise", niveau: "Année de langue", programme: "Chinois (1 an)", langue: "Chinois", duree: "1 an", scolarite: 22000, dortoir: 9000, vie: 2200, selectivite: 1, moyenneMin: 8, verifie: false },
  { nom: "Shenyang Pharmaceutical University", ville: "Shenyang", domaine: "Pharmacie", niveau: "Licence", programme: "Pharmacie", langue: "Anglais", duree: "4 ans", scolarite: 25000, dortoir: 5000, vie: 1400, selectivite: 2, moyenneMin: 11.5, verifie: false },
  { nom: "Guangdong Pharmaceutical University", ville: "Canton", domaine: "Pharmacie", niveau: "Licence", programme: "Pharmacie", langue: "Anglais", duree: "4 ans", scolarite: 20000, dortoir: 6000, vie: 1800, selectivite: 1, moyenneMin: 10.5, verifie: false },
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
