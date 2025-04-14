import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// セッションIDを取得または生成する関数
function getOrCreateSessionId(request: NextRequest): string {
  // クライアントから送られたセッションIDを確認
  const clientSessionId = request.headers.get('x-session-id');
  if (clientSessionId) {
    return clientSessionId;
  }
  
  // ヘッダーにセッションIDがない場合は新規生成
  return uuidv4();
}

// GET: セッションIDに紐づくオンライン視聴者データを取得
export async function GET(request: NextRequest) {
  try {
    const sessionId = getOrCreateSessionId(request);
    
    // セッションIDに関連付けられたオンライン視聴者データを検索
    const viewer = await prisma.onlineViewer.findUnique({
      where: { sessionId }
    });
    
    if (!viewer) {
      return NextResponse.json({ exists: false });
    }
    
    return NextResponse.json({
      exists: true,
      data: viewer
    });
  } catch (error) {
    console.error('オンライン視聴者データの取得に失敗しました:', error);
    return NextResponse.json({ error: 'オンライン視聴者データの取得に失敗しました' }, { status: 500 });
  }
}

// POST: 新規オンライン視聴者データを登録
export async function POST(request: NextRequest) {
  try {
    const sessionId = getOrCreateSessionId(request);
    const { department, name, notes } = await request.json();
    
    // 必須項目のバリデーション
    if (!department || !name) {
      return NextResponse.json({ error: '所属部署と氏名は必須です' }, { status: 400 });
    }
    
    // 既存データの確認
    const existingViewer = await prisma.onlineViewer.findUnique({
      where: { sessionId }
    });
    
    if (existingViewer) {
      return NextResponse.json({ 
        error: '既に登録済みです。更新する場合はPUTメソッドを使用してください' 
      }, { status: 400 });
    }
    
    // 新規登録
    const newViewer = await prisma.onlineViewer.create({
      data: {
        sessionId,
        department,
        name,
        notes: notes || null
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newViewer
    }, { status: 201 });
  } catch (error) {
    console.error('オンライン視聴者データの登録に失敗しました:', error);
    return NextResponse.json({ error: 'オンライン視聴者データの登録に失敗しました' }, { status: 500 });
  }
}

// PUT: 既存のオンライン視聴者データを更新
export async function PUT(request: NextRequest) {
  try {
    const sessionId = getOrCreateSessionId(request);
    const { department, name, notes } = await request.json();
    
    // 必須項目のバリデーション
    if (!department || !name) {
      return NextResponse.json({ error: '所属部署と氏名は必須です' }, { status: 400 });
    }
    
    // 既存データの確認
    const existingViewer = await prisma.onlineViewer.findUnique({
      where: { sessionId }
    });
    
    if (!existingViewer) {
      return NextResponse.json({ 
        error: '更新対象のオンライン視聴者データが見つかりません' 
      }, { status: 404 });
    }
    
    // データ更新
    const updatedViewer = await prisma.onlineViewer.update({
      where: { sessionId },
      data: {
        department,
        name,
        notes: notes || null
      }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedViewer
    });
  } catch (error) {
    console.error('オンライン視聴者データの更新に失敗しました:', error);
    return NextResponse.json({ error: 'オンライン視聴者データの更新に失敗しました' }, { status: 500 });
  }
} 