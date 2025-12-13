# TASK-03-D: Google Authentication Implementation

## 🎯 Objective
Implement "Sign in with Google" functionality using Supabase Auth and Expo's Web Browser module.

## 🛠 Implemented Features

### 1. Configuration & Dependencies
- **Scheme:** Added `scheme: "animefound"` to `app.json` to enable deep linking (`animefound://`).
- **Packages:** Installed `expo-web-browser` and `expo-linking`.

### 2. Auth Context Updates (`AuthContext.tsx`)
- **`signInWithGoogle`:**
    - Generates a redirect URL pointing to the app (`animefound://auth/callback`).
    - Calls `supabase.auth.signInWithOAuth`.
    - Opens the OAuth URL in an in-app browser using `WebBrowser.openAuthSessionAsync`.
    - Handles the return redirection and parses the URL hash to extract `access_token` and `refresh_token`.
    - Manually sets the Supabase session using `supabase.auth.setSession`.

### 3. UI Implementation (`login.tsx`)
- Added a **"Se connecter avec Google"** button.
- Styled with the secondary theme variant (Gold/Carbon).
- Connected to the `signInWithGoogle` function with loading state handling.

## ✅ Verification
1.  **Dependencies:** `expo-web-browser` and `expo-linking` are installed.
2.  **Linting:** No type errors in `AuthContext` or `LoginScreen`.
3.  **Flow:**
    - Click Button -> Opens Browser -> Google Login -> Redirects to App -> Session Set -> Auto-navigates to App.

## 📝 Notes
- Ensure the **Google and Supabase Dashboards** are configured with the correct Redirect URL (`https://<supabase-ref>.supabase.co/auth/v1/callback`).
- The Deep Link logic uses the **Implicit Flow** (parsing `#access_token`) which is standard for Supabase with React Native.
