import { ManifestOptions } from "vite-plugin-pwa";
import iconsData from "./public/icons/icons.json";

export const manifest: Partial<ManifestOptions> = {
  name: "Escape - Nature's Calm, Anywhere",
  short_name: "Escape",
  description:
    "Nature's Calm, Anywhere. Create your perfect ambient soundscape for focus, relaxation, and productivity. Mix nature sounds with a built-in timer.",
  theme_color: "#1e293b",
  background_color: "#0f172a",
  display: "standalone",
  orientation: "portrait",
  scope: "/",
  start_url: "/",
  categories: ["productivity", "lifestyle", "utilities"],
  lang: "en",
  dir: "ltr",

  icons: iconsData.icons.map((icon) => ({
    src: `/icons/${icon.src}`,
    sizes: icon.sizes,
    type: "image/png",
    purpose: icon.src.includes("maskable") ? "maskable" : "any",
  })),

  shortcuts: [
    {
      name: "Quick Timer",
      short_name: "Timer",
      description: "Start a quick 25-minute focus timer",
      url: "/?timer=25",
      icons: [
        {
          src: "/icons/android/android-launchericon-192-192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
    {
      name: "Rain Sounds",
      short_name: "Rain",
      description: "Start with relaxing rain sounds",
      url: "/?preset=rain",
      icons: [
        {
          src: "/icons/android/android-launchericon-192-192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
  ],

  screenshots: [
    {
      src: "/screenshots/1.jpg",
      sizes: "390x844",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Escape ambient sound mixer - Main interface with nature sounds",
    },
    {
      src: "/screenshots/2.jpg",
      sizes: "390x844",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Timer and sound mixing controls - Focus mode",
    },
    {
      src: "/screenshots/3.jpg",
      sizes: "390x844",
      type: "image/jpeg",
      form_factor: "narrow",
      label: "Nature sounds collection - Rain, forest, ocean waves",
    },
    // Add wide screenshots for desktop
    {
      src: "/screenshots/1.jpg",
      sizes: "1280x720",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Escape desktop interface - Full ambient sound mixer",
    },
    {
      src: "/screenshots/2.jpg",
      sizes: "390x844",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Timer and sound mixing controls - Focus mode",
    },
    {
      src: "/screenshots/3.jpg",
      sizes: "390x844",
      type: "image/jpeg",
      form_factor: "wide",
      label: "Nature sounds collection - Rain, forest, ocean waves",
    },
  ],

  protocol_handlers: [],

  // PWA install prompts
  prefer_related_applications: false,

  // File handling (for future use)
  file_handlers: [],

  // Web app manifest display modes
  display_override: ["standalone", "minimal-ui", "browser"],

  // Edge side panel support
  edge_side_panel: {
    preferred_width: 400,
  },
};

export default manifest;
