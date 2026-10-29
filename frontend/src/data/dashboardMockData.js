/**
 * KOMANDO Analytics Dashboard Mock Data
 * Data struktur terpisah untuk Lower Section Dashboard:
 * - Top Hashtags (Post & Engagement metrics, 10 items)
 * - Top Authors (Multi-channel ranking, followers, engagement, ER%, 10+ items)
 * - Gender Distribution (Estimated demographic classification)
 * - Top Words (Platform-filtered word cloud data with sentiment)
 */

export const hashtagData = {
  post: [
    { rank: 1, tag: '#indonesiasadar', count: 517, displayVal: '517', sentiment: 'Negatif', reach: '8.4M' },
    { rank: 2, tag: '#demo', count: 392, displayVal: '392', sentiment: 'Negatif', reach: '6.2M' },
    { rank: 3, tag: '#demomahasiswa', count: 213, displayVal: '213', sentiment: 'Negatif', reach: '4.8M' },
    { rank: 4, tag: '#bemui', count: 209, displayVal: '209', sentiment: 'Netral', reach: '3.9M' },
    { rank: 5, tag: '#bundaranhi', count: 194, displayVal: '194', sentiment: 'Netral', reach: '3.1M' },
    { rank: 6, tag: '#mahasiswa', count: 162, displayVal: '162', sentiment: 'Netral', reach: '2.5M' },
    { rank: 7, tag: '#sumpahpemuda', count: 114, displayVal: '114', sentiment: 'Positif', reach: '1.9M' },
    { rank: 8, tag: '#tolakruu', count: 98, displayVal: '98', sentiment: 'Negatif', reach: '1.5M' },
    { rank: 9, tag: '#suaramahasiswa', count: 86, displayVal: '86', sentiment: 'Netral', reach: '1.2M' },
    { rank: 10, tag: '#aksidamai', count: 74, displayVal: '74', sentiment: 'Positif', reach: '980K' }
  ],
  engagement: [
    { rank: 1, tag: '#indonesiasadar', count: 48200, displayVal: '48.200', sentiment: 'Negatif', reach: '8.4M' },
    { rank: 2, tag: '#demo', count: 35800, displayVal: '35.800', sentiment: 'Negatif', reach: '6.2M' },
    { rank: 3, tag: '#demomahasiswa', count: 22400, displayVal: '22.400', sentiment: 'Negatif', reach: '4.8M' },
    { rank: 4, tag: '#bemui', count: 21100, displayVal: '21.100', sentiment: 'Netral', reach: '3.9M' },
    { rank: 5, tag: '#bundaranhi', count: 19800, displayVal: '19.800', sentiment: 'Netral', reach: '3.1M' },
    { rank: 6, tag: '#mahasiswa', count: 16500, displayVal: '16.500', sentiment: 'Netral', reach: '2.5M' },
    { rank: 7, tag: '#sumpahpemuda', count: 12000, displayVal: '12.000', sentiment: 'Positif', reach: '1.9M' },
    { rank: 8, tag: '#tolakruu', count: 9850, displayVal: '9.850', sentiment: 'Negatif', reach: '1.5M' },
    { rank: 9, tag: '#suaramahasiswa', count: 8420, displayVal: '8.420', sentiment: 'Netral', reach: '1.2M' },
    { rank: 10, tag: '#aksidamai', count: 7150, displayVal: '7.150', sentiment: 'Positif', reach: '980K' }
  ]
};

