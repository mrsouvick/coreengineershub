import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get('branch');
    const semester = searchParams.get('semester');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};

    if (branch && branch !== 'all') {
      where.branch = branch;
    }
    if (semester && semester !== 'all') {
      where.semester = parseInt(semester);
    }
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { subject: { contains: search } },
      ];
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Fetch notes error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, subject, semester, branch, category, fileUrl, fileType } = data;

    if (!title || !subject || !semester || !branch || !category || !fileUrl) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        subject,
        semester: parseInt(semester),
        branch,
        category,
        fileUrl,
        fileType: fileType || 'pdf',
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
