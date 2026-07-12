import { prisma } from '@/lib/prisma';
import NotesClient from './NotesClient';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NotesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialBranch = typeof resolvedSearchParams.branch === 'string' ? resolvedSearchParams.branch : '';

  const where: any = {};
  if (initialBranch && initialBranch !== 'all') {
    where.branch = initialBranch;
  }

  // Retrieve initial notes from SQLite database
  const initialNotes = await prisma.note.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Serialize Date objects to ISO strings for safe client serialization
  const serializedNotes = initialNotes.map((note) => ({
    ...note,
    id: note.id,
    title: note.title,
    subject: note.subject,
    semester: note.semester,
    branch: note.branch,
    category: note.category,
    fileUrl: note.fileUrl,
    fileType: note.fileType,
    viewCount: note.viewCount,
    downloadCount: note.downloadCount,
    createdAt: note.createdAt.toISOString(),
  }));

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <NotesClient initialNotes={serializedNotes} initialBranch={initialBranch} />
    </div>
  );
}
