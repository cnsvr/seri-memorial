import { NextResponse } from 'next/server';
import { getAllMedia, getDailyMedia } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const random = searchParams.get('random') === 'true';
    const media = await getAllMedia();
    const daily = random
      ? (media.length ? media[Math.floor(Math.random() * media.length)] : null)
      : getDailyMedia(media);
    return NextResponse.json({ daily, total: media.length });
  } catch (err) {
    console.error('Media fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
