import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Increment viewCount on fetching individual note
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Fetch note error:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { action } = data;

    if (action === 'download') {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, downloadCount: updatedNote.downloadCount });
    }

    // Administrative update via PATCH
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, subject, semester, branch, category, fileUrl, fileType } = data;

    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        subject,
        semester: semester ? parseInt(semester) : undefined,
        branch,
        category,
        fileUrl,
        fileType,
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
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
    const { title, subject, semester, branch, category, fileUrl, fileType } = data;

    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        subject,
        semester: parseInt(semester),
        branch,
        category,
        fileUrl,
        fileType,
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
