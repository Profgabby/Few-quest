-- Direct learner roster fields for FEW Quest.
alter table public.fewq_competitors
  add column if not exists age_category text,
  add column if not exists quest_eligibility text[] not null default '{}'::text[],
  add column if not exists updated_at timestamptz not null default now();

create index if not exists fewq_competitors_school_class_idx
  on public.fewq_competitors(school_id, school_level, class_level);

alter table public.fewq_competitors
  drop constraint if exists fewq_competitors_quest_eligibility_check;

alter table public.fewq_competitors
  add constraint fewq_competitors_quest_eligibility_check
  check (quest_eligibility <@ array['growmeal','growenergy','growaqua']::text[]);
