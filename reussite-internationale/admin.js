// Espace agence Réussite Internationale (logique de la page admin.html)
const CHARGES_DEFAUT = 200000;
const ETAPES = ["Prospect", "Diagnostic", "Vœux", "Dossier", "Admission & visa", "Accueil Chine"];
const STATUTS = { actif: "Actif", pause: "En pause", termine: "Terminé", abandon: "Abandonné" };

const $ = (s) => document.querySelector(s);
const fmt = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n || 0));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DOCUMENTS_DEFAUT = () => ["Passeport", "Diplôme et relevés du bac", "Photos d'identité", "Lettre de motivation", "Certificat médical", "Casier judiciaire"].map((nom) => ({ nom, ok: false }));
const PAIEMENTS_DEFAUT = () => [
  { libelle: "À la signature", montant: 500000, payee: false },
  { libelle: "À l'admission + JW202", montant: 700000, payee: false },
  { libelle: "Au visa X1, avant le vol", montant: 300000, payee: false },
];
// Les anciens dossiers avaient 3 tranches fixes (tranches: [true, false, ...]) : on les convertit.
const paiements = (d) => Array.isArray(d.paiements) ? d.paiements :
  PAIEMENTS_DEFAUT().map((p, i) => ({ ...p, payee: !!(d.tranches && d.tranches[i]) }));
const prix = (d) => paiements(d).reduce((s, p) => s + (+p.montant || 0), 0);
const encaisse = (d) => paiements(d).reduce((s, p) => s + (p.payee ? +p.montant || 0 : 0), 0);
const nbTranches = (d) => paiements(d).filter((p) => p.payee).length;
const charges = (d) => (typeof d.charges === "number" ? d.charges : CHARGES_DEFAUT);
const avancement = (d) => d.statut === "termine" ? 100 : Math.round(((d.etape || 0) / 5) * 100);

let dossiers = [], filtreEtape = null, enEdition = null, brouillon = null, confirmDelete = false;

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 2200);
}
function notice(msg) { const n = $("#notice"); n.textContent = msg; n.hidden = !msg; }

