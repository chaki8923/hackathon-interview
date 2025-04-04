import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const interviews = await prisma.interview.findMany({
      select: {
        id: true,
        interviewId: true,
        name: true,
        title: true,
        content: true,
        imageUrl: true,
        likeCount: true,
      },
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('インタビュー一覧の取得に失敗しました:', error);
    return NextResponse.json({ error: 'インタビュー一覧の取得に失敗しました' }, { status: 500 });
  }
} 