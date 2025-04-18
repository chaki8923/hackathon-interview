'use client';

import { FaClock, FaUser, FaCalendar } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// サンプルのブログ投稿データ
const blogPosts = {
  'hackathon-for-beginners': {
    title: 'ハッカソンに参加したいけれど…「忙しくて時間がない」「足を引っ張りそう」「自信がない」あなたへ',
    date: '2025年3月15日',
    author: 'ハッカソン運営チーム',
    readTime: '約5分',
    content: `
      <p class="text-lg leading-relaxed mb-6">
        ハッカソンってワクワクする反面、
      </p>
      
      <ul class="list-none space-y-2 mb-6">
        <li class="flex items-start gap-2">
          <span class="text-blue-400 font-bold">•</span>
          <span>本業や家事で忙しい</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-400 font-bold">•</span>
          <span>技術力に自信がなくてチームに迷惑をかけそう</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-400 font-bold">•</span>
          <span>そもそも自分なんかが参加していいのか…</span>
        </li>
      </ul>
      
      <p class="mb-8">
        と尻込みしてしまう方も多いはず。
        でも、大丈夫。ちょっとした工夫とマインドセットの切り替えで、あなたもハッカソンデビューできます！
      </p>

      <h2 class="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
        1. 忙しくて時間がない…を乗り越える３つのテクニック
      </h2>
      
      <h3 class="text-lg font-semibold text-purple-300 mb-2">「スモールタスク化」</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>コードを書く時間が取れなくても、アイデア出しや資料作りは10～15分でもOK。</li>
        <li>朝の通勤時間やランチ後の15分でToDoを整理しよう。</li>
      </ul>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「ペア・モブプログラミング」活用</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>一人で悶々とするより、ペアで短時間取り組むほうが進捗アップ。</li>
        <li>事前にペア相手と日時を決め、一緒に触るだけでも経験値になる。</li>
      </ul>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「外注・アウトソース感覚」</h3>
      <ul class="list-disc pl-5 space-y-2 mb-6">
        <li>デザインやドキュメント作成は、社内のデザイナーや他チームにお願いしてもOK。</li>
        <li>自分のコアスキルに集中でき、全体のクオリティが上がる。</li>
      </ul>

      <h2 class="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
        2. 「足を引っ張りそう…」という不安を和らげる方法
      </h2>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「役割分担＋ショートサイクル」</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>チーム立ち上げ時に「私は雑務担当」「私は調査担当」など役割を分ける。</li>
        <li>1～2時間ごとに成果を共有し、早めにフォローを受けられる体制を作る。</li>
      </ul>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「ドキュメント重視の開発」</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>コードをいきなり書かず、まずはREADMEや画面遷移図を作成。</li>
        <li>ドキュメントがあると誰が見てもわかりやすく、リファクタの手間も減る。</li>
      </ul>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「コードレビュー／ペアチェック」</h3>
      <ul class="list-disc pl-5 space-y-2 mb-6">
        <li>事前に「ここだけレビューしてほしい」と伝えることで、負担を小分けにできる。</li>
        <li>小さい変更を複数回に分けてPRすることで、チームがキャッチアップしやすくなる。</li>
      </ul>

      <h2 class="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
        3. 「自信がない…」をポジティブに変える思考法
      </h2>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「失敗＝学び」のマインドセット</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>正解を当てにいくより、挑戦中のエラーやトラブルこそ価値がある。</li>
        <li>「後で振り返って、こうすればよかった」を素直にメモしておこう。</li>
      </ul>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「小さな成功体験」を積む</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>簡単な機能（ボタン1つ動く、APIレスポンスが見える）でもOK。</li>
        <li>ステップごとに「動いた！」をチームに報告し、自信のビルドアップ。</li>
      </ul>

      <h3 class="text-lg font-semibold text-purple-300 mb-2">「強みを活かす」</h3>
      <ul class="list-disc pl-5 space-y-2 mb-6">
        <li>コーディング以外にも、企画、UI/UX、プレゼン資料作成、タイムキーパー…</li>
        <li>チームに必要な役割は多様。あなたの得意を前面に出そう。</li>
      </ul>

      <h2 class="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
        4. "参加ハードル"をグッと下げるコツ
      </h2>

      <ul class="list-disc pl-5 space-y-3 mb-6">
        <li><span class="text-purple-300 font-semibold">事前チュートリアル参加</span>：ハッカソン前に短時間で基本環境だけセットアップ</li>
        <li><span class="text-purple-300 font-semibold">Slack/Discordの質問チャンネル活用</span>：開催中常に聞ける場があると安心</li>
        <li><span class="text-purple-300 font-semibold">初心者向けテーマのチーム</span>：最初からハッカソン「初心者歓迎」チームに応募</li>
      </ul>

      <h2 class="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
        まとめ：まずは「やってみる」を選ぼう！
      </h2>

      <ul class="list-none space-y-2 mb-6">
        <li class="flex items-start gap-2">
          <span class="text-blue-400 font-bold">✓</span>
          <span>小さく分けて時間を捻出</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-400 font-bold">✓</span>
          <span>チームワークで「誰かがフォロー」</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-400 font-bold">✓</span>
          <span>小さな成功を自信に変える</span>
        </li>
      </ul>

      <p class="mb-4">
        迷っている間にも時間は過ぎていきます。
        「忙しい」「不安」「自信不足」は誰もが通る道。
        まずはエントリーしてみること、それが最大の一歩です。
      </p>

      <p class="text-lg font-semibold text-blue-300 mt-8 mb-4">
        あなたの挑戦をチーム一同、全力で応援します！
        ぜひぜひ、一緒に楽しみましょう😊
      </p>
    `,
    images: [
      {
        url: '/images/sugi.png',
        alt: 'カレンダーに小さなタスクをびっしり書き込む様子',
        position: 'after-section-1'
      },
      {
        url: '/images/wataru.jpeg',
        alt: 'ホワイトボードに役割を書き出すチーム',
        position: 'after-section-2'
      },
      {
        url: '/images/kusi.jpeg',
        alt: '小さな成果を喜ぶ人の表情',
        position: 'after-section-3'
      },
      {
        url: '/images/chaki.jpeg',
        alt: 'PCの前で笑顔でガッツポーズをする人',
        position: 'after-section-5'
      }
    ]
  }
};

