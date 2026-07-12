import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: { videos: true },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, thumbnail, playlistUrl, duration, videos } = data;

    if (!title || !description || !thumbnail || !playlistUrl) {
      return NextResponse.json({ error: 'Primary fields are required' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        playlistUrl,
        duration: duration || 'Self-paced',
        videos: videos && Array.isArray(videos) ? {
          create: videos.map((video: any) => ({
            title: video.title,
            videoUrl: video.videoUrl,
            notesUrl: video.notesUrl || null,
          })),
        } : undefined,
      },
      include: { videos: true },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
