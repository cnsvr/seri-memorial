import { NextResponse } from 'next/server';
import { getAllMedia, getDailyMedia } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const media = await getAllMedia();
    const daily = getDailyMedia(media);
    return NextResponse.json({ daily, total: media.length });
  } catch (err) {
    console.error('Media fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
