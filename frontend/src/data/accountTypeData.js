/**
 * KOMANDO Account Type Distribution Mock Dataset
 * Model data & kalkulasi dinamis untuk sebaran tipe akun:
 * 1. Homeless Media (Coral Red / Terracotta)
 * 2. Government (Soft Blue)
 * 3. KOL (Purple / Violet)
 * 4. Brand (Amber / Orange)
 */

export const initialAccountTypeData = [
  {
    id: 'homeless-media',
    name: 'Homeless Media',
    icon: 'fa-solid fa-newspaper',
    color: '#f87171',
    gradient: 'linear-gradient(90deg, #dc2626 0%, #f87171 100%)',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    instagramPosts: 0,
    tiktokPosts: 2
  },
  {
    id: 'government',
    name: 'Government',
    icon: 'fa-solid fa-building-columns',
    color: '#38bdf8',
    gradient: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    instagramPosts: 0,
    tiktokPosts: 0
  },
  {
    id: 'kol',
    name: 'KOL',
    icon: 'fa-solid fa-users',
    color: '#c084fc',
    gradient: 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
    bgColor: 'rgba(192, 132, 252, 0.15)',
    instagramPosts: 0,
    tiktokPosts: 0
  },
  {
    id: 'brand',
    name: 'Brand',
    icon: 'fa-solid fa-tag',
    color: '#fb923c',
    gradient: 'linear-gradient(90deg, #ea580c 0%, #fb923c 100%)',
    bgColor: 'rgba(251, 146, 60, 0.15)',
    instagramPosts: 0,
    tiktokPosts: 0
  }
];

export function getAccountTypeComputed(data = initialAccountTypeData) {
  const withTotals = data.map((item) => {
    const totalPosts = (item.instagramPosts || 0) + (item.tiktokPosts || 0);
    return {
      ...item,
      totalPosts
    };
  });

  const totalCategorizedPosts = withTotals.reduce((sum, item) => sum + item.totalPosts, 0);

  const categories = withTotals.map((item) => {
    const pct = totalCategorizedPosts > 0
      ? (item.totalPosts / totalCategorizedPosts) * 100
      : 0;

    return {
      ...item,
      percentage: pct,
      percentageStr: `${pct.toFixed(1)}%`
    };
  });

  return {
    categories,
    totalCategorizedPosts
  };
}

