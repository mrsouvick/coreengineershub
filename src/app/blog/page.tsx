import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';

  const where: any = {};
  if (activeCategory && activeCategory !== 'all') {
    where.category = activeCategory;
  }

  // Fetch blogs matching the filters from the database
  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const categories = [
    { name: 'All Topics', slug: 'all' },
    { name: 'Exam Preparation', slug: 'Exam Prep' },
    { name: 'Career & Placements', slug: 'Career' },
    { name: 'Roadmaps & Guidance', slug: 'Roadmap' },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal">
            Guidance & Placements Hub
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Insider preparation blueprints, academic roadmaps, and career placement resources from seniors.
          </p>
        </div>

        {/* Category filters bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-gray-150 pb-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === 'all' ? '/blog' : `/blog?category=${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.slug || (cat.slug === 'all' && activeCategory === '')
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col group"
              >
                {/* Header Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 border-b border-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-white text-primary text-[10px] font-extrabold rounded-lg shadow uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase space-x-2">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{post.author}</span>
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-base text-charcoal group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Strip html tags to generate text snippet */}
                    <div 
                      className="text-gray-500 text-sm line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '') }}
                    />
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50">
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl max-w-xl mx-auto">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-gray-700 mb-1">No articles found</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              We haven't posted guidance articles for this category yet. Check back soon for new guides!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
