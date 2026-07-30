# Project Instructions

## Scope of this file

**If the current request is invoking a `sc-` command (e.g. `/sc-create-component` ), 
that command's own instructions take priority over this file.** Follow the command
file as written; do not layer these general instructions on top of it or use this
file to fill gaps it didn't ask you to fill. `sc-` commands are self-contained, 
purpose-built versions of the same underlying plan-then-execute philosophy — they've
already adapted it to their specific task type.

Everything below in this file applies **only when a `sc-` command is not being
invoked** — i.e. any direct, ad hoc request in chat.

## Plan → Execute — applies to all other implementation work

Any time you are asked to implement something, fix something, or create a plan
*outside of a `sc-` command* — a direct request like "build me X", "fix this bug", or
"create a plan to do this" — follow the two-phase approach below. This is the standing
way ad hoc work gets done in this repo.

**You never move from PLAN to EXECUTE without explicit human approval.** No files are
modified during the PLAN phase, even for changes that look trivial or safe.

---

### Sources of truth (read fresh, every time — never from memory of a prior session)

1. **`.standards/*.md`** at the repo root — the standards collection.
2. **`DESIGN SYSTEM.md`** and **`design-tokens.json`** at the repo root — the design
   system, whenever the work touches UI/components.
3. **The actual codebase** — real folder layout, naming, export style, and existing
   patterns. Never assume; discover it by reading.

Do not invent conventions, file structures, prop names, colors, or package choices
that aren't backed by one of these three. If something is genuinely undecided, surface
it rather than guessing — see Clarifications below.

If `.standards/` is missing or empty, or (for UI work) the design system files don't
exist, stop and say so. Do not fall back to generic/textbook conventions.

---

### Phase 1 — Plan

1. **Understand the ask.** Identify scope from the conversation or any linked
   brief/spec. Triage anything missing:
   - **Blocking** (plan can't meaningfully be drafted) → ask before doing anything else.
   - **Non-blocking** (a sensible default exists) → proceed with a stated assumption, 

     record it under `Clarifications Required` in the plan.

   Don't ask about anything the standards or design system already answer.

2. **Standards discovery.** List every file currently in `.standards/*.md` — treat
   this as a fresh directory listing, not a remembered set. Read each file's `##
   Purpose `, ` ## When to Apply `, and full ` Required Practices`. Classify each as
   ALWAYS / Applies / Related Standards / Not applicable to this task, and read the
   Required Practices in full for anything in the first three buckets.

3. **Design system discovery** (UI/component work only). Read `DESIGN SYSTEM.md` and
`design-tokens.json` in full. Never approximate a hex/token value. Use mode-aware
   (light/dark) tokens, never a flat single value where the system defines a pair.
   Check for an already-established pattern for this kind of component before
   inventing a new visual treatment.

4. **Solution architecture discovery.** Explore the real repo — actual file
   structure, naming conventions, styling mechanism in real use, test setup — and
   prefer what the repo actually does over a standard's illustrative example.

5. **Write the plan to a file** using the structure of
`~/.claude/command-resources/feature-plan-template.md` **exactly** — this is the
   one centralised template for all plans in this repo; don't create a new one or
   restructure it per task type. Adapt section *content* to the task (e.g. props/API
   surface instead of request/response Contracts for a component; omit sections the
   template already says are conditional), but keep the template's structure.
   - File lives at `plans/<slug>.md` (create `plans/` if needed).
   - If it already exists for this task, edit it in place — never `-v2` variants.
   - Use `AskUserQuestion` for any remaining blocking questions before finalizing.
   - After writing, don't paste the full plan into chat — give a 2-4 sentence summary, 

     the file path, and ask for review.

6. **Review loop.** Wait for the developer's response. No implementation files yet.
   Edit the same plan file in place for requested changes. A reply that only answers
   one open question is not approval by itself — fold it in, then still wait for an
   explicit go-ahead ("approved", "go ahead", "ship it", etc.). If it's ambiguous
   whether a reply is approval, ask for confirmation.

   **Do not proceed to Phase 2 while the plan still has open `Clarifications Required`

   or `Open Questions` entries** — even if the developer says "approved." Point out the
   outstanding item(s) and get each one resolved explicitly first.

   Once approved with nothing outstanding, update the plan file's `## Approval` line to
`Status: APPROVED` .

### Phase 2 — Implement

Only after explicit approval with no outstanding items.

1. Re-read `plans/<slug>.md` from disk (not memory) and confirm `Status: APPROVED`.
2. Create/modify exactly the files in the plan's file table, in order. If scope needs
   to expand mid-implementation, pause, explain why, get confirmation, then update the
   plan table too — don't silently expand scope.
3. Apply every rule in the plan's Standards Applied (and, for UI work, Design System
   Applied) sections exactly as captured — re-open the source file if you need the
   exact detail again rather than reconstructing from memory of the plan.
4. Match real repo conventions discovered in Phase 1, including wiring up any
   exports/registrations needed to make the new code actually reachable.
5. Include every test the applicable standard requires — not optional follow-up.
6. Run build/tests/linter if tooling is available via Bash; fix failures before
   declaring done. If tooling isn't available, say so rather than claiming it passed.

### Phase 3 — Finalisation

Short summary of files touched, standards/design-system elements applied, and
anything still needing developer attention. Reference the plan file path again.

---

### Guardrails

* Never fabricate a standard's rule, a design token value, or a convention — re-check
  the source file rather than relying on a paraphrase from earlier in the conversation.
* Never skip Phase 1 or merge it into Phase 2, even for requests that look trivial —
  just keep the plan proportionately short.
* Never write implementation code during Phase 1.
* The plan file on disk under `plans/` is the authoritative record, not anything
  pasted into chat — keep it in sync through every revision and the final approval.
* If two applicable standards (or a standard and the design system) genuinely
  conflict for this task, don't resolve it by preference — record it under
  Clarifications Required, quote both sides, and block approval until the developer
  decides.
* This applies regardless of how the request is phrased — "create a plan for X", 
  "implement X", "fix X", "add X" all go through Plan → Execute the same way.