/* ---------- Rendu ---------- */
function render() {
  const actifs = dossiers.filter((d) => d.statut !== "abandon" && d.statut !== "termine" && (d.etape || 0) > 0);
  const prospects = dossiers.filter((d) => (d.etape || 0) === 0 && d.statut !== "abandon");
  const totalEnc = dossiers.reduce((s, d) => s + encaisse(d), 0);
  const totalCh = dossiers.filter((d) => (d.etape || 0) > 0).reduce((s, d) => s + charges(d), 0);
  const reste = actifs.reduce((s, d) => s + Math.max(0, prix(d) - encaisse(d)), 0);
  $("#k-actifs").textContent = actifs.length;
  $("#k-actifs-s").textContent = `${dossiers.filter((d) => d.statut === "termine").length} terminé(s)`;
  $("#k-prospects").textContent = prospects.length;
  $("#k-encaisse").textContent = fmt(totalEnc);
  $("#k-reste").textContent = fmt(reste);
  $("#k-marge").textContent = fmt(totalEnc - totalCh) + " FCFA";
  $("#k-marge-s").textContent = `dépenses : ${fmt(totalCh)} FCFA`;

  const counts = ETAPES.map((_, i) => dossiers.filter((d) => (d.etape || 0) === i && d.statut !== "abandon").length);
  $("#pipeline").innerHTML =
    `<button class="stage ${filtreEtape === null ? "active" : ""}" data-etape=""><b>${dossiers.length}</b><span>Tous</span></button>` +
    ETAPES.map((e, i) => `<button class="stage ${filtreEtape === i ? "active" : ""}" data-etape="${i}"><b>${counts[i]}</b><span>${i ? i + ". " : ""}${e}</span></button>`).join("");

  const q = $("#q").value.trim().toLowerCase();
  const st = $("#f-statut").value;
  const vis = dossiers
    .filter((d) => filtreEtape === null || (d.etape || 0) === filtreEtape)
    .filter((d) => !st || d.statut === st)
    .filter((d) => !q || [d.prenom, d.nom, d.code, d.universite, d.pays, d.domaine, d.telephone].join(" ").toLowerCase().includes(q))
    .sort((a, b) => String(b.maj_le || "").localeCompare(String(a.maj_le || "")));

  const list = $("#list");
  if (!dossiers.length) {
    list.innerHTML = `<div class="empty"><h3>Aucun élève pour l'instant</h3><p>Ajoutez votre premier élève avec « + Nouvel élève ». Chaque inscription reçue sur WhatsApp peut être ajoutée ici comme prospect.</p></div>`;
    return;
  }
  if (!vis.length) { list.innerHTML = `<div class="empty"><h3>Aucun dossier ne correspond</h3><p>Changez la recherche ou le filtre.</p></div>`; return; }

  list.innerHTML = `<div class="row head"><div>Élève</div><div>Étape</div><div class="c-uni">Université</div><div>Payé / prix</div><div class="c-next">Prochaine action</div></div>` +
    vis.map((d) => {
      const pct = avancement(d);
      const pill = (d.etape || 0) === 0 && d.statut === "actif" ? `<span class="pill p-prospect">Prospect</span>` : `<span class="pill p-${d.statut}">${STATUTS[d.statut] || ""}</span>`;
      return `<button class="row" data-id="${esc(d.id)}">
        <div><div class="name">${esc(d.prenom)} ${esc(d.nom)}</div><div class="sub">${esc(d.code)}${d.pays ? " · " + esc(d.pays) : ""}</div></div>
        <div class="prog"><div class="prog-top"><span>${(d.etape || 0) ? d.etape + ". " : ""}${ETAPES[d.etape || 0]}</span><span>${pct} %</span></div><div class="bar"><span style="width:${pct}%"></span></div></div>
        <div class="c-uni"><div class="sub" style="color:var(--ink)">${esc(d.universite) || "—"}</div><div class="sub">${esc(d.niveau || "")}${d.domaine ? " · " + esc(d.domaine) : ""}</div></div>
        <div><div class="pay">${paiements(d).map((p) => `<i class="${p.payee ? "on" : ""}"></i>`).join("")}</div><div class="sub">${fmt(encaisse(d))} / ${fmt(prix(d))}</div></div>
        <div class="c-next">${pill}<div class="next">${esc(d.prochaine) || '<span class="sub">—</span>'}</div></div>
      </button>`;
    }).join("");
}

$("#pipeline").addEventListener("click", (e) => {
  const b = e.target.closest(".stage"); if (!b) return;
  filtreEtape = b.dataset.etape === "" ? null : +b.dataset.etape; render();
});
$("#q").addEventListener("input", render);
$("#f-statut").addEventListener("change", render);
$("#list").addEventListener("click", (e) => {
  const r = e.target.closest(".row[data-id]"); if (!r) return;
  ouvrir(dossiers.find((d) => d.id === r.dataset.id));
});

/* ---------- Édition ---------- */
function prochainCode() {
  // 8 caractères au hasard (sans 0/O ni 1/I) : impossible à deviner
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const n = crypto.getRandomValues(new Uint32Array(8));
  const c = [...n].map((x) => A[x % A.length]).join("");
  return `RI-${c.slice(0, 4)}-${c.slice(4)}`;
}

function ouvrir(d) {
  enEdition = d ? d.id : null;
  brouillon = d ? { ...d, paiements: paiements(d).map((p) => ({ ...p })), documents: (d.documents || []).map((x) => ({ ...x })) } :
    { prenom: "", nom: "", sexe: "", telephone: "", pays: "", niveau: "Licence", domaine: "", universite: "", programme: "", ville: "", etape: 0, statut: "actif", code: prochainCode(), paiements: PAIEMENTS_DEFAUT(), documents: DOCUMENTS_DEFAUT(), charges: CHARGES_DEFAUT, prochaine: "", notes: "" };
  $("#d-title").textContent = d ? `${d.prenom} ${d.nom}`.trim() : "Nouvel élève";
  const set = (id, v) => ($(id).value = v ?? "");
  set("#e-prenom", brouillon.prenom); set("#e-nom", brouillon.nom); set("#e-tel", brouillon.telephone); set("#e-pays", brouillon.pays);
  set("#e-niveau", brouillon.niveau || "Licence"); set("#e-domaine", brouillon.domaine); set("#e-uni", brouillon.universite); set("#e-prog", brouillon.programme); set("#e-ville", brouillon.ville);
  set("#e-statut", brouillon.statut || "actif"); set("#e-code", brouillon.code); set("#e-charges", charges(brouillon));
  set("#e-next", brouillon.prochaine); set("#e-notes", brouillon.notes);
  $("#e-err").hidden = true;
  confirmDelete = false; $("#d-delete").textContent = "Supprimer"; $("#d-delete").hidden = !d;
  majEtapes(); majSexe(); majPaiements(); majDocs(); majArgent(); majWa();
  $("#overlay").hidden = false; $("#drawer").hidden = false;
  $("#e-prenom").focus();
}
function fermer() { $("#overlay").hidden = true; $("#drawer").hidden = true; enEdition = null; brouillon = null; }

