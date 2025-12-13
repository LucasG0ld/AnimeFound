---
description: 
---

# Bootstrap AnimeFound Project
Description: Initializes the Expo project, installs dependencies, sets up folder structure, and prepares the database migration based on the project documentation.

## Step 1: Understand the Vision
Context: @docs/01_PROJECT_VISION_AND_SCOPE.md
Instruction: Read the vision document. Summarize in 2 sentences what we are building and confirm that the UI language must be FRENCH.

## Step 2: Initialize Expo Framework
Context: @docs/03_TECH_STACK_ANALYSIS.md
Instruction:
1. Initialize a new Expo project using the default TypeScript template.
2. Name the project 'AnimeFound'.
3. Wait for the initialization to complete.

## Step 3: Architecture & Folders
Context: @docs/04_ARCHITECTURE_AND_PATTERNS.md
Instruction:
Inside the `src/` folder, create the exact directory structure defined in the documentation:
- src/app
- src/core (theme, auth, services)
- src/components
- src/features (library, groups, search, profile)
- src/assets

## Step 4: Install "Golden Stack" Dependencies
Context: @docs/03_TECH_STACK_ANALYSIS.md
Instruction:
Install the critical libraries mentioned in the Tech Stack document.
Group them by purpose:
1. Navigation: `expo-router`, `react-native-safe-area-context`, etc.
2. Data: `@tanstack/react-query`, `@supabase/supabase-js`.
3. State & Forms: `zustand`, `react-hook-form`, `zod`.
4. UI & Icons: `lucide-react-native`, `expo-image`.

## Step 5: Setup Design System
Context: @docs/02_UI_UX_DESIGN_SYSTEM.md
Instruction:
1. Create a file `src/core/theme/colors.ts`.
2. Define the palette constants exactly as specified (Carbon `#2B2B2B`, Gold `#FFBF00`, etc.).
3. Ensure these constants are exported for global use.

## Step 6: Prepare Database
Context: @docs/05_DATABASE_SCHEMA_AND_RLS.md
Instruction:
Based on the Schema documentation, generate a single `.sql` file content that includes:
1. Creation of tables (profiles, animes, library_items, groups, group_members).
2. The RLS (Row Level Security) policies.
Do not execute it yet, just provide the SQL code block so the user can copy it to Supabase SQL Editor.

## Step 7: Final Check
Instruction:
Confirm that the project is ready for development. Remind the user to add their Supabase URL and Anon Key to a `.env` file before starting the server.