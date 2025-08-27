/**
 * Media Session API integration for background audio playbook
 * Provides system-level media controls and notifications
 */

import { APP_CONFIG } from "../config/app";

interface MediaSessionMetadata {
  title: string;
  artist: string;
  album?: string;
  artwork?: MediaImage[];
}

export class MediaSessionManager {
  private isActive = false;
  private currentSounds: string[] = [];

  constructor() {
    this.setupMediaSession();
  }

  private setupMediaSession() {
    if ("mediaSession" in navigator) {
      // Set default metadata
      this.updateMetadata({
        title: APP_CONFIG.mediaSession.defaultTitle,
        artist: APP_CONFIG.mediaSession.artist,
        album: APP_CONFIG.mediaSession.album,
        artwork: APP_CONFIG.mediaSession.artwork,
      });

      // Set playback state
      navigator.mediaSession.playbackState = "none";
    }
  }

  public updateMetadata(metadata: MediaSessionMetadata) {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata(metadata);
    }
  }

  public setPlaying(sounds: string[]) {
    this.currentSounds = sounds;
    this.isActive = sounds.length > 0;

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = this.isActive
        ? "playing"
        : "paused";

      // Update title with active sounds
      const title =
        sounds.length > 0
          ? `Playing: ${sounds.join(", ")}`
          : APP_CONFIG.mediaSession.defaultTitle;

      this.updateMetadata({
        title,
        artist: APP_CONFIG.mediaSession.artist,
        album: APP_CONFIG.mediaSession.album,
        artwork: APP_CONFIG.mediaSession.artwork,
      });
    }
  }

  public setPaused() {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "paused";
    }
  }

  public setActionHandlers(
    onPlay?: () => void,
    onPause?: () => void,
    onStop?: () => void,
    onPreviousTrack?: () => void,
    onNextTrack?: () => void
  ) {
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", onPlay || null);
        navigator.mediaSession.setActionHandler("pause", onPause || null);
        navigator.mediaSession.setActionHandler("stop", onStop || null);
        navigator.mediaSession.setActionHandler(
          "previoustrack",
          onPreviousTrack || null
        );
        navigator.mediaSession.setActionHandler(
          "nexttrack",
          onNextTrack || null
        );

        // Additional actions for PWAs
        navigator.mediaSession.setActionHandler("seekbackward", (_details) => {
          // Could implement rewind functionality
        });
        navigator.mediaSession.setActionHandler("seekforward", (_details) => {
          // Could implement fast-forward functionality
        });
      } catch (error) {
        console.warn("Failed to set media session action handlers:", error);
      }
    }
  }

  public isSupported(): boolean {
    return "mediaSession" in navigator;
  }

  public getCurrentSounds(): string[] {
    return this.currentSounds;
  }

  public isMediaActive(): boolean {
    return this.isActive;
  }
}

export const mediaSessionManager = new MediaSessionManager();
