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

// GET: セッションIDに紐づく応募データを取得
export async function GET(request: NextRequest) {
  try {
    const sessionId = getOrCreateSessionId(request);
    
    // セッションIDに関連付けられた応募データを検索
    const applicant = await prisma.applicant.findUnique({
      where: { sessionId }
    });
    
    if (!applicant) {
      return NextResponse.json({ exists: false });
    }
    
    return NextResponse.json({
      exists: true,
      data: applicant
    });
  } catch (error) {
    console.error('応募データの取得に失敗しました:', error);
    return NextResponse.json({ error: '応募データの取得に失敗しました' }, { status: 500 });
  }
}

// POST: 新規応募データを登録
export async function POST(request: NextRequest) {
  try {
    const sessionId = getOrCreateSessionId(request);
    const { department, name, languages, tools, notes } = await request.json();
    
    // 必須項目のバリデーション
    if (!department || !name) {
      return NextResponse.json({ error: '所属部署と氏名は必須です' }, { status: 400 });
    }
    
    // 既存データの確認
    const existingApplicant = await prisma.applicant.findUnique({
      where: { sessionId }
    });
    
    if (existingApplicant) {
      return NextResponse.json({ 
        error: '既に応募済みです。更新する場合はPUTメソッドを使用してください' 
      }, { status: 400 });
    }
    
    // 新規登録
    const newApplicant = await prisma.applicant.create({
      data: {
        sessionId,
        department,
        name,
        languages: languages || null,
        tools: tools || null,
        notes: notes || null
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newApplicant
    }, { status: 201 });
  } catch (error) {
    console.error('応募データの登録に失敗しました:', error);
    return NextResponse.json({ error: '応募データの登録に失敗しました' }, { status: 500 });
  }
}

// PUT: 既存の応募データを更新
export async function PUT(request: NextRequest) {
  try {
    const sessionId = getOrCreateSessionId(request);
    const { department, name, languages, tools, notes } = await request.json();
    
    // 必須項目のバリデーション
    if (!department || !name) {
      return NextResponse.json({ error: '所属部署と氏名は必須です' }, { status: 400 });
    }
    
    // 既存データの確認
    const existingApplicant = await prisma.applicant.findUnique({
      where: { sessionId }
    });
    
    if (!existingApplicant) {
      return NextResponse.json({ 
        error: '更新対象の応募データが見つかりません' 
      }, { status: 404 });
    }
    
    // データ更新
    const updatedApplicant = await prisma.applicant.update({
      where: { sessionId },
      data: {
        department,
        name,
        languages: languages || null,
        tools: tools || null,
        notes: notes || null
      }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedApplicant
    });
  } catch (error) {
    console.error('応募データの更新に失敗しました:', error);
    return NextResponse.json({ error: '応募データの更新に失敗しました' }, { status: 500 });
  }
} 