function majEtapes() {
  $("#e-steps").innerHTML = ETAPES.map((e, i) => {
    const cls = i < brouillon.etape ? "done" : i === brouillon.etape ? "now" : "";
    return `<button type="button" class="${cls}" data-i="${i}"><b>${i ? i : "•"}</b>${e}</button>`;
  }).join("");
}
function majSexe() {
  document.querySelectorAll("#e-sexe button").forEach((b) => b.classList.toggle("on", b.dataset.v === brouillon.sexe));
}
function majPaiements() {
  $("#e-pay").innerHTML = brouillon.paiements.map((p, i) => `
    <div class="pay-row ${p.payee ? "on" : ""}">
      <input type="checkbox" id="e-p${i}" data-i="${i}" data-k="payee" ${p.payee ? "checked" : ""} title="Cochez quand c'est payé" aria-label="Tranche ${i + 1} payée">
      <input type="text" id="e-pl${i}" data-i="${i}" data-k="libelle" value="${esc(p.libelle)}" placeholder="Ex. À la signature" aria-label="Nom de la tranche ${i + 1}">
      <input type="number" class="amt-in" id="e-pm${i}" data-i="${i}" data-k="montant" value="${+p.montant || 0}" min="0" step="1000" inputmode="numeric" aria-label="Montant de la tranche ${i + 1} en FCFA">
      <button type="button" class="rm" data-rm="${i}" aria-label="Retirer la tranche ${i + 1}">×</button>
    </div>`).join("") +
    `<div class="pay-total"><span>Prix total pour cet élève</span><span>${fmt(prix(brouillon))} FCFA</span></div>`;
}
function majDocs() {
  $("#e-docs").innerHTML = brouillon.documents.map((x, i) => `
    <div class="doc-row ${x.ok ? "on" : ""}">
      <input type="checkbox" id="e-d${i}" data-i="${i}" data-k="ok" ${x.ok ? "checked" : ""} aria-label="Document ${i + 1} reçu">
      <input type="text" id="e-dn${i}" data-i="${i}" data-k="nom" value="${esc(x.nom)}" aria-label="Nom du document ${i + 1}">
      <button type="button" class="rm" data-rm="${i}" aria-label="Retirer le document ${i + 1}">×</button>
    </div>`).join("");
}
function majArgent() {
  const enc = encaisse(brouillon), ch = charges(brouillon);
  $("#e-money").innerHTML = `
    <div><small>Encaissé</small><b>${fmt(enc)} FCFA</b></div>
    <div><small>Reste à encaisser</small><b>${fmt(Math.max(0, prix(brouillon) - enc))} FCFA</b></div>
    <div class="hl"><small>Marge actuelle <span class="help">(reçu − dépenses)</span></small><b>${fmt(enc - ch)} FCFA</b></div>
    <div><small>Marge à la fin <span class="help">(si tout est payé)</span></small><b>${fmt(prix(brouillon) - ch)} FCFA${prix(brouillon) ? ` (${Math.round(((prix(brouillon) - ch) / prix(brouillon)) * 100)} %)` : ""}</b></div>`;
}
function majWa() {
  const num = ($("#e-tel").value || "").replace(/[^\d]/g, "");
  const a = $("#d-wa"); a.hidden = num.length < 8; a.href = `https://wa.me/${num}`;
}

