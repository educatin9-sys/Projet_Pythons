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
if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const svg = document.querySelector(".mo-svg");
  if (svg && svg.pauseAnimations) { svg.pauseAnimations(); svg.setCurrentTime && svg.setCurrentTime(3); }
}

/* ---------- Simulateur de budget ----------
   La liste UNIVERSITES (data.js) sert seulement de base de calcul :
   aucun nom d'université n'est montré au visiteur. */
const choix = { niveau: "Licence", domaine: "Tous", ville: "Tous" };
const GRANDES_VILLES = ["Pékin", "Shanghai", "Canton", "Shenzhen"];

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

const sansAccent = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const moyenneDe = (l) => l.reduce((s, x) => s + x, 0) / l.length;
const arrondi = (n) => Math.round(n / 50000) * 50000;   // budgets arrondis à 50 000 FCFA

// Paliers de budget : plus c'est cher, plus c'est prestigieux (jamais « mauvais »)
function palier(coutFcfa) {
  if (coutFcfa <= 2200000) return { cls: "t-vert", emoji: "💚", label: "Budget accessible" };
  if (coutFcfa <= 3300000) return { cls: "t-jaune", emoji: "⭐", label: "Budget confort" };
  return { cls: "t-rouge", emoji: "👑", label: "Budget prestige" };
}
// Durée la plus fréquente pour ce type de formation, en années
function dureeType(base) {
  const ans = base.map((u) => parseInt(u.duree, 10) || 1);
  const freq = ans.reduce((m, a) => ((m[a] = (m[a] || 0) + 1), m), {});
  return +Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

$("#sim-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const zone = $("#sim-results");
  const autre = choix.domaine === "Autre" ? $("#sim-autre").value.trim() : "";
  if (choix.domaine === "Autre" && !autre) {
    $("#sim-autre").focus();
    zone.innerHTML = `<div class="alert">Écrivez la formation que vous cherchez dans le champ prévu.</div>`;
    return;
  }

  // Base de calcul : même niveau, même formation si on la connaît, type de ville choisi
  const tousNiveau = UNIVERSITES.filter((u) => u.niveau === choix.niveau);
  let base = tousNiveau;
  let precision = "formation";
  if (choix.domaine !== "Tous" && choix.domaine !== "Autre") base = base.filter((u) => u.domaine === choix.domaine);
  if (autre) {
    const mots = sansAccent(autre).split(/[\s,/'-]+/).filter((m) => m.length > 3);
    const proches = base.filter((u) => mots.some((m) => sansAccent(`${u.programme} ${u.domaine}`).includes(m)));
    if (proches.length >= 3) base = proches; else precision = "general";
  }
  if (choix.ville !== "Tous") {
    const filtre = base.filter((u) => (choix.ville === "grande") === GRANDES_VILLES.includes(u.ville));
    if (filtre.length >= 2) base = filtre; else precision = precision === "general" ? "general" : "ville";
  }
  if (!base.length) base = tousNiveau;

  const etudes = base.map((u) => (u.scolarite + u.dortoir) * TAUX_RMB_FCFA).sort((a, b) => a - b);
  const scolarite = moyenneDe(base.map((u) => u.scolarite * TAUX_RMB_FCFA));
  const logement = moyenneDe(base.map((u) => u.dortoir * TAUX_RMB_FCFA));
  const vie = moyenneDe(base.map((u) => u.vie * 12 * TAUX_RMB_FCFA));
  const parAn = scolarite + logement;
  const totalAn = parAn + vie;
  const bas = etudes[Math.floor(etudes.length * 0.15)];
  const haut = etudes[Math.min(etudes.length - 1, Math.floor(etudes.length * 0.85))];
  const annees = dureeType(base);
  const pal = palier(parAn);
  const formation = autre || (choix.domaine === "Tous" ? "toutes formations" : choix.domaine);
  const villeTxt = choix.ville === "grande" ? "grande ville" : choix.ville === "autre" ? "autre ville" : "";

  const notes = [];
  if (precision === "general") notes.push(`Nous avons encore peu de données sur « ${autre} » : le budget s'appuie sur l'ensemble des formations de ce niveau.`);
  if (precision === "ville") notes.push("Peu de données pour ce type de ville : le budget s'appuie sur toutes les villes.");
  if (choix.ville !== "grande") notes.push("À Pékin, Shanghai et Canton, le logement et la vie quotidienne coûtent plus cher.");
  if (choix.niveau !== "Année de langue") notes.push("Votre conseiller vous propose une université, souvent privée, dont le prix correspond à votre budget : l'admission y est plus accessible.");

  const msg = `Bonjour Réussite Internationale, j'ai fait la simulation de budget sur votre site : ${choix.niveau}, ${formation}${villeTxt ? ", " + villeTxt : ""}. Budget moyen : environ ${fcfa(arrondi(totalAn))} FCFA par an tout compris. Je voudrais être accompagné(e).`;

  zone.innerHTML = `
  <div class="est">
    <p class="esp-label">Votre simulation · ${esc(choix.niveau)} · ${esc(formation)}${villeTxt ? " · " + villeTxt : ""}</p>

    <article class="est-card est-cost ${pal.cls}">
      <div class="est-cost-top">
        <div>
          <p class="esp-label">Budget moyen par an <span class="q-hint">(études + logement)</span></p>
          <p class="est-money">≈ ${fcfa(arrondi(parAn))} FCFA</p>
          <p class="muted">Selon l'université, de ${fcfa(arrondi(bas))} à ${fcfa(arrondi(haut))} FCFA par an.</p>
        </div>
        <span class="tier ${pal.cls}">${pal.emoji} ${pal.label}</span>
      </div>
      <div class="est-line"><span>Frais de scolarité</span><b>≈ ${fcfa(arrondi(scolarite))} FCFA / an</b></div>
      <div class="est-line"><span>Logement (chambre en résidence universitaire)</span><b>≈ ${fcfa(arrondi(logement))} FCFA / an</b></div>
      <div class="est-line"><span>Vie quotidienne (repas, transport, téléphone)</span><b>≈ ${fcfa(arrondi(vie))} FCFA / an</b></div>
      <div class="est-line est-total"><span>Total à prévoir par an</span><b>≈ ${fcfa(arrondi(totalAn))} FCFA</b></div>
    </article>

    <div class="est-grid">
      <article class="est-card">
        <p class="esp-label">Sur toute la formation</p>
        <p class="est-mid">≈ ${fcfa(arrondi(totalAn * annees))} FCFA</p>
        <p class="muted small">Pour une durée habituelle de ${annees} an${annees > 1 ? "s" : ""}, tout compris.</p>
      </article>
      <article class="est-card">
        <p class="esp-label">Soit par mois</p>
        <p class="est-mid">≈ ${fcfa(arrondi(totalAn / 12))} FCFA</p>
        <p class="muted small">Pour vous aider à préparer le budget de la famille.</p>
      </article>
    </div>

    ${notes.length ? `<article class="est-card"><p class="esp-label">Bon à savoir</p><ul class="est-tips">${notes.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></article>` : ""}

    <div class="legend-tiers">
      <span class="tier t-vert">💚 Accessible : jusqu'à 2,2 M FCFA / an</span>
      <span class="tier t-jaune">⭐ Confort : 2,2 à 3,3 M FCFA / an</span>
      <span class="tier t-rouge">👑 Prestige : plus de 3,3 M FCFA / an</span>
    </div>

    <a class="btn btn-lg btn-full btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-chat"/></svg> Parler à un conseiller sur WhatsApp</a>
    <p class="muted small">Budget indicatif, calculé à partir des prix des universités que nous suivons, vérifiés régulièrement. Le prix exact dépend de l'université choisie avec votre conseiller. L'accompagnement de l'agence est en plus.</p>
  </div>`;
  zone.scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#sim-results").innerHTML = `<div class="empty"><svg class="ic"><use href="#i-coin"/></svg><p><b>Votre budget apparaîtra ici.</b><br>Choisissez votre niveau et votre formation, puis appuyez sur « Calculer mon budget ».</p></div>`;

/* ---------- Espace élève ---------- */
let codeCourant = null;
try { codeCourant = sessionStorage.getItem("ri-code"); } catch (e) {}
let dossierCharge = null;
const dossierCourant = () => (codeCourant && (DOSSIERS[codeCourant] || dossierCharge)) || null;

// Lit UN dossier dans la base Supabase avec son code (fonction publique dossier_eleve)
async function chercherDossier(code) {
  if (DOSSIERS[code]) return DOSSIERS[code];
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/dossier_eleve`, {
    method: "POST",
    headers: { apikey: SUPABASE_CLE, "Content-Type": "application/json" },
    body: JSON.stringify({ p_code: code }),
  });
  if (!r.ok) throw new Error("reseau");
  const d = await r.json();
  if (!d) return null;
  const date = d.maj_le ? new Date(d.maj_le).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "";
  return {
    prenom: d.prenom, sexe: d.sexe, universite: d.universite, programme: d.programme, ville: d.ville,
    etape: Math.max(1, d.etape || 0), termine: d.statut === "termine", maj: date, prochaine: d.prochaine,
    paiements: Array.isArray(d.paiements) ? d.paiements : [], documents: Array.isArray(d.documents) ? d.documents : [],
  };
}

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
          ${d.programme ? `<span>${esc(d.programme)}</span>` : ""}
          ${d.maj ? `<span>Mis à jour le ${esc(d.maj)}</span>` : ""}
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
          <p class="esp-uni"><svg class="ic"><use href="#i-cap"/></svg> ${d.universite ? esc(d.universite) : "Université en cours de choix avec votre conseiller"}${d.ville ? " · " + esc(d.ville) : ""}</p>
        </div>
      </article>

      <article class="esp-card esp-todo">
        <p class="esp-label">À faire maintenant</p>
        <p class="esp-todo-txt">${esc(d.prochaine) || "Rien à faire pour le moment : votre conseiller avance sur votre dossier."}</p>
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

async function entrer(code) {
  const err = $("#suivi-err");
  err.hidden = true;
  if (!code) { err.textContent = "Entrez votre code de dossier."; err.hidden = false; return; }
  const btn = $("#suivi-form button[type=submit]");
  btn.disabled = true;
  let d = null;
  try { d = await chercherDossier(code); }
  catch (e) { err.textContent = "Connexion impossible pour le moment. Vérifiez votre internet et réessayez."; err.hidden = false; return; }
  finally { btn.disabled = false; }
  if (!d) { err.textContent = "Ce code n'existe pas. Vérifiez-le ou écrivez-nous sur WhatsApp."; err.hidden = false; return; }
  dossierCharge = d;
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

// Au chargement : si l'élève était connecté, on relit son dossier dans la base
(async () => {
  if (codeCourant && !DOSSIERS[codeCourant]) {
    try { dossierCharge = await chercherDossier(codeCourant); } catch (e) { dossierCharge = null; }
  }
  afficher();
})();
