# Recreate Scholarly Atelier as a React Web App

You are picking up an existing **React Native + Expo** todo-list app ("Scholarly Atelier") and rebuilding it as a **React web app**. The original RN project lives in a sibling folder and is your **read-only source of truth** for features, DTOs, endpoints, and product behavior. Treat it as a spec, not as code to port line-by-line.

## Execution mode: BUILD, don't ask

- **Do not propose a plan.** Do not produce a "here's what I'll do" message and wait for approval.
- **Do not ask clarifying questions** unless something is truly impossible to decide from this document + the RN reference (in which case, pick the closest RN behavior and add a `// TODO(verify):` comment instead of stopping).
- **Just implement.** Read the RN reference for the slice you're working on, build the slice end-to-end, move to the next slice. Use the suggested order at the bottom of this doc.
- The `build-web-feature` skill's propose-then-build flow is for **future, user-initiated features after v1 ships** — not for this initial recreation pass. During the recreation, skip Steps 1–4 of that skill and go straight to "build" + "report" at the end of each slice.

## Ground rules

1. **Do not import or copy RN/Expo/NativeWind code.** Look, understand, reimplement for the web with web-native patterns.
2. **Do not modify the RN project.** It stays as the reference app.
3. **Same backend, same endpoints, same DTOs, same Firebase project.** All API contracts and field names are fixed — the backend doesn't know it's talking to a different client.
4. **Web-native redesign is allowed and expected.** Don't recreate iOS modal sheets on the web. Use a sidebar layout on desktop, stack on mobile, hover/focus states, keyboard support, browser history. The brand (colors, icons, copy) stays; the layout adapts to the medium.
5. **Spanish copy stays Spanish.** All user-facing strings (errors, labels) are in Spanish in the RN app and stay in Spanish here.

## Where the new app lives

- Sibling folder: `../todo-list-web` (already scaffolded with Vite + React + TS + Tailwind v4 + CLAUDE.md + skills before you started).
- The RN project is at `../todo-list` — read it, never edit it.

## Stack (locked)

| Concern | Pick | Notes |
|---|---|---|
| Build | **Vite + React 19 + TypeScript** | Already scaffolded |
| Styling | **Tailwind CSS v4** | Already configured |
| Routing | **React Router v7** (data routers, `createBrowserRouter`) | File layout under `src/routes/`, route guards mirror RN's `(app)` / `(auth)` split |
| State (client) | **Zustand + persist middleware** (localStorage) | Mirror `useAuthStore` from RN; persist `token` + `user` |
| Server state | Plain typed axios services + React component-level `useEffect` / local state | No TanStack Query for v1 — match the RN pattern of one-shot services with `try/catch → console.error → throw or return empty` |
| HTTP | **axios** with interceptors | Port the RN `api.ts` interceptor logic (attach Firebase JWT, single-flight refresh on 401, sign out on refresh failure) |
| Auth | **Firebase Web SDK** (`firebase/auth` browser build) | Persistence: `browserLocalPersistence` |
| Storage | **Firebase Storage Web SDK** | Profile photos — upload `File` from `<input type="file">`, no XHR-to-blob workaround needed |
| Icons | **lucide-react** | The RN app uses SF Symbols / Material icons via `IconDTO`. Map `IconDTO.name` (or `iosName`/`androidName`) to the closest lucide icon. Build a `<IconBadge name={icon.name} />` that does the mapping in one place. |
| Forms | Plain controlled inputs + local validation | Match RN — no react-hook-form unless it gets unwieldy |
| Toast / errors | Inline error UI + a global `<ErrorModal />` for blocking errors, matching the RN pattern | |

## Folder layout

