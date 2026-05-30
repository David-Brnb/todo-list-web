---
name: build-web-feature
description: Build a new web feature in this React + Vite + Tailwind project (the web port of the Scholarly Atelier RN app). Use whenever the user says "build", "add", "create", "scaffold", or "make" a page, screen, route, form, list, dialog, or any UI that consumes a backend endpoint. Flow is propose-then-build — read the matching RN screen as the spec, propose the full plan across all layers (types, axios service, store/state, route, components, JSX), let the user approve, then build it end to end and ask about gaps.
---

# Building web features

This project is the **web port** of an existing React Native app at `../todo-list`. The RN app is the **spec** — for every feature you build, the equivalent RN screen + the services it calls are your source of truth for behavior, DTOs, copy, and edge cases. You're not porting code; you're reimplementing for the web.

The flow is **propose-then-build**: user describes what they want → you read the RN reference → propose the full plan → they approve or revise → you build it → you ask about anything that wasn't covered.

The build order is fixed and follows the dependency chain so the code compiles incrementally:

1. **Types** — DTOs from the backend, mirrored from `../todo-list/src/types/`.
2. **Axios services** — one function per endpoint, typed with the types above.
3. **Store / local state** — only if the feature touches global state (e.g. auth).
4. **UI** — route, layout, local state, side effects, derived values, handlers, then JSX.
5. **Wire-up** — register the route, link from the sidebar / parent screen.
6. **Open questions** — components that don't exist, states the RN app didn't have a clear analog for, web-only states (hover, focus, keyboard).

## Step 1 — Read the RN reference first

Before proposing anything, find the matching RN code and read it. Don't skip this — the RN app encodes business decisions (optimistic update behavior, error mapping, sort order, what counts as "today") that aren't anywhere else.

For a feature about screen X, read:
- The RN route file under `../todo-list/src/app/...`
- Every service it imports from `../todo-list/src/services/axios/...`
- Every type it imports from `../todo-list/src/types/...`
- Reusable components it uses from `../todo-list/src/project_components/...` (you'll reimplement these for web, but the props and behavior should match).

If a service or type you need already exists in the web project (`src/services/`, `src/types/`), reuse it — don't re-add.

## Step 2 — Listen, ask only what blocks a useful proposal

The user describes what they want. Usually they'll name a screen ("rebuild the explore / search screen") or a flow ("add-task dialog"). Don't fire a checklist. If you genuinely need one or two specifics first ("dialog or dedicated route for add-task?"), ask inline. Otherwise go straight to the proposal.

## Step 3 — Propose the full plan

Lay out everything in one coherent proposal, organized by layer. Be specific: real names, real types, real paths, real endpoint URLs. Mark guesses with a trailing `?`.

Use this structure:

### RN reference
- The RN file(s) you read and the key behaviors you're inheriting (sort order, optimistic-update semantics, Spanish copy you'll reuse verbatim, error mapping, etc.). One or two sentences each — enough that the user can spot if you misread something.

### Types
- DTOs needed: which already exist in `src/types/`, which need to be added, mirrored from RN.
- Same field names as the backend / RN (`completed` not `isCompleted`, `taskListIds`, `HIGH | MEDIUM | LOW`, etc.).

### Services
- One function per endpoint: name, signature, URL, method, body type, return type.
- File path under `src/services/<domain>/<action>.ts`.
- `try/catch → console.error → throw` for mutations; `return empty value` for queries — match the RN pattern exactly.

### Store / global state
- Skip this section if no global state is touched.
- If you do touch it, name the store, what fields change, what actions you'll add.

### Route
- Route path (e.g. `/tasklist/:id/edit`).
- Whether it's a full page, a nested route, or a dialog overlay.
- Auth gate (under `routes/app/...` for protected, `routes/auth/...` for public).

