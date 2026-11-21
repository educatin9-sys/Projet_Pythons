// Connexion à la base de données Supabase.
// La clé ci-dessous est la clé PUBLIQUE (« publishable ») : elle est faite pour être dans le site.
// La sécurité vient des règles de la base (voir supabase/schema.sql) :
//  - le public ne peut lire qu'un dossier, avec son code, via la fonction dossier_eleve ;
//  - seuls les administrateurs connectés lisent et modifient les dossiers.
// Ne mettez JAMAIS ici la clé « service_role » ou « secret ».
const SUPABASE_URL = "https://ybxnldlrykkybjfmzfmm.supabase.co";
const SUPABASE_CLE = "sb_publishable_Pl-mtc7Bw6Wl2uuJsTcekA_Oe5KEHGE";
