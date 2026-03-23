import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('seri-auth');
  if (auth?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

  return new Promise<NextResponse>((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'seri',
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ url: result.secure_url, public_id: result.public_id }));
        }
      }
    );
    uploadStream.end(buffer);
  });
}
