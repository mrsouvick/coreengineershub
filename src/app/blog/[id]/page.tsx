import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;

  // Retrieve selected post from database
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const tagsList = post.tags ? post.tags.split(',').map((tag) => tag.trim()) : [];

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to Guidance Hub</span>
          </Link>
        </div>

        {/* Article Body */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {/* Header Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {/* Meta Headers */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-400 font-semibold uppercase tracking-wider pb-6 border-b border-gray-100">
              <span className="px-2.5 py-1 bg-primary-light text-primary rounded-lg text-[10px] font-bold">
                {post.category}
              </span>
              <span className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1" />
                <span>{post.author}</span>
              </span>
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal leading-tight">
              {post.title}
            </h1>

            {/* Content (HTML) */}
            <div
              className="prose max-w-none text-gray-600 leading-relaxed text-sm sm:text-base space-y-4
              [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-charcoal [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-4
              [&_strong]:font-bold [&_strong]:text-charcoal"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags footer */}
            {tagsList.length > 0 && (
              <div className="pt-8 border-t border-gray-100 flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 text-gray-400 mr-1" />
                {tagsList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