### UI
- **Components reused vs. new** — list every existing component (Button, IconBadge, TaskCard…) and every new one to build. New components are flagged here so the user knows to expect questions in Step 6.
- **Local state** (`useState`): only for UI concerns (dialog open, active tab, controlled inputs, the request's loading/error/data triple).
- **Form state**: list the fields and their validation rules. Plain controlled inputs by default; only reach for react-hook-form if the form has >8 fields or cross-field validation.
- **Side effects** (`useEffect`): **omit this bullet entirely if the only effect is the initial fetch** — that's expected and doesn't need calling out. Only list effects that aren't "fetch on mount": URL/searchParams sync, event listeners (keydown for ESC), focus management, debounced search, etc.
- **Derived values**: variables computed from `data` + local state.
- **Handlers**: `onClick`, `onSubmit`, `onChange` — what they call.
- **JSX states**: loading, error, empty, success — in that order, with early returns.
- **Responsive**: one sentence on mobile (≤ 640) vs. desktop (≥ 1024) layout differences.

### Open questions
- Any component / icon / state not yet defined.
- Any web-only concern (keyboard nav, focus trap, ESC behavior, URL persistence of filters).
- Any field the backend returns that the UI doesn't have a place for.

End the proposal with: **"Approve as-is, or want changes?"**

## Step 4 — Iterate

If the user revises, update only the parts that changed. Keep iterating until they approve.

## Step 5 — Build

Once approved, implement in this exact order — no check-ins between layers, just build:

1. **Types** in `src/types/<domain>/<file>.ts`. Mirror the RN file 1:1 (same name, same fields, same casing). Export everything.
2. **Services** in `src/services/<domain>/<action>.ts`. One file per endpoint. Pull the axios instance from `src/services/api.ts`. Pattern: `try { return (await api.X(...)).data; } catch (e) { console.error("..."); throw e; }` (or return empty for queries).
3. **Store changes** in `src/stores/<name>.ts`. Only if needed.
4. **Component file(s)** under `src/components/<kebab-name>/<Name>.tsx`, with `index.ts` re-export and a one-line addition to `src/components/index.ts`. Compose from existing primitives before making new ones.
5. **Route file** under `src/routes/...`. Inside the route component, write code in this order:
   1. `useState` (UI state, controlled inputs, `data/loading/error` triple)
   2. `useEffect` (initial fetch; debounced search; ESC listeners — each with a one-line reason)
   3. Derived values (plain consts, `useMemo` only when measurable)
   4. Handlers (`onClick`, `onSubmit`, `onToggle`…)
   5. Early returns: `if (loading) return <Spinner />`, `if (error) return <ErrorState />`, `if (!data?.length) return <Empty />`
   6. JSX for the success state
6. **Wire up**: register the route in the router config, add the sidebar / nav link if it's a new top-level screen.

If you hit something genuinely ambiguous mid-build (a field shape the RN app handles but the proposal didn't, an optimistic-update edge case), stop and ask. Don't silently guess.

## Step 6 — Report and ask about gaps

When everything's done:
- Full list of new and modified files, grouped by layer (types / services / stores / components / routes), paths relative to project root.
- One sentence on anything you decided that wasn't in the approved plan.
- **Then ask about the gaps flagged in the plan's "Open questions" section**, one at a time:
  - "El RN tiene un `LoadingModal` durante el guardado. En web lo hice como botón deshabilitado con spinner inline — ¿lo dejamos así o quieres un dialog bloqueando como en RN?"
  - "El icono `book.closed` del RN no tiene equivalente directo en lucide-react. Usé `BookMarked`. ¿OK o prefieres otro?"
  - "La búsqueda en RN no tiene debounce — agregué 300ms en web porque es teclado físico. ¿Lo dejamos?"

## Rules during the build

- **Web-native first.** No iOS modal sheets on desktop. No `Pressable`. No `@/tw`. No `react-native-*` imports — ever.
- **DTO field names match the backend exactly.** `completed`, `taskListIds`, `HIGH | MEDIUM | LOW`. If the RN type says it, the web type says it.
- **Spanish copy stays Spanish.** Don't translate user-facing strings.
- **Priority + date conversions** live in `src/lib/priority.ts` and `src/lib/date.ts` — use them, don't inline conversions in components.
- **Server data does not live in `useState` long-term.** It lives in the `data` half of a `data/loading/error` triple next to its fetch. Don't copy it into separate `useState`s downstream — derive instead.
- **Optimistic updates**: when the RN screen does them (toggle complete, delete task), the web does them too. Update local state immediately, fire the request, rollback on `catch`.
- **Mirror existing patterns.** Before creating a new service or component, look at how the closest existing feature is structured and match that shape. Don't refactor unrelated code.
- **Reuse over rebuild.** Existing components / services / types in the web project come first. RN reference comes second. Only invent when both are silent.

## When NOT to use this skill

- Pure refactors with no new feature surface (use a normal edit flow).
- Tweaking copy or styling on an existing screen (just edit).
- Adding a new backend endpoint (that's a backend task, not a web one).
- Anything in the RN project — the RN project is read-only reference, never touched.