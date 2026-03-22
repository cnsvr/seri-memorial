import { NextResponse } from 'next/server';
import { getAllMedia } from '@/lib/cloudinary';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('seri-auth');
  if (auth?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const media = await getAllMedia();
    return NextResponse.json({ media });
  } catch (err) {
    console.error('Media fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
