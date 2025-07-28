import { EGender } from '@/interfaces/student.interface';

export const AVATAR_URLS = {
  MALE: 'https://api.dicebear.com/7.x/avataaars/svg?backgroundColor=b6e3f4&clothingColor=0066cc&hairColor=000000&facialHair=beardMedium&accessoriesColor=000000',
  FEMALE:
    'https://api.dicebear.com/7.x/avataaars/svg?backgroundColor=ffdfbf&clothingColor=ff69b4&hairColor=8b4513&accessoriesColor=000000',
} as const;

export const getAvatarUrl = (gender: EGender, seed?: string): string => {
  const baseUrl =
    gender === EGender.MALE ? AVATAR_URLS.MALE : AVATAR_URLS.FEMALE;
  if (!seed) return baseUrl;

  // Encode seed để tránh ký tự đặc biệt
  const encodedSeed = encodeURIComponent(seed);
  return `${baseUrl}&seed=${encodedSeed}`;
};
