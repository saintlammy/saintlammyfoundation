export const NGO_IMAGES = {
  community: '/images/nigerian-ngo/community-relief.webp',
  education: '/images/nigerian-ngo/education-classroom.webp',
  healthcare: '/images/nigerian-ngo/health-outreach.webp',
  widows: '/images/nigerian-ngo/widow-empowerment.webp',
  orphanCare: '/images/nigerian-ngo/orphan-care.webp',
  volunteers: '/images/nigerian-ngo/volunteer-team.webp',
  livelihoods: '/images/nigerian-ngo/livelihoods.webp',
  student: '/images/nigerian-ngo/portrait-student.webp',
  widow: '/images/nigerian-ngo/portrait-widow.webp',
  volunteer: '/images/nigerian-ngo/portrait-volunteer.webp',
  doctor: '/images/nigerian-ngo/portrait-doctor.webp',
} as const;

const legacyStockImageMap: Record<string, string> = {
  '1544717301-9cdcb1f5940f': NGO_IMAGES.education,
  '1577896851231-70ef18881754': NGO_IMAGES.education,
  '1497486751825-1233686d5d80': NGO_IMAGES.education,
  '1509099836639-18ba1795216d': NGO_IMAGES.education,
  '1488521787991-ed7bbaae773c': NGO_IMAGES.orphanCare,
  '1503454537195-1dcabb73ffb9': NGO_IMAGES.orphanCare,
  '1559757148-5c350d0d3c56': NGO_IMAGES.healthcare,
  '1631217868264-e5b90bb7e133': NGO_IMAGES.healthcare,
  '1576091160399-112ba8d25d1d': NGO_IMAGES.healthcare,
  '1576091160550-2173dba999ef': NGO_IMAGES.healthcare,
  '1545558014-8692077e9b5c': NGO_IMAGES.widows,
  '1554520735-0a6b8b6ce8b7': NGO_IMAGES.widows,
  '1497375638960-ca368c7231e4': NGO_IMAGES.livelihoods,
  '1582213782179-e0d53f98f2ca': NGO_IMAGES.volunteers,
  '1559027615-cd4628902d4a': NGO_IMAGES.community,
  '1603998382124-c9835bf50409': NGO_IMAGES.community,
  '1544027993-37dbfe43562a': NGO_IMAGES.community,
  '1507003211169-0a1dd7228f2d': NGO_IMAGES.volunteer,
  '1506794778202-cad84cf45f1d': NGO_IMAGES.volunteer,
  '1472099645785-5658abf4ff4e': NGO_IMAGES.volunteer,
  '1551698618-1dfe5d97d256': NGO_IMAGES.widow,
  '1580489944761-15a19d654956': NGO_IMAGES.widow,
  '1559839734-2b71ea197ec2': NGO_IMAGES.doctor,
  '1582750433449-648ed127bb54': NGO_IMAGES.doctor,
  '1612349317150-e413f6a5b16d': NGO_IMAGES.doctor,
  '1494790108755-2616c34ca2f7': NGO_IMAGES.student,
  '1494790108755-2616b612b490': NGO_IMAGES.student,
  '1544717302-de2939b7ef71': NGO_IMAGES.student,
};

export const isLegacyPeopleStockImage = (value: unknown): value is string =>
  typeof value === 'string' &&
  /(?:images\.(?:unsplash|pexels)\.com|randomuser\.me|pravatar\.cc)/i.test(value);

export function localizeNgoImage(
  value: unknown,
  fallback: string = NGO_IMAGES.community,
): unknown {
  if (!isLegacyPeopleStockImage(value)) return value;

  const matchedImage = Object.entries(legacyStockImageMap).find(([id]) => value.includes(id));
  return matchedImage?.[1] || fallback;
}

export function ngoImageForCategory(category?: string): string {
  const normalized = category?.toLowerCase() || '';
  if (normalized.includes('health') || normalized.includes('medical')) return NGO_IMAGES.healthcare;
  if (normalized.includes('widow') || normalized.includes('empower')) return NGO_IMAGES.widows;
  if (normalized.includes('education') || normalized.includes('school')) return NGO_IMAGES.education;
  if (normalized.includes('orphan') || normalized.includes('child')) return NGO_IMAGES.orphanCare;
  if (normalized.includes('volunteer')) return NGO_IMAGES.volunteers;
  if (normalized.includes('livelihood') || normalized.includes('agric')) return NGO_IMAGES.livelihoods;
  return NGO_IMAGES.community;
}

/**
 * Prevent legacy stock-photo URLs saved in page-content JSON from resurfacing.
 * This only rewrites known people-photo hosts and leaves all other CMS values intact.
 */
export function localizeNgoImagesDeep<T>(value: T): T {
  if (typeof value === 'string') return localizeNgoImage(value) as T;
  if (Array.isArray(value)) return value.map(localizeNgoImagesDeep) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        localizeNgoImagesDeep(item),
      ]),
    ) as T;
  }
  return value;
}
