import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Fetch blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, content, category, tags, author, imageUrl } = data;

    if (!title || !content || !category || !tags || !imageUrl) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        category,
        tags,
        author: author || 'Core Engineers Hub',
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
