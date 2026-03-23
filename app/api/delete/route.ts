import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { cookies } from 'next/headers';

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('seri-auth');
  if (auth?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { public_id, resource_type } = await req.json();
  if (!public_id) {
    return NextResponse.json({ error: 'No public_id provided' }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(public_id, { resource_type: resource_type || 'image' });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
