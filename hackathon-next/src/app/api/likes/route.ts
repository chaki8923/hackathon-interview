import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// セッションIDを取得または生成
function getOrCreateSessionId(request: NextRequest) {
  // クライアントから送られたセッションIDを確認
  const clientSessionId = request.headers.get('x-session-id');
  if (clientSessionId) {
    return clientSessionId;
  }
  
  // CookieからセッションIDを取得
  const cookieHeader = request.headers.get('cookie');
  const cookieObj: Record<string, string> = {};
  
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        cookieObj[key] = value;
      }
    });
  }
  
  let sessionId = cookieObj['session_id'];
  
  if (!sessionId) {
    sessionId = uuidv4();
  }
  
  return sessionId;
}

// いいね状態を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const interviewId = searchParams.get('interviewId');
    
    if (!interviewId) {
      return NextResponse.json({ error: 'interviewIdが必要です' }, { status: 400 });
    }
    
    const sessionId = getOrCreateSessionId(request);
    
    // インタビューを取得
    const interview = await prisma.interview.findUnique({
      where: { interviewId },
      select: { id: true, likeCount: true }
    });
    
    if (!interview) {
      return NextResponse.json({ error: 'インタビューが見つかりません' }, { status: 404 });
    }
    
    // このセッションからのいいねを確認
    const like = await prisma.like.findUnique({
      where: {
        interviewId_sessionId: {
          interviewId: interview.id,
          sessionId
        }
      }
    });
    
    return NextResponse.json({
      likeCount: interview.likeCount,
      isLiked: !!like
    });
    
  } catch (error) {
    console.error('いいね状態の取得に失敗しました:', error);
    return NextResponse.json({ error: 'いいね状態の取得に失敗しました' }, { status: 500 });
  }
}

// いいねを追加/削除
export async function POST(request: NextRequest) {
  try {
    const { interviewId, action } = await request.json();
    
    if (!interviewId || !action || (action !== 'like' && action !== 'unlike')) {
      return NextResponse.json({ error: 'interviewIdとaction (like/unlike)が必要です' }, { status: 400 });
    }
    
    const sessionId = getOrCreateSessionId(request);
    
    // インタビューを取得
    const interview = await prisma.interview.findUnique({
      where: { interviewId },
      select: { id: true, likeCount: true }
    });
    
    if (!interview) {
      return NextResponse.json({ error: 'インタビューが見つかりません' }, { status: 404 });
    }
    
    // 現在のいいね状態を確認
    const existingLike = await prisma.like.findUnique({
      where: {
        interviewId_sessionId: {
          interviewId: interview.id,
          sessionId
        }
      }
    });
    
    // すでにいいね済みなのにいいねしようとした場合
    if (action === 'like' && existingLike) {
      return NextResponse.json({
        likeCount: interview.likeCount,
        isLiked: true,
        message: '既にいいね済みです'
      });
    }
    
    // いいねしていないのに解除しようとした場合
    if (action === 'unlike' && !existingLike) {
      return NextResponse.json({
        likeCount: interview.likeCount,
        isLiked: false,
        message: 'いいねされていません'
      });
    }
    
    // いいね/いいね解除処理
    let updatedLikeCount = interview.likeCount;
    
    if (action === 'like') {
      // いいねを追加
      await prisma.$transaction(async (tx) => {
        // いいねを作成
        await tx.like.create({
          data: {
            interviewId: interview.id,
            sessionId
          }
        });
        
        // いいねカウントを増やす
        const updated = await tx.interview.update({
          where: { id: interview.id },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true }
        });
        
        updatedLikeCount = updated.likeCount;
      });
    } else {
      // いいねを削除
      await prisma.$transaction(async (tx) => {
        // いいねを削除
        await tx.like.delete({
          where: {
            interviewId_sessionId: {
              interviewId: interview.id,
              sessionId
            }
          }
        });
        
        // いいねカウントを減らす
        const updated = await tx.interview.update({
          where: { id: interview.id },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true }
        });
        
        updatedLikeCount = updated.likeCount;
      });
    }
    
    return NextResponse.json({
      likeCount: updatedLikeCount,
      isLiked: action === 'like'
    });
    
  } catch (error) {
    console.error('いいね操作に失敗しました:', error);
    return NextResponse.json({ error: 'いいね操作に失敗しました' }, { status: 500 });
  }
} 