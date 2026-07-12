import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Clock, Video, ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 0;

export default async function CoursesPage() {
  // Fetch courses from database along with video items count
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { videos: true }
      }
    }
  });

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal">
            Free Video Courses
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Structured syllabus-aligned video lecture playbooks to clear concepts and solve previous year papers.
          </p>
        </div>

        {/* Courses Cards Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {/* Course Details */}
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500 font-semibold">
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{course.duration}</span>
                      </span>
                      <span className="flex items-center">
                        <Video className="h-3.5 w-3.5 mr-1 text-primary" />
                        <span>{course._count.videos} Lectures</span>
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-lg text-charcoal line-clamp-1 group-hover:text-primary transition-colors mb-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Card footer redirect button */}
                <div className="p-6 pt-0 mt-4">
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition-colors space-x-2"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl max-w-xl mx-auto">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-gray-700 mb-1">No courses listed yet</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              Our academic curators are compiling video playbooks. Courses will appear here shortly!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
