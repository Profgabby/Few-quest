-- FEW Quest Phase 1 foundation. Apply ONLY to the dedicated FEW Quest Supabase project.
create extension if not exists pgcrypto;
create type public.language_code as enum ('en','ha','yo','ig','fr','ar');
create type public.school_status as enum ('pending','verified','active','suspended','inactive','rejected');
create type public.membership_role as enum ('school_admin','teacher','competitor_manager');
create type public.platform_role_type as enum ('moderator','content_reviewer','language_reviewer','finance_admin','platform_admin');
create sequence public.fewq_school_code_seq start 1;

create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,full_name text,preferred_language public.language_code not null default 'en',status text not null default 'active',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.schools(id uuid primary key default gen_random_uuid(),school_code text not null unique default ('FEW-NG-'||lpad(nextval('public.fewq_school_code_seq')::text,6,'0')),name text not null,school_type text,country_code char(2) not null default 'NG',state text,lga text,address text,email text,phone text,status public.school_status not null default 'pending',preferred_language public.language_code not null default 'en',verified_at timestamptz,verified_by uuid references public.profiles(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.school_memberships(id uuid primary key default gen_random_uuid(),school_id uuid not null references public.schools(id) on delete restrict,user_id uuid not null references public.profiles(id) on delete restrict,role public.membership_role not null,active boolean not null default true,created_by uuid references public.profiles(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(school_id,user_id,role));
create table public.competitors(id uuid primary key default gen_random_uuid(),competitor_code text not null unique,school_id uuid not null references public.schools(id) on delete restrict,display_name text not null,school_level text,class_level text,active boolean not null default true,authorization_status text not null default 'pending',created_by uuid references public.profiles(id),created_at timestamptz not null default now());
create table public.platform_roles(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete restrict,role public.platform_role_type not null,active boolean not null default true,granted_by uuid references public.profiles(id),granted_at timestamptz not null default now(),revoked_at timestamptz,unique(user_id,role));
create table public.audit_events(id uuid primary key default gen_random_uuid(),occurred_at timestamptz not null default now(),event_type text not null,actor_user_id uuid references public.profiles(id),actor_role text,school_id uuid references public.schools(id),entity_type text not null,entity_id uuid,correlation_id uuid not null default gen_random_uuid(),request_id text,metadata jsonb not null default '{}'::jsonb);

create index school_memberships_user_active_idx on public.school_memberships(user_id,active);
create index school_memberships_school_role_active_idx on public.school_memberships(school_id,role,active);
create index competitors_school_active_idx on public.competitors(school_id,active);
create index platform_roles_user_role_active_idx on public.platform_roles(user_id,role,active);
create index audit_events_school_time_idx on public.audit_events(school_id,occurred_at desc);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict(id) do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_school_member(p_school_id uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.school_memberships sm where sm.school_id=p_school_id and sm.user_id=auth.uid() and sm.active=true); $$;
create or replace function public.has_school_role(p_school_id uuid,p_role public.membership_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.school_memberships sm where sm.school_id=p_school_id and sm.user_id=auth.uid() and sm.role=p_role and sm.active=true); $$;
create or replace function public.has_platform_role(p_role public.platform_role_type) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.platform_roles pr where pr.user_id=auth.uid() and pr.role=p_role and pr.active=true); $$;

alter table public.profiles enable row level security;alter table public.schools enable row level security;alter table public.school_memberships enable row level security;alter table public.competitors enable row level security;alter table public.platform_roles enable row level security;alter table public.audit_events enable row level security;
create policy profiles_read_self on public.profiles for select to authenticated using(id=auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy schools_read_member on public.schools for select to authenticated using(public.is_school_member(id) or public.has_platform_role('platform_admin'));
create policy memberships_read_own_school on public.school_memberships for select to authenticated using(user_id=auth.uid() or public.is_school_member(school_id) or public.has_platform_role('platform_admin'));
create policy competitors_read_school on public.competitors for select to authenticated using(public.is_school_member(school_id) or public.has_platform_role('platform_admin'));
create policy competitors_insert_manager on public.competitors for insert to authenticated with check(public.has_school_role(school_id,'school_admin') or public.has_school_role(school_id,'teacher') or public.has_school_role(school_id,'competitor_manager') or public.has_platform_role('platform_admin'));
create policy platform_roles_read_self on public.platform_roles for select to authenticated using(user_id=auth.uid() or public.has_platform_role('platform_admin'));
create policy audit_admin_read on public.audit_events for select to authenticated using(public.has_platform_role('platform_admin'));
revoke insert,update,delete on public.audit_events from anon,authenticated;
revoke insert,update,delete on public.platform_roles from anon,authenticated;
