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
$("#wa-float").href = waLink("Bonjour Réussite Internationale, je souhaite étudier en Chine.");
$("#annee").textContent = new Date().getFullYear();
$("#lien-agence").href = LIEN_ESPACE_AGENCE;

/* ---------- Simulateur ---------- */
const choix = { niveau: "Licence", domaine: "Tous", anglais: "2" };

$$(".choices").forEach((groupe) => {
  groupe.addEventListener("click", (e) => {
    const btn = e.target.closest(".choice");
    if (!btn) return;
    $$(".choice", groupe).forEach((b) => b.classList.toggle("active", b === btn));
    choix[groupe.dataset.name] = btn.dataset.value;
    if (groupe.dataset.name === "domaine") majAutre();
    if (groupe.dataset.name === "niveau" && btn.dataset.value === "Année de langue") {
      choisirDans("domaine", "Langue chinoise");
    } else if (groupe.dataset.name === "niveau" && choix.domaine === "Langue chinoise") {
      choisirDans("domaine", "Tous");
    }
  });
});
function choisirDans(nom, valeur) {
  const groupe = $(`.choices[data-name="${nom}"]`);
  $$(".choice", groupe).forEach((b) => b.classList.toggle("active", b.dataset.value === valeur));
  choix[nom] = valeur;
  if (nom === "domaine") majAutre();
}

