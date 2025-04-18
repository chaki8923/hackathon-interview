'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaCalendar } from 'react-icons/fa';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl: string;
  authorName: string;
}

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article 
          key={post.id}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-xl 
                    transition-all duration-300 hover:shadow-blue-900/20 hover:scale-[1.02] hover:border-blue-800/50"
        >
          <Link href={`/blog/${post.slug}`} className="block h-full">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
            </div>
            
            <div className="p-5">
              <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {post.title}
              </h2>
              
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <FaCalendar size={12} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock size={12} />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex justify-end">
                <span className="text-blue-400 text-sm font-medium flex items-center">
                  読む
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
} 