// 投稿の型定義
interface BlogPost {
  title: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
  images?: {
    url: string;
    alt: string;
    position: string;
  }[];
}

export default function BlogPost() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 実際のアプリケーションでは、APIからデータを取得する
    // ここではモックデータを使用
    setIsLoading(true);
    
    setTimeout(() => {
      if (slug && blogPosts[slug as keyof typeof blogPosts]) {
        setPost(blogPosts[slug as keyof typeof blogPosts]);
      }
      setIsLoading(false);
    }, 500);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">投稿が見つかりません</h1>
        <p className="text-lg text-gray-400 mb-8">
          お探しの記事は存在しないか、移動された可能性があります。
        </p>
        <Link 
          href="/blog" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          ブログ一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header with back link */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>ブログ一覧に戻る</span>
          </Link>
          <div className="text-sm text-gray-400">ハッカソンブログ</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Blog post */}
        <article className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-xl mb-10">
          {/* Blog header */}
          <div className="p-6 md:p-8 border-b border-gray-800">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <FaCalendar size={14} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUser size={14} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock size={14} />
                <span>読了時間: {post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Blog content */}
          <div 
            className="prose prose-invert prose-blue max-w-none p-6 md:p-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          {/* Call to Action */}
          <div className="p-6 md:p-8 bg-blue-900/20 border-t border-blue-800/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">今すぐハッカソンに参加しませんか？</h3>
                <p className="text-gray-300">エントリー締め切りは2025年4月25日です。</p>
              </div>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <span>応募する</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <footer className="py-12 text-center border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p className="text-gray-400">&copy; 2025 社内ハッカソン運営チーム</p>
        </div>
      </footer>
    </div>
  );
} 