export const authorData = [
  {
    rank: 1,
    author: 'akunkedua.1988',
    channel: 'Threads',
    followers: 0,
    followersStr: '0',
    engagement: 47027,
    engagementStr: '47.027',
    post: 1,
    er: '0.0%',
    erNum: 0.0,
    avatarColor: '#4f46e5',
    verified: false,
    bio: 'Pengamat dinamika politik dan wacana media sosial Jakarta.',
    location: 'DKI Jakarta'
  },
  {
    rank: 2,
    author: 'ceritabe kasi_',
    channel: 'TikTok',
    followers: 486487,
    followersStr: '486.487',
    engagement: 40568,
    engagementStr: '40.568',
    post: 1,
    er: '8.3%',
    erNum: 8.3,
    avatarColor: '#0ea5e9',
    verified: true,
    bio: 'Portal kabar warga & reportase lapangan seputar Jabodetabek.',
    location: 'Jawa Barat'
  },
  {
    rank: 3,
    author: 'potratjkt',
    channel: 'TikTok',
    followers: 18456,
    followersStr: '18.456',
    engagement: 38924,
    engagementStr: '38.924',
    post: 1,
    er: '210.9%',
    erNum: 210.9,
    avatarColor: '#ec4899',
    verified: false,
    bio: 'Dokumentasi visual aksi & fenomena urban ibu kota.',
    location: 'DKI Jakarta'
  },
  {
    rank: 4,
    author: 'inibukanniko',
    channel: 'TikTok',
    followers: 558700,
    followersStr: '558.700',
    engagement: 36114,
    engagementStr: '36.114',
    post: 2,
    er: '6.5%',
    erNum: 6.5,
    avatarColor: '#8b5cf6',
    verified: false,
    bio: 'Opini publik & cuplikan peristiwa nasional terkini.',
    location: 'Banten'
  },
  {
    rank: 5,
    author: 'shiftmedia.id',
    channel: 'Instagram',
    followers: 2245987,
    followersStr: '2.245.987',
    engagement: 33203,
    engagementStr: '33.203',
    post: 1,
    er: '1.5%',
    erNum: 1.5,
    avatarColor: '#f43f5e',
    verified: true,
    bio: 'Kanal media edukasi & narasi gerakan generasi muda.',
    location: 'Jawa Barat'
  },
  {
    rank: 6,
    author: 'suararakyat_id',
    channel: 'Twitter',
    followers: 892400,
    followersStr: '892.400',
    engagement: 29840,
    engagementStr: '29.840',
    post: 4,
    er: '3.3%',
    erNum: 3.3,
    avatarColor: '#38bdf8',
    verified: false,
    bio: 'Agregasi percakapan warganet & tagar trending Indonesia.',
    location: 'Jawa Tengah'
  },
  {
    rank: 7,
    author: 'fakta_news_indo',
    channel: 'Facebook',
    followers: 345000,
    followersStr: '345.000',
    engagement: 25180,
    engagementStr: '25.180',
    post: 3,
    er: '7.3%',
    erNum: 7.3,
    avatarColor: '#2563eb',
    verified: true,
    bio: 'Berita dan rilis investigasi faktual nasional.',
    location: 'Sumatera Utara'
  },
  {
    rank: 8,
    author: 'komando_stream',
    channel: 'YouTube',
    followers: 612000,
    followersStr: '612.000',
    engagement: 21900,
    engagementStr: '21.900',
    post: 2,
    er: '3.5%',
    erNum: 3.5,
    avatarColor: '#ef4444',
    verified: true,
    bio: 'Siaran langsung dan liputan investigasi jurnalisme warga.',
    location: 'DKI Jakarta'
  },
  {
    rank: 9,
    author: 'radar_siber_nusantara',
    channel: 'Instagram',
    followers: 178500,
    followersStr: '178.500',
    engagement: 19450,
    engagementStr: '19.450',
    post: 3,
    er: '10.9%',
    erNum: 10.9,
    avatarColor: '#10b981',
    verified: false,
    bio: 'Kompilasi tren narasi digital & analisis diskursus regional.',
    location: 'Jawa Timur'
  },
  {
    rank: 10,
    author: 'lensa.warga.id',
    channel: 'Threads',
    followers: 42300,
    followersStr: '42.300',
    engagement: 17820,
    engagementStr: '17.820',
    post: 2,
    er: '42.1%',
    erNum: 42.1,
    avatarColor: '#f59e0b',
    verified: false,
    bio: 'Citizen journalism & dokumentasi aksi lapangan real-time.',
    location: 'DI Yogyakarta'
  },
  {
    rank: 11,
    author: 'tribun_wacana',
    channel: 'Twitter',
    followers: 520000,
    followersStr: '520.000',
    engagement: 16900,
    engagementStr: '16.900',
    post: 5,
    er: '3.2%',
    erNum: 3.2,
    avatarColor: '#0284c7',
    verified: true,
    bio: 'Diskursus isu strategis & rangkuman perbincangan medsos.',
    location: 'DKI Jakarta'
  },
  {
    rank: 12,
    author: 'garuda_investigasi',
    channel: 'YouTube',
    followers: 310000,
    followersStr: '310.000',
    engagement: 15200,
    engagementStr: '15.200',
    post: 2,
    er: '4.9%',
    erNum: 4.9,
    avatarColor: '#dc2626',
    verified: true,
    bio: 'Laporan mendalam isu publik dan dinamika kebijakan.',
    location: 'Jawa Barat'
  },
  {
    rank: 13,
    author: 'kabar_kampus_real',
    channel: 'TikTok',
    followers: 285000,
    followersStr: '285.000',
    engagement: 14100,
    engagementStr: '14.100',
    post: 3,
    er: '4.9%',
    erNum: 4.9,
    avatarColor: '#06b6d4',
    verified: false,
    bio: 'Informasi aksi mahasiswa & forum kajian kampus se-Indonesia.',
    location: 'Sulawesi Selatan'
  }
];

