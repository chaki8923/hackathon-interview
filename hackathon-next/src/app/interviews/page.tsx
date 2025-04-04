import { prisma } from '@/lib/prisma';
import InterviewCard from '@/app/components/InterviewCard';
import Link from 'next/link';

export default async function InterviewsPage() {
  // データベースからインタビュー一覧を取得
  const interviews = await prisma.interview.findMany({
    orderBy: {
      id: 'asc'
    }
  });


  console.log(interviews);
  

  return (
    <main className="min-h-screen bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">ハッカソン参加者インタビュー</h1>
          <p className="text-xl text-gray-400">過去の参加者の体験談をご覧ください</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-900/50 hover:bg-blue-800/50 transition-colors rounded-lg border border-blue-800/50"
          >
            トップページに戻る
          </Link>
        </div>

        <div className="space-y-8">
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      </div>
    </main>
  );
} 