$("#e-steps").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-i]"); if (!b) return;
  brouillon.etape = +b.dataset.i; majEtapes();
});
$("#e-sexe").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-v]"); if (!b) return; brouillon.sexe = b.dataset.v; majSexe();
});
$("#e-pay").addEventListener("input", (e) => {
  const t = e.target, i = +t.dataset.i, k = t.dataset.k; if (!k) return;
  const p = brouillon.paiements[i];
  if (k === "payee") { p.payee = t.checked; t.closest(".pay-row").classList.toggle("on", t.checked); }
  else if (k === "montant") p.montant = Math.max(0, +t.value || 0);
  else p.libelle = t.value;
  $("#e-pay .pay-total span:last-child").textContent = fmt(prix(brouillon)) + " FCFA";
  majArgent();
});
$("#e-pay").addEventListener("click", (e) => {
  const b = e.target.closest("[data-rm]"); if (!b) return;
  brouillon.paiements.splice(+b.dataset.rm, 1); majPaiements(); majArgent();
});
$("#e-pay-add").addEventListener("click", () => {
  brouillon.paiements.push({ libelle: `Tranche ${brouillon.paiements.length + 1}`, montant: 0, payee: false });
  majPaiements(); majArgent();
});
$("#e-docs").addEventListener("input", (e) => {
  const t = e.target, i = +t.dataset.i, k = t.dataset.k; if (!k) return;
  if (k === "ok") { brouillon.documents[i].ok = t.checked; t.closest(".doc-row").classList.toggle("on", t.checked); }
  else brouillon.documents[i].nom = t.value;
});
$("#e-docs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-rm]"); if (!b) return;
  brouillon.documents.splice(+b.dataset.rm, 1); majDocs();
});
$("#e-doc-add").addEventListener("click", () => { brouillon.documents.push({ nom: "", ok: false }); majDocs(); });
$("#e-copy").addEventListener("click", async () => {
  const v = $("#e-code").value;
  try { await navigator.clipboard.writeText(v); toast("Code copié"); } catch { $("#e-code").select(); }
});
$("#e-charges").addEventListener("input", () => { brouillon.charges = Math.max(0, +$("#e-charges").value || 0); majArgent(); });
$("#e-tel").addEventListener("input", majWa);

async function enregistrer() {
  const prenom = $("#e-prenom").value.trim();
  if (!prenom) { $("#e-err").textContent = "Le prénom est obligatoire."; $("#e-err").hidden = false; return; }
  const data = {
    prenom, nom: $("#e-nom").value.trim(), telephone: $("#e-tel").value.trim(), pays: $("#e-pays").value.trim(),
    niveau: $("#e-niveau").value, domaine: $("#e-domaine").value.trim(), universite: $("#e-uni").value.trim(),
    programme: $("#e-prog").value.trim(), ville: $("#e-ville").value.trim(),
    etape: brouillon.etape, statut: $("#e-statut").value, code: ($("#e-code").value.trim() || prochainCode()).toUpperCase(),
    sexe: brouillon.sexe || "",
    paiements: brouillon.paiements.map((p) => ({ libelle: String(p.libelle || "").trim(), montant: +p.montant || 0, payee: !!p.payee })),
    documents: brouillon.documents.filter((x) => String(x.nom || "").trim()).map((x) => ({ nom: String(x.nom).trim(), ok: !!x.ok })),
    charges: Math.max(0, +$("#e-charges").value || 0),
    prochaine: $("#e-next").value.trim(), notes: $("#e-notes").value.trim(),
  };
  const btn = $("#d-save"); btn.disabled = true;
  try {
    if (enEdition) await api("PATCH", `/rest/v1/dossiers?id=eq.${encodeURIComponent(enEdition)}`, data);
    else await api("POST", "/rest/v1/dossiers", data);
    fermer(); toast("Dossier enregistré"); await charger();
  } catch (err) {
    $("#e-err").textContent = /duplicate|23505/.test(err.message) ? "Ce code de dossier existe déjà : changez-le." : "L'enregistrement a échoué. Vérifiez votre connexion et réessayez.";
    $("#e-err").hidden = false;
  } finally { btn.disabled = false; }
}
async function supprimer() {
  if (!enEdition) return;
  if (!confirmDelete) { confirmDelete = true; $("#d-delete").textContent = "Confirmer la suppression"; return; }
  try { await api("DELETE", `/rest/v1/dossiers?id=eq.${encodeURIComponent(enEdition)}`); fermer(); toast("Dossier supprimé"); await charger(); }
  catch { $("#e-err").textContent = "La suppression a échoué. Réessayez."; $("#e-err").hidden = false; }
}

