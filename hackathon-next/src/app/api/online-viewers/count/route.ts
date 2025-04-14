import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.onlineViewer.count();

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('オンライン視聴者数の取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'オンライン視聴者数の取得に失敗しました' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 