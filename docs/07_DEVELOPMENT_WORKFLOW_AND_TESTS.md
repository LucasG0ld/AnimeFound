# 07_DEVELOPMENT_WORKFLOW_AND_TESTS.md

## 1. Task Breakdown (Step-by-Step)
Do not attempt to build everything at once. Follow this sequence:

1.  **Phase 1: Foundation**
    *   Init Expo project.
    *   Setup Supabase client & Types.
    *   Implement Authentication (Login/Register).
    *   Create "Profile" screen.
2.  **Phase 2: Data Core (Jikan + DB)**
    *   Implement "Search" screen with Jikan API.
    *   Implement "Add to Library" logic (Insert into `animes` then `library_items`).
    *   Implement "My Library" screen with Tabs.
3.  **Phase 3: Social & UI Polish**
    *   Implement "Groups" logic.
    *   Apply "Gold & Carbon" theme strict styling.
    *   Add French localization for all static text.

## 2. Git Workflow
*   **Commit Style:** Conventional Commits (e.g., `feat: add search screen`, `fix: header padding`, `style: apply gold theme`).
*   **Checkpoints:** Test the app on an Android/iOS Simulator after every Phase.

## 3. Testing Strategy
*   **Manual Testing (Primary):** Verify flows (Login -> Search -> Add -> Check Library).
*   **Linting:** Ensure no ESLint errors before marking a task as done.
*   **TypeScript:** Zero TS errors allowed. Use `any` only as a desperate last resort (ask user first).