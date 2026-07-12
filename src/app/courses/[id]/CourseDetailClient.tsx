'use client';

import { useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Download, 
  ExternalLink, 
  Youtube, 
  ArrowLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  notesUrl: string | null;
  courseId: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  playlistUrl: string;
  duration: string;
  createdAt: string;
  videos: Video[];
}

interface CourseDetailClientProps {
  course: Course;
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const activeVideo = course.videos[activeVideoIndex];

  // Helper to handle incrementing download count and downloading notes
  const handleDownloadNotes = async (notesUrl: string, title: string) => {
    // If it's a local note file structure, let's trigger download
    try {
      // Find note in notes DB by checking title or path (optional) to keep it simple,
      // we can just directly trigger download link since these URLs are seeded.
      const link = document.createElement('a');
      link.href = notesUrl;
      link.download = `${title}_Lecture_Notes.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Notes download error:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow" id="course-detail-view">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6">
        <Link
          href="/courses"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          <span>Back to Courses</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Video Area: Left (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {activeVideo ? (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg bg-black border border-gray-100">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-3xl bg-gray-100 flex items-center justify-center border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No videos available in this course playlist.</p>
            </div>
          )}

          {/* Active Video Info */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-primary-light text-primary text-[10px] font-bold rounded uppercase">
                  Lecture {activeVideoIndex + 1} of {course.videos.length}
                </span>
                {activeVideo?.notesUrl && (
                  <span className="px-2.5 py-0.5 bg-accent/15 text-accent-dark text-[10px] font-bold rounded uppercase">
                    Notes Available
                  </span>
                )}
              </div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-charcoal leading-snug">
                {activeVideo ? activeVideo.title : course.title}
              </h1>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {course.description}
            </p>

            {/* Companion notes download */}
            {activeVideo?.notesUrl && (
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-50 text-accent p-2 rounded-xl">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-charcoal">Download Lecture Companion Notes</h4>
                    <p className="text-xs text-gray-500">Includes core formulas, syllabus topics, and solved examples.</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadNotes(activeVideo.notesUrl!, activeVideo.title)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-xs shadow-sm transition-colors space-x-1.5 shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF Notes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation: Right (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Playlist Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-[80vh]">
            {/* Playlist Header */}
            <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-charcoal text-sm">Course Curriculum</h3>
                <p className="text-xs text-gray-500 mt-0.5">{course.videos.length} video lectures</p>
              </div>
              <a
                href={course.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="View full playlist on YouTube"
              >
                <Youtube className="h-5 w-5 fill-current" />
              </a>
            </div>

            {/* Playlist videos list */}
            <div className="overflow-y-auto divide-y divide-gray-100">
              {course.videos.map((video, idx) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`w-full flex items-start text-left p-4 hover:bg-gray-50 transition-colors ${
                    activeVideoIndex === idx
                      ? 'bg-primary-light/30 border-l-4 border-primary pl-3'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mr-3 ${
                    activeVideoIndex === idx
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Play className="h-3 w-3 fill-current" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase mb-0.5">
                      Lecture {idx + 1}
                    </span>
                    <h4 className={`text-xs font-bold truncate ${
                      activeVideoIndex === idx ? 'text-primary' : 'text-charcoal'
                    }`}>
                      {video.title}
                    </h4>
                    {video.notesUrl && (
                      <span className="inline-flex items-center text-[9px] text-accent-dark bg-amber-50 px-1.5 py-0.5 rounded font-semibold mt-1">
                        PDF notes included
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
