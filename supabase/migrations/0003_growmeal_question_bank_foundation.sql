-- Canonical FEW Quest question bank shared by Practice, Timed Quiz, 100 Cards, Hot Seat and Live 50.
create table if not exists public.question_bank (
  id uuid primary key default gen_random_uuid(),
  question_code text not null unique,
  quest_family text not null default 'GrowMeal' check (quest_family in ('GrowMeal','GrowEnergy','GrowAqua')),
  competition_category text not null check (competition_category in ('GM-NUR','GM-LP','GM-UP','GM-JSS','GM-SSS')),
  garden_code text,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option char(1) not null check (correct_option in ('A','B','C','D')),
  explanation text,
  difficulty text not null default 'standard' check (difficulty in ('foundation','standard','advanced')),
  language public.fewq_language_code not null default 'en',
  lifecycle_status text not null default 'draft' check (lifecycle_status in ('draft','content_review','answer_verified','approved','published','retired')),
  competition_approved boolean not null default false,
  version integer not null default 1 check (version > 0),
  source_reference text,
  created_by uuid references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz
);
create index if not exists question_bank_growmeal_category_idx on public.question_bank(quest_family,competition_category,lifecycle_status,competition_approved);
create index if not exists question_bank_garden_idx on public.question_bank(garden_code);
alter table public.question_bank enable row level security;
create policy question_bank_read_published on public.question_bank for select to authenticated using (
  lifecycle_status='published'
  or public.fewq_has_platform_role('platform_admin'::public.fewq_platform_role_type)
  or public.fewq_has_platform_role('content_reviewer'::public.fewq_platform_role_type)
  or public.fewq_has_platform_role('language_reviewer'::public.fewq_platform_role_type)
);
revoke insert,update,delete on public.question_bank from anon,authenticated;
