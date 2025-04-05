import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    // クッキーから支払い状態を確認（実際のアプリではちゃんとした認証を使うべき）
    const cookieStore = await cookies();
    const premiumCookie = cookieStore.get('premium_user');
    const isPremiumUser = premiumCookie?.value === 'true';
    
    // 選択するフィールドを動的に設定
    const selectFields = {
      id: true,
      interviewId: true,
      name: true,
      title: true,
      content: true,
      alt: true,
      subContent: true,
      fullContent: true,
      imageUrl: true,
      likeCount: true,
    } as const;
    
    // プレミアムユーザーの場合はフルコンテンツも取得
    const query: Prisma.InterviewFindManyArgs = {
      select: {
        ...selectFields,
        ...(isPremiumUser && { fullContent: true }),
      },
      orderBy: {
        id: 'asc'
      }
    };

    const interviews = await prisma.interview.findMany(query);
    console.log("interviews>>>>>>", interviews);
    

    // 各インタビューにプレミアムコンテンツの有無を示すフラグを追加
 

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('インタビュー一覧の取得に失敗しました:', error);
    return NextResponse.json({ error: 'インタビュー一覧の取得に失敗しました' }, { status: 500 });
  }
} 