export const genderDistributionData = {
  totalClassified: 258,
  totalAuthors: 2695,
  confidenceThreshold: '≥70%',
  male: {
    count: 166,
    percentage: 64,
    color: '#3b82f6'
  },
  female: {
    count: 92,
    percentage: 36,
    color: '#ec4899'
  }
};

export const wordCloudData = {
  All: {
    Mention: [
      { text: 'demo', weight: 48, freq: 482, sentiment: 'negative' },
      { text: 'mahasiswa', weight: 42, freq: 390, sentiment: 'neutral' },
      { text: 'hari', weight: 36, freq: 312, sentiment: 'neutral' },
      { text: 'rakyat', weight: 32, freq: 285, sentiment: 'neutral' },
      { text: 'bundaran', weight: 28, freq: 240, sentiment: 'neutral' },
      { text: 'aksi', weight: 26, freq: 220, sentiment: 'negative' },
      { text: 'gedung', weight: 22, freq: 195, sentiment: 'neutral' },
      { text: 'jakarta', weight: 20, freq: 180, sentiment: 'neutral' },
      { text: 'aspirasi', weight: 18, freq: 165, sentiment: 'positive' },
      { text: 'damai', weight: 16, freq: 142, sentiment: 'positive' },
      { text: 'aparat', weight: 14, freq: 130, sentiment: 'neutral' },
      { text: 'polisi', weight: 12, freq: 115, sentiment: 'neutral' },
      { text: 'keadilan', weight: 12, freq: 108, sentiment: 'positive' },
      { text: 'tuntutan', weight: 10, freq: 94, sentiment: 'neutral' }
    ],
    Engagement: [
      { text: 'demo', weight: 48, freq: '58.4K', sentiment: 'negative' },
      { text: 'mahasiswa', weight: 42, freq: '49.1K', sentiment: 'neutral' },
      { text: 'rakyat', weight: 36, freq: '38.2K', sentiment: 'neutral' },
      { text: 'hari', weight: 32, freq: '31.5K', sentiment: 'neutral' },
      { text: 'aksi', weight: 26, freq: '27.4K', sentiment: 'negative' },
      { text: 'bundaran', weight: 24, freq: '22.8K', sentiment: 'neutral' },
      { text: 'gedung', weight: 20, freq: '19.0K', sentiment: 'neutral' },
      { text: 'aspirasi', weight: 18, freq: '17.3K', sentiment: 'positive' },
      { text: 'damai', weight: 16, freq: '14.8K', sentiment: 'positive' },
      { text: 'jakarta', weight: 14, freq: '12.9K', sentiment: 'neutral' }
    ]
  },
  Twitter: {
    Mention: [
      { text: 'mahasiswa', weight: 48, freq: 390, sentiment: 'neutral' },
      { text: 'demo', weight: 44, freq: 350, sentiment: 'negative' },
      { text: 'bemui', weight: 38, freq: 210, sentiment: 'neutral' },
      { text: 'tuntutan', weight: 32, freq: 160, sentiment: 'neutral' },
      { text: 'aspirasi', weight: 28, freq: 135, sentiment: 'positive' },
      { text: 'politik', weight: 24, freq: 115, sentiment: 'negative' }
    ],
    Engagement: [
      { text: 'mahasiswa', weight: 48, freq: '42.0K', sentiment: 'neutral' },
      { text: 'demo', weight: 44, freq: '38.2K', sentiment: 'negative' },
      { text: 'bemui', weight: 38, freq: '25.6K', sentiment: 'neutral' }
    ]
  },
  Instagram: {
    Mention: [
      { text: 'gedung', weight: 46, freq: 210, sentiment: 'neutral' },
      { text: 'bundaran', weight: 42, freq: 195, sentiment: 'neutral' },
      { text: 'jakarta', weight: 38, freq: 175, sentiment: 'neutral' },
      { text: 'damai', weight: 34, freq: 140, sentiment: 'positive' },
      { text: 'rakyat', weight: 30, freq: 120, sentiment: 'neutral' }
    ],
    Engagement: [
      { text: 'gedung', weight: 46, freq: '29.5K', sentiment: 'neutral' },
      { text: 'bundaran', weight: 42, freq: '27.1K', sentiment: 'neutral' },
      { text: 'damai', weight: 34, freq: '19.4K', sentiment: 'positive' }
    ]
  },
  Facebook: {
    Mention: [
      { text: 'masyarakat', weight: 46, freq: 180, sentiment: 'neutral' },
      { text: 'polisi', weight: 42, freq: 155, sentiment: 'neutral' },
      { text: 'tertib', weight: 36, freq: 130, sentiment: 'positive' },
      { text: 'aspirasi', weight: 32, freq: 110, sentiment: 'positive' }
    ],
    Engagement: [
      { text: 'masyarakat', weight: 46, freq: '21.0K', sentiment: 'neutral' },
      { text: 'polisi', weight: 42, freq: '18.5K', sentiment: 'neutral' }
    ]
  },
  Threads: {
    Mention: [
      { text: 'opini', weight: 46, freq: 160, sentiment: 'neutral' },
      { text: 'aspirasi', weight: 42, freq: 140, sentiment: 'positive' },
      { text: 'demokrasi', weight: 38, freq: 125, sentiment: 'positive' },
      { text: 'suara', weight: 32, freq: 105, sentiment: 'positive' }
    ],
    Engagement: [
      { text: 'opini', weight: 46, freq: '18.4K', sentiment: 'neutral' },
      { text: 'aspirasi', weight: 42, freq: '16.0K', sentiment: 'positive' }
    ]
  },
  YouTube: {
    Mention: [
      { text: 'aksi', weight: 44, freq: 165, sentiment: 'negative' },
      { text: 'demo', weight: 42, freq: 152, sentiment: 'negative' },
      { text: 'massa', weight: 36, freq: 125, sentiment: 'negative' },
      { text: 'aparat', weight: 32, freq: 110, sentiment: 'neutral' },
      { text: 'bundaran', weight: 28, freq: 95, sentiment: 'neutral' }
    ],
    Engagement: [
      { text: 'aksi', weight: 44, freq: '25.0K', sentiment: 'negative' },
      { text: 'demo', weight: 42, freq: '23.4K', sentiment: 'negative' },
      { text: 'massa', weight: 36, freq: '17.2K', sentiment: 'negative' }
    ]
  },
  TikTok: {
    Mention: [
      { text: 'mahasiswa', weight: 48, freq: 290, sentiment: 'neutral' },
      { text: 'demo', weight: 44, freq: 260, sentiment: 'negative' },
      { text: 'hari', weight: 38, freq: 215, sentiment: 'neutral' },
      { text: 'bundaran', weight: 34, freq: 185, sentiment: 'neutral' },
      { text: 'jakarta', weight: 32, freq: 170, sentiment: 'neutral' },
      { text: 'aksi', weight: 30, freq: 155, sentiment: 'negative' }
    ],
    Engagement: [
      { text: 'mahasiswa', weight: 48, freq: '38.5K', sentiment: 'neutral' },
      { text: 'demo', weight: 44, freq: '32.1K', sentiment: 'negative' },
      { text: 'hari', weight: 38, freq: '24.8K', sentiment: 'neutral' }
    ]
  }
};

