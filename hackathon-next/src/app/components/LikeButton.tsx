'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaHeart } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

interface LikeButtonProps {
  interviewId: string;
}

export default function LikeButton({ interviewId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [heartbeat, setHeartbeat] = useState(false);
  const hasInitialized = useRef(false);
  const isProcessing = useRef(false);

  // LocalStorageのいいね状態を更新
  const updateLocalStorage = useCallback((liked: boolean) => {
    try {
      const likedInterviews = JSON.parse(localStorage.getItem('liked_interviews') || '[]');
      
      if (liked && !likedInterviews.includes(interviewId)) {
        // いいねを追加
        likedInterviews.push(interviewId);
      } else if (!liked && likedInterviews.includes(interviewId)) {
        // いいねを削除
        const index = likedInterviews.indexOf(interviewId);
        if (index > -1) {
          likedInterviews.splice(index, 1);
        }
      }
      
      localStorage.setItem('liked_interviews', JSON.stringify(likedInterviews));
    } catch (error) {
      console.error('LocalStorageの更新に失敗しました:', error);
    }
  }, [interviewId]);

  // いいねエフェクト
  const createLikeEffect = useCallback(() => {
    // クライアントサイドでのいいねエフェクト実装
    const button = document.querySelector(`[data-interview-id="${interviewId}"]`);
    if (button) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '❤️';
      
      // ボタンの相対位置を取得
      const buttonRect = button.getBoundingClientRect();
      const centerX = buttonRect.width / 2;
      const centerY = buttonRect.height / 2;
      
      heart.style.left = `${centerX}px`;
      heart.style.top = `${centerY}px`;
      
      button.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 1000);
    }
  }, [interviewId]);

  // いいね解除エフェクト
  const createUnlikeEffect = useCallback(() => {
    // いいね解除時のビジュアルフィードバック
    const button = document.querySelector(`[data-interview-id="${interviewId}"]`);
    if (button) {
      const heartIcon = button.querySelector('svg');
      if (heartIcon) {
        heartIcon.classList.add('shake');
        setTimeout(() => {
          heartIcon.classList.remove('shake');
        }, 500);
      }
    }
  }, [interviewId]);

  // いいね状態の切り替え
  const handleLikeToggle = useCallback(async (forceLike: boolean = false, forceUnlike: boolean = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const action = forceLike ? 'like' : (forceUnlike ? 'unlike' : (isLiked ? 'unlike' : 'like'));
      
      // 現在のいいね状態を保存
      const prevLikedState = isLiked;
      
      // UI状態を先に更新（楽観的UI更新）
      if (action === 'like') {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        // いいねエフェクト
        createLikeEffect();
        // いいねハートビートアニメーション
        setHeartbeat(true);
        setTimeout(() => setHeartbeat(false), 500);
      } else if (action === 'unlike') {
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1)); // マイナスにならないように
        // いいね解除エフェクト
        createUnlikeEffect();
      }
      
      // LocalStorage更新
      updateLocalStorage(action === 'like');
      
      // APIリクエスト
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': localStorage.getItem('session_id') || '',
        },
        body: JSON.stringify({
          interviewId,
          action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // サーバーから返った状態で更新
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
        
        // LocalStorageを更新
        updateLocalStorage(data.isLiked);
      } else {
        // エラー時は元の状態に戻す
        setIsLiked(prevLikedState);
        setLikeCount(prev => prevLikedState ? prev + 1 : prev - 1);
        updateLocalStorage(prevLikedState);
        console.error('いいね操作に失敗しました:', await res.text());
      }
    } catch (error) {
      console.error('いいね操作に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLiked, isLoading, interviewId, updateLocalStorage, createLikeEffect, createUnlikeEffect]);

  // いいね状態を取得する関数
  const syncLikeStatus = useCallback(async (localLiked: boolean) => {
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch(`/api/likes?interviewId=${interviewId}`, {
        headers: {
          'x-session-id': sessionId || '',
        }
      });
      if (res.ok) {
        const data = await res.json();
        
        // サーバーとローカルの状態を確認して、どちらかがいいね済みならいいね状態にする
        const finalLikedState = data.isLiked || localLiked;
        setIsLiked(finalLikedState);
        setLikeCount(data.likeCount);
        
        // LocalStorageを更新
        updateLocalStorage(finalLikedState);
        
        // サーバーとローカルで状態が異なる場合は同期
        if (localLiked !== data.isLiked) {
          if (localLiked && !data.isLiked) {
            // ローカルでいいね済みだがサーバーでは未いいね
            await handleLikeToggle(true, false);
          }
        }
      }
    } catch (error) {
      console.error('いいね状態の取得に失敗しました:', error);
    }
  }, [interviewId, updateLocalStorage, handleLikeToggle]);

  // セッションIDとローカルいいね状態を確保
  useEffect(() => {
    // 初期化済みの場合は再実行しない
    if (hasInitialized.current) return;
    
    // セッションID取得
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('session_id', sessionId);
    }

    // ローカルのいいね状態を確認
    const likedInterviews = JSON.parse(localStorage.getItem('liked_interviews') || '[]');
    const isAlreadyLiked = likedInterviews.includes(interviewId);
    
    // ローカルのいいね状態とサーバーのいいね状態を同期
    syncLikeStatus(isAlreadyLiked);
    
    hasInitialized.current = true;
  }, [interviewId, syncLikeStatus]);

  // いいね/いいね解除の処理
  const handleLikeClick = async () => {
    // 処理中なら何もしない
    if (isProcessing.current) return;
    
    // 処理中フラグを立てる
    isProcessing.current = true;
    
    try {
      // 既にいいねしている場合はいいね解除、していない場合はいいね追加
      await handleLikeToggle(false, isLiked);
    } finally {
      // 完了したら処理中フラグを下ろす
      setTimeout(() => {
        isProcessing.current = false;
      }, 500); // 連打防止のために少し待機
    }
  };

  return (
    <button
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 overflow-hidden group ${
        isLiked 
          ? 'bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-300 border border-pink-500/50 shadow-lg shadow-pink-900/20' 
          : 'bg-gray-800/40 text-gray-300 border border-gray-700/60 hover:bg-gray-700/40 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20'
      }`}
      onClick={handleLikeClick}
      disabled={isLoading}
      data-interview-id={interviewId}
    >
      {/* 背景エフェクト */}
      <div className={`absolute inset-0 blur-md bg-gradient-to-r ${
        isLiked 
          ? 'from-pink-600/10 to-purple-600/10' 
          : 'from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10'
      } transition-opacity duration-500 opacity-70`}></div>
      
      {/* ホバーエフェクト */}
      <div className="absolute inset-0 w-full h-full">
        <div className={`absolute inset-0 translate-y-full bg-gradient-to-r ${
          isLiked 
            ? 'from-pink-500/10 to-purple-500/10' 
            : 'from-blue-500/10 to-purple-500/10'
        } group-hover:translate-y-0 transition-transform duration-300 opacity-50`}></div>
      </div>
      
      {/* アイコンと数字 */}
      <div className="relative z-10 flex items-center gap-2">
        <FaHeart 
          className={`${
            isLiked 
              ? 'text-pink-400 drop-shadow-[0_0_3px_rgba(236,72,153,0.7)]' 
              : 'text-gray-400 group-hover:text-gray-300'
          } transition-all duration-300 ${heartbeat ? 'heartbeat scale-125' : ''}`} 
        />
        <span className={`font-medium ${isLiked ? 'text-pink-300' : 'text-gray-300'} transition-colors duration-300`}>
          {likeCount}
        </span>
      </div>
      
      {/* クリック時の波紋エフェクト */}
      <span className={`absolute inset-0 pointer-events-none ${heartbeat ? 'animate-ripple' : 'opacity-0'}`}></span>
    </button>
  );
} 