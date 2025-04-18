'use client';

import Link from 'next/link';
import Image from 'next/image';
import BlogList, { BlogPost } from '../components/BlogList';

// サンプルのブログ投稿データ
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'ハッカソンに参加したいけれど…「忙しくて時間がない」「足を引っ張りそう」「自信がない」あなたへ',
    slug: 'hackathon-for-beginners',
    excerpt: 'ハッカソンってワクワクする反面、「本業や家事で忙しい」「技術力に自信がなくてチームに迷惑をかけそう」「そもそも自分なんかが参加していいのか…」と尻込みしてしまう方も多いはず。でも、大丈夫。ちょっとした工夫とマインドセットの切り替えで、あなたもハッカソンデビューできます！',
    date: '2025年3月15日',
    readTime: '約5分',
    imageUrl: '/images/chaki.jpeg',
    authorName: 'ハッカソン運営チーム'
  },
  {
    id: '2',
    title: 'ハッカソンでチームリーダーを務める際のポイント5選',
    slug: 'hackathon-team-leader-tips',
    excerpt: 'ハッカソンのチームリーダーは、技術力だけでなくコミュニケーション能力やタイムマネジメントも重要です。今回は、実際のハッカソンで優勝経験のあるリーダーたちから学んだ、成功へと導くための5つのポイントをご紹介します。',
    date: '2025年3月10日',
    readTime: '約4分',
    imageUrl: '/images/wataru.jpeg',
    authorName: 'ハッカソン運営チーム'
  },
  {
    id: '3',
    title: '優勝チームに共通する3つの特徴とアイデアの発想法',
    slug: 'winning-hackathon-teams',
    excerpt: '過去のハッカソンで優勝したチームには、いくつかの共通点があります。技術的な側面だけでなく、アイデアの出し方やチーム内のコミュニケーションにも特徴があるのです。今回は、そんな優勝チームに共通する3つの特徴と、アイデアを生み出すための方法をご紹介します。',
    date: '2025年3月5日',
    readTime: '約6分',
    imageUrl: '/images/kusi.jpeg',
    authorName: 'ハッカソン運営チーム'
  }
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header with back link */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>トップページに戻る</span>
          </Link>
          <div className="text-sm text-gray-400">ハッカソンブログ</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Blog Hero Section */}
        <section className="mb-16">
          <div className="relative rounded-2xl overflow-hidden mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
            <div className="relative py-16 px-6 md:px-12 text-center z-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                ハッカソンブログ
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                未来を創る開発者たちへ、挑戦の後押しとなる情報を発信しています
              </p>
              
              <div className="absolute top-0 right-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900"></div>
                <Image
                  src="/images/engi2.jpg"
                  alt="Programming"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
            注目の記事
          </h2>
          
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <Image
                  src="/images/chaki.jpeg"
                  alt="ハッカソンに参加したいけれど…"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    ハッカソンに参加したいけれど…「忙しくて時間がない」「足を引っ張りそう」「自信がない」あなたへ
                  </h3>
                  
                  <div className="flex gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <span>2025年3月15日</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>読了時間: 約5分</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    ハッカソンってワクワクする反面、「本業や家事で忙しい」「技術力に自信がなくてチームに迷惑をかけそう」「そもそも自分なんかが参加していいのか…」と尻込みしてしまう方も多いはず。でも、大丈夫。ちょっとした工夫とマインドセットの切り替えで、あなたもハッカソンデビューできます！
                  </p>
                </div>
                
                <div>
                  <Link 
                    href="/blog/hackathon-for-beginners" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    <span>記事を読む</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
            最新の記事
          </h2>
          
          <BlogList posts={samplePosts} />
        </section>
      </main>

      <footer className="py-12 text-center border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p className="text-gray-400">&copy; 2025 社内ハッカソン運営チーム</p>
        </div>
      </footer>
    </div>
  );
} 