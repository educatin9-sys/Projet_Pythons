// Logique du site Réussite Internationale (les données sont dans data.js)

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fcfa = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n / 1000) * 1000);
const rmb = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waLink = (texte) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texte)}`;

/* ---------- Navigation entre les écrans ---------- */
const VUES = $$("[data-view]").map((v) => v.dataset.view);

function afficher() {
  const cible = location.hash.slice(1) || "accueil";
  let vue = VUES.includes(cible) ? cible : null;
  let ancre = null;
  if (!vue) {
    ancre = document.getElementById(cible);
    const parent = ancre && ancre.closest("[data-view]");
    vue = parent ? parent.dataset.view : "accueil";
  }
  if (vue === "espace" && !dossierCourant()) { location.replace("#suivi"); return; }
  if (vue === "espace") afficherEspace();
  $$("[data-view]").forEach((v) => (v.hidden = v.dataset.view !== vue));
  const actif = vue === "espace" ? "suivi" : vue;
  $$("[data-link]").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + actif));
  if (ancre) ancre.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo(0, 0);
}
window.addEventListener("hashchange", afficher);

/* ---------- Contenus générés ---------- */
$("#timeline-accueil").innerHTML = ETAPES.map((e) => `<li><h3>${e.titre}</h3><p>${e.texte}</p></li>`).join("");
$("#pack-total").textContent = fcfa(PACK.total);
$("#tranches").innerHTML = PACK.tranches
  .map((t, i) => `<li><span class="num">${i + 1}</span><div><b>${fcfa(t.montant)} FCFA</b><span class="q">${t.quand}</span></div><span class="pct">${Math.round((t.montant / PACK.total) * 100)} %</span></li>`)
  .join("");

const numeroAffiche = WHATSAPP_AFFICHE;
$("#foot-wa").textContent = numeroAffiche;
$("#foot-mail").textContent = EMAIL_CONTACT;
const lienWa = waLink("Bonjour Réussite Internationale, je souhaite étudier en Chine.");
$("#wa-float").href = lienWa;
$$(".js-wa").forEach((a) => (a.href = lienWa));
$("#annee").textContent = new Date().getFullYear();
$("#lien-agence").href = LIEN_ESPACE_AGENCE;

/* ---------- Estimateur de chances ----------
   La liste UNIVERSITES (data.js) sert seulement de base de calcul :
   aucun nom d'université ni nombre d'universités n'est montré au visiteur. */
const choix = { niveau: "Licence", domaine: "Tous", anglais: "2" };

$$(".choices").forEach((groupe) => {
  groupe.addEventListener("click", (e) => {
    const btn = e.target.closest(".choice");
    if (!btn) return;
    $$(".choice", groupe).forEach((b) => b.classList.toggle("active", b === btn));
    choix[groupe.dataset.name] = btn.dataset.value;
    if (groupe.dataset.name === "domaine") majAutre();
    if (groupe.dataset.name === "niveau" && btn.dataset.value === "Année de langue") choisirDans("domaine", "Langue chinoise");
    else if (groupe.dataset.name === "niveau" && choix.domaine === "Langue chinoise") choisirDans("domaine", "Tous");
  });
});
function choisirDans(nom, valeur) {
  const groupe = $(`.choices[data-name="${nom}"]`);
  $$(".choice", groupe).forEach((b) => b.classList.toggle("active", b.dataset.value === valeur));
  choix[nom] = valeur;
  if (nom === "domaine") majAutre();
}
function majAutre() {
  const box = $("#sim-autre-box");
  box.hidden = choix.domaine !== "Autre";
  if (!box.hidden) $("#sim-autre").focus();
}

const moyenneInput = $("#sim-moyenne");
moyenneInput.addEventListener("input", () => ($("#sim-moyenne-out").textContent = `${moyenneInput.value.replace(".", ",")} / 20`));
const budgetInput = $("#sim-budget");
const budgetTexte = () => (+budgetInput.value >= 8000000 ? "8 000 000 FCFA et plus" : `${fcfa(+budgetInput.value)} FCFA`);
budgetInput.addEventListener("input", () => ($("#sim-budget-out").textContent = budgetTexte()));

const sansAccent = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const moyenneDe = (l) => l.reduce((s, x) => s + x, 0) / l.length;

// Probabilité d'être admis dans UNE formation, selon l'écart entre la moyenne et le niveau demandé
function probaUne(u, moyenne, anglais) {
  let ecart = moyenne - u.moyenneMin;
  if (u.langue !== "Chinois") ecart += anglais === 1 ? -1.5 : anglais === 3 ? 0.5 : 0;
  if (u.selectivite === 4) ecart -= 0.5;
  return 1 / (1 + Math.exp(-0.9 * ecart));
}

// Paliers de coût : plus c'est cher, plus c'est prestigieux (jamais « mauvais »)
function palier(coutFcfa) {
  if (coutFcfa <= 2200000) return { cls: "t-vert", emoji: "💚", label: "Budget accessible" };
  if (coutFcfa <= 3300000) return { cls: "t-jaune", emoji: "⭐", label: "Budget confort" };
  return { cls: "t-rouge", emoji: "👑", label: "Budget prestige" };
}
function niveauChance(p) {
  if (p >= 0.75) return { cls: "c-top", emoji: "🔥🔥🔥", label: "Très bonnes chances" };
  if (p >= 0.5) return { cls: "c-bon", emoji: "🔥🔥", label: "Bonnes chances" };
  if (p >= 0.3) return { cls: "c-moy", emoji: "🔥", label: "Chances réelles" };
  return { cls: "c-ambi", emoji: "🚀", label: "Projet ambitieux" };
}

function jauge(pct, cls) {
  const r = 52, c = 2 * Math.PI * r;
  return `<div class="ring-wrap"><svg viewBox="0 0 120 120" class="ring ${cls}" aria-hidden="true">
    <circle cx="60" cy="60" r="${r}" class="ring-bg"/><circle cx="60" cy="60" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${c * (1 - pct / 100)}"/>
  </svg><div class="ring-txt"><b>${pct} %</b><span>d'admission</span></div></div>`;
}

