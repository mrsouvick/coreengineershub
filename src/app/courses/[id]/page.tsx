import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CourseDetailClient from './CourseDetailClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Retrieve course item including sub-playlist video models
  const course = await prisma.course.findUnique({
    where: { id },
    include: { videos: true },
  });

  if (!course) {
    notFound();
  }

  // Serialize Dates for client transfer
  const serializedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    playlistUrl: course.playlistUrl,
    duration: course.duration,
    createdAt: course.createdAt.toISOString(),
    videos: course.videos.map((video) => ({
      id: video.id,
      title: video.title,
      videoUrl: video.videoUrl,
      notesUrl: video.notesUrl,
      courseId: video.courseId,
      createdAt: video.createdAt.toISOString(),
    })),
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <CourseDetailClient course={serializedCourse} />
    </div>
  );
}
