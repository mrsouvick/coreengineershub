import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  ArrowRight, 
  BookOpen, 
  Download, 
  GraduationCap, 
  Users, 
  Youtube, 
  Clock, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  Video
} from 'lucide-react';

// Force dynamic so data is always fresh from SQLite
export const revalidate = 0;

export default async function HomePage() {
  // Fetch high-quality database contents in parallel
  const [featuredNotes, courses, latestBlogs] = await Promise.all([
    prisma.note.findMany({
      take: 3,
      orderBy: { downloadCount: 'desc' },
    }),
    prisma.course.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blogPost.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const branches = [
    { name: 'Computer Science (CSE)', code: 'CSE', desc: 'Notes for DSA, OS, DBMS, DAA, discrete maths & labs.', color: 'from-blue-500 to-indigo-600', icon: GraduationCap },
    { name: 'Electronics & Comm (ECE)', code: 'ECE', desc: 'Core ECE notes for network, signals, analog communication.', color: 'from-teal-500 to-emerald-600', icon: TrendingUp },
    { name: 'Mechanical Eng (ME)', code: 'ME', desc: 'Thermodynamics, fluid mechanics, SOM suggestions.', color: 'from-orange-500 to-red-600', icon: FileText },
    { name: 'Information Tech (IT)', code: 'IT', desc: 'Syllabus coverage for software engineering, networking.', color: 'from-purple-500 to-pink-600', icon: Users },
  ];

  const stats = [
    { label: 'Engineering Students Helped', value: '15,000+', icon: Users },
    { label: 'MAKAUT Study Resources', value: '250+', icon: FileText },
    { label: 'YouTube Subscribers', value: '22,000+', icon: Youtube },
    { label: 'MAKAUT Branches Covered', value: '6+', icon: GraduationCap },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-primary-light/20 pt-10 pb-20 md:py-32 overflow-hidden border-b border-gray-100">
        {/* Background circuit/gear accents */}
        <div className="absolute right-0 top-1/4 -translate-y-1/2 opacity-5 pointer-events-none animate-spin-slow">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" />
            <path d="M50 0V20M50 80V100M0 50H20M80 50H100" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero text content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-primary-light/60 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Companion Platform to Core Engineers Hub YouTube</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-charcoal leading-tight">
                Ace Your <span className="gradient-text">MAKAUT</span> Semester Exams For Free
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Unlock structured notes, previous year solved papers (PYQs), branch suggestions, and lecture playbooks specifically compiled for Maulana Abul Kalam Azad University of Technology.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/notes"
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl text-base font-bold text-white bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  id="hero-notes-btn"
                >
                  Browse Notes
                </Link>
                <Link
                  href="/courses"
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl text-base font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-primary-light shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200"
                  id="hero-courses-btn"
                >
                  Watch Free Courses
                </Link>
              </div>
            </div>

            {/* Hero graphics */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative w-full h-[400px] flex items-center justify-center">
                <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute w-60 h-60 bg-accent/10 rounded-full blur-3xl -z-10 translate-x-12 translate-y-12" />
                
                {/* Floating Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs animate-float relative z-20">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-charcoal mb-1">Organized Notes</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Syllabus-wise study guides for CSE, ECE, EE, and Mechanical. Clear exams with zero backlogs.</p>
                </div>
                
                <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-2xl max-w-xs absolute bottom-10 right-0 z-30 translate-x-4 border border-gray-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-red-600 p-2 rounded-lg">
                      <Youtube className="h-5 w-5 fill-current text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">YouTube Lectures</h4>
                      <p className="text-[10px] text-gray-400">Step-by-Step guides</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-4/5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 border-r border-gray-100 last:border-0">
                <div className="text-primary flex items-center justify-center mb-2">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-extrabold text-charcoal font-heading">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium tracking-wide mt-1 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Branch Navigation Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal">
              Select Your Department
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Find semester-wise and subject-specific resources tailored directly to your engineering curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((branch, idx) => (
              <Link
                key={idx}
                href={`/notes?branch=${branch.code}`}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-primary-light transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${branch.color} text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <branch.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-charcoal mb-2 group-hover:text-primary transition-colors">
                    {branch.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {branch.desc}
                  </p>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-1.5 transition-transform duration-200">
                  <span>Browse notes</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Resources Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-charcoal">
                Trending Downloads
              </h2>
              <p className="text-gray-500 mt-2">
                The most popular study materials currently helping MAKAUT students prepare for exams.
              </p>
            </div>
            <Link
              href="/notes"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <span>View all resources</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredNotes.length > 0 ? (
              featuredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 bg-primary-light text-primary rounded-lg text-xs font-bold uppercase tracking-wider">
                        {note.branch} · Sem {note.semester}
                      </span>
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                        {note.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-charcoal mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-500 text-xs font-semibold uppercase mb-4">
                      {note.subject}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span>{note.downloadCount} downloads</span>
                    </span>
                    <Link
                      href="/notes"
                      className="inline-flex items-center justify-center p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      title="Download resource"
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
                No resources uploaded yet. Notes will appear as soon as the administrator populates the dashboard.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Free Courses Section */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-charcoal">
                Free Lectures & Syllabus Guides
              </h2>
              <p className="text-gray-500 mt-2">
                Step-by-step video playlists covering core engineering topics. Learn concepts, solve numericals, and reference companion notes.
              </p>
            </div>
            <Link
              href="/courses"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <span>View all courses</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 group flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                        <Video className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-charcoal group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-primary mt-6">
                      <span>Start learning</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
                No video courses listed yet. Watch this space!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Guidance Hub/Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-charcoal">
                Guidance & Placements Blog
              </h2>
              <p className="text-gray-500 mt-2">
                Proven tips from seniors and alumni to boost your placements, understand credit structures, and pass backlogs.
              </p>
            </div>
            <Link
              href="/blog"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <span>Read all articles</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogs.length > 0 ? (
              latestBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 mb-4 border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
                    {blog.category}
                  </span>
                  <h3 className="font-heading font-bold text-base text-charcoal group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 space-x-3 mt-auto">
                    <span>By {blog.author}</span>
                    <span>·</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
                No blog posts published yet. Blogs are added from the admin dashboard regularly.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. YouTube Embedded Section */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        {/* Background gear shapes */}
        <div className="absolute left-0 bottom-0 opacity-5 pointer-events-none translate-y-12">
          <svg width="300" height="300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-red-950 border border-red-800/40 px-3 py-1.5 rounded-full text-xs font-semibold text-red-400">
                <Youtube className="h-4 w-4 fill-current" />
                <span>MAKAUT's Dedicated Platform</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
                Watch us live on YouTube
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                We broadcast live classes, syllabus orientation sessions, and answer student questions directly. Subscribe to our channel and press the bell icon so you never miss a lecture video or suggestion drop.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-gray-300 text-sm font-medium">Free Live Doubt Clearing Streams</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-gray-300 text-sm font-medium">MAKAUT Exam Suggestion Walkthroughs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-gray-300 text-sm font-medium">Regular Placement Preparation Videos</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.youtube.com/@CoreEngineersHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all duration-200 space-x-2"
                >
                  <Youtube className="h-5 w-5 fill-current" />
                  <span>Join 22K+ Subscribers</span>
                </a>
              </div>
            </div>

            {/* Embedded youtube video */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/zWg7U0OEAoE" // Sample video from the channel (DSA lecture introduction)
                  title="Core Engineers Hub YouTube Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-3xl font-bold text-charcoal">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">
              Clear answers to help you navigate our platform and resources.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-heading font-bold text-base text-charcoal flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Are these study resources really free?</span>
              </h3>
              <p className="text-gray-600 text-sm mt-3 ml-8 leading-relaxed">
                Yes! Every single PDF note, previous year solved paper, syllabus copy, and suggestional booklet is 100% free to download. We do not charge anything for accessing academic guidance.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-heading font-bold text-base text-charcoal flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>How accurate are the exam suggestions?</span>
              </h3>
              <p className="text-gray-600 text-sm mt-3 ml-8 leading-relaxed">
                Our suggestions are compiled by comparing MAKAUT question paper patterns of the past 7 years and analyzing trending core topics. While they are highly accurate and cover 70-80% of exams, we always advise students to study the full syllabus notes as well.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-heading font-bold text-base text-charcoal flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>How can I request notes for a specific subject?</span>
              </h3>
              <p className="text-gray-600 text-sm mt-3 ml-8 leading-relaxed">
                If your branch or semester subject notes are missing, head to our <Link href="/contact" className="text-primary hover:underline font-bold">Contact Page</Link> and write a request. The admin will compile and upload the PDF notes as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
