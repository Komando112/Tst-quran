# Quran App - Production-Grade React Application

A beautiful, modern, and fully-featured Quran application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### Core Features
- **Verse of the Day** - Daily inspirational verse with playback
- **Quick Ayah Listener** - Search and listen to any ayah instantly
- **Mushaf Reader** - Paginated Quran reading interface
- **Full Surah Reading** - Complete surah display with ayah numbers
- **Full Surah Audio** - Ayah-by-ayah audio playback with controls

### Customization
- **18 Professional Reciters** - Multiple beautiful recitations
- **3 Themes** - Light, Dark, and Sepia modes
- **Adjustable Font Sizes** - 8 different text size options
- **Responsive Design** - Mobile, tablet, and desktop optimized

### User Experience
- **Toast Notifications** - Real-time feedback for actions
- **Copy & Share** - Easy text copying and social sharing
- **Audio Player** - Persistent bottom player with controls
- **Progress Tracking** - Visual progress for audio playback
- **Accessibility** - WCAG compliant with keyboard navigation

## Tech Stack

- **Frontend Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **State Management**: React Context API + Zustand ready
- **Audio Handling**: Web Audio API
- **Storage**: localStorage with service layer
- **PWA**: Manifest.json for installable app
- **APIs**: Quran Cloud API, Islamic Network Audio

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── providers.tsx      # Context providers
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── sections/          # Feature sections
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── services/              # API and business logic
├── types/                 # TypeScript types
├── lib/                   # Utilities and constants
└── public/                # Static assets
```

## Installation & Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check
```

## Key Components

### Contexts
- **QuranContext** - Quran data management and API calls
- **AudioContext** - Audio playback state and controls
- **ThemeContext** (next-themes) - Theme management

### Custom Hooks
- `useQuran()` - Access Quran data and methods
- `useAudio()` - Control audio playback
- `useLocalStorage()` - Persistent state management
- `useToast()` - Show notifications

### Services
- `quranApi` - Fetch Quran data and build audio URLs
- `audioService` - Singleton for audio management
- `storageService` - localStorage wrapper with prefix

## API Integration

### Quran API
- Endpoint: `https://api.alquran.cloud/v1`
- Provides surah data, ayah text, and metadata
- Timeout: 10 seconds with retry logic

### Audio URLs
- Base: `https://cdn.islamic.network/quran_audio/256/{reciter}/{surah}.mp3`
- 18 different reciters supported
- MP3 format with good compression

## Customization Guide

### Adding a New Reciter
1. Add reciter to `lib/constants.ts`
2. Update `quranApi.getAudioUrl()` mapping
3. Reciter appears automatically in UI

### Changing Theme Colors
1. Edit CSS variables in `app/globals.css`
2. Update Tailwind config in `tailwind.config.ts`
3. Supports light, dark, and sepia modes

### Modifying Font Sizes
1. Update `FONT_SIZES` in `lib/constants.ts`
2. Persists to localStorage automatically

## Performance Features

- **Code Splitting** - Dynamic imports for sections
- **Image Optimization** - Next.js image handling
- **CSS Optimization** - Tailwind purging
- **Service Worker Ready** - PWA support
- **Caching** - Surah data cached in context
- **Lazy Loading** - Components load on demand

## Accessibility

- **ARIA Labels** - All interactive elements labeled
- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Visible focus indicators
- **Color Contrast** - WCAG AA compliant
- **Semantic HTML** - Proper heading hierarchy

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Environment Variables
No environment variables required for development. For production:
- Optional: Custom Quran API endpoint
- Optional: Analytics/tracking codes

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Troubleshooting

### Audio Not Playing
1. Check browser audio permissions
2. Verify internet connection
3. Try different reciter
4. Check browser console for errors

### Surah Not Loading
1. Verify API is accessible
2. Check browser network tab
3. Clear localStorage and reload
4. Try different surah

### Theme Not Persisting
1. Enable localStorage in browser
2. Check if private browsing is on
3. Clear browser cache

## Future Enhancements

- [ ] Translation support (English, Urdu, French, etc.)
- [ ] Tafseer (Islamic commentary)
- [ ] Bookmarks and reading progress
- [ ] Offline support with service worker
- [ ] Search functionality
- [ ] Social sharing integration
- [ ] Reading time estimation
- [ ] Night mode schedule
- [ ] Voice commands
- [ ] Quran memorization tools

## Support

For issues and feature requests, please open an issue on GitHub.

## Credits

- **Quran Text**: Quran Cloud API
- **Audio**: Islamic Network
- **Design**: Modern UI/UX principles
- **Icons**: Unicode emoji

---

Built with ❤️ for the Ummah
