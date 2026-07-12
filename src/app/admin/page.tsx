import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const revalidate = 0;

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Load database lists for CRUD tables in parallel
  const [notes, courses, blogs, submissions] = await Promise.all([
    prisma.note.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.course.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      include: { videos: true } 
    }),
    prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  // Serialize Dates to strings for safe transfer to client component
  const serializedNotes = notes.map((note) => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  }));

  const serializedCourses = courses.map((course) => ({
    ...course,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    videos: course.videos.map((video) => ({
      ...video,
      createdAt: video.createdAt.toISOString(),
    })),
  }));

  const serializedBlogs = blogs.map((blog) => ({
    ...blog,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  }));

  const serializedSubmissions = submissions.map((sub) => ({
    ...sub,
    createdAt: sub.createdAt.toISOString(),
  }));

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <AdminDashboardClient
        initialNotes={serializedNotes}
        initialCourses={serializedCourses}
        initialBlogs={serializedBlogs}
        initialSubmissions={serializedSubmissions}
        adminUser={session.username}
      />
    </div>
  );
}
