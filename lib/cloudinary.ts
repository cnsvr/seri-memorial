import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export type MediaItem = {
  public_id: string;
  secure_url: string;
  resource_type: 'image' | 'video';
  format: string;
  width?: number;
  height?: number;
  created_at: string;
};

export async function getAllMedia(): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  const [images, videos] = await Promise.all([
    cloudinary.api.resources({
      type: 'upload',
      prefix: 'seri/',
      resource_type: 'image',
      max_results: 500,
    }),
    cloudinary.api.resources({
      type: 'upload',
      prefix: 'seri/',
      resource_type: 'video',
      max_results: 500,
    }),
  ]);

  for (const img of images.resources) {
    results.push({ ...img, resource_type: 'image' });
  }
  for (const vid of videos.resources) {
    results.push({ ...vid, resource_type: 'video' });
  }

  return results;
}

// Deterministic daily pick: same result all day, changes each day
export function getDailyMedia(media: MediaItem[]): MediaItem | null {
  if (!media.length) return null;
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
  }
  return media[hash % media.length];
}
