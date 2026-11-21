// =====================================================
//  À MODIFIER : coordonnées de Réussite Internationale
//  Numéro WhatsApp au format international, sans + ni espaces
//  (ex. 2250700000000 pour la Côte d'Ivoire)
// =====================================================
const WHATSAPP_NUMERO = "2250000000000";
const EMAIL_CONTACT = "contact@reussite-internationale.com";

// Liens WhatsApp et e-mail
document.querySelectorAll(".js-whatsapp").forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Bonjour Réussite Internationale, je souhaite étudier en Chine.")}`;
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll(".js-email").forEach((a) => {
  a.href = `mailto:${EMAIL_CONTACT}`;
  if (a.textContent.trim() === "E-mail") a.textContent = EMAIL_CONTACT;
});

document.getElementById("annee").textContent = new Date().getFullYear();

// Menu mobile
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Formulaire d'inscription → message WhatsApp pré-rempli
const form = document.getElementById("form-inscription");
const errorBox = form.querySelector(".form-error");
const successBox = form.querySelector(".form-success");

const LIBELLES = {
  nom: "Nom",
  prenom: "Prénom",
  telephone: "Téléphone",
  email: "E-mail",
  pays: "Pays",
  ville: "Ville",
  niveau: "Niveau visé",
  diplome: "Diplôme / série",
  domaine: "Domaine",
  passeport: "Passeport",
  profil: "Rempli par",
  message: "Message",
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  successBox.hidden = true;

  let valide = true;
  form.querySelectorAll("[required]").forEach((champ) => {
    const ok = champ.type === "checkbox" ? champ.checked : champ.value.trim() !== "";
    champ.classList.toggle("invalid", !ok);
    if (!ok) valide = false;
  });
  const email = form.elements.email;
  if (email.value && !email.checkValidity()) {
    email.classList.add("invalid");
    valide = false;
  }
  if (!valide) {
    errorBox.textContent = "Merci de remplir les champs obligatoires (*) correctement.";
    errorBox.hidden = false;
    return;
  }

  const data = new FormData(form);
  const lignes = ["*Nouvelle inscription — Réussite Internationale*", ""];
  for (const [cle, libelle] of Object.entries(LIBELLES)) {
    const valeur = (data.get(cle) || "").toString().trim();
    if (valeur) lignes.push(`${libelle} : ${valeur}`);
  }

  window.open(
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(lignes.join("\n"))}`,
    "_blank",
    "noopener"
  );
  successBox.hidden = false;
  form.reset();
});

form.querySelectorAll("input, select, textarea").forEach((champ) =>
  champ.addEventListener("input", () => champ.classList.remove("invalid"))
);
