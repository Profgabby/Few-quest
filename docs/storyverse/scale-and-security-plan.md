# StoryVerse scale and data architecture (design draft)

Status: design only. Do not execute against the existing FEW Quest production database. The current StoryVerse interface uses local pilot manuscripts and generated editorial concepts; none of these records constitute 12,000 published stories.

## Capacity and editorial workflow
- 60 themes x 200 original story targets = 12,000 manuscripts.
- Per theme: 70 Little Explorers, 70 Story Adventurers, 60 Master Storytellers.
- Current concept seed: 50 per theme (3,000), not approved manuscripts. The remaining 150 per theme require original editorial planning.
- Canonical story record has immutable UUID, unique stable code, title, summary, theme, tier, language-neutral canonical work ID, owner, status, timestamps and revision.
- Each story can have multiple localized editions, chapters/scenes, accessible image assets, optional narrated audio, comprehension items, learning objectives, curriculum mappings, and reviewed age guidance.
- Lifecycle: concept -> drafted -> in_review -> changes_requested -> approved -> published -> archived. Every transition must be authorized and audited. Public endpoints return only approved/published editions.
- Published version is immutable; edits create a new revision and require reapproval. Translation approval is independent per language.

## Proposed data model (future migration, not deployed)
- sv_themes(id, slug unique, title, active, sort_order)
- sv_works(id uuid pk, code unique, theme_id fk, tier, original_language, owner_id, created_at)
- sv_editions(id uuid pk, work_id fk, locale, revision, status, title, summary, reading_minutes, reviewed_by, approved_at, published_at, unique(work_id,locale,revision))
- sv_scenes(id uuid pk, edition_id fk, position, heading, body, unique(edition_id,position))
- sv_assets(id uuid pk, edition_id fk, scene_id nullable, type, storage_path, alt_text, rights_status)
- sv_questions(id uuid pk, scene_id fk, prompt, answer_model, explanation)
- sv_learning_objectives(id uuid pk, code unique, description)
- sv_edition_objectives(edition_id fk, objective_id fk)
- sv_grade_mappings(edition_id fk, curriculum_id, grade_code, subject_code)
- sv_memberships(id uuid pk, account_id, organization_id nullable, role, verified_at)
- sv_reader_profiles(id uuid pk, guardian_account_id nullable, organization_id nullable, pseudonym, privacy_mode)
- sv_assignments(id uuid pk, organization_id, educator_id, edition_id, group_id, due_at)
- sv_progress(id uuid pk, reader_profile_id, edition_id, scene_position, completed_at)
- sv_attempts(id uuid pk, reader_profile_id, question_id, first_answer, attempted_at)
- sv_editorial_events(id uuid pk, edition_id, actor_id, action, previous_status, new_status, created_at)

## Security and isolation requirements
- Separate school organizations from household profiles; do not share school learner records with community readers.
- Never authorize from editable user metadata, client-side selected role, or query string. Enforce role and ownership on server and database.
- Apply row-level security to all exposed tables. Use narrow tenant-scoped SELECT/INSERT/UPDATE policies, plus immutable audit logs.
- Protect minors: verified guardian/school consent, minimum data collection, retention/deletion controls, access reviews, and safeguarding review before launch.
- Editorial actions require verified staff roles; story creators cannot approve their own submissions.
- Public catalog is a read-only published-edition projection, not a view exposing draft records.
- Never expose service-role credentials in the browser. Test cross-school and cross-household isolation using negative authorization cases.

## Release gates
1. Confirm the correct isolated StoryVerse development database and inventory existing FEW Quest tables.
2. Review schema, RLS and consent design before applying any migration.
3. Seed only a small reviewed pilot set; test approval, localization, pagination and search.
4. Run authorization, accessibility, performance and regression tests.
5. Expand in editorial batches with duplicate detection, human review and versioned publication.
