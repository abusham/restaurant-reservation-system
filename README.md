# Foodics Restaurant Reservation System (Technical Challenge)
## Abdullah Abu Sham | abusham_93@hotmail.com | +962795074251

## Getting Started:
## Required .env file
#### VITE_API_BASE_URL=https://api.foodics.dev/v5
#### VITE_API_TOKEN={your_token}

## Install dependencies
pnpm install

## Serve with hot reload
pnpm dev

## Build for production
pnpm build

## Setup and libraries:
- 🛠 [Vue 3 - (Composition API)](https://v3.vuejs.org/guide/introduction.html)
- ⚡️ [Vite](https://vitejs.dev/guide)
- 🧩 [Typescript](https://www.typescriptlang.org/docs/)
- 🕸️ [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- 🗂 [PNPM](https://pnpm.io)
- 🛣 [Vue Router](https://github.com/vuejs/vue-router-next)
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs)
- 📣 [Vue3-Toastify](https://www.npmjs.com/package/vue3-toastify)

## Project Structure
### Components
#### • Layout: AppHeader.vue / AppFooter.vue
#### • UI: BaseButton.vue - Button component / BaseModal.vue - Base modal wrapper
#### • Modals: ConfirmationModal.vue - Generic confirmation dialog  / AddBranchesModal.vue - Enable reservations for branches / EditBranchModal.vue - Edit branch reservation settings
#### • Reservations: ReservationsTable.vue - Main table displaying branches

### Composables - Vue composables for shared logic
#### • useReservations.ts - Reservation state and business logic

### Directives - Custom Vue directives
#### • clickOutside.ts - Click-outside detection directive

### Pages
#### • reservations.vue - Main reservations page
#### • not-found.vue - 404 page

### Services - API communication layer
#### • api.ts - API service

### Types - TypeScript type definitions
#### • reservations.ts - Reservation-related interfaces

### Routes
#### • routes.ts - App routes

### Vite
#### • vite.config.ts - contains server proxy to overcome CORS locally

## Features
#### • View all branches with reservations enabled
#### • Enable reservations for new branches (multi-select)
#### • Edit branch settings: duration and time slots per day (up to 3 slots)
#### • Disable reservations per branch or all branches at once
#### • Fully responsive design

## API Integrations
#### •  GET /branches?include[0]=sections&include[1]=sections.tables - Fetch branches with nested sections and tables
#### •  PUT /branches/:id - Update branch settings (enable/disable reservations, duration, time slots)
#### The application makes parallel API calls when enabling/disabling multiple branches, then refreshes data once to minimize network requests.

## Architecture Decisions
#### • Singleton Composable Pattern - useReservations.ts uses shared state (defined outside the function) to ensure all components accessing the composable share the same data, preventing duplicate API calls and keeping the UI in sync.
#### • Service Layer - api.ts handles all API communication with proper error handling, authentication, response normalization and centralized toast usage.
#### • TypeScript - Full type safety with interfaces in types/reservations.ts for better developer experience and compile-time error detection.
#### • Vite Proxy - Configured to proxy /api/* requests to Foodics API, avoiding CORS issues during development.
#### • Unified Modal Component - BaseModal.vue provides reusable modal structure with header, content, and footer slots, reducing code duplication across different modal types.

## Known Limitations & Possible Improvements
#### • Pagination Challenges: The API returns paginated results (50 branches per page), but the requirement to filter only branches with accepts_reservations: true makes traditional pagination impractical. To properly implement pagination, we would need either: A server-side filter parameter (e.g., ?accepts_reservations=true) or start displaying all branches and start showing status in a column.
#### • Bulk Operations - No bulk update endpoint exists for disabling multiple branches simultaneously. Currently, the application makes parallel API calls when disabling all reservations, which could hit rate limits with many branches. A batch endpoint like PUT /branches/bulk would be more efficient.
#### • Table Reservation Settings - Based on the API documentation, there's no apparent way to update the accepts_reservations flag on individual tables within sections. The edit modal shows tables that already accept reservations, but cannot toggle this setting. This would require endpoints like PUT /sections/:id/tables/:id with updatable accepts_reservations field.

## Final notes
#### • Provided demo URL is hosted on a personal AWS Amplify account, and token is being read from environment variables so it doesn't get exposed.
#### • The github repo is public at the moment only to allow sharing it with Foodics team.