```
src/
  routes/                       # React Router route components
    _root.tsx                   # <Outlet/> + auth hydrate gate
    auth/
      layout.tsx                # redirects to /home if logged in
      login.tsx
      signup/
        index.tsx               # step 1 — email/password
        general-info.tsx        # step 2 — name, role, interests, photo
        confirm.tsx             # step 3 — review + submit
    app/
      layout.tsx                # redirects to /login if not logged in; renders sidebar + <Outlet/>
      home.tsx                  # today's tasks + paginated task lists
      explore.tsx               # search across lists + tasks
      account.tsx               # profile + logout
      tasklist/
        $id.tsx                 # task list detail
        add.tsx                 # create list  (web: dialog OR /tasklist/new, see "Modals on web")
        $id.edit.tsx            # edit list
        $id.task.add.tsx        # add task to list
        task.$taskId.edit.tsx   # edit task
  components/                   # reusable UI kit (port of project_components)
    button/  icon-badge/  task-card/  list-card/  ...
  services/
    axios/                                                  # MIRROR RN: src/services/axios/
      api.ts                    # axios instance + request/response interceptors (port from RN)
      errors.ts                 # shared error helpers (port from RN)
      tasks/
        getTodayTasks.ts        # one file per endpoint, same filenames as RN
        getTaskById.ts
        registerTask.ts
        updateTask.ts
        setTaskCompleted.ts
        deleteTask.ts
      tasklists/
        getUserTaskLists.ts
        getTaskList.ts
        getTaskListTasks.ts     # from src/types/taskLists/getTaskListTasks.ts in RN — actually a service
        registerTaskList.ts
        updateTaskList.ts
        deleteTaskList.ts
      users/
        getUserById.ts
        createUser.ts
      icons/
        getIcons.ts
      search/
        search.ts
    firebase/                                               # MIRROR RN: src/services/firebase/
      firebase.ts               # initializeApp(firebaseConfig) — same shape as RN
      auth.ts                   # initialize Auth + setPersistence(browserLocalPersistence)
      storage.ts                # getStorage(app)
      authService.ts            # login / logout / register / registerUserWithDetails + Spanish error maps (port verbatim)
  stores/
    auth.ts                     # Zustand + persist (localStorage)
  types/                        # mirror src/types/ from RN, 1:1 (same field names, same enums)
  lib/
    priority.ts                 # alta↔HIGH, media↔MEDIUM, baja↔LOW
    date.ts                     # toLocalDateTimeNoTZ(date) → "YYYY-MM-DDTHH:mm:ss"
  index.css                     # Tailwind v4 entry + brand tokens
  main.tsx
```

## Firebase + API structure: mirror RN exactly

The folder shape, filenames, and module boundaries under `src/services/firebase/` and `src/services/axios/` are **fixed**. Match the RN repo 1:1 — same files, same names, same responsibilities, same export shape. Only swap RN-specific bits for web equivalents inside each file. This is non-negotiable because (a) it makes the diff against the RN app trivial to review and (b) future cross-references between the two apps stop working the moment names drift.

### `src/services/firebase/` — initialize first, then services

Build in this order, one file at a time, each file standalone-compilable:

1. **`firebase.ts`** — `initializeApp(firebaseConfig)`, exports `app`. Config reads `import.meta.env.VITE_FIREBASE_*`. Same shape as RN, just `EXPO_PUBLIC_` → `VITE_`.
2. **`auth.ts`** — initialize Auth on `app`, call `setPersistence(auth, browserLocalPersistence)`, export `auth`. Web analog of RN's `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`. Wrap in the same try/catch fallback to `getAuth(app)` so HMR doesn't double-initialize.
3. **`storage.ts`** — `getStorage(app)`, export `storage`.
4. **`authService.ts`** — `login`, `logout`, `register`, `registerUserWithDetails`. Port the Spanish `LOGIN_ERROR_MESSAGES` / `REGISTER_ERROR_MESSAGES` maps and the `mapAuthError` helper **verbatim**. For `registerUserWithDetails`: web replaces the XHR-to-blob workaround with a direct `File` from `<input type="file">` passed to `uploadBytes`.

