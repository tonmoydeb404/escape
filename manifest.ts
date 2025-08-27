import { ManifestOptions } from "vite-plugin-pwa";
import iconsData from "./public/icons/icons.json";
import { APP_CONFIG } from "./src/config/app";

export const manifest: Partial<ManifestOptions> = {
  name: APP_CONFIG.name,
  short_name: APP_CONFIG.shortName,
  description: APP_CONFIG.description,
  theme_color: APP_CONFIG.theme.color,
  background_color: APP_CONFIG.theme.backgroundColor,
  display: "standalone",
  orientation: "portrait",
  scope: "/",
  start_url: "/",
  categories: [...APP_CONFIG.categories],
  lang: APP_CONFIG.lang,
  dir: APP_CONFIG.dir,

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
