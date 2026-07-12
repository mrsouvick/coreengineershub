import { BookOpen, Award, CheckCircle, Heart, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const coreValues = [
    {
      title: 'Free Engineering Education',
      desc: 'We believe that quality academic guidance should be free and accessible to every student, regardless of their financial background.',
      icon: Heart,
    },
    {
      title: 'MAKAUT Syllabus Focused',
      desc: 'No generic course outlines. All our resources are strictly structured to match MAKAUT course codes and semester guidelines.',
      icon: Shield,
    },
    {
      title: 'Alumni & Senior Guidance',
      desc: 'Our exam preparation advice, notes, and plannings are reviewed by university seniors and alumni who have achieved 9+ DGPA.',
      icon: Award,
    },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story Section */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
              Empowering MAKAUT Engineers to Succeed
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              <strong>Core Engineers Hub</strong> started as a YouTube channel with a single mission: to make Maulana Abul Kalam Azad University of Technology (MAKAUT) engineering syllabus easy and structured for students. Over the years, we have helped thousands of students pass backlogs, master complex core concepts, and score high grades.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We realized that while video lectures are helpful, students frequently struggle to find organized, reliable, written study resources. Searching for scanners, previous year papers, and lecture notes across social media groups leads to clutter. This companion website was built to solve that exact problem.
            </p>
          </div>
          
          <div className="md:col-span-5 bg-gradient-to-br from-primary to-blue-600 p-8 rounded-2xl text-white space-y-6 shadow-inner relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
              <BookOpen className="h-40 w-40" />
            </div>
            <h3 className="font-heading font-bold text-xl">Our Vision</h3>
            <p className="text-primary-light text-xs sm:text-sm leading-relaxed">
              "To become the absolute study companion for every student under MAKAUT, bridging the gap between classroom theory and practical engineering excellence."
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs text-white/80">
              <span>Founded: 2023</span>
              <span>Subscribers: 22K+</span>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal">
              Our Core Principles
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              The values that drive us to build, curate, and support the engineering community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-charcoal mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Community focus section */}
        <section className="bg-gray-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold">
              Join Our Study Community
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We run dedicated discussion forums and announcement channels on WhatsApp and Telegram. Get immediate updates about MAKAUT notices, suggestion PDFs, video lectures, and job updates.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-center text-sm font-bold shadow-sm transition-colors"
            >
              Ask for Notes
            </Link>
            <a
              href="https://www.youtube.com/@CoreEngineersHub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-center text-sm font-bold shadow-sm transition-colors"
            >
              Subscribe on YouTube
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