$("#btn-new").addEventListener("click", () => ouvrir(null));
$("#d-close").addEventListener("click", fermer);
$("#d-cancel").addEventListener("click", fermer);
$("#overlay").addEventListener("click", fermer);
$("#d-save").addEventListener("click", enregistrer);
$("#d-delete").addEventListener("click", supprimer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#drawer").hidden) fermer(); });

/* ---------- Export CSV ---------- */
$("#btn-export").hidden = false;
$("#btn-export").addEventListener("click", () => {
  const cols = ["code", "prenom", "nom", "telephone", "pays", "niveau", "domaine", "universite", "programme", "ville", "etape", "statut", "prix", "tranchesPayees", "encaisse", "charges", "prochaine", "notes", "maj_le"];
  const lignes = dossiers.map((d) => cols.map((c) => {
    const v = c === "etape" ? ETAPES[d.etape || 0] : c === "statut" ? STATUTS[d.statut] : c === "tranchesPayees" ? nbTranches(d) : c === "prix" ? prix(d) : c === "encaisse" ? encaisse(d) : c === "charges" ? charges(d) : d[c];
    return `"${String(v ?? "").replace(/"/g, '""')}"`;
  }).join(";"));
  const blob = new Blob(["\ufeff" + cols.join(";") + "\n" + lignes.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `dossiers-reussite-internationale-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

/* ---------- Connexion Supabase (sans bibliothèque) ---------- */
const CLE_SESSION = "ri-admin-session";
let session = null;
try { session = JSON.parse(localStorage.getItem(CLE_SESSION) || "null"); } catch (e) {}
function garderSession(s) {
  session = s;
  try { s ? localStorage.setItem(CLE_SESSION, JSON.stringify(s)) : localStorage.removeItem(CLE_SESSION); } catch (e) {}
}
async function rafraichir() {
  if (!session || !session.refresh_token) throw new Error("pas de session");
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST", headers: { apikey: SUPABASE_CLE, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!r.ok) { garderSession(null); throw new Error("session expirée"); }
  const j = await r.json();
  garderSession({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + j.expires_in });
}
async function api(method, chemin, corps) {
  if (session && session.expires_at - 60 < Date.now() / 1000) await rafraichir();
  const r = await fetch(SUPABASE_URL + chemin, {
    method,
    headers: { apikey: SUPABASE_CLE, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  const texte = await r.text();
  if (!r.ok) throw new Error(texte || r.status);
  return texte ? JSON.parse(texte) : null;
}
async function charger() {
  dossiers = await api("GET", "/rest/v1/dossiers?select=*&order=maj_le.desc");
  render();
}

function voir(ecran) {
  $("#login").hidden = ecran === "app";
  $("#app").hidden = ecran !== "app";
  $("#login-form").hidden = ecran !== "login";
  $("#pw-form").hidden = ecran !== "pw";
}
function erreur(id, msg) { const e = $(id); e.textContent = msg; e.hidden = !msg; }
function sessionDepuis(j) {
  return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (+j.expires_in || 3600) };
}

// Retour depuis un lien reçu par e-mail (choix du mot de passe) : #access_token=…&type=recovery
let modeMotDePasse = false;
(function lireLien() {
  const h = new URLSearchParams(location.hash.slice(1));
  if (h.get("access_token")) {
    garderSession({ access_token: h.get("access_token"), refresh_token: h.get("refresh_token"), expires_at: +h.get("expires_at") || Math.floor(Date.now() / 1000) + (+h.get("expires_in") || 3600) });
    modeMotDePasse = h.get("type") === "recovery" || h.get("type") === "invite";
    history.replaceState(null, "", location.pathname);
  } else if (h.get("error_description")) {
    erreur("#l-err", "Le lien n'est plus valable. Demandez-en un nouveau.");
    history.replaceState(null, "", location.pathname);
  }
})();

// Connexion e-mail + mot de passe
$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  erreur("#l-err", ""); $("#l-ok").hidden = true;
  const email = $("#l-email").value.trim(), password = $("#l-pass").value;
  if (!email || !password) return erreur("#l-err", "Entrez votre e-mail et votre mot de passe.");
  $("#l-btn").disabled = true;
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: { apikey: SUPABASE_CLE, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (r.status === 400) return erreur("#l-err", "E-mail ou mot de passe incorrect. Première connexion ? Utilisez le lien sous le bouton pour choisir votre mot de passe.");
    if (r.status === 429) return erreur("#l-err", "Trop d'essais. Attendez quelques minutes.");
    if (!r.ok) throw new Error(r.status);
    garderSession(sessionDepuis(await r.json()));
    await demarrer();
  } catch (err) {
    erreur("#l-err", "Connexion impossible. Vérifiez votre internet et réessayez.");
  } finally { $("#l-btn").disabled = false; }
});

// Recevoir un lien pour choisir (ou réinitialiser) le mot de passe
$("#l-reset").addEventListener("click", async () => {
  erreur("#l-err", ""); $("#l-ok").hidden = true;
  const email = $("#l-email").value.trim();
  if (!email) return erreur("#l-err", "Écrivez d'abord votre adresse e-mail ci-dessus.");
  try {
    const retour = location.origin + location.pathname;
    const r = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(retour)}`, {
      method: "POST", headers: { apikey: SUPABASE_CLE, "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (r.status === 429) return erreur("#l-err", "Trop de demandes. Attendez quelques minutes avant de redemander un lien.");
    $("#l-ok").textContent = `Si cette adresse est autorisée, un e-mail vient d'être envoyé à ${email}. Cliquez sur le lien (regardez aussi les spams) : vous pourrez choisir votre mot de passe.`;
    $("#l-ok").hidden = false;
  } catch (err) { erreur("#l-err", "L'envoi a échoué. Vérifiez votre connexion internet."); }
});

// Enregistrer un nouveau mot de passe
$("#pw-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  erreur("#p-err", "");
  const p1 = $("#p-1").value, p2 = $("#p-2").value;
  if (p1.length < 8) return erreur("#p-err", "Le mot de passe doit faire au moins 8 caractères.");
  if (p1 !== p2) return erreur("#p-err", "Les deux mots de passe ne sont pas identiques.");
  $("#p-btn").disabled = true;
  try {
    if (session.expires_at - 60 < Date.now() / 1000) await rafraichir();
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: "PUT", headers: { apikey: SUPABASE_CLE, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password: p1 }),
    });
    if (!r.ok) {
      const t = await r.text();
      return erreur("#p-err", /weak|pwned|leaked/i.test(t) ? "Ce mot de passe est trop simple. Choisissez-en un plus long ou plus original." : "L'enregistrement a échoué. Réessayez.");
    }
    $("#p-1").value = $("#p-2").value = "";
    modeMotDePasse = false;
    toast("Mot de passe enregistré");
    await demarrer();
  } catch (err) { erreur("#p-err", "Votre session a expiré. Redemandez un lien depuis l'écran de connexion."); }
  finally { $("#p-btn").disabled = false; }
});
$("#btn-pw").addEventListener("click", () => { $("#p-cancel").hidden = false; voir("pw"); });
$("#p-cancel").addEventListener("click", () => voir("app"));

$("#btn-out").addEventListener("click", async () => {
  try { await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: { apikey: SUPABASE_CLE, Authorization: `Bearer ${session.access_token}` } }); } catch (e) {}
  garderSession(null); location.reload();
});

async function demarrer() {
  if (!session) return voir("login");
  if (modeMotDePasse) { $("#p-cancel").hidden = true; return voir("pw"); }
  try {
    const admin = await api("POST", "/rest/v1/rpc/est_admin", {});
    if (!admin) { garderSession(null); voir("login"); return erreur("#l-err", "Ce compte n'est pas autorisé à gérer les dossiers."); }
    voir("app");
    await charger();
  } catch (err) {
    garderSession(null);
    voir("login");
    erreur("#l-err", "Votre session a expiré. Reconnectez-vous.");
  }
}
demarrer();
