'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Video,
  BookOpen,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Calendar,
  AlertCircle,
  FileUp,
  Tag,
  Clock,
  Play
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  subject: string;
  semester: number;
  branch: string;
  category: string;
  fileUrl: string;
  fileType: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
}

interface VideoLesson {
  id?: string;
  title: string;
  videoUrl: string;
  notesUrl: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  playlistUrl: string;
  duration: string;
  createdAt: string;
  videos: VideoLesson[];
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  imageUrl: string;
  createdAt: string;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

interface AdminDashboardClientProps {
  initialNotes: Note[];
  initialCourses: Course[];
  initialBlogs: BlogPost[];
  initialSubmissions: Submission[];
  adminUser: string;
}

type TabType = 'submissions' | 'notes' | 'courses' | 'blogs';

export default function AdminDashboardClient({
  initialNotes,
  initialCourses,
  initialBlogs,
  initialSubmissions,
  adminUser
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('submissions');

  // Lists state
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  // Form edit modes
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [editBlogId, setEditBlogId] = useState<string | null>(null);

  // Loading indicator states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  // 1. NOTES Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [noteSemester, setNoteSemester] = useState(3);
  const [noteBranch, setNoteBranch] = useState('CSE');
  const [noteCategory, setNoteCategory] = useState('Notes');
  const [noteFileUrl, setNoteFileUrl] = useState('');
  const [noteFileType, setNoteFileType] = useState('pdf');

  // 2. COURSES Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseThumb, setCourseThumb] = useState('');
  const [coursePlayUrl, setCoursePlayUrl] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseVideos, setCourseVideos] = useState<VideoLesson[]>([]);

  // 3. BLOG Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Exam Prep');
  const [blogTags, setBlogTags] = useState('');
  const [blogImage, setBlogImage] = useState('');

  // LOGOUT
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // UPLOAD FILE HELPER
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setNoteFileUrl(data.fileUrl);
        // Deduce file type
        const ext = file.name.split('.').pop() || 'pdf';
        setNoteFileType(ext.toLowerCase());
      } else {
        setFormError(data.error || 'File upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setFormError('Upload network error');
    } finally {
      setUploading(false);
    }
  };

  // NOTES ACTIONS
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    if (!noteTitle || !noteSubject || !noteFileUrl) {
      setFormError('Title, subject, and file are required.');
      setLoading(false);
      return;
    }

    const payload = {
      title: noteTitle,
      subject: noteSubject,
      semester: noteSemester,
      branch: noteBranch,
      category: noteCategory,
      fileUrl: noteFileUrl,
      fileType: noteFileType,
    };

