'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Share2, 
  FileText, 
  X, 
  ExternalLink,
  BookOpen,
  Send,
  MessageSquare
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

interface NotesClientProps {
  initialNotes: Note[];
  initialBranch: string;
}

export default function NotesClient({ initialNotes, initialBranch }: NotesClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [loading, setLoading] = useState(false);
  
  // State variables for filters
  const [branch, setBranch] = useState(initialBranch || 'all');
  const [semester, setSemester] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  
  // Active selected note for detail view / preview modal
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Trigger search and filters on changes
  useEffect(() => {
    const fetchFilteredNotes = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (branch !== 'all') queryParams.append('branch', branch);
        if (semester !== 'all') queryParams.append('semester', semester);
        if (category !== 'all') queryParams.append('category', category);
        if (search.trim() !== '') queryParams.append('search', search);

        const response = await fetch(`/api/notes?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        }
      } catch (error) {
        console.error('Error filtering notes:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search query changes slightly
    const delayDebounce = setTimeout(() => {
      fetchFilteredNotes();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [branch, semester, category, search]);

  // Handle Incremental View Count and open Preview
  const handlePreviewNote = async (note: Note) => {
    setSelectedNote(note);
    // Trigger GET to increment viewCount on backend
    try {
      const response = await fetch(`/api/notes/${note.id}`);
      if (response.ok) {
        const updatedNote = await response.json();
        // Update local state note view count
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n.id === note.id ? { ...n, viewCount: updatedNote.viewCount } : n))
        );
      }
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  // Handle Incremental Download Count and download file
  const handleDownloadNote = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    
    // 1. Increment count in DB
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download' }),
      });
      
      // Update local state download count
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === note.id ? { ...n, downloadCount: n.downloadCount + 1 } : n))
      );
    } catch (error) {
      console.error('Failed to increment download count:', error);
    }

    // 2. Trigger browser download
    const link = document.createElement('a');
    link.href = note.fileUrl;
    link.download = `${note.title}.${note.fileType}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle sharing note resource
  const handleShareNote = (e: React.MouseEvent, note: Note, platform: 'whatsapp' | 'telegram') => {
    e.stopPropagation();
    const shareText = `Check out this study resource for MAKAUT: "${note.title}" for ${note.subject} (${note.branch} Semester ${note.semester}). Download notes from Core Engineers Hub!`;
    const shareUrl = `${window.location.origin}/notes`;
    
    let url = '';
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    } else {
      url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    }
    
    window.open(url, '_blank');
  };

  const branches = ['CSE', 'ECE', 'ME', 'IT', 'EE', 'CE'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const categories = ['Notes', 'PYQ', 'Suggestions', 'Syllabus'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow" id="notes-explorer">
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal">
          Notes & Syllabus Explorer
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Browse, preview, and download semester exam suggestions, syllabus copies, and solved question papers for MAKAUT.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Search by note title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/50"
              id="search-notes-input"
            />
          </div>

          {/* Branch Filter */}
          <div className="md:col-span-3">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/50"
              id="filter-branch"
            >
              <option value="all">All Departments</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b} Branch
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div className="md:col-span-2">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/50"
              id="filter-semester"
            >
              <option value="all">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s.toString()}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/50"
              id="filter-category"
            >
              <option value="all">All Resource Types</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <span className="flex h-8 w-8 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
          <p className="text-gray-500 text-sm font-semibold">Filtering database resources...</p>
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="notes-grid">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handlePreviewNote(note)}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-primary-light/60 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 bg-primary-light text-primary rounded-lg text-xs font-bold uppercase tracking-wider">
                    {note.branch} · Sem {note.semester}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    note.category === 'Notes' ? 'bg-blue-50 text-blue-600' :
                    note.category === 'PYQ' ? 'bg-purple-50 text-purple-600' :
                    note.category === 'Suggestions' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {note.category}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-charcoal mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {note.title}
                </h3>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  {note.subject}
                </p>
              </div>

              {/* Statistics & Actions */}
              <div className="pt-4 border-t border-gray-50 mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[11px] text-gray-400 font-semibold">
                  <span className="flex items-center">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    <span>{note.viewCount} views</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    <span>{note.downloadCount} DLs</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleShareNote(e, note, 'whatsapp')}
                    className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:text-green-600 hover:bg-green-50 transition-colors"
                    title="Share on WhatsApp"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleShareNote(e, note, 'telegram')}
                    className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:text-blue-50 hover:bg-blue-50 transition-colors"
                    title="Share on Telegram"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleDownloadNote(e, note)}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl max-w-xl mx-auto">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-gray-700 mb-1">No matching resources found</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            Try adjusting your search criteria, selecting a different department branch, or checking another semester.
          </p>
        </div>
      )}

      {/* PDF Preview Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNote(null)}></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-gray-100">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-primary-light text-primary rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {selectedNote.branch} · Semester {selectedNote.semester}
                  </span>
                  <h2 className="font-heading font-bold text-base md:text-lg text-charcoal line-clamp-1 mt-1">
                    {selectedNote.title}
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => handleDownloadNote(e, selectedNote)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors space-x-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Download Notes</span>
                  </button>
                  <a
                    href={selectedNote.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Preview Body */}
              <div className="flex-grow bg-gray-100 relative p-4 flex items-center justify-center">
                {/* PDF Viewer embedding */}
                {selectedNote.fileUrl.endsWith('.pdf') || selectedNote.fileUrl.includes('/uploads/') ? (
                  <iframe
                    src={`${selectedNote.fileUrl}#toolbar=0`}
                    className="w-full h-full rounded-xl border border-gray-200 shadow-inner bg-white"
                    title={selectedNote.title}
                  ></iframe>
                ) : (
                  <div className="bg-white p-8 rounded-2xl text-center max-w-md shadow border border-gray-100">
                    <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-gray-700 mb-2">Resource Preview</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      This file cannot be previewed directly inside the iframe. Please click the button below to download the resource file.
                    </p>
                    <button
                      onClick={(e) => handleDownloadNote(e, selectedNote)}
                      className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow transition-colors"
                    >
                      Download {selectedNote.fileType.toUpperCase()} File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
