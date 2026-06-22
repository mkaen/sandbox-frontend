# vibe-frontend

## Overview

Vibe-frontend is the frontend application for vibecoding. It communicates with vibe-backend (main backend application). The project uses a feature-based folder structure.

## Practice

### Authorization JWT

## Dependencies

* API — axios
* Store — pinia
* Code style — eslint
* Build and dev — Vite

### Install dependencies

```
npm install
```

## Structure

```
src/
├── App.vue
├── main.js
├── global.css
├── assets/
├── config/                  # app-wide configuration
│   ├── env.js               # env variables (API host, ports)
│   ├── api.js               # API base URL, prefixes, versions
│   └── axios.js             # axios instance (shared HTTP client)
├── features/                # feature modules (co-locate related code)
│   ├── auth/
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   └── RegistrationView.vue
│   │   └── authApi.js
│   ├── home/
│   │   └── views/
│   │       └── HomeView.vue
│   └── users/
│       └── userStore.js
├── shared/                  # code reused across features
│   ├── components/
│   │   ├── categories/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── ui/
│   └── utils/
│       └── validation.js
└── router/
    └── index.js
```

### Conventions

* **Feature owns its UI** — views, API calls, and stores for a domain live under `features/<name>/`.
* **Shared is cross-cutting** — components and utils used by multiple features go in `shared/`.
* **Config is global** — env, API paths, and the axios instance live in `config/`.
* **Router stays central** — `router/index.js` imports views from features. Per-feature route files can be added later when the app grows.