### `src/services/axios/` — instance + interceptor first, then service functions

Build in this order:

1. **`api.ts`** — create the axios instance, then attach both interceptors. Port the RN logic almost verbatim:
   - `baseURL: import.meta.env.VITE_API_URL`, `timeout: 30000`.
   - **Lazy auth-store import** to avoid circular deps at module load (same pattern as RN).
   - **Single-flight refresh** via module-level `refreshPromise` — multiple concurrent 401s share one `getIdToken(true)` call.
   - **Request interceptor**: prefer live `auth.currentUser.getIdToken()`, sync the result into the store via `setToken` if it drifted, fall back to the persisted token if Firebase hasn't rehydrated yet, attach `Authorization: Bearer <token>` when present.
   - **Response interceptor**: on `401` with no `_retry` flag, set `_retry`, call `refreshIdToken()`, retry the original request with the new token; on refresh failure, call `signOut()` on the store (the route guard handles the redirect).
2. **`errors.ts`** — shared error helpers (port whatever the RN file exports).
3. **Service functions** — only after `api.ts` compiles. One file per endpoint, filenames identical to RN. Each function: `try { return (await api.X(...)).data; } catch (e) { console.error("..."); throw e; }` for mutations, `return <empty>` for queries. Import the axios instance as `import api from "../api"` (relative path matches RN).

### Order of implementation for the services layer (do this in one pass, no questions)

```
1. firebase/firebase.ts
2. firebase/auth.ts
3. firebase/storage.ts
4. firebase/authService.ts
5. axios/api.ts          ← interceptors live here, must compile against firebase/auth + stores/auth
6. axios/errors.ts
7. axios/users/*         ← needed by login flow
8. axios/icons/*
9. axios/tasklists/*
10. axios/tasks/*
11. axios/search/*
```

The Zustand `auth` store (`src/stores/auth.ts`) must exist before step 5 because the interceptor imports it lazily. Build the store at step 0 or step 4.5.

## Endpoints (port these exactly — DO NOT rename fields)

Base URL: `import.meta.env.VITE_API_URL` (no trailing slash).

| Method | Path | Body / params | Response |
|---|---|---|---|
| GET  | `/user?firebaseUuid=<uid>` | — | `UserDTO` |
| POST | `/user` | `CreateUserDTO` | `UserDTO` |
| GET  | `/tasklist/with-oldest-pending?page=<n>` | — | `TaskListWithOldestPendingPageDTO` |
| GET  | `/tasklist/{id}` | — | `TaskListDTO` |
| POST | `/tasklist` | `createListDto` | (see RN — currently no return type used) |
| PATCH| `/tasklist/{id}` | `UpdateTaskListDto` | `TaskListDTO` |
| DELETE| `/tasklist/{id}` | — | `TaskListDTO` |
| GET  | `/tasklist/{id}/task` | — | `TaskDTO[]` |
| GET  | `/task/today` | — | `taskColorDto[]` |
| GET  | `/task/{taskId}` | — | `TaskDTO` |
| POST | `/task` | `CreateTaskDto` | `TaskDTO` |
| PATCH| `/task/{taskId}` | `UpdateTaskDto` | `TaskDTO` |
| PATCH| `/task/{taskId}/completed` | `{ completed: boolean }` | `TaskDTO` |
| DELETE| `/task/{taskId}` | — | `TaskDTO` |
| GET  | `/search?q=<query>` | — | `SearchResultDTO` |
| GET  | `/icon` | — | `IconDTO[]` |

