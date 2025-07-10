import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra cấu hình Cloudinary
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    const contentType = request.headers.get('content-type');

    // Xử lý FormData (upload)
    if (contentType?.includes('multipart/form-data')) {
      return await handleUpload(request);
    }

    // Xử lý JSON (delete)
    const { action, ...data } = await request.json();

    switch (action) {
      case 'delete':
        return await handleDelete(data.publicId);
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Cloudinary API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const folder = searchParams.get('folder') || 'nq-chess';
    const maxResults = parseInt(searchParams.get('max_results') || '50');

    // Kiểm tra cấu hình Cloudinary
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    switch (action) {
      case 'list':
        return await handleList(folder, maxResults);
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Cloudinary API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function handleUpload(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'nq-chess';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

async function handleDelete(publicId: string) {
  if (!publicId) {
    return NextResponse.json(
      { success: false, error: 'Public ID is required' },
      { status: 400 }
    );
  }

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result === 'ok') {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { success: false, error: 'Failed to delete image from Cloudinary' },
      { status: 500 }
    );
  }
}

async function handleList(folder: string, maxResults: number) {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: maxResults,
    resource_type: 'image',
  });

  return NextResponse.json({
    success: true,
    resources: result.resources,
    total: result.resources.length,
  });
}
