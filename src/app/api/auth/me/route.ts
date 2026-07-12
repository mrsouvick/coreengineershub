import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, username: null });
    }
    return NextResponse.json({ authenticated: true, username: session.username });
  } catch (error) {
    console.error('Auth session error:', error);
    return NextResponse.json({ authenticated: false, username: null });
  }
}