**DTO rules (carry over from RN — they're backend contracts):**
- Java boolean getters serialize without the `is` prefix: use `completed`, not `isCompleted`. (Exception: `taskListWithOldestPending` returns `isCompleted` on its embedded `BackendTaskDTO` — match the RN type exactly.)
- `taskListIds` is always an array of numbers.
- `priority` enum on the wire is `HIGH | MEDIUM | LOW`. UI picker uses `alta | media | baja`. Convert at the boundary.
- `dueDate` is a Java `LocalDateTime` — send `date.toISOString().split(".")[0]` (no timezone, no millis).

## Features to ship (parity with the RN app)

### Auth
- **Login** (email + password) → Firebase Auth → get ID token → `GET /user?firebaseUuid=` → store `{ user, token }` in Zustand + localStorage → redirect to `/home`.
- **Sign-up, 3 steps**:
  1. Email + password
  2. Full name, role, interests, description, profile photo (`<input type="file" accept="image/*">`, preview)
  3. Confirm → `createUserWithEmailAndPassword` → upload photo to Firebase Storage at `profiles/{uid}.jpg` → `POST /user` with `CreateUserDTO` (including `firebaseUuid` and `firebaseImageUuid` URL) → sign in.
- **Error mapping** — port the Spanish error map from `authService.ts` verbatim.
- **Logout** — `signOut(auth)` + clear store.
- **Session persistence** — `setPersistence(auth, browserLocalPersistence)` + Zustand `persist` middleware. On app boot, wait for `onAuthStateChanged` once before rendering protected routes.
- **401 handling** — interceptor refreshes ID token once via `currentUser.getIdToken(true)`, single-flight, retries the original request; on refresh failure → `signOut()` → React Router navigates to `/login`.

### Home (`/home`)
- **Today's tasks** row at the top — `GET /task/today`, horizontal scroll on mobile, grid on desktop, colored by `taskListColor`.
- **Your task lists** — paginated `GET /tasklist/with-oldest-pending?page=N`, infinite scroll OR "Load more" button (your call), shows name, color, icon, progress bar, oldest pending task.
- Empty state, loading skeleton, error state.

### Explore (`/explore`)
- Search bar, debounced ~300ms.
- `GET /search?q=` → render two sections: matched lists, matched tasks.
- Empty state for "no query" and for "no results".

### Task list detail (`/tasklist/:id`)
- Header with color + icon + name + description + edit/delete buttons.
- Tasks: `GET /tasklist/:id/task`, sorted however the RN app sorts them (check `src/app/tasklist/[id].tsx`).
- Toggle complete → optimistic update → `PATCH /task/:taskId/completed` → rollback on failure.
- Delete task → confirm dialog → optimistic remove → `DELETE` → rollback on failure.
- "Add task" button → opens add-task UI.

### Add / edit task
- Fields: title, description, due date (datetime picker), priority (alta/media/baja), task lists multi-select.
- Submit: `POST /task` or `PATCH /task/:taskId` with proper DTO shape (priority converted, date formatted).

### Add / edit task list
- Fields: name, color (color wheel/swatches), icon (pick from `GET /icon`), description.
- Submit: `POST /tasklist` or `PATCH /tasklist/:id`.

### Account (`/account`)
- Profile photo, full name, email, role, interests, description.
- Logout button → confirm → sign out → redirect to `/login`.

### Modals on web
- **Don't reuse the RN "modal sheet" pattern.** On web, "add task" / "edit task" / "add list" / "edit list" should be:
  - Desktop: a centered `<dialog>` / Radix-style modal, OR a dedicated route — pick one and apply consistently.
  - Mobile width: bottom sheet OR full-page route.
- Use the `<DeleteConfirmModal>` / `<ErrorModal>` / `<LoadingModal>` pattern, but as web dialogs (focus trap, ESC closes, click-outside closes for non-destructive ones).

## Environment

`.env.example` (web):
```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=
```

Reuse the same Firebase project as the RN app so logins work across both.

## Conventions (mirror AGENTS.md from the RN repo where they still make sense)

- **Services**: one file per endpoint, `try/catch → console.error → throw` for mutations, `return empty value` for queries.
- **Types**: one folder per domain under `src/types/`, names match the RN repo exactly. The RN repo has some quirky casing (`createListDto` lowercase) — match it so you can cross-reference without translating.
- **Components**: each reusable component in its own folder `src/components/<kebab-name>/<Name>.tsx` + `index.ts`, re-exported from a barrel `src/components/index.ts`.
- **No `any`.** If the backend types are missing a field, add it to the DTO file with a comment.
- **Server data does NOT live in `useState`.** Fetch in `useEffect`, store in a `useState` next to the fetch, expose loading/error flags. (If this gets painful past v1, swap in TanStack Query in a follow-up — but ship v1 with the RN-style pattern so the diff is small.)

## How to work

**During the initial recreation, you do not propose and you do not ask.** Implement each slice end-to-end against this document + the RN reference, then move to the next slice. The `build-web-feature` skill in `.claude/skills/build-web-feature/` exists for **post-v1 feature work** initiated by the user — ignore its propose-then-build flow during this recreation and just build.

For each slice:

1. Read the matching RN screen + the services it calls.
2. Build in dependency order: types → service(s) → store changes (if any) → component(s) → route → wire to navigation.
3. Report what shipped in one short message. Move to the next slice without waiting for approval.

The only time to stop and ask is if a slice is genuinely impossible to implement from this doc + the RN reference (rare). Otherwise, when in doubt: do what the RN app does, leave a `// TODO(verify):` comment, keep moving.

## Order of work (do this top-to-bottom, no check-ins)

1. **Foundation, in this exact order**:
   1. `.env` + `.env.example` with `VITE_*` keys.
   2. `src/types/` — port every domain folder from RN (`users`, `tasks`, `taskLists`, `icons`, `search`, `colors`) 1:1, same filenames, same field names.
   3. `src/stores/auth.ts` — Zustand + `persist` middleware (localStorage), same `signIn` / `setToken` / `signOut` / `hydrate` API as RN.
   4. `src/services/firebase/firebase.ts` → `auth.ts` → `storage.ts` → `authService.ts`.
   5. `src/services/axios/api.ts` (instance + both interceptors) → `errors.ts`.
   6. `src/services/axios/users/*` (needed for login).
   7. Router shell: `_root.tsx` with auth hydrate gate (await Firebase `onAuthStateChanged` once before rendering protected routes), `auth/layout.tsx` and `app/layout.tsx` guards, sidebar component, `lib/priority.ts`, `lib/date.ts`.
   8. Login screen end-to-end against the live backend.
2. **Remaining axios services** — `icons`, `tasklists`, `tasks`, `search`. Build all of them now so feature screens just consume.
3. **Sign-up flow** (3 steps), Storage upload, `POST /user`.
4. **Home** — today + task lists paginated.
5. **Task list detail** — list tasks, toggle complete (optimistic), delete (optimistic).
6. **Add / edit task** (dialog or dedicated route — pick one, apply consistently).
7. **Add / edit task list** + icons + color picker.
8. **Explore / search** (debounced 300ms).
9. **Account / logout**.
10. **Polish** — empty states, error states, loading skeletons, keyboard nav on dialogs, responsive sweep.

## Acceptance for v1

- Logs in with an existing RN-app account (same Firebase project).
- Lists, tasks, completions made on web show up in the RN app and vice versa.
- All CRUD flows work end-to-end against the live backend.
- 401 with an expired token triggers a silent refresh + retry; only a hard refresh failure logs the user out.
- No `console.error` in normal flows; only on actual service errors.
- Mobile (≤ 640px) and desktop (≥ 1024px) layouts both work without horizontal scroll.

## What NOT to do

- Don't bring in expo-router, NativeWind, react-native, `@/tw`, or anything from `react-native-*`.
- Don't rename DTO fields to "fix" them.
- Don't introduce a new state library, router, or query lib without flagging it first.
- Don't translate Spanish copy to English.
- Don't build iOS-style sheet modals on desktop.
- Don't edit the RN project to "match" something — the RN app is the spec.