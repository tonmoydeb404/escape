# Escape

A mobile-first React.js web application for sleep and relaxation with professional audio mixing and timer functionality. Escape from daily stress into peaceful natural soundscapes.

## Features

- **6 Premium Nature Sounds**: Rain, Ocean Waves, Forest Birds, Crackling Fire, Wind, and Thunderstorm
- **Professional Audio Mixing**: Mix multiple sounds simultaneously with independent volume controls
- **Smart Timer System**: Quick presets (15, 30, 45, 60, 90 minutes) plus custom timer with visual countdown
- **Mobile-First Design**: Optimized for touch interactions with glassmorphism effects
- **Dark Theme**: Eye-friendly design perfect for nighttime use
- **Persistent Settings**: Remembers your preferences with localStorage

## Technical Stack

- **React 18** with TypeScript and functional components
- **Howler.js** for professional audio management with fade transitions
- **Tailwind CSS** for responsive, mobile-first styling
- **React Context API** for state management
- **Vite** for fast development and optimized builds

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Mobile Testing Guidelines

### Recommended Testing Devices
- **iOS**: iPhone 12/13/14 (Safari)
- **Android**: Chrome on Pixel/Samsung devices
- **Tablets**: iPad (Safari), Android tablets (Chrome)

### Performance Verification
- All touch targets meet 48x48px minimum requirement
- Smooth 60fps animations on all interactions
- Audio mixing works with 3+ simultaneous sounds
- No audio stuttering during state updates
- Proper behavior during orientation changes

### Touch Interaction Testing
- Tap to play/pause sounds
- Drag volume sliders smoothly
- Swipe interactions feel responsive
- Timer bottom sheet slides up smoothly
- All buttons have proper active states

## Browser Compatibility

- **Excellent**: Chrome 88+, Safari 14+, Edge 88+
- **Good**: Firefox 85+ (some audio features may vary)
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+

## Component Architecture

```
src/
├── components/
│   ├── SoundCard.tsx          # Individual sound controls
│   ├── VolumeSlider.tsx       # Custom volume control
│   ├── TimerDisplay.tsx       # Circular progress timer
│   └── TimerBottomSheet.tsx   # Modal timer selection
├── hooks/
│   ├── useAudio.ts           # Howler.js audio management
│   ├── useTimer.ts           # Timer functionality
│   └── useLocalStorage.ts    # Persistence utilities
├── context/
│   └── AppContext.tsx        # Global state management
└── App.tsx                   # Main application
```

## Accessibility Features

- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **High Contrast**: Respects system high contrast preferences
- **Reduced Motion**: Honors prefers-reduced-motion settings
- **Focus Management**: Clear focus indicators for all interactive elements

## Audio Implementation Details

- **Infinite Looping**: All sounds loop seamlessly
- **Fade Transitions**: 300ms fade in/out for smooth starts/stops
- **Volume Mixing**: Independent volume control for each sound
- **Preloading**: All audio files preload for instant playback
- **Memory Management**: Proper cleanup prevents memory leaks

## Performance Optimizations

- **Code Splitting**: Non-critical components load on demand
- **Lazy Loading**: Audio files load progressively
- **Efficient Rendering**: Minimal re-renders with proper React patterns
- **Mobile Optimizations**: Reduced bundle size and fast initial load
- **Gesture Handling**: Optimized touch event handling

## Development Notes

### Local Storage Keys
- `soundPreferences`: Sound states and volume levels
- `lastTimerDuration`: Last used timer setting

### Audio File Requirements
- Format: MP3 or WAV for broad compatibility
- Bitrate: 128kbps recommended for balance of quality/size
- Length: 30+ seconds for smooth looping
- Volume: Normalized to prevent clipping

### Known Limitations
- Audio autoplay restrictions on some mobile browsers
- iOS Safari requires user interaction before audio playback
- Background audio may pause when app is not in focus

## Contributing

When adding new sounds or features:

1. Test on both iOS and Android devices
2. Verify accessibility with screen readers
3. Ensure proper TypeScript typing
4. Add appropriate error handling
5. Update localStorage schema if needed

## License

MIT License - feel free to use this code for personal or commercial projects.