# 02_UI_UX_DESIGN_SYSTEM.md

## 1. Design Philosophy & Localization
*   **App Name:** AnimeFound
*   **Visual Identity:** "Gold & Carbon". A premium, cinematic dark mode that emphasizes high-quality anime artwork.
*   **Localization (CRITICAL):**
    *   **The User Interface (UI) language is FRENCH.**
    *   All labels, buttons, error messages, and placeholders described below must be implemented in French.
    *   *Note for Dev:* Variable names in code should remain in English (e.g., `isLoading`), but the displayed text must be French (e.g., "Chargement...").

---

## 2. Color Palette
The app is **Dark Mode Only**.

### 2.1 Primary Colors
*   **Carbon Background (Main):** `#2B2B2B` (Used for app background).
*   **Slate Surface (Cards/Headers):** `#3C3C3C` (Used for cards, bottom sheets, headers).
*   **Gold Accent (Primary Action):** `#FFBF00` (Used for main buttons, active tab icons, stars, floating action buttons).
    *   *Text on Gold:* Black (`#000000`) for maximum contrast.

### 2.2 Secondary & Functional Colors
*   **Brick/Rust (Links/Secondary):** `#AD4622` (Used for clickable links if distinct from Gold, or subtle highlights).
*   **Text Primary:** `#F0F0F0` (Off-white - Headings, Body).
*   **Text Secondary:** `#A0A0A0` (Light Grey - Metadata, timestamps).
*   **Success (Green):** `#4CAF50` (Used for "Added" state, "Airing" status).
*   **Error/Destructive (Red):** `#E53935` (Used for "Delete", "Dropped" status).

---

## 3. Typography & Icons
*   **Font Family:** Modern Sans-Serif (e.g., *Inter*, *Roboto*, or *System Default*).
*   **Weights:** Bold for Headings, Regular for Body, Medium for Buttons.
*   **Icon Set:** Feather Icons, Lucide, or Ionicons (Stroke style).
*   **Image Ratio (CRITICAL):** All anime covers in grids must use a **Portrait Ratio (2:3)**. Do not use square or landscape ratios for covers.

---

## 4. Component Library (Atomic Design)

### 4.1 Buttons
*   **Primary Button:** Gold background (`#FFBF00`), Black text, Rounded corners (12px-16px).
    *   *Label Example:* "Ajouter à ma liste"
*   **Secondary/Ghost Button:** Transparent background, Gold border or Gold text.
    *   *Label Example:* "Annuler"
*   **FAB (Floating Action Button):** Gold circle with a Plus (+) icon.

### 4.2 Cards
*   **Anime Grid Card:**
    *   Image: 2:3 aspect ratio, rounded corners (8px).
    *   Title: Located **below** the image. Max 2 lines. Ellipsis (...) if longer.
    *   Rating: Small Star icon + Number next to title.
*   **Activity Feed Card:**
    *   Background: `#3C3C3C`.
    *   Header: Avatar + User Name + Action text (e.g., "Fimby a noté One Piece").
    *   Content: Anime cover thumbnail (small) + User's rating + Comment.
    *   **Spoiler State:** If marked as spoiler, the comment text is blurred/hidden with a label: "Spoiler - Appuyer pour révéler".

### 4.3 Tags & Chips
*   Small rounded pills for metadata (Year, Genre, Status).
*   Background: `#3C3C3C` (slightly lighter than bg) or transparent with border.
*   **Status Indicators:**
    *   "En cours" (Airing): Green dot inside the chip.
    *   "Terminé" (Finished): Red/Grey dot.

---

## 5. Screen Layouts & Navigation

### 5.1 Bottom Navigation Bar
Fixed at the bottom. Background `#2B2B2B` with a top border `#3C3C3C`.
*   **Tab 1:** Icon: Home/Book | Label: **Bibliothèque**
*   **Tab 2:** Icon: Users/Group | Label: **Groupes**
*   **Tab 3:** Icon: Search | Label: **Recherche**
*   **Tab 4:** Icon: User | Label: **Profil**

### 5.2 Screen Specifics (French Labels)

#### A. Login (Connexion)
*   Title: "Bienvenue sur AnimeFound"
*   Buttons: "Continuer avec Google", "Se connecter avec Email".

#### B. Library (Ma Bibliothèque)
*   **Top Tabs:** "En cours", "À voir", "Terminés", "Abandonnés".
*   **Sort Icon:** Top right (Sort by Date, Rating, Name).
*   **Empty State:** Illustration + Button "Ajouter mon premier anime".

#### C. Anime Details (Détails)
*   **Header:** Large backdrop image.
*   **Info:** Title, Year, Genre, Status (e.g., "Terminé").
*   **Social:** Section "Amis ayant vu" (Avatars).
*   **Synopsis:** Collapsible text ("Voir plus").
*   **Action:** **Sticky Bottom Bar** with button "Ajouter à ma liste" (or "Modifier" if already added).

#### D. The Squad (Groupe)
*   **Header:** Group Name + Members.
*   **Tabs:** "Fil d'actu" (Feed) / "Catalogue" (Shared List).
*   **Shared List:** Display "Note moyenne du groupe" (Gold Star) vs "Ma note" (Blue or outline star).

#### E. Search (Recherche)
*   **Search Bar:** Placeholder "Rechercher un anime...".
*   **Results:** List showing Portrait Cover + Title + Type (TV/Movie).
*   **Action:** Button on the right.
    *   State 1: "+" (Add)
    *   State 2: "✓" (Added/Green)

---

## 6. Feedback & Micro-interactions
*   **Loading:** Use "Skeleton" loaders (shimmering grey shapes) instead of generic spinners for lists.
*   **Toast Messages (Notifications):**
    *   Success: "Anime ajouté avec succès" (Green accent).
    *   Error: "Une erreur est survenue" (Red accent).
*   **Transitions:** Smooth slide-in from right for entering detail screens. Fade-in for tabs.