# FEW Quest

**FEW Quest** is the LIFEWS educational competition platform for school-based Food–Energy–Water learning.

## Initial Quest Families

Phase 1 establishes one shared platform capable of hosting multiple curriculum-aligned quiz families:

- **GrowMeal** — food, nutrition, school gardens, agriculture and food systems
- **GrowEnergy / GrowVolt** — energy literacy, solar electricity, PV systems and applied energy learning
- **GrowAqua** — water literacy, irrigation, water productivity and water systems

The architecture must remain extensible so future families such as **GrowFarm** and **GrowFloat** can be introduced without creating separate competition platforms.

## Platform Model

FEW Quest provides the common competition infrastructure:

- school registration and verification
- school, teacher and competitor roles
- multilingual interface: English, Hausa, Yoruba, Igbo, French and Arabic
- school access and programme cycles
- practice
- question banks organized by Quest family
- weekly activities
- 100-card activities where enabled
- Hot Seat competitions
- Live 50 competitions
- spectator mode
- leaderboards and recognition
- administration, security and audit trails

Each Quest family owns its curriculum taxonomy, learning domains, resources and question content while using the same secure competition engine.

## Phase 1

Phase 1 builds only the shared foundation:

1. standalone FEW Quest application
2. isolated Supabase staging/production architecture
3. authentication
4. schools and memberships
5. competitor foundation
6. role-based authorization and RLS
7. six-language localization and Arabic RTL
8. school registration and LIFEWS verification
9. audit foundation
10. role-specific dashboards

Competition engines, question-bank imports, payments, cards and live events are added in later phases.

## Architecture rule

The existing GrowMeal production platform and its AQ/FSC assessment systems are not modified by FEW Quest. GrowMeal becomes one content family within FEW Quest rather than the identity of the entire competition platform.
