/**
 * @file colors.ts
 * @description Single source of truth for the "Gold & Carbon" theme.
 * Strictly adheres to 02_UI_UX_DESIGN_SYSTEM.md.
 */

export const colors = {
  // Primary (Backgrounds)
  carbon: '#2B2B2B', // Main Background
  slate: '#3C3C3C',  // Cards / Headers / Bottom Sheet

  // Accent (Action)
  gold: '#FFBF00',   // Primary Buttons / Active State

  // Functional
  textPrimary: '#F0F0F0', // Headings / Body
  textSecondary: '#A0A0A0', // Metadata
  
  // Feedback
  success: '#4CAF50',  // Added / Airing
  error: '#E53935',    // Delete / Dropped
  brick: '#AD4622',    // Links / Secondary Highlights

  // Special
  black: '#000000',    // Text on Gold
  transparent: 'transparent',
} as const;
