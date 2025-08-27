/**
 * Centralized app configuration to eliminate duplication
 * All app metadata, branding, and constants should be defined here
 */

export const APP_CONFIG = {
  // Core app identity
  name: "Escape - Nature's Calm, Anywhere",
  shortName: "Escape",
  tagline: "Nature's Calm, Anywhere",
  
  // Descriptions
  description: "Nature's Calm, Anywhere. Create your perfect ambient soundscape for focus, relaxation, and productivity. Mix nature sounds with a built-in timer.",
  
  // Media Session metadata
  mediaSession: {
    defaultTitle: "Escape - Nature Sounds",
    artist: "Ambient Sound Mixer", 
    album: "Nature's Calm, Anywhere",
    artwork: [
      { src: "/icons/android/android-launchericon-96-96.png", sizes: "96x96", type: "image/png" },
      { src: "/icons/android/android-launchericon-144-144.png", sizes: "144x144", type: "image/png" },
      { src: "/icons/android/android-launchericon-192-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/android/android-launchericon-512-512.png", sizes: "512x512", type: "image/png" },
    ] as MediaImage[]
  },
  
  // PWA theming
  theme: {
    color: "#1e293b",
    backgroundColor: "#0f172a",
  },
  
  // Categories for app stores
  categories: ["productivity", "lifestyle", "utilities"],
  
  // Language and direction
  lang: "en",
  dir: "ltr" as const,
} as const;