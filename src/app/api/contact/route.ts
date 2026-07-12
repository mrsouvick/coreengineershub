import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message,
        status: 'UNREAD',
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Create contact submission error:', error);
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}
