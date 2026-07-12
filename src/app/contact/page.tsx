'use client';

import { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Youtube, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function ContactPage() {
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Submission flags
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    if (!name || !email || !message) {
      setError('Please fill in all the required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(data.error || 'Failed to submit the message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('An unexpected error occurred. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-12" id="contact-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal">
            Get in Touch
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base max-w-xl mx-auto">
            Need notes for a missing subject? Have suggestions for the channel? Drop us a message, and our curators will get back to you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details: Left (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* YouTube link promotion */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center">
                <Youtube className="h-5 w-5 fill-current" />
              </div>
              <h3 className="font-heading font-bold text-base text-charcoal">Request a Video Guide</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                If you are struggling with a specific syllabus topic and want us to create a step-by-step video lecture playlist on YouTube, mention it in your message details!
              </p>
            </div>

            {/* Social linkages */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="bg-primary-light text-primary p-2.5 rounded-xl w-11 h-11 flex items-center justify-center">
                <Send className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-charcoal">Join Channel Group</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Want immediate notifications on new suggestion drops, placement preparations, and exam details? Make sure to subscribe to our channels!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://www.youtube.com/@CoreEngineersHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-xs font-bold text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-colors space-x-1.5"
                >
                  <Youtube className="h-3.5 w-3.5 fill-current text-red-600" />
                  <span>YouTube Channel</span>
                </a>
                <a
                  href="https://t.me/CoreEngineersHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-xs font-bold text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-colors space-x-1.5"
                >
                  <Send className="h-3.5 w-3.5 text-blue-500" />
                  <span>Telegram Group</span>
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form: Right (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-charcoal mb-6">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                {/* Error Box */}
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-start space-x-2.5 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Box */}
                {success && (
                  <div className="p-4 bg-green-50 text-green-700 border border-green-100 rounded-xl flex items-start space-x-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">Message sent successfully!</h4>
                      <p className="text-xs text-green-600/90 mt-1">Our academic team will compile relevant notes and update you via email.</p>
                    </div>
                  </div>
                )}

                {/* Name field */}
                <div className="space-y-1.5">
                  <label htmlFor="form-name" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="form-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/30"
                    required
                  />
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="form-email" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="form-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/30"
                    required
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label htmlFor="form-message" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Message / Notes Request <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify subject name, department, semester code, and detail your request..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/30"
                    required
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold text-sm shadow-sm transition-colors space-x-2 cursor-pointer"
                    id="contact-submit-btn"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
