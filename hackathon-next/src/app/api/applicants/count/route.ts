import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // notesカラムに'テスト'が含まれていないデータの数を取得
    const count = await prisma.applicant.count({
      where: {
        NOT: {
          notes: {
            contains: 'テスト',
          },
        },
      },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('参加者数の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '参加者数の取得に失敗しました' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 