    try {
      const url = editNoteId ? `/api/notes/${editNoteId}` : '/api/notes';
      const method = editNoteId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form
        setNoteTitle('');
        setNoteSubject('');
        setNoteSemester(3);
        setNoteBranch('CSE');
        setNoteCategory('Notes');
        setNoteFileUrl('');
        setNoteFileType('pdf');
        setEditNoteId(null);

        // Refresh notes list
        const refreshedRes = await fetch('/api/notes');
        const refreshedData = await refreshedRes.json();
        setNotes(refreshedData);
      } else {
        setFormError(result.error || 'Failed to save note');
      }
    } catch (err) {
      console.error(err);
      setFormError('Network error saving note');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditNoteId(note.id);
    setNoteTitle(note.title);
    setNoteSubject(note.subject);
    setNoteSemester(note.semester);
    setNoteBranch(note.branch);
    setNoteCategory(note.category);
    setNoteFileUrl(note.fileUrl);
    setNoteFileType(note.fileType);
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // COURSES ACTIONS
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    if (!courseTitle || !courseDesc || !courseThumb || !coursePlayUrl) {
      setFormError('Title, description, thumbnail, and playlist URL are required.');
      setLoading(false);
      return;
    }

    const payload = {
      title: courseTitle,
      description: courseDesc,
      thumbnail: courseThumb,
      playlistUrl: coursePlayUrl,
      duration: courseDuration || 'Self-paced',
      videos: courseVideos,
    };

    try {
      const url = editCourseId ? `/api/courses/${editCourseId}` : '/api/courses';
      const method = editCourseId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setCourseTitle('');
        setCourseDesc('');
        setCourseThumb('');
        setCoursePlayUrl('');
        setCourseDuration('');
        setCourseVideos([]);
        setEditCourseId(null);

        const refreshedRes = await fetch('/api/courses');
        const refreshedData = await refreshedRes.json();
        setCourses(refreshedData);
      } else {
        setFormError(result.error || 'Failed to save course');
      }
    } catch (err) {
      console.error(err);
      setFormError('Network error saving course');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditCourseId(course.id);
    setCourseTitle(course.title);
    setCourseDesc(course.description);
    setCourseThumb(course.thumbnail);
    setCoursePlayUrl(course.playlistUrl);
    setCourseDuration(course.duration);
    setCourseVideos(course.videos.map(v => ({ title: v.title, videoUrl: v.videoUrl, notesUrl: v.notesUrl })));
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? All associated video lessons will be deleted too.')) return;
    try {
      const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCourses(courses.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // BLOG ACTIONS
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    if (!blogTitle || !blogContent || !blogCategory || !blogTags || !blogImage) {
      setFormError('All blog fields are required.');
      setLoading(false);
      return;
    }

    const payload = {
      title: blogTitle,
      content: blogContent,
      category: blogCategory,
      tags: blogTags,
      imageUrl: blogImage,
    };

    try {
      const url = editBlogId ? `/api/blog/${editBlogId}` : '/api/blog';
      const method = editBlogId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setBlogTitle('');
        setBlogContent('');
        setBlogCategory('Exam Prep');
        setBlogTags('');
        setBlogImage('');
        setEditBlogId(null);

        const refreshedRes = await fetch('/api/blog');
        const refreshedData = await refreshedRes.json();
        setBlogs(refreshedData);
      } else {
        setFormError(result.error || 'Failed to save article');
      }
    } catch (err) {
      console.error(err);
      setFormError('Network error saving article');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setBlogCategory(blog.category);
    setBlogTags(blog.tags);
    setBlogImage(blog.imageUrl);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const response = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SUBMISSION ACTIONS
  const handleToggleSubStatus = async (sub: Submission) => {
    const nextStatus = sub.status === 'UNREAD' ? 'READ' : 'UNREAD';
    try {
      const response = await fetch(`/api/contact/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) {
        setSubmissions(
          submissions.map((s) => (s.id === sub.id ? { ...s, status: nextStatus } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student message?')) return;
    try {
      const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSubmissions(submissions.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = submissions.filter((s) => s.status === 'UNREAD').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-panel">
      {/* Top Header Panel */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-lg uppercase">
            Administrative Role
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-charcoal mt-1.5">
            Dashboard Control Panel
          </h1>
          <p className="text-gray-400 text-xs">Logged in as: <strong className="text-gray-600 font-sans">{adminUser}</strong></p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 hover:border-red-200 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all space-x-1.5 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-charcoal font-heading">{notes.length}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Notes Uploaded</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-charcoal font-heading">{courses.length}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Free Playlists</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-charcoal font-heading">{blogs.length}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Blog Articles</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${unreadCount > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-charcoal font-heading">{unreadCount}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">New Requests</p>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-150 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => { setActiveTab('submissions'); setFormError(''); }}
          className={`px-5 py-3 text-xs font-bold transition-all shrink-0 border-b-2 uppercase tracking-wider ${
            activeTab === 'submissions'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-charcoal'
          }`}
          id="tab-submissions"
        >
          Requests Submissions ({unreadCount})
        </button>
        <button
          onClick={() => { setActiveTab('notes'); setFormError(''); }}
          className={`px-5 py-3 text-xs font-bold transition-all shrink-0 border-b-2 uppercase tracking-wider ${
            activeTab === 'notes'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-charcoal'
          }`}
          id="tab-notes"
        >
          Manage Notes
        </button>
        <button
          onClick={() => { setActiveTab('courses'); setFormError(''); }}
          className={`px-5 py-3 text-xs font-bold transition-all shrink-0 border-b-2 uppercase tracking-wider ${
            activeTab === 'courses'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-charcoal'
          }`}
          id="tab-courses"
        >
          Manage Courses
        </button>
        <button
          onClick={() => { setActiveTab('blogs'); setFormError(''); }}
          className={`px-5 py-3 text-xs font-bold transition-all shrink-0 border-b-2 uppercase tracking-wider ${
            activeTab === 'blogs'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-charcoal'
          }`}
          id="tab-blogs"
        >
          Manage Blog
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="space-y-8">
        
        {/* TAB 1: CONTACT SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="font-heading font-bold text-charcoal">Student Messages & Requests</h3>
              <p className="text-xs text-gray-500 mt-0.5">Inbox folder containing notes requests submitted via the contact form.</p>
            </div>
            
            {submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4">Sender</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className={`hover:bg-gray-50/50 transition-colors ${sub.status === 'UNREAD' ? 'bg-primary-light/5 font-semibold' : ''}`}>
                        <td className="p-4">
                          <p className="font-bold text-charcoal">{sub.name}</p>
                          <p className="text-[10px] text-gray-400 font-sans mt-0.5">{sub.email}</p>
                        </td>
                        <td className="p-4 max-w-xs sm:max-w-md whitespace-pre-wrap leading-relaxed text-gray-600">
                          {sub.message}
                        </td>
                        <td className="p-4 whitespace-nowrap text-gray-400 font-medium">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleSubStatus(sub)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                              sub.status === 'UNREAD'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-green-50 text-green-600'
                            }`}
                          >
                            {sub.status}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete submission"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <MessageSquare className="h-10 w-10 mx-auto text-gray-200 mb-3" />
                <p>No messages received yet.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE NOTES */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Section */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <h3 className="font-heading font-bold text-charcoal">
                  {editNoteId ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                {editNoteId && (
                  <button
                    onClick={() => {
                      setEditNoteId(null);
                      setNoteTitle('');
                      setNoteSubject('');
                      setNoteFileUrl('');
                      setNoteFileType('pdf');
                    }}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleNoteSubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-start space-x-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* File Upload Field */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">
                    Upload PDF / Notes File
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="flex-grow flex flex-col items-center justify-center px-4 py-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer text-center">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <FileUp className="h-4 w-4 text-primary" />
                        <span className="font-bold">Select Notes File</span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploading && (
                    <p className="text-[10px] text-primary font-bold animate-pulse">Uploading file to server...</p>
                  )}
                  {noteFileUrl && (
                    <div className="p-2.5 bg-green-50 border border-green-100 rounded-xl text-green-700 break-all flex items-start">
                      <CheckCircle className="h-4 w-4 shrink-0 mr-1.5 mt-0.5" />
                      <span>Saved as: {noteFileUrl}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Resource Title</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Data Structures solved Paper 2023"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Subject & Code</label>
                  <input
                    type="text"
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    placeholder="e.g. Discrete Mathematics (BS-M301)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-600 uppercase">Branch Tag</label>
                    <select
                      value={noteBranch}
                      onChange={(e) => setNoteBranch(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="IT">IT</option>
                      <option value="EE">EE</option>
                      <option value="CE">CE</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-600 uppercase">Semester</label>
                    <select
                      value={noteSemester}
                      onChange={(e) => setNoteSemester(parseInt(e.target.value))}
                      className="w-full px-2 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Resource Type</label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                  >
                    <option value="Notes">Lecture Notes</option>
                    <option value="PYQ">PYQ Solved Papers</option>
                    <option value="Suggestions">Exam Suggestions</option>
                    <option value="Syllabus">Syllabus Copy</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-colors cursor-pointer text-xs mt-2"
                >
                  {loading ? 'Saving...' : editNoteId ? 'Update Note' : 'Add Note'}
                </button>
              </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-heading font-bold text-charcoal">All Uploaded Resources</h3>
                <p className="text-xs text-gray-500 mt-0.5">Metadata overview of notes published for students.</p>
              </div>

              {notes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase border-b border-gray-100">
                        <th className="p-4">Resource</th>
                        <th className="p-4">Branch/Sem</th>
                        <th className="p-4 text-center">Stats</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {notes.map((note) => (
                        <tr key={note.id} className="hover:bg-gray-50/20 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-charcoal">{note.title}</p>
                            <p className="text-[10px] text-gray-400 font-sans mt-0.5">{note.subject} · {note.category}</p>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-primary-light text-primary rounded font-bold uppercase tracking-wider text-[10px]">
                              {note.branch} · Sem {note.semester}
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap font-medium text-gray-500">
                            <p>{note.viewCount} views</p>
                            <p className="text-[10px] text-gray-400">{note.downloadCount} downloads</p>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => handleEditNote(note)}
                              className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
                              title="Edit metadata"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete resource"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <FileText className="h-10 w-10 mx-auto text-gray-200 mb-3" />
                  <p>No resources found in the database.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE COURSES */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Section */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <h3 className="font-heading font-bold text-charcoal">
                  {editCourseId ? 'Edit Video Course' : 'Create Video Course'}
                </h3>
                {editCourseId && (
                  <button
                    onClick={() => {
                      setEditCourseId(null);
                      setCourseTitle('');
                      setCourseDesc('');
                      setCourseThumb('');
                      setCoursePlayUrl('');
                      setCourseDuration('');
                      setCourseVideos([]);
                    }}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleCourseSubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-start space-x-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Course Playlist Title</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Engineering Mathematics-I lectures"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Course Description</label>
                  <textarea
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Provide details about covered modules, key syllabus parts..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    required
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={courseThumb}
                    onChange={(e) => setCourseThumb(e.target.value)}
                    placeholder="https://images.unsplash.com/... or relative path"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-600 uppercase">Duration Tag</label>
                    <input
                      type="text"
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      placeholder="e.g. 15 Hours"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-600 uppercase">YouTube Playlist Link</label>
                    <input
                      type="url"
                      value={coursePlayUrl}
                      onChange={(e) => setCoursePlayUrl(e.target.value)}
                      placeholder="https://www.youtube.com/playlist?list=..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                      required
                    />
                  </div>
                </div>

                {/* Sub-form: Manage Playlist Videos */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-charcoal uppercase tracking-wide">Video Lectures Playlist</label>
                    <button
                      type="button"
                      onClick={() => setCourseVideos([...courseVideos, { title: '', videoUrl: '', notesUrl: null }])}
                      className="inline-flex items-center text-[10px] text-primary hover:text-primary-dark font-extrabold"
                    >
                      <Plus className="h-3.5 w-3.5 mr-0.5" />
                      <span>Add Lecture Video</span>
                    </button>
                  </div>

                  {courseVideos.length > 0 ? (
                    <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
                      {courseVideos.map((video, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100 relative">
                          <button
                            type="button"
                            onClick={() => setCourseVideos(courseVideos.filter((_, i) => i !== idx))}
                            className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                            title="Remove video row"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Lecture Video #{idx + 1}</p>

                          <div className="space-y-1">
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => {
                                const newVideos = [...courseVideos];
                                newVideos[idx].title = e.target.value;
                                setCourseVideos(newVideos);
                              }}
                              placeholder="Video Title (e.g. Leibniz Theorem)"
                              className="w-full px-2 py-1.5 rounded border border-gray-200 bg-white"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="url"
                              value={video.videoUrl}
                              onChange={(e) => {
                                const newVideos = [...courseVideos];
                                newVideos[idx].videoUrl = e.target.value;
                                setCourseVideos(newVideos);
                              }}
                              placeholder="Embed URL (youtube.com/embed/...)"
                              className="w-full px-2 py-1.5 rounded border border-gray-200 bg-white"
                              required
                            />
                            <input
                              type="text"
                              value={video.notesUrl || ''}
                              onChange={(e) => {
                                const newVideos = [...courseVideos];
                                newVideos[idx].notesUrl = e.target.value || null;
                                setCourseVideos(newVideos);
                              }}
                              placeholder="Notes URL (/uploads/...)"
                              className="w-full px-2 py-1.5 rounded border border-gray-200 bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic">No lectures added yet. Click above to add videos.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-colors cursor-pointer text-xs mt-4"
                >
                  {loading ? 'Saving...' : editCourseId ? 'Update Video Course' : 'Create Video Course'}
                </button>
              </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-heading font-bold text-charcoal">All Courses</h3>
                <p className="text-xs text-gray-500 mt-0.5">Control hub for managing courses and sub-videos.</p>
              </div>

              {courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase border-b border-gray-100">
                        <th className="p-4">Course Info</th>
                        <th className="p-4 text-center">Lectures</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50/20 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={course.thumbnail}
                              alt=""
                              className="h-10 w-16 object-cover rounded-lg border border-gray-100"
                            />
                            <div>
                              <p className="font-bold text-charcoal">{course.title}</p>
                              <p className="text-[10px] text-gray-400 font-sans truncate max-w-xs">{course.duration} · {course.playlistUrl}</p>
                            </div>
                          </td>
                          <td className="p-4 text-center font-bold text-gray-600">
                            {course.videos.length} videos
                          </td>
                          <td className="p-4 text-center whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
                              title="Edit course & lectures"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete course"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <Video className="h-10 w-10 mx-auto text-gray-200 mb-3" />
                  <p>No video courses added to database yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE BLOGS */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Section */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <h3 className="font-heading font-bold text-charcoal">
                  {editBlogId ? 'Edit Article' : 'Write Guidance Article'}
                </h3>
                {editBlogId && (
                  <button
                    onClick={() => {
                      setEditBlogId(null);
                      setBlogTitle('');
                      setBlogContent('');
                      setBlogCategory('Exam Prep');
                      setBlogTags('');
                      setBlogImage('');
                    }}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-start space-x-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Article Title</label>
                  <input
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. Blueprint to score 8.5+ SGPA in MAKAUT"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-600 uppercase">Category</label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    >
                      <option value="Exam Prep">Exam Preparation</option>
                      <option value="Career">Career & Placements</option>
                      <option value="Roadmap">Roadmaps & Credit System</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-600 uppercase">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={blogTags}
                      onChange={(e) => setBlogTags(e.target.value)}
                      placeholder="e.g. Exam Tips, SGPA, Study Plan"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Header Image URL</label>
                  <input
                    type="url"
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or relative link"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 uppercase">Article Content (HTML tags supported)</label>
                  <textarea
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Write detailed advice article. Wrap paragraphs with <p>, use <h3> for headings, <ul> and <li> for bullet lists."
                    rows={12}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/20 font-mono"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-colors cursor-pointer text-xs mt-4"
                >
                  {loading ? 'Saving...' : editBlogId ? 'Update Article' : 'Publish Article'}
                </button>
              </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-heading font-bold text-charcoal">All Guidance Articles</h3>
                <p className="text-xs text-gray-500 mt-0.5">Control hub for managing blog content.</p>
              </div>

              {blogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase border-b border-gray-100">
                        <th className="p-4">Article</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {blogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-gray-50/20 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blog.imageUrl}
                              alt=""
                              className="h-10 w-16 object-cover rounded-lg border border-gray-100"
                            />
                            <div>
                              <p className="font-bold text-charcoal">{blog.title}</p>
                              <p className="text-[10px] text-gray-400 font-sans">{new Date(blog.createdAt).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-bold uppercase tracking-wider text-[10px]">
                              {blog.category}
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
                              title="Edit article"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete article"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <BookOpen className="h-10 w-10 mx-auto text-gray-200 mb-3" />
                  <p>No guidance articles written yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
