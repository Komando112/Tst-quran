import { Reciter } from '@/types/quran'

export const QURAN_API_BASE = 'https://api.alquran.cloud/v1'
export const AUDIO_BASE_URL = 'https://cdn.islamic.network/quran_audio'

export const RECITERS: Reciter[] = [
  {
    id: 'abdul-basit-murattal',
    name: 'عبد الباسط عبد الصمد',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'abdul-basit-mujawwad',
    name: 'عبد الباسط (مجود)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'abdur-rahman-as-sudais',
    name: 'عبد الرحمن السديس',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'abdur-rahman-as-sudais-suara-quraan-uk',
    name: 'عبد الرحمن السديس (UK)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'abdur-rahman-as-sudais-64kb',
    name: 'عبد الرحمن السديس (64KB)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'abu-bakr-ash-shatri',
    name: 'أبو بكر الشاطري',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'abu-bakr-ash-shatri-suara-quraan-uk',
    name: 'أبو بكر الشاطري (UK)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'ahmed-al-balihis',
    name: 'أحمد العجمي',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'ahmed-ibn-ali-al-ajmi',
    name: 'أحمد بن علي العجمي',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'ahmed-ibn-ali-al-ajmi-suara-quraan-uk',
    name: 'أحمد بن علي العجمي (UK)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'fares-abbad',
    name: 'فارس عباد',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'fares-abbad-suara-quraan-uk',
    name: 'فارس عباد (UK)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'karim-mansoori',
    name: 'كريم منصوري',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'karim-mansoori-suara-quraan-uk',
    name: 'كريم منصوري (UK)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'mahmoud-al-banna',
    name: 'محمود البنا',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'mahmoud-al-banna-suara-quraan-uk',
    name: 'محمود البنا (UK)',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'mishary-alafasy',
    name: 'مشاري راشد العفاسي',
    category: 'male',
    audioUrls: {},
  },
  {
    id: 'mishary-alafasy-suara-quraan-uk',
    name: 'مشاري راشد العفاسي (UK)',
    category: 'male',
    audioUrls: {},
  },
]

export const THEMES = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'sepia', name: 'Sepia', icon: '📖' },
]

export const DEFAULT_RECITER_ID = 'abdul-basit-murattal'
export const DEFAULT_THEME = 'light'

export const FONT_SIZES = [14, 16, 18, 20, 22, 24, 28, 32]

export const QURAN_ACTIONS = {
  PLAY: 'play',
  PAUSE: 'pause',
  STOP: 'stop',
  NEXT: 'next',
  PREVIOUS: 'previous',
} as const

export const ERROR_MESSAGES = {
  FETCH_SURAHS_FAILED: 'Failed to fetch surahs. Please try again.',
  FETCH_SURAH_FAILED: 'Failed to fetch surah details. Please try again.',
  AUDIO_FAILED: 'Failed to load audio. Please try another reciter.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const

export const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
