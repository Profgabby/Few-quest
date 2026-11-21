# StoryVerse Product, Monetization & Ecosystem Blueprint
Status: DEVELOPMENT PROPOSAL — no publication, billing activation, migration, or release approval
Branch: feature/storyverse-monetization-ecosystem
Base: feature/storyverse-eight-interfaces

## Non-negotiable isolation
- Preserve existing StoryVerse reader, 15 editorial draft manuscripts, 7-scene/14-question structure, routes, and reading progress.
- Do not change the source branch, main, production configuration, Supabase, or existing published content.
- Build new functionality behind explicit feature flags, initially OFF; never claim a payment or service is live until verified.
- StoryVerse remains independent of GrowMeal and LIFEWSBooks; any later integration uses optional links/APIs.
- Draft manuscripts must never be treated as publication-approved merely because they exist in the catalog.

## Pricing hypotheses — not approved prices
| Tier | Suggested test price | Core entitlements |
| --- | --- | --- |
| Free | $0 | Selected approved stories, standard comprehension, basic local progress, limited challenges and private author drafts |
| Plus | $3.99/month | Approved full standard library, richer exercises, reading awards, selected offline downloads, optional premium narration |
| Family | $7.99/month | Up to five managed reader profiles, Plus features, parental reports and family reading activities |
| School | Pilot from $99/year, capped seats | Teacher/classroom workspaces, assignments, aggregate reporting, licensed classroom offline packs, administrative roster controls |

All prices require willingness-to-pay testing and a documented cost model before launch. Annual discounts, country-sensitive pricing, taxes, refunds, processing costs, content royalties, storage, bandwidth, narration/AI usage, and customer support must be modeled. Do not offer unlimited downloads, AI, or school seats at these prices without unit-economics verification.

## Six reader dashboard modules
1. **Read**: browse approved library, search/filter, continue reading, comprehension.
2. **Listen**: human/licensed or consented narration, playback controls, optional word/phrase highlighting, selected premium downloadable audio; disclose unavailable recordings.
3. **Learn**: vocabulary, age-appropriate comprehension, reading levels, pronunciation practice where supported, personalized pathways and detailed premium reports.
4. **Create**: guided private story drafts, illustration/assembly, plan-based quotas; public sharing only after guardian consent where applicable, safeguarding and LIFEWS editorial approval.
5. **Challenges**: reading missions, badges, classroom competitions, moderated seasonal events; no public child rankings by default.
6. **Offline**: download manager for licensed approved content, storage usage, removal, local progress, sync status.

Additional role-specific workspaces: **Family Hub** (guardian-managed profiles, privacy controls, progress), **Classroom Hub** (teachers, school admins, assignments, student access), **Author/Publisher Studio** (submission and rights), **LIFEWS Admin** (moderation, editorial, commerce, licensing). Keep billing/admin actions out of child UI.

## Seven ecosystem services
- StoryVerse Listen: audiobooks and narration.
- StoryVerse Read & Learn: literacy and assessment.
- StoryVerse Create: Young Authors Studio.
- StoryVerse Classroom: teachers and school workspaces.
- StoryVerse Languages: parallel-language stories and verified translations.
- StoryVerse Reading League: challenges and competitions.
- StoryVerse Marketplace: later-stage curated sales of approved interactive books and learning resources; commission, payouts and rights verification required before launch.

## Online/offline access policy
- **Online**: discovery, payments, subscription changes, live competitions, publishing, moderation, roster management, account synchronization.
- **Offline**: previously downloaded licensed stories, associated available illustrations and optional audio, embedded questions, reading position, queued achievements and assignment completion.
- Initial install/download requires connectivity, except for separately prepared institution-managed/preloaded packages.
- Use a service worker for app shell and static assets; IndexedDB for downloadable content and progress, with versioned schemas and migration tests.
- Cache only approved/licensed downloadable content; never cache secrets, payment data or unpublished author submissions as public assets.
- Store a bounded signed entitlement snapshot and grace period for subscription downloads; purchased-title access follows purchase terms. Avoid blocking reading immediately when internet drops.
- Queue idempotent offline events, use stable event IDs and server reconciliation to prevent duplicate awards; define device conflict policy and account-switch isolation.
- Browser storage may be evicted; clearly communicate download availability and provide storage controls. Do not promise permanent offline access on every device.

