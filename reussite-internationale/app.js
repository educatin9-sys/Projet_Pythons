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
  $$("[data-view]").forEach((v) => (v.hidden = v.dataset.view !== vue));
  $$("[data-link]").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + vue));
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

const numeroAffiche = "+" + WHATSAPP_NUMERO;
$("#foot-wa").textContent = numeroAffiche;
$("#foot-mail").textContent = EMAIL_CONTACT;
$("#wa-float").href = waLink("Bonjour Réussite Internationale, je souhaite étudier en Chine.");
$("#annee").textContent = new Date().getFullYear();

/* ---------- Simulateur ---------- */
const choix = { niveau: "Licence", domaine: "Tous", anglais: "2" };

$$(".choices").forEach((groupe) => {
  groupe.addEventListener("click", (e) => {
    const btn = e.target.closest(".choice");
    if (!btn) return;
    $$(".choice", groupe).forEach((b) => b.classList.toggle("active", b === btn));
    choix[groupe.dataset.name] = btn.dataset.value;
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
        ${u.verifie ? `<span class="badge b-info">Scolarité vérifiée (${esc(u.verifie)})</span>` : `<span class="badge b-grey">Estimation à confirmer</span>`}
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

  const candidats = UNIVERSITES
    .filter((u) => u.niveau === choix.niveau && (choix.domaine === "Tous" || u.domaine === choix.domaine))
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

/* ---------- Suivi de dossier ---------- */
function afficherDossier(code) {
  const zone = $("#suivi-result");
  const d = DOSSIERS[code];
  if (!d) {
    zone.innerHTML = `<div class="alert"><b>Code introuvable.</b> Vérifiez le code reçu à la signature, ou écrivez-nous sur WhatsApp.</div>`;
    return;
  }
  const pct = d.etape >= 5 ? 100 : Math.round(((d.etape - 0.5) / ETAPES.length) * 100);
  const paye = PACK.tranches.slice(0, d.tranchesPayees).reduce((s, t) => s + t.montant, 0);
  const pctPaye = Math.round((paye / PACK.total) * 100);

  zone.innerHTML = `
  <div class="dossier">
    <div class="panel dossier-head">
      <div><h2>Bonjour ${esc(d.prenom)}</h2><p class="muted" style="margin:0">${esc(d.universite)}</p></div>
      <span class="badge b-info">Mis à jour le ${esc(d.maj)}</span>
    </div>

    <div class="panel bar-block">
      <div class="bar-label"><span>Avancement du dossier</span><span>${pct} %</span></div>
      <div class="bar"><span style="width:0" data-w="${pct}"></span></div>
      <p class="muted" style="margin:0">Étape ${d.etape} sur ${ETAPES.length} : <b>${esc(ETAPES[d.etape - 1].titre)}</b></p>
    </div>

    <div class="next"><b>Prochaine action :</b> ${esc(d.prochaine)}</div>

    <div class="panel">
      <ol class="stepper">
        ${ETAPES.map((e, i) => {
          const n = i + 1;
          const cls = n < d.etape || (d.etape >= 5 && pct === 100) ? "done" : n === d.etape ? "now" : "";
          return `<li class="${cls}"><span class="dot">${cls === "done" ? "✓" : n}</span><div><h4>${e.titre}</h4><p>${e.texte}</p></div></li>`;
        }).join("")}
      </ol>
    </div>

    <div class="panel bar-block">
      <div class="bar-label"><span>Paiement du pack</span><span>${pctPaye} %</span></div>
      <div class="bar green"><span style="width:0" data-w="${pctPaye}"></span></div>
      <ul class="pay-list">
        ${PACK.tranches.map((t, i) => `<li><span>Tranche ${i + 1} · ${t.quand}</span><span><b>${fcfa(t.montant)} FCFA</b> · ${i < d.tranchesPayees ? '<span class="badge b-good">Payée</span>' : '<span class="badge b-grey">À venir</span>'}</span></li>`).join("")}
      </ul>
    </div>
    <p class="demo-note">Ceci est un dossier de démonstration.</p>
  </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => $$("[data-w]", zone).forEach((b) => (b.style.width = b.dataset.w + "%"))));
}

$("#suivi-form").addEventListener("submit", (e) => {
  e.preventDefault();
  afficherDossier($("#suivi-code").value.trim().toUpperCase());
});
$$("[data-demo]").forEach((b) => b.addEventListener("click", () => {
  $("#suivi-code").value = b.dataset.demo;
  afficherDossier(b.dataset.demo);
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
