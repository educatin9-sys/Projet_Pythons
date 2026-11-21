-- =====================================================================
--  Réussite Internationale — base de données des dossiers élèves
--  À coller dans Supabase : SQL Editor > New query > Run
--  Sécurité :
--   * seuls les administrateurs connectés (table admins) lisent et
--     modifient les dossiers ;
--   * un élève ne voit que SON dossier, avec son code, via la fonction
--     dossier_eleve() ; elle ne renvoie jamais le téléphone, les notes
--     internes ni les dépenses de l'agence.
-- =====================================================================

create table if not exists public.dossiers (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  prenom      text not null,
  nom         text not null default '',
  sexe        text not null default '' check (sexe in ('F', 'M', '')),
  telephone   text not null default '',
  pays        text not null default '',
  niveau      text not null default 'Licence',
  domaine     text not null default '',
  universite  text not null default '',
  ville       text not null default '',
  programme   text not null default '',
  etape       int  not null default 0 check (etape between 0 and 5),
  statut      text not null default 'actif' check (statut in ('actif', 'pause', 'termine', 'abandon')),
  paiements   jsonb not null default '[]'::jsonb,   -- [{libelle, montant, payee}]
  documents   jsonb not null default '[]'::jsonb,   -- [{nom, ok}]
  charges     int  not null default 200000,         -- dépenses de l'agence (privé)
  prochaine   text not null default '',             -- visible par l'élève
  notes       text not null default '',             -- privé
  cree_le     timestamptz not null default now(),
  maj_le      timestamptz not null default now()
);

-- Date de mise à jour automatique
create or replace function public.maj_date() returns trigger
language plpgsql set search_path = public as $$
begin
  new.maj_le := now();
  return new;
end $$;
drop trigger if exists dossiers_maj on public.dossiers;
create trigger dossiers_maj before update on public.dossiers
  for each row execute function public.maj_date();

-- Liste des administrateurs (comptes Supabase Auth autorisés)
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;   -- aucune règle : invisible depuis le site

create or replace function public.est_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke execute on function public.est_admin() from public, anon;
grant execute on function public.est_admin() to authenticated;
revoke execute on function public.maj_date() from public, anon, authenticated;

-- Règles d'accès : tout pour les administrateurs, rien pour les autres
alter table public.dossiers enable row level security;
drop policy if exists "admins gerent les dossiers" on public.dossiers;
create policy "admins gerent les dossiers" on public.dossiers
  for all to authenticated
  using (public.est_admin())
  with check (public.est_admin());

-- Droits de base pour les comptes connectés (la règle RLS ci-dessus filtre : administrateurs seulement)
grant select, insert, update, delete on public.dossiers to authenticated;
revoke all on public.dossiers from anon;

-- Lecture d'UN dossier par son code, pour l'espace élève
create or replace function public.dossier_eleve(p_code text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'code', code, 'prenom', prenom, 'sexe', sexe,
    'universite', universite, 'ville', ville, 'programme', programme,
    'etape', etape, 'statut', statut,
    'paiements', paiements, 'documents', documents,
    'prochaine', prochaine, 'maj_le', maj_le
  )
  from public.dossiers
  where upper(code) = upper(trim(p_code)) and statut <> 'abandon'
  limit 1;
$$;
revoke all on function public.dossier_eleve(text) from public;
grant execute on function public.dossier_eleve(text) to anon, authenticated;

-- =====================================================================
--  APRÈS avoir créé votre compte administrateur
--  (Authentication > Users > Add user), remplacez l'e-mail ci-dessous
--  par le vôtre, puis exécutez SEULEMENT cette ligne :
--
--  insert into public.admins (user_id)
--  select id from auth.users where email = 'VOTRE_EMAIL_ICI';
-- =====================================================================