## Stripe billing architecture — design only, no live credentials
- Server-side Stripe Checkout for paid plans; Stripe Customer Portal for upgrades, cancellation and invoices.
- Server-created Checkout sessions with validated plan/price IDs and authenticated purchaser; no client-side trust of prices.
- Verify webhook signatures and idempotency; handle checkout completion, subscription update/cancel, invoice paid/failed, refunds and disputes as appropriate.
- Maintain server-authoritative entitlements linked to customer, account and plan; do not unlock content solely from a checkout success URL or localStorage.
- Role-based organization seat enforcement; family profiles controlled by an adult account.
- Never store payment card details in StoryVerse. Keep test/live environments strictly separate. Review applicable tax, privacy and consumer-protection obligations.

## LIFEWS editorial and safeguarding workflow
draft -> submitted -> editorial_review -> changes_requested | approved -> scheduled -> published -> archived
- Separate content approval from technical upload and commercial availability.
- Only authorized LIFEWS editors can approve and publish. Require audit trail with reviewer, timestamp, version and rights evidence.
- Verify authorship, illustrations, audio licenses, age suitability, cultural/language accuracy and factual claims.
- For child-generated content: private by default, guardian consent where required, restricted sharing, reporting/moderation, no direct adult-to-child messaging.
- Marketplace: author onboarding, rights warranties, seller terms, commission schedule, refunds, dispute handling and payout verification before activation.
- Existing 15 manuscripts remain editorial drafts and unpublished.

## Feature flags (default OFF)
STORYVERSE_BILLING_ENABLED=false
STORYVERSE_PREMIUM_ENTITLEMENTS_ENABLED=false
STORYVERSE_OFFLINE_DOWNLOADS_ENABLED=false
STORYVERSE_LISTEN_ENABLED=false
STORYVERSE_LEARN_ENABLED=false
STORYVERSE_CREATE_ENABLED=false
STORYVERSE_CLASSROOM_ENABLED=false
STORYVERSE_LANGUAGES_ENABLED=false
STORYVERSE_READING_LEAGUE_ENABLED=false
STORYVERSE_MARKETPLACE_ENABLED=false
STORYVERSE_PUBLIC_SUBMISSIONS_ENABLED=false

## Implementation milestones and acceptance gates
M0 — baseline: existing reader/build tests pass on new branch; snapshot routes and draft flags; no behavior changes.
M1 — specification and modular UI prototypes: role-specific navigation, plan comparison, seven service descriptions and disabled-state notices; no fake checkout.
M2 — offline pilot: one approved test fixture (not an unpublished manuscript), 7 scenes/14 questions, disconnect/reopen, progress recovery, local awards, asset downloads, storage removal.
M3 — billing sandbox: Stripe test mode only; server entitlements, signed webhooks, duplicate delivery tests, refunds and cancellation; no production billing.
M4 — literacy services: narration licensing, Learn assessments, Create private drafts, guardian safety.
M5 — school: classroom rosters, assignments, teacher reports, seat limits, data privacy review.
M6 — multilingual and reading league: human-reviewed translations and child-safe competition.
M7 — marketplace: only after rights, approval, seller payout, refunds and moderation processes are tested.
Release gate: written editorial, security, accessibility, privacy, payment and commercial approval required; never inferred from passing builds.

## Commercial validation
- Test pricing and plan messaging with families, teachers and schools before setting live prices.
- Track conversion, 30/90-day retention, churn, engagement, paid download rates, reading completion and school seat utilization with privacy-preserving analytics.
- Unit economics: net receipts = subscription/book revenue minus payment fees, taxes, refunds, content royalties, bandwidth/storage, narration/AI, support and acquisition.
- Compare paid conversion and gross margin by segment; adjust pricing/quotas before scaling.

## Engineering work packages
A. Define TypeScript plan, entitlement, role, feature and content-status contracts with tests.
B. Build non-destructive dashboard and pricing prototypes under new isolated routes/components.
C. Add server-side entitlement checks and test-only billing adapters before integrating Stripe.
D. Add offline download/sync as independent, opt-in module.
E. Implement services incrementally with explicit completion criteria; never expose unimplemented controls as functional.
F. Run regression suite against existing reader, accessibility checks, child-safety review and production-isolation audit before requesting merge.

This blueprint authorizes design and development on the isolated branch only. It does not authorize publishing books, activating subscriptions, changing production databases, or merging branches.
