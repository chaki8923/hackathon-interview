import Image from 'next/image';
import LikeButton from './LikeButton';

interface InterviewCardProps {
  interview: {
    id: number;
    interviewId: string;
    name: string;
    title: string;
    content: string;
    imageUrl: string | null;
  };
}

export default function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:border-blue-800/50">
      <div className="flex flex-col md:flex-row">
        {interview.imageUrl && (
          <div className="md:w-1/3 relative h-64 md:h-auto">
            <Image
              src={interview.imageUrl}
              alt={interview.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 md:w-2/3 flex flex-col">
          <div>
            <h3 className="text-xl font-bold mb-2">{interview.name}</h3>
            <p className="text-blue-400 mb-4">{interview.title}</p>
            <p className="text-gray-300 italic mb-4">&ldquo;{interview.content}&rdquo;</p>
          </div>
          <div className="mt-auto flex justify-end">
            <LikeButton interviewId={interview.interviewId} />
          </div>
        </div>
      </div>
    </div>
  );
} 