$("#sim-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const moyenne = parseFloat(moyenneInput.value);
  const anglais = parseInt(choix.anglais, 10);
  const budget = +budgetInput.value >= 8000000 ? Infinity : +budgetInput.value;
  const age = parseInt($("#sim-age").value, 10) || 0;
  const zone = $("#sim-results");
  const autre = choix.domaine === "Autre" ? $("#sim-autre").value.trim() : "";
  if (choix.domaine === "Autre" && !autre) {
    $("#sim-autre").focus();
    zone.innerHTML = `<div class="alert">Écrivez la formation que vous cherchez dans le champ prévu.</div>`;
    return;
  }

  // Base de calcul : même niveau ; même domaine si on le connaît
  let base = UNIVERSITES.filter((u) => u.niveau === choix.niveau);
  let precision = "domaine";
  if (choix.domaine !== "Tous" && choix.domaine !== "Autre") base = base.filter((u) => u.domaine === choix.domaine);
  if (autre) {
    const mots = sansAccent(autre).split(/[\s,/'-]+/).filter((m) => m.length > 3);
    const proches = base.filter((u) => mots.some((m) => sansAccent(`${u.programme} ${u.domaine}`).includes(m)));
    if (proches.length >= 3) base = proches; else precision = "general";
  }
  if (!base.length) base = UNIVERSITES.filter((u) => u.niveau === choix.niveau);

  const couts = base.map((u) => (u.scolarite + u.dortoir) * TAUX_RMB_FCFA).sort((a, b) => a - b);
  const vieAn = moyenneDe(base.map((u) => u.vie * 12 * TAUX_RMB_FCFA));
  const coutMoyen = moyenneDe(couts);
  const bas = couts[Math.floor(couts.length * 0.15)], haut = couts[Math.min(couts.length - 1, Math.floor(couts.length * 0.85))];

  // Chances : on suppose 3 candidatures choisies dans le budget (ou les moins chères si le budget est serré)
  const probas = base.map((u) => ({ p: probaUne(u, moyenne, anglais), cout: (u.scolarite + u.dortoir) * TAUX_RMB_FCFA }));
  let pool = probas.filter((x) => x.cout <= budget);
  const budgetSerre = pool.length < 3;
  if (budgetSerre) pool = [...probas].sort((a, b) => a.cout - b.cout).slice(0, 3);
  const meilleures = pool.map((x) => x.p).sort((a, b) => b - a).slice(0, 3);
  // Les candidatures ne sont pas indépendantes (même dossier) : chacune ne compte qu'à 60 %
  const pAdmission = 1 - meilleures.reduce((acc, p) => acc * (1 - 0.6 * p), 1);
  const pct = Math.max(5, Math.min(90, Math.round(pAdmission * 100)));
  const couverture = Math.round((probas.filter((x) => x.cout <= budget).length / probas.length) * 100);

  const ch = niveauChance(pct / 100);
  const pal = palier(coutMoyen);
  const ageMax = choix.niveau === "Licence" ? 25 : choix.niveau === "Master" ? 35 : 0;
  const bourse = !ageMax || age >= ageMax ? "faible" : moyenne >= 15 ? "bonne" : moyenne >= 13.5 ? "possible" : "faible";
  const formation = autre || (choix.domaine === "Tous" ? "toutes formations" : choix.domaine);

  const conseils = [];
  if (anglais === 1 && choix.niveau !== "Année de langue") conseils.push("Améliorer votre anglais (ou commencer par une année de langue) augmente nettement vos chances.");
  if (budgetSerre) conseils.push("Votre budget est serré pour cette formation : votre conseiller cherchera des universités moins chères ou des bourses.");
  if (pct < 50) conseils.push("Une année de langue chinoise avant la formation peut ouvrir plus de portes.");
  if (bourse !== "faible") conseils.push("Votre profil permet de tenter une bourse : on en parle avec votre conseiller.");
  if (precision === "general") conseils.push(`Nous avons encore peu de données sur « ${autre} » : l'estimation s'appuie sur l'ensemble des formations de ce niveau.`);

  const msg = `Bonjour Réussite Internationale, j'ai fait l'estimation sur votre site : ${choix.niveau}, ${formation}, moyenne ${moyenneInput.value}/20, budget ${budgetTexte()} par an, ${age} ans. Résultat : ${pct} % de chances d'admission. Je voudrais être accompagné(e).`;

  zone.innerHTML = `
  <div class="est">
    <div class="est-head">
      <p class="esp-label">Votre estimation · ${esc(choix.niveau)} · ${esc(formation)}</p>
    </div>

    <article class="est-card est-chance ${ch.cls}">
      ${jauge(pct, ch.cls)}
      <div>
        <p class="est-big">${ch.emoji} ${ch.label}</p>
        <p class="muted">Probabilité d'obtenir au moins une admission en déposant 3 candidatures bien choisies par votre conseiller.${budgetSerre ? ` <b>Attention :</b> avec votre budget actuel, ce résultat suppose de viser les formations les moins chères (dès ≈ ${fcfa(Math.min(...pool.map((x) => x.cout)))} FCFA par an).` : ""}</p>
      </div>
    </article>

    <article class="est-card est-cost ${pal.cls}">
      <div class="est-cost-top">
        <div>
          <p class="esp-label">Coût moyen par an <span class="q-hint">(scolarité + logement)</span></p>
          <p class="est-money">≈ ${fcfa(coutMoyen)} FCFA</p>
          <p class="muted">En général entre ${fcfa(bas)} et ${fcfa(haut)} FCFA par an selon l'université.</p>
        </div>
        <span class="tier ${pal.cls}">${pal.emoji} ${pal.label}</span>
      </div>
      <div class="est-line"><span>+ Vie quotidienne (repas, transport, téléphone)</span><b>≈ ${fcfa(vieAn)} FCFA / an</b></div>
      <div class="est-line"><span>Total moyen à prévoir par an</span><b>≈ ${fcfa(coutMoyen + vieAn)} FCFA</b></div>
    </article>

    <div class="est-grid">
      <article class="est-card">
        <p class="esp-label">Votre budget</p>
        <p class="est-mid">${couverture} %</p>
        <div class="bar green"><span style="width:0" data-w="${couverture}"></span></div>
        <p class="muted small">des formations de ce type rentrent dans un budget de ${budgetTexte()} par an.</p>
      </article>
      <article class="est-card">
        <p class="esp-label">Chance de bourse</p>
        <p class="est-mid">${bourse === "bonne" ? "🎓 Bonne" : bourse === "possible" ? "🎓 Possible" : "Faible"}</p>
        <p class="muted small">${ageMax ? `Selon votre moyenne et votre âge (bourses gouvernementales : moins de ${ageMax} ans en ${choix.niveau.toLowerCase()}).` : "Les années de langue ont rarement des bourses complètes."}</p>
      </article>
    </div>

    ${conseils.length ? `<article class="est-card"><p class="esp-label">Nos conseils</p><ul class="est-tips">${conseils.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></article>` : ""}

    <div class="legend-tiers">
      <span class="tier t-vert">💚 Accessible : jusqu'à 2,2 M FCFA</span>
      <span class="tier t-jaune">⭐ Confort : 2,2 à 3,3 M FCFA</span>
      <span class="tier t-rouge">👑 Prestige : plus de 3,3 M FCFA</span>
    </div>

    <a class="btn btn-lg btn-full btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-chat"/></svg> Parler à un conseiller sur WhatsApp</a>
    <p class="muted small">Estimation indicative, calculée à partir des formations que nous suivons (prix vérifiés régulièrement). Le choix réel des universités se fait avec votre conseiller.</p>
  </div>`;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$("#sim-results [data-w]").forEach((b) => (b.style.width = b.dataset.w + "%"));
    $$("#sim-results [data-off]").forEach((c) => (c.style.strokeDashoffset = c.dataset.off));
  }));
  if (window.innerWidth < 1000) zone.scrollIntoView({ behavior: "smooth" });
});

$("#sim-results").innerHTML = `<div class="empty"><svg class="ic"><use href="#i-search"/></svg><p><b>Votre estimation apparaîtra ici.</b><br>Répondez aux questions puis appuyez sur « Voir mes chances ».</p></div>`;

/* ---------- Espace élève ---------- */
let codeCourant = null;
try { codeCourant = sessionStorage.getItem("ri-code"); } catch (e) {}
const dossierCourant = () => (codeCourant && DOSSIERS[codeCourant]) || null;

// Avatar dessiné selon le sexe ("F" ou "M")
function avatar(sexe) {
  const peau = "#8a5a3b", cheveux = "#24160f";
  if (sexe === "F") {
    return `<svg viewBox="0 0 120 120" class="avatar-svg" role="img" aria-label="Avatar"><circle cx="60" cy="60" r="60" fill="#fde2e4"/>
      <path d="M30 64c0-24 13-38 30-38s30 14 30 38v30H30z" fill="${cheveux}"/>
      <rect x="52" y="78" width="16" height="16" rx="6" fill="${peau}"/>
      <path d="M20 120c4-19 20-29 40-29s36 10 40 29z" fill="#c8102e"/>
      <path d="M46 92h28l-14 12z" fill="#ffffff" opacity=".9"/>
      <ellipse cx="60" cy="60" rx="20" ry="23" fill="${peau}"/>
      <path d="M39 58c1-15 10-24 21-24s20 9 21 24c-7-7-15-11-21-11s-14 4-21 11z" fill="${cheveux}"/>
      <circle cx="60" cy="27" r="10" fill="${cheveux}"/>
      <circle cx="52" cy="62" r="2.4" fill="${cheveux}"/><circle cx="68" cy="62" r="2.4" fill="${cheveux}"/>
      <path d="M53 71q7 6 14 0" fill="none" stroke="#4a2414" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="40" cy="69" r="2.6" fill="#f2b33d"/><circle cx="80" cy="69" r="2.6" fill="#f2b33d"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 120 120" class="avatar-svg" role="img" aria-label="Avatar"><circle cx="60" cy="60" r="60" fill="#e3ecfb"/>
    <rect x="52" y="78" width="16" height="16" rx="6" fill="${peau}"/>
    <path d="M20 120c4-19 20-29 40-29s36 10 40 29z" fill="#0f1e45"/>
    <path d="M50 91l10 12 10-12" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="39.5" cy="62" rx="3.5" ry="5" fill="${peau}"/><ellipse cx="80.5" cy="62" rx="3.5" ry="5" fill="${peau}"/>
    <ellipse cx="60" cy="60" rx="20" ry="23" fill="${peau}"/>
    <path d="M39 56c0-16 9-25 21-25s21 9 21 25c-5-6-11-9-21-9s-16 3-21 9z" fill="${cheveux}"/>
    <circle cx="52" cy="62" r="2.4" fill="${cheveux}"/><circle cx="68" cy="62" r="2.4" fill="${cheveux}"/>
    <path d="M53 71q7 6 14 0" fill="none" stroke="#4a2414" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;
}

function anneau(pct) {
  const r = 52, c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 120 120" class="ring" aria-hidden="true">
    <circle cx="60" cy="60" r="${r}" class="ring-bg"/>
    <circle cx="60" cy="60" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${c * (1 - pct / 100)}"/>
  </svg>`;
}

function afficherEspace() {
  const d = dossierCourant();
  if (!d) return;
  const etape = d.etape || 1;
  const pct = d.termine ? 100 : Math.round(((etape - 0.5) / ETAPES.length) * 100);
  const total = d.paiements.reduce((s, p) => s + p.montant, 0);
  const paye = d.paiements.reduce((s, p) => s + (p.payee ? p.montant : 0), 0);
  const pctPaye = total ? Math.round((paye / total) * 100) : 0;
  const docsOk = d.documents.filter((x) => x.ok).length;

  $("#espace").innerHTML = `
  <div class="esp-banner">
    <div class="wrap esp-banner-inner">
      <div class="esp-avatar">${avatar(d.sexe)}</div>
      <div class="esp-hello">
        <p class="esp-kicker"><svg class="ic"><use href="#i-lock"/></svg> Espace personnel</p>
        <h1>Bonjour ${esc(d.prenom)}</h1>
        <p>Bienvenue dans votre espace. Votre dossier est entre de bonnes mains.</p>
        <div class="esp-chips">
          <span>${esc(codeCourant)}</span>
          <span>${esc(d.programme)}</span>
          <span>Mis à jour le ${esc(d.maj)}</span>
        </div>
      </div>
      <button type="button" class="btn btn-sm esp-out" id="esp-out">Quitter mon espace</button>
    </div>
  </div>

  <div class="wrap esp">
    <div class="esp-grid">
      <article class="esp-card esp-progress">
        <div class="ring-wrap">${anneau(pct)}<div class="ring-txt"><b>${pct} %</b><span>${d.termine ? "terminé" : "avancé"}</span></div></div>
        <div>
          <p class="esp-label">Où en est mon dossier</p>
          <h2>Étape ${etape} sur ${ETAPES.length} : ${esc(ETAPES[etape - 1].titre)}</h2>
          <p class="muted">${esc(ETAPES[etape - 1].rassure)}</p>
          <p class="esp-uni"><svg class="ic"><use href="#i-cap"/></svg> ${esc(d.universite)} · ${esc(d.ville)}</p>
        </div>
      </article>

      <article class="esp-card esp-todo">
        <p class="esp-label">À faire maintenant</p>
        <p class="esp-todo-txt">${esc(d.prochaine)}</p>
        <a class="btn btn-sm btn-wa" href="${waLink(`Bonjour, c'est ${d.prenom} (dossier ${codeCourant}). J'ai une question sur mon dossier.`)}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-chat"/></svg> Écrire à mon conseiller</a>
      </article>
    </div>

    <article class="esp-card">
      <p class="esp-label">Mon parcours</p>
      <ol class="esp-steps">
        ${ETAPES.map((e, i) => {
          const n = i + 1;
          const cls = n < etape || d.termine ? "done" : n === etape ? "now" : "";
          return `<li class="${cls}"><span class="dot">${cls === "done" ? '<svg class="ic"><use href="#i-check"/></svg>' : n}</span><div><h3>${e.titre}</h3><p>${e.texte}</p></div></li>`;
        }).join("")}
      </ol>
    </article>

    <div class="esp-grid esp-grid-2">
      <article class="esp-card">
        <div class="esp-card-head"><p class="esp-label">Mes documents</p><span class="badge b-info">${docsOk} / ${d.documents.length} reçus</span></div>
        <ul class="esp-docs">
          ${d.documents.map((x) => `<li class="${x.ok ? "ok" : ""}"><span class="tick">${x.ok ? '<svg class="ic"><use href="#i-check"/></svg>' : ""}</span><span class="doc-name">${esc(x.nom)}</span><span class="state">${x.ok ? "Reçu" : "À fournir"}</span></li>`).join("")}
        </ul>
      </article>

      <article class="esp-card">
        <div class="esp-card-head"><p class="esp-label">Mes paiements</p><span class="badge b-good">${pctPaye} % réglé</span></div>
        <div class="bar green"><span style="width:0" data-w="${pctPaye}"></span></div>
        <ul class="esp-pay">
          ${d.paiements.map((x) => `<li><span>${esc(x.libelle)}</span><span><b>${fcfa(x.montant)} FCFA</b> ${x.payee ? '<span class="badge b-good">Payé</span>' : '<span class="badge b-grey">À venir</span>'}</span></li>`).join("")}
        </ul>
        <div class="esp-pay-total"><span>Déjà réglé</span><b>${fcfa(paye)} / ${fcfa(total)} FCFA</b></div>
        <p class="muted small">La scolarité et le dortoir se paient directement à l'université.</p>
      </article>
    </div>

    <ul class="trust trust-soft">
      <li><svg class="ic"><use href="#i-shield"/></svg>Votre contrat vous protège</li>
      <li><svg class="ic"><use href="#i-user"/></svg>Un conseiller suit votre dossier</li>
      <li><svg class="ic"><use href="#i-lock"/></svg>Espace réservé à vous</li>
    </ul>
    ${codeCourant.startsWith("RI-DEMO") ? '<p class="demo-note">Ceci est un dossier de démonstration.</p>' : ""}
  </div>`;

  $("#esp-out").addEventListener("click", () => {
    codeCourant = null;
    try { sessionStorage.clear(); } catch (e) {}
    location.hash = "suivi";
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$("#espace [data-w]").forEach((b) => (b.style.width = b.dataset.w + "%"));
    $$("#espace [data-off]").forEach((c) => (c.style.strokeDashoffset = c.dataset.off));
  }));
}

function entrer(code) {
  const err = $("#suivi-err");
  if (!DOSSIERS[code]) {
    err.textContent = code ? "Ce code n'existe pas. Vérifiez-le ou écrivez-nous sur WhatsApp." : "Entrez votre code de dossier.";
    err.hidden = false;
    return;
  }
  err.hidden = true;
  codeCourant = code;
  try { sessionStorage.setItem("ri-code", code); } catch (e) {}
  location.hash = "espace";
}
$("#suivi-form").addEventListener("submit", (e) => {
  e.preventDefault();
  entrer($("#suivi-code").value.trim().toUpperCase());
});
$$("[data-demo]").forEach((b) => b.addEventListener("click", () => {
  $("#suivi-code").value = b.dataset.demo;
  entrer(b.dataset.demo);
}));

afficher();
