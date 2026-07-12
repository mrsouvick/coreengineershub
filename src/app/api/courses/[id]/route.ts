import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: { videos: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Fetch course error:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, thumbnail, playlistUrl, duration, videos } = data;

    if (!title || !description || !thumbnail || !playlistUrl) {
      return NextResponse.json({ error: 'Primary fields are required' }, { status: 400 });
    }

    // Run transaction to replace associated videos and update course attributes
    const course = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing videos for this course
      await tx.video.deleteMany({
        where: { courseId: id },
      });

      // 2. Update course properties and write new video models
      return await tx.course.update({
        where: { id },
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
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
