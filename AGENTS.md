# sandbox-frontend — agent instructions

This file applies to the whole repository. Follow the existing architecture. Do not invent parallel patterns.

## Most important: professional solutions

Recommend and write a **professional** solution. Do not choose the “quick and as long as it works” path, even when it is shorter.

Professional means:

- the root cause is fixed, not the symptom papered over
- edge cases, errors, and permissions are thought through
- the change fits this app’s layers and lifecycle (view → store → API), not a one-off hack in a single file
- the code is simple and readable: clear names, short functions, little magic
- new code looks like the rest of the app, not a separate mini-framework

Simple is not the same as cheap. Simple is understandable and correct. Cheap is an empty `try/catch`, `console.log` as “error handling”, tokens in `localStorage`, validation only in the UI, or a new global “because it was faster”.

When the user asks for something that needs a real design (auth, file upload, permissions, session, API contract), **propose the right solution first**. If a compromise is necessary, say so clearly and name the technical debt — do not take the compromise by default.

## Going live — security is required

This app will be deployed to production soon. Treat every change as code that **ships to real users**. “Good enough for local/dev” is not acceptable. Do not defer security, auth, or data handling to a later hardening pass.

Frontend security rules:

- **No secrets in the client.** Anything in `VITE_*` or bundled JS is public. Never put API keys, upload keys, or credentials in env, source, or comments.
- **Tokens stay in HTTP-only cookies.** Do not read, store, or log tokens. Do not add `Authorization` headers with bearer tokens from frontend state.
- **UI checks are not authorization.** Route `meta` and store getters hide pages; the backend enforces access. Never invent a client-only “admin” or “owner” bypass.
- **Do not trust the browser.** Validate on the client for UX; assume the backend re-validates (auth, roles, file type/size, input length). Do not skip client checks “because the API will catch it” if that leaves users with a broken or unsafe flow.
- **XSS and unsafe HTML.** Do not use `v-html`, `innerHTML`, or `eval` with user-controlled data. Interpolate with Vue text bindings.
- **Do not log secrets or PII.** No passwords, tokens, cookies, or full payloads in `console.*`. Log only what is needed to debug (status, endpoint, correlation id).
- **Production URLs and transport.** Do not hardcode `http://127.0.0.1` or disable `withCredentials` “to make it work”. HTTPS and cookie credentials are the live setup; keep the client compatible with that.
- **Dependencies and shortcuts.** Do not add a library that weakens CSRF/XSS protections, stores sessions in `localStorage`, or talks to storage with a browser-side secret.

If a requested change cannot be done safely on the frontend, say so and point the work to the backend instead of shipping an unsafe workaround.

Do not over-engineer. Do not add libraries, abstractions, stores, or folders when an existing layer already does the job. This project does not need TypeScript, Vuex, a second HTTP client, or “enterprise” patterns it does not already use.

## Stack

Vue 3 (Composition API, `<script setup>`), Vite, Pinia, Vue Router, Axios, Bootstrap 5. Language is **JavaScript**, not TypeScript. Alias `@` → `src/`.

## Folders

```
src/
├── config/          # env, axios clients
├── constants/       # shared constants (lengths, roles, session)
├── composables/     # reusable behaviour (e.g. session timer)
├── utils/           # pure helpers (validation, formatter, image file checks)
├── components/      # shared UI: layout, ui, buttons, modals
├── features/        # domain: views, forms, and store together
│   ├── auth/
│   └── users/
├── views/           # app-level views (Home, NotFound, UserProfile)
├── router/          # the only route file
├── assets/
├── App.vue
└── main.js          # bootstrap: Pinia, interceptors, auth init, route guards
```

- A feature owns its UI, store, and domain logic: `features/<name>/`.
- Shared UI lives under `components/`, not inside a feature.
- Configuration (URLs, axios) lives under `config/`, not in a store or view.
- Constants (lengths, roles, enums) live in `constants/constants.js` — do not hardcode magic numbers in forms.
- The router stays central: `router/index.js`. Do not add per-feature route files until the app actually needs them.
- New code goes in an existing folder. Add a new folder only when no current role covers it.

The README structure diagram may be outdated. **`src/` is the source of truth**, not the README sketch.

## Data flow

```
Form (validate, emit) → View (coordinate) → Pinia store (API + state) → axios/config
```

- The form collects fields, validates, and emits a payload. The form does not call the API.
- The view listens for submit, calls a store action, navigates, and shows feedback.
- The store talks to the backend (`authApi` / `userApi`) and updates state. Getters derive permissions (`isAuthenticated`, `isAdmin`).
- HTTP clients, headers, and token refresh live in `config/api.js`, not in a component.

Do not call axios from a view or form when the matching store already exists. Do not duplicate user state into a local `ref` when Pinia is the source.

## Auth, cookies, session

Access and refresh tokens live in **HTTP-only cookies**. The frontend never reads, writes, or stores tokens (`localStorage`, `sessionStorage`, Pinia — never). Axios: `withCredentials: true`.

Session restore:

1. App start: `authStore.initalizeAuth()` → `POST /auth/refresh`.
2. API 401: the interceptor calls `refreshToken()`, queues concurrent 401s, and retries the original request.
3. Skip refresh for: `/login`, `/register`, `/refresh`, `/logout`.
4. Failed refresh → `logout()` + redirect to `/login`.

Route guards live in `main.js` (`requiresAuth`, `requiresAdmin`, `requiresSelfOrAdmin`). Permission checks must stay consistent with store getters. Do not rely on hiding UI alone.

Inactivity timer: `composables/sessionManager.js`. Login/refresh starts the session; logout stops it. Do not build a second timer.

Tracing: `X-Correlation-ID` (session scope), `X-Request-ID` (every request). Do not remove or bypass these headers.

## API

- Clients: `authApi`, `userApi` in `src/config/api.js`. Base URLs come from `config/env.js` + `API_PREFIX` / `ENDPOINT_VERSION`.
- New endpoint: add a prefix in `api.js` if needed, use the existing client, do not create a new axios instance “for a quick test”.
- Env variables: `VITE_*` in `env.js`. Do not scatter `import.meta.env` reads across the codebase.

## Images

All user images are served and stored by the **backend**. The frontend never talks to object storage (no R2, no CDN worker, no direct PUT/DELETE to a bucket).

- **Read:** fetch image bytes/URLs from backend endpoints (e.g. `userApi.get('/image/:userId')`). Display what the backend returns. Do not build public object URLs on the client.
- **Write:** upload the file to the backend (e.g. `userApi.post('/upload-profile-image/:userId', file)`). The backend owns storage, replacement, and deletion.
- **Delete / account removal:** call the backend user API. Do not delete objects from the client.
- Client-side checks still run before upload via `validateProfileImageFile` (MIME + magic bytes, HEIC rejected, max 5 MB). Do not trust the `accept` attribute alone.
- Do not reintroduce `config/r2.js`, `VITE_R2_*`, upload keys in the browser bundle, or `imageReference`-based object-store URLs.

Static UI assets (logo, default avatar, icons) stay in `src/assets/`. Those are not user images.

## Vue and Pinia

- `<script setup>` and Composition API only. Do not add Options API components.
- Shared base components are global: `base-card`, `confirmation-button`, `notification-modal`. Use them; do not copy markup.
- Form fields follow `{ value, isValid }` (plus `error` / `match` when needed). `@blur` clears the error (`clearValidity`).
- Store: `defineStore`, clear `state` / `actions` / `getters`. An action returns a meaningful result (`true`/`false`, data, or a structured error), not a silent `undefined` on success.
- IDs: compare as strings (`String(id)`), because backend and route params may differ in type.

## UI

- Layout: Bootstrap utilities (`d-flex`, `container`, `form-control`, …) plus component `scoped` CSS.
- Global colours/fonts: `global.css` CSS variables. Do not add a second design system.
- Navigation: `RouterLink` / `router.push`, not raw `<a href>` for in-app routes.
- Modals: existing `notification-modal` + `defineExpose({ openModal, closeModal })`. Do not bring in another modal library.

## Code quality

- Names describe intent. Prefer a small single-purpose function over a long comment.
- Do not duplicate validation rules — use `constants` and `utils/validation.js` / `utils/imageFile.js`.
- Errors: log with context, return a result the UI can use, do not swallow exceptions with an empty `catch`. Auth failures must end in a known state (e.g. logout), not “half logged in”.
- Do not rename public contracts (store actions, events, route names) in passing. If you fix a typo in a public name, update the whole chain on purpose.
- Do not commit secrets (`.env`, keys, cookies).
- Do not add a dependency when Vue / Pinia / axios / Bootstrap can do it.
- Refactor only what the task touches. Do not “clean the whole file” when you were asked to fix one bug.

## Examples

```js
// BAD — hack: take the token and carry it around
localStorage.setItem('accessToken', token)
api.defaults.headers.Authorization = `Bearer ${token}`

// GOOD — cookies + existing client
await authApi.post('/login', payload) // withCredentials: true
```

```js
// BAD — “works” if you ignore the error
try {
  await userApi.put(`/update/${id}`, data)
} catch (e) {}

// GOOD — status, user, known failure
const response = await userApi.put(`/update/${id}`, data)
if (response.status !== 200) return
this.setUser(response.data)
return response.data
```

```js
// BAD — new axios in a view because it was faster
const { data } = await axios.get(`http://localhost:8000/v1/users/${id}`)

// GOOD — store + existing client + permissions
async fetchUserById(id) {
  if (!this.isSelf(id) && !this.isAdmin) return
  const response = await userApi.get(`/${id}`)
  // ...
}
```

```js
// BAD — frontend talks to object storage
await fetch(`${r2WorkerUrl}/${folder}/${imageReference}`, { method: 'PUT', body: file })

// GOOD — backend owns the file
await userApi.post(`/upload-profile-image/${userId}`, file, {
  headers: { 'Content-Type': file.type },
})
const image = await userApi.get(`/image/${userId}`)
```

If you are choosing between two solutions, pick the one you would leave in production and that another developer can understand without a verbal walkthrough.