// Champ « Autre » : l'élève écrit lui-même la formation qu'il cherche
const sansAccent = (t) => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function majAutre() {
  const box = $("#sim-autre-box");
  box.hidden = choix.domaine !== "Autre";
  if (!box.hidden) $("#sim-autre").focus();
}
$("#sim-autre-list").innerHTML = [...new Set(UNIVERSITES.map((u) => u.programme))].map((p) => `<option value="${esc(p)}">`).join("");
function correspondDomaine(u) {
  if (choix.domaine === "Tous") return true;
  if (choix.domaine !== "Autre") return u.domaine === choix.domaine;
  const mots = sansAccent($("#sim-autre").value).split(/[\s,/'-]+/).filter((m) => m.length > 2);
  if (!mots.length) return false;
  const texte = sansAccent(`${u.programme} ${u.domaine}`);
  return mots.some((m) => texte.includes(m));
}

const moyenneInput = $("#sim-moyenne");
const moyenneOut = $("#sim-moyenne-out");
moyenneInput.addEventListener("input", () => (moyenneOut.textContent = `${moyenneInput.value.replace(".", ",")} / 20`));

const CHANCES = {
  good: { label: "Bonnes chances", cls: "b-good", rang: 0 },
  mid: { label: "Chances moyennes", cls: "b-mid", rang: 1 },
  hard: { label: "Ambitieux", cls: "b-hard", rang: 2 },
};

function evaluer(u, moyenne, anglais) {
  let score = moyenne - u.moyenneMin;
  const notes = [];
  if (u.langue === "Anglais") {
    if (anglais === 1) { score -= 1.5; notes.push("Prévoir des cours d'anglais avant le départ"); }
    if (anglais === 3) score += 0.5;
  }
  if (u.selectivite === 4) score -= 0.5;
  let chance = null;
  if (score >= 1.5) chance = "good";
  else if (score >= 0) chance = "mid";
  else if (score >= -1.5) chance = "hard";
  const annuelRmb = u.scolarite + u.dortoir;
  return {
    ...u, chance, notes,
    annuelFcfa: annuelRmb * TAUX_RMB_FCFA,
    mensuelRmb: annuelRmb / 12 + u.vie,
    mensuelFcfa: (annuelRmb / 12 + u.vie) * TAUX_RMB_FCFA,
  };
}

function carteUni(u, index) {
  const c = CHANCES[u.chance];
  return `
  <article class="uni-card">
    <div class="uni-top">
      <div>
        <h3>${esc(u.nom)}</h3>
        <p class="uni-sub">${esc(u.programme)} · ${esc(u.ville)} · ${esc(u.duree)} · cours en ${esc(u.langue.toLowerCase())}</p>
      </div>
      <span class="badge ${c.cls}">${c.label}</span>
    </div>
    <div class="cost">
      <div class="main"><small>Coût par mois</small><b>≈ ${fcfa(u.mensuelFcfa)} FCFA</b><em>tout compris · ${rmb(u.mensuelRmb)} RMB</em></div>
      <div><small>Scolarité / an</small><b>${rmb(u.scolarite)} RMB</b><em>≈ ${fcfa(u.scolarite * TAUX_RMB_FCFA)} FCFA</em></div>
      <div><small>Dortoir / an</small><b>≈ ${rmb(u.dortoir)} RMB</b><em>≈ ${fcfa(u.dortoir * TAUX_RMB_FCFA)} FCFA</em></div>
    </div>
    <div class="uni-foot">
      <div class="tags">
        ${u.verifie ? `<span class="badge b-info">Prix vérifié (${esc(u.verifie)})</span>` : `<span class="badge b-grey">Estimation à confirmer</span>`}
        ${u.source ? `<a class="badge b-grey src" href="${esc(u.source)}" target="_blank" rel="noopener">Source officielle ↗</a>` : ""}
        ${u.notes.map((n) => `<span class="badge b-mid">${esc(n)}</span>`).join("")}
      </div>
      <button type="button" class="btn btn-sm" data-choisir="${index}">Je choisis cette université</button>
    </div>
  </article>`;
}

let derniersResultats = [];

$("#sim-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const moyenne = parseFloat(moyenneInput.value);
  const anglais = parseInt(choix.anglais, 10);
  const budget = parseInt($("#sim-budget").value, 10);
  const age = parseInt($("#sim-age").value, 10) || 0;
  const formationAutre = choix.domaine === "Autre" ? $("#sim-autre").value.trim() : "";
  if (choix.domaine === "Autre" && !formationAutre) {
    $("#sim-autre").focus();
    $("#sim-results").innerHTML = `<div class="alert">Écrivez la formation que vous cherchez dans le champ « Quelle formation cherchez-vous ? ».</div>`;
    return;
  }

  const candidats = UNIVERSITES
    .filter((u) => u.niveau === choix.niveau && correspondDomaine(u))
    .map((u) => evaluer(u, moyenne, anglais));

  const possibles = candidats.filter((u) => u.chance);
  const dansBudget = possibles.filter((u) => u.annuelFcfa <= budget)
    .sort((a, b) => CHANCES[a.chance].rang - CHANCES[b.chance].rang || a.mensuelFcfa - b.mensuelFcfa);
  const horsBudget = possibles.filter((u) => u.annuelFcfa > budget).sort((a, b) => a.annuelFcfa - b.annuelFcfa);
  const tropExigeantes = candidats.length - possibles.length;
  derniersResultats = [...dansBudget, ...horsBudget];

  const zone = $("#sim-results");
  let html = "";

  const ageMax = choix.niveau === "Licence" ? 25 : choix.niveau === "Master" ? 35 : 0;
  const bourse = ageMax && age > 0 && age < ageMax && moyenne >= 14;

  html += `<div class="res-head"><h2>${dansBudget.length} université${dansBudget.length > 1 ? "s" : ""} pour vous</h2>
    <div class="legend"><span class="badge b-good">Bonnes chances</span><span class="badge b-mid">Moyennes</span><span class="badge b-hard">Ambitieux</span></div></div>`;

  if (bourse) html += `<div class="info"><svg class="ic"><use href="#i-cap"/></svg><div>Avec votre moyenne et votre âge, <b>une bourse CSC est envisageable</b>. On en parle pendant le diagnostic.</div></div><br>`;

  if (dansBudget.length >= 2) {
    const sur = dansBudget.find((u) => u.chance === "good");
    const equi = dansBudget.find((u) => u !== sur && (u.chance === "mid" || u.selectivite === 2));
    const ambi = dansBudget.find((u) => u !== sur && u !== equi && (u.chance === "hard" || u.selectivite >= 3));
    const voeux = [[sur, "Vœu sûr"], [equi, "Vœu équilibre"], [ambi, "Vœu ambitieux"]].filter(([u]) => u);
    if (voeux.length >= 2) {
      html += `<div class="voeux"><h3>Nos 3 vœux conseillés</h3><ol>${voeux.map(([u, t]) => `<li><b>${t}</b> : ${esc(u.nom)}</li>`).join("")}</ol></div>`;
    }
  }

  if (formationAutre && !candidats.length) {
    const msg = `Bonjour Réussite Internationale, je cherche une formation en « ${formationAutre} » (${choix.niveau}) en Chine. Ma moyenne : ${moyenneInput.value}/20. Budget par an : ${$("#sim-budget").selectedOptions[0].textContent}. Pouvez-vous m'aider ?`;
    zone.innerHTML = `<div class="request">
      <span class="quick-ic gold"><svg class="ic"><use href="#i-search"/></svg></span>
      <h2>« ${esc(formationAutre)} » : on la cherche pour vous</h2>
      <p>Cette formation n'est pas encore dans notre simulateur, mais beaucoup d'universités chinoises la proposent. Envoyez-nous votre demande : un conseiller vous répond avec les universités possibles, leurs prix et vos chances.</p>
      <a class="btn btn-lg btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-chat"/></svg> Envoyer ma demande sur WhatsApp</a>
      <p class="muted small">Votre demande contient déjà la formation, votre niveau, votre moyenne et votre budget.</p>
    </div>`;
    $("#f-domaine").value = formationAutre;
    if (window.innerWidth < 1000) zone.scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (!dansBudget.length) {
    html += `<div class="alert"><b>Aucune université ne correspond pour l'instant.</b><br>
      ${horsBudget.length ? "Certaines universités sont possibles avec un budget un peu plus élevé (voir ci-dessous). " : ""}
      ${choix.niveau !== "Année de langue" ? "Une année de langue chinoise peut aussi être une bonne porte d'entrée. " : ""}
      Parlez-en à un conseiller : le diagnostic est gratuit.</div>`;
  }

  html += `<div class="res-list">${dansBudget.map((u) => carteUni(u, derniersResultats.indexOf(u))).join("")}</div>`;

  if (horsBudget.length) {
    html += `<details class="more-list"><summary>${horsBudget.length} autre${horsBudget.length > 1 ? "s" : ""} au-dessus de votre budget</summary>
      <div class="res-list">${horsBudget.map((u) => carteUni(u, derniersResultats.indexOf(u))).join("")}</div></details>`;
  }
  if (tropExigeantes) {
    html += `<p class="muted">${tropExigeantes} université${tropExigeantes > 1 ? "s demandent" : " demande"} une moyenne plus élevée.</p>`;
  }
  html += `<p class="muted">Coût par mois = (scolarité + dortoir) ÷ 12 + vie quotidienne. 1 RMB ≈ ${TAUX_RMB_FCFA} FCFA. Résultats indicatifs, confirmés par un conseiller.</p>`;
  html += `<a href="#inscription" class="btn btn-lg btn-full" data-link>Réserver mon diagnostic gratuit</a>`;

  zone.innerHTML = html;
  if (window.innerWidth < 1000) zone.scrollIntoView({ behavior: "smooth" });
});

$("#sim-results").innerHTML = `<div class="empty"><svg class="ic"><use href="#i-search"/></svg><p><b>Vos résultats apparaîtront ici.</b><br>Répondez aux questions puis appuyez sur « Voir mes universités ».</p></div>`;

$("#sim-results").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-choisir]");
  if (!btn) return;
  const u = derniersResultats[+btn.dataset.choisir];
  if (!u) return;
  $("#f-universite").value = `${u.nom} (${u.programme})`;
  $("#f-niveau").value = u.niveau;
  $("#f-domaine").value = u.domaine;
  const box = $("#chosen-uni");
  box.textContent = `Université choisie : ${u.nom} — ${u.programme}`;
  box.hidden = false;
  location.hash = "inscription";
});

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

/* ---------- Inscription → WhatsApp ---------- */
const form = $("#form-inscription");
const erreur = $(".form-error", form);
const succes = $(".form-success", form);
const LIBELLES = { nom: "Nom", prenom: "Prénom", telephone: "Téléphone", email: "E-mail", pays: "Pays", niveau: "Niveau visé", domaine: "Domaine", universite: "Université choisie (simulateur)", passeport: "Passeport", profil: "Rempli par", message: "Message" };

form.addEventListener("submit", (e) => {
  e.preventDefault();
  erreur.hidden = true;
  succes.hidden = true;
  let ok = true;
  $$("[required]", form).forEach((c) => {
    const valide = c.type === "checkbox" ? c.checked : c.value.trim() !== "";
    c.classList.toggle("invalid", !valide);
    if (!valide) ok = false;
  });
  const email = form.elements.email;
  if (email.value && !email.checkValidity()) { email.classList.add("invalid"); ok = false; }
  if (!ok) {
    erreur.textContent = "Merci de remplir les champs marqués d'une * .";
    erreur.hidden = false;
    return;
  }
  const data = new FormData(form);
  const lignes = ["*Nouvelle inscription — Réussite Internationale*", ""];
  for (const [cle, lib] of Object.entries(LIBELLES)) {
    const v = (data.get(cle) || "").toString().trim();
    if (v) lignes.push(`${lib} : ${v}`);
  }
  const lien = waLink(lignes.join("\n"));
  window.open(lien, "_blank", "noopener");
  succes.innerHTML = `Merci ! Votre inscription est prête dans WhatsApp : appuyez sur « Envoyer ».<br>WhatsApp ne s'est pas ouvert ? <a href="${lien}" target="_blank" rel="noopener">Cliquez ici</a>.`;
  succes.hidden = false;
});
$$("input, select, textarea", form).forEach((c) => c.addEventListener("input", () => c.classList.remove("invalid")));

afficher();