export const platformTopWordComparison = [
  { platform: 'All', label: 'Semua', icon: 'fa-solid fa-layer-group', word: 'demo', count: '482 mention', sentiment: 'negative' },
  { platform: 'X', label: 'X (Twitter)', icon: 'fa-brands fa-x-twitter', word: 'mahasiswa', count: '390 mention', sentiment: 'neutral' },
  { platform: 'TikTok', label: 'TikTok', icon: 'fa-brands fa-tiktok', word: 'rakyat', count: '290 mention', sentiment: 'neutral' },
  { platform: 'Instagram', label: 'Instagram', icon: 'fa-brands fa-instagram', word: 'gedung dpr', count: '210 mention', sentiment: 'negative' },
  { platform: 'Facebook', label: 'Facebook', icon: 'fa-brands fa-facebook', word: 'masyarakat', count: '155 mention', sentiment: 'neutral' },
  { platform: 'Threads', label: 'Threads', icon: 'fa-brands fa-threads', word: 'aspirasi', count: '140 mention', sentiment: 'positive' },
  { platform: 'YouTube', label: 'YouTube', icon: 'fa-brands fa-youtube', word: 'aksi', count: '165 mention', sentiment: 'negative' }
];

export { performanceContentData, filterAndSortPerformanceContent, getPerformanceCampaigns } from './performanceContentData.js';
