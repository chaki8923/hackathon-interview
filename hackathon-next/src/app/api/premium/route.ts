import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // 支払いが成功したと仮定してプレミアムユーザーフラグをセットする
    // 実際のアプリでは決済の確認をした後にユーザー情報を更新する
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 30, // 30日間有効
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    };
    
    cookieStore.set('premium_user', 'true', cookieOptions);
    
    // 明示的なレスポンスヘッダーを設定
    const response = NextResponse.json({ 
      success: true, 
      message: 'プレミアム機能が有効になりました',
      isPremium: true
    });
    
    // フロントエンドでも利用できるよう非HTTPOnlyのCookieも設定
    response.cookies.set('premium_user_status', 'true', {
      ...cookieOptions,
      httpOnly: false
    });
    
    return response;
  } catch (error) {
    console.error('プレミアム設定に失敗しました:', error);
    return NextResponse.json({ error: '設定に失敗しました' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    
    // プレミアムユーザーフラグを削除
    cookieStore.delete('premium_user');
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'プレミアム機能が無効になりました',
      isPremium: false
    });
    
    // フロントエンド用のCookieも削除
    response.cookies.delete('premium_user_status');
    
    return response;
  } catch (error) {
    console.error('プレミアム設定解除に失敗しました:', error);
    return NextResponse.json({ error: '設定解除に失敗しました' }, { status: 500 });
  }
} 