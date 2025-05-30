'use client';

import { useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaChevronDown, FaTimes, FaBuilding, FaTools, FaGlobe, FaRocket, FaGrinStars, FaStar, FaLock, FaCheck } from 'react-icons/fa';
import styles from './index.module.scss';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, EffectCreative, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import LikeButton from './components/LikeButton';
import ApplicationModal from './components/ApplicationModal';
import IntroAnimation from './components/IntroAnimation';
import OnlineViewerModal from './components/OnlineViewerModal';
import Link from 'next/link';

// インタビューデータの型定義
interface Interview {
  id: number;
  interviewId: string;
  name: string;
  title: string;
  content: string;
  alt: string;
  fullContent: string; // プレミアムユーザー向けのフルコンテンツ（オプショナル）
  subContent: string;
  imageUrl: string | null;
  likeCount: number;
  hasPremiumContent: boolean; // プレミアムコンテンツがあるかのフラグ
  isPremiumUser: boolean; // ユーザーがプレミアムかどうか
}

// 課金モーダルのコンポーネント
const PaymentModal = ({ isOpen, onClose, onPaymentComplete }: { 
  isOpen: boolean; 
  onClose: () => void;
  onPaymentComplete: () => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 処理ステップのテキスト配列
  const processingSteps = [
    "UserAgentを解析中...",
    "発信元IPを特定しています...",
    "幾何学データ解析中...",
    "接続ポイントを検出中...",
    "生体情報をスキャン中...",
    "量子暗号鍵を生成中...",
    "位置情報を特定中...",
    "DNS解決を最適化中...",
    "セキュリティプロトコルを確立中...",
    "支払い処理を実行中..."
  ];
  
  // 処理ステップの進行を制御する関数
  const simulateProcessing = () => {
    let currentStep = 0;
    setIsProcessing(true);
    setProcessingStep(currentStep);
    
    // ステップごとにインターバルをずらして表示
    const interval = setInterval(() => {
      currentStep++;
      setProcessingStep(currentStep);
      
      // すべてのステップが完了したら
      if (currentStep >= processingSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowSuccess(true);
          // LocalStorageに課金ユーザー情報を保存
          localStorage.setItem('premium_user', 'true');
        }, 800);
        
        // 成功表示後、完了処理を実行
        setTimeout(() => {
          setIsProcessing(false);
          setProcessingStep(0);
          setShowSuccess(false);
          onPaymentComplete();
          onClose();
        }, 3500);
      }
    }, 300); // 各ステップの表示間隔
  };
  
  const handlePayment = async () => {
    // 演出処理を実行
    simulateProcessing();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={isProcessing ? undefined : onClose}></div>
      
      <div className="relative z-10 w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 mx-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        
        {!isProcessing && !showSuccess && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        )}
        
        {!isProcessing && !showSuccess ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">プレミアム機能にアクセス</h2>
              <p className="text-gray-300">月額¥98,000でインタビューのフルコンテンツとその他特典が利用可能になります</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-blue-400 mb-2">プレミアム特典</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center"><FaCheck className="text-green-500 mr-2" size={14} />ハッカソン優先参加権</li>
                <li className="flex items-center"><FaCheck className="text-green-500 mr-2" size={14} />当日の発表5分延長権</li>
                <li className="flex items-center"><FaCheck className="text-green-500 mr-2" size={14} />当日はVIPテーブルで閲覧可能</li>
                <li className="flex items-center"><FaCheck className="text-green-500 mr-2" size={14} />茶木の収益の出る個人開発メソッド200分超えの動画プレゼント</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <button 
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
                onClick={handlePayment}
              >
                月額プランに登録する
              </button>
              <button 
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                onClick={onClose}
              >
                キャンセル
              </button>
            </div>
          </>
        ) : showSuccess ? (
          <div className="py-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <FaCheck size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">プレミアム登録完了</h3>
            <p className="text-gray-300 mb-6">すべてのインタビューコンテンツへのアクセスが許可されました</p>
            <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-800/30 text-sm text-blue-300 mb-5">
              <p className="flex items-center gap-2">
                <FaStar className="text-yellow-500" size={16} />
                <span>今月より料金が発生します</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">支払い処理中</h2>
              <p className="text-blue-400">お待ちください...</p>
            </div>
            
            <div className={`bg-black/50 border border-gray-800 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto ${styles.customScrollbar}`}>
              <div className="flex flex-col gap-2 flex-grow">
                {processingSteps.slice(0, processingStep + 1).map((step, index) => (
                  <div key={index} className={`${styles.terminalLine} ${index === processingStep ? styles.terminalLineCurrent : styles.terminalLineCompleted}`}>
                    <span className="text-green-500 mr-2">&gt;</span>
                    <span className={index === processingStep ? 'text-blue-400' : 'text-gray-400'}>
                      {step}
                      {index === processingStep && (
                        <span className={styles.blinkCursor}></span>
                      )}
                      {index < processingStep && (
                        <span className="text-green-500 ml-2">[完了]</span>
                      )}
                    </span>
                  </div>
                ))}
                
                <div 
                  className={styles.progressBar}
                  style={{ opacity: processingStep < processingSteps.length ? 1 : 0 }}
                >
                  <div 
                    className={styles.progressBarInner}
                    style={{ width: `${(processingStep / processingSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 参加者数の型定義
interface ApplicantCount {
  count: number;
}

export default function Home() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const polygonsRef = useRef<Array<{x: number, y: number, size: number, angle: number, speed: number}>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnlineViewerModalOpen, setIsOnlineViewerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showIntroAnimation, setShowIntroAnimation] = useState(false);
  
  // 参加者数のstate追加
  const [applicantCount, setApplicantCount] = useState<number>(0);
  const [onlineViewerCount, setOnlineViewerCount] = useState<number>(0);
  const [countLoaded, setCountLoaded] = useState<boolean>(false);
  
  // 画像ビューワー用の状態
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // 画像プリロード用の状態
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const galleryImageUrls = [
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8798.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8803.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8819.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8826.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8836.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8822.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8839.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8849.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8850.jpg",
    "https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8873.jpg"
  ];

  // LocalStorageから課金状態とアニメーション表示状態を取得
  useEffect(() => {
    console.log("useEffect");
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      const isPremium = localStorage.getItem('premium_user') === 'true';
      console.log("isPremium", isPremium);
      
      setIsPremiumUser(isPremium);
      
      // アニメーションの表示状態を確認
      const hasSeenIntro = localStorage.getItem('has_seen_intro') === 'true';
      
      // 初回訪問時のみアニメーションを表示
      if (!hasSeenIntro) {
        setShowIntroAnimation(true);
      }
    }
    
    // 初期データ取得
    fetchInterviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // インタビューデータを取得
  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/interviews');
      if (response.ok) {
        const data = await response.json();
        console.log("data>>>>>>", data);
        
        setInterviews(data);
       
      }
    } catch (error) {
      console.error('インタビューデータの取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInterviews();
  }, []);

  // スクロール処理
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ポリゴン背景
  useEffect(() => {
    const canvas = document.getElementById('polygonBackground') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ポリゴン初期化（初回のみ）
    if (polygonsRef.current.length === 0) {
      const polygonCount = 20;
      for (let i = 0; i < polygonCount; i++) {
        polygonsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 150 + 50,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() - 0.5) * 0.2
        });
      }
    }

    // ポリゴン描画
    const drawPolygons = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(15, 23, 42, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // スクロール位置に応じた影響を計算
      const scrollFactor = scrollY * 0.0005;
      
      polygonsRef.current.forEach((polygon, i) => {
        ctx.beginPath();
        const sides = Math.floor(i % 3) + 3; // 3, 4, 5辺のポリゴン
        
        // スクロールに応じてポリゴンを回転させる
        polygon.angle += polygon.speed + scrollFactor * 0.01;
        
        // スクロールに応じてポリゴンを上下に動かす
        const yOffset = Math.sin(scrollFactor + i) * 20;
        
        for (let j = 0; j < sides; j++) {
          const pointX = polygon.x + polygon.size * Math.cos(polygon.angle + Math.PI * 2 * j / sides);
          const pointY = polygon.y + yOffset + polygon.size * Math.sin(polygon.angle + Math.PI * 2 * j / sides);
          
          if (j === 0) {
            ctx.moveTo(pointX, pointY);
          } else {
            ctx.lineTo(pointX, pointY);
          }
        }

        ctx.closePath();
        
        // グラデーションをスクロールに応じて変化させる
        const gradient = ctx.createLinearGradient(
          polygon.x, 
          polygon.y, 
          polygon.x + polygon.size, 
          polygon.y + polygon.size
        );
        
        const intensity = Math.abs(Math.sin(scrollFactor + i * 0.2)) * 0.15;
        gradient.addColorStop(0, `rgba(59, 130, 246, ${intensity})`); // 青
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${intensity * 0.8})`); // 紫
        gradient.addColorStop(1, `rgba(236, 72, 153, ${intensity * 0.6})`); // ピンク
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        const strokeOpacity = Math.min(0.2, intensity * 1.5);
        ctx.strokeStyle = `rgba(100, 150, 250, ${strokeOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    // アニメーションフレーム
    let animationFrame: number;
    
    const animate = () => {
      drawPolygons();
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [scrollY]);

  // スクロールインジケーターのクリック
  const scrollToInterviews = () => {
    const interviewsSection = document.querySelector('.interviews');
    if (interviewsSection) {
      interviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // モーダルを開く処理
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // 課金モーダルを開く処理
  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  // 課金モーダルを閉じる処理
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
  
  // オンライン視聴モーダルを開く処理
  const handleOpenOnlineViewerModal = () => {
    setIsOnlineViewerModalOpen(true);
  };

  // オンライン視聴モーダルを閉じる処理
  const handleCloseOnlineViewerModal = () => {
    setIsOnlineViewerModalOpen(false);
  };
  
  // 支払い完了後の処理
  const handlePaymentComplete = async () => {
    // LocalStorageに情報を保存済みなので、ステートだけ更新
    setIsPremiumUser(true);
    // インタビューデータを再取得
    await fetchInterviews();
  };

  // Handle animation completion
  const handleIntroComplete = () => {
    setShowIntroAnimation(false);
    
    // localStorage にアニメーション表示済みのフラグを設定
    if (typeof window !== 'undefined') {
      localStorage.setItem('has_seen_intro', 'true');
    }
  };

  // 特定の画像をプリロードする関数
  const preloadImage = (src: string) => {
    if (preloadedImages.has(src)) return; // 既にプリロード済みならスキップ
    
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setPreloadedImages(prev => new Set([...prev, src]));
    };
  };
  
  // ビューに表示されているサムネイル画像の読み込みを監視
  useEffect(() => {
    // ページがブラウザで実行されていることを確認
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // data-full-src属性から元画像のURLを取得
            const element = entry.target as HTMLElement;
            const fullSrc = element.getAttribute('data-full-src');
            if (fullSrc) {
              preloadImage(fullSrc);
            }
          }
        });
      },
      { rootMargin: '200px' } // ビューポートから200px手前で読み込み開始
    );
    
    // サムネイルの監視を開始
    const thumbnails = document.querySelectorAll('.gallery-image[data-full-src]');
    thumbnails.forEach(img => {
      observer.observe(img);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // 画像を拡大表示する際のハンドラ
  const openImageViewer = (imageUrl: string, alt: string) => {
    setSelectedImage(imageUrl);
    setSelectedImageAlt(alt);
    setIsImageViewerOpen(true);
    setIsImageLoading(true);
    
    // すでにプリロード済みの場合はローディング状態をすぐに解除
    if (preloadedImages.has(imageUrl)) {
      setIsImageLoading(false);
    } else {
      // プリロードされていない場合は読み込みを開始
      preloadImage(imageUrl);
      // 画像のロード完了を待つためのイベントハンドラを設定
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        setIsImageLoading(false);
      };
    }
  };

  // 画像ビューワーを閉じる
  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  // コンポーネントがマウントされたときに、表示される可能性の高い最初の数枚の画像をプリロード
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 最初の3枚のギャラリー画像をプリロード
    galleryImageUrls.slice(0, 3).forEach(url => {
      preloadImage(url);
    });
  }, []);
  
  // Swiperがスライド変更時に次の画像をプリロード
  const handleSlideChange = (swiper: SwiperType) => {
    // 現在のインデックスを更新
    setCurrentIndex(swiper.realIndex);
    
    // 次のスライドの画像をプリロード（次の2枚）
    const nextIndex1 = (swiper.realIndex + 1) % galleryImageUrls.length;
    const nextIndex2 = (swiper.realIndex + 2) % galleryImageUrls.length;
    
    preloadImage(galleryImageUrls[nextIndex1]);
    preloadImage(galleryImageUrls[nextIndex2]);
  };

  // 参加者数を取得
  const fetchApplicantCount = async () => {
    try {
      const response = await fetch('/api/applicants/count');
      if (response.ok) {
        const data: ApplicantCount = await response.json();
        setApplicantCount(data.count);
        setCountLoaded(true);
      }
    } catch (error) {
      console.error('参加者数の取得に失敗しました:', error);
    }
  };

  // オンライン視聴者数を取得
  const fetchOnlineViewerCount = async () => {
    try {
      const response = await fetch('/api/online-viewers/count');
      if (response.ok) {
        const data: ApplicantCount = await response.json();
        setOnlineViewerCount(data.count);
        setCountLoaded(true);
      }
    } catch (error) {
      console.error('オンライン視聴者数の取得に失敗しました:', error);
    }
  };
  
  useEffect(() => {
    fetchApplicantCount();
    fetchOnlineViewerCount();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-6">
            {/* Animated hexagon loader */}
            <div className="absolute top-0 left-0 w-full h-full animate-spin-slow">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon 
                  points="50 15, 85 36.5, 85 73.5, 50 95, 15 73.5, 15 36.5" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="3"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Inner pulsing circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full animate-pulse opacity-70 blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full animate-ping opacity-70"></div>
          </div>
          <div className="text-sm font-medium tracking-wider text-blue-400 uppercase animate-pulse">Loading</div>
          <div className="mt-2 relative h-1 w-40 bg-gray-800 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showIntroAnimation && <IntroAnimation onComplete={handleIntroComplete} />}
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes loading-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-glow {
          0% { opacity: 0.2; filter: blur(2px); }
          50% { opacity: 0.4; filter: blur(4px); }
          100% { opacity: 0.2; filter: blur(2px); }
        }
        
        @keyframes title-glow {
          0% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 15px rgba(99, 102, 241, 0.3); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(99, 102, 241, 0.6); }
          100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 15px rgba(99, 102, 241, 0.3); }
        }
        
        @keyframes hologram-effect {
          0% { opacity: 0; transform: translateY(1px); }
          5% { opacity: 0.3; }
          10% { opacity: 0; transform: translateY(-1px); }
          15% { opacity: 0.3; }
          20% { opacity: 0; transform: translateY(1px); }
          25% { opacity: 0; }
          30% { opacity: 0.3; }
          35% { opacity: 0; }
          40% { opacity: 0; }
          45% { opacity: 0.3; transform: translateY(-1px); }
          50% { opacity: 0; }
          55% { opacity: 0.3; }
          60% { opacity: 0; }
          65% { opacity: 0; }
          70% { opacity: 0.3; transform: translateY(1px); }
          75% { opacity: 0; }
          80% { opacity: 0; }
          85% { opacity: 0.3; }
          90% { opacity: 0; transform: translateY(-1px); }
          95% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .hologram-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
          animation: hologram-effect 8s infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        
        .animate-title-glow {
          animation: title-glow 3s ease-in-out infinite;
        }
        
        .animate-loading-progress {
          animation: loading-progress 1.5s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.4s ease-out;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes reverse-spin {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-duration-1000 {
          animation-duration: 1000ms;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
      
      <canvas id="polygonBackground" className="fixed top-0 left-0 w-full h-full -z-10"></canvas>
      <div className="scroll-progress-container fixed top-0 left-0 w-full h-1 z-50 bg-gray-900/50 backdrop-blur-sm">
        <div 
          className="scroll-progress-bar bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-full" 
          style={{ width: `${scrollY / (document.body.scrollHeight - window.innerHeight) * 100}%` }}
        ></div>
      </div>

      <div className="container mx-auto px-4">
        <header className="min-h-screen flex flex-col items-center justify-center text-center relative">
          {/* Navigation links */}
          <div className="fixed top-0 left-0 right-0 z-40 py-4 bg-gray-950/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 flex justify-end">
              <nav>
                <ul className="flex space-x-4 md:space-x-8">
                  <li>
                    <Link href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors">
                      ブログ
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none"></div>
          <div className="header-content relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white tracking-tighter relative overflow-hidden">
              {/* サイバースタイルの装飾線 */}
              <div className="absolute top-0 left-0 w-20 h-1 bg-blue-500 opacity-60"></div>
              <div className="absolute top-0 left-0 w-1 h-10 bg-blue-500 opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-20 h-1 bg-pink-500 opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-1 h-10 bg-pink-500 opacity-60"></div>
              
              {/* ホログラム効果 */}
              <div className="hologram-line" style={{ top: '10%', animationDelay: '0s' }}></div>
              <div className="hologram-line" style={{ top: '30%', animationDelay: '0.5s' }}></div>
              <div className="hologram-line" style={{ top: '50%', animationDelay: '1s' }}></div>
              <div className="hologram-line" style={{ top: '70%', animationDelay: '1.5s' }}></div>
              <div className="hologram-line" style={{ top: '90%', animationDelay: '2s' }}></div>
              
              {/* 光るロゴ背景 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse-glow" style={{ width: '350px', height: '350px' }}></div>
                  <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 bg-purple-500 rounded-full opacity-15 blur-3xl animate-pulse-glow" style={{ width: '300px', height: '300px', animationDelay: '0.5s' }}></div>
                  <Image 
                    src="/images/logo.jpg" 
                    alt="ハッカソンロゴ" 
                    width={400} 
                    height={400} 
                    className="opacity-40 animate-pulse-glow" 
                    priority
                  />
                </div>
              </div>
              
              {/* 幾何学的な要素 */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
                <div className="absolute right-0 top-1/2 w-full h-px bg-gradient-to-l from-transparent via-purple-500 to-transparent opacity-30"></div>
              </div>
              
              {/* 近未来的なオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 mix-blend-overlay pointer-events-none"></div>
              
              <span className="relative z-10 animate-title-glow px-4">HACKATHON</span> <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-title-glow font-extrabold" style={{ textShadow: '0 0 8px rgba(255,255,255,0.5), 0 0 2px rgba(255,255,255,0.8)' }}>2025</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 tracking-wide">あなたの挑戦が始まる</p>
            
            {/* 参加者数表示 */}

            <div className="participants-counter relative py-4 mb-6">
              <div className="counter-container flex flex-col items-center justify-center">
                
                <div className="counter-label text-gray-400 text-sm mb-2">現在の参加申込者数</div>
                <div className="counter-value relative flex items-center">
                  <div className="counter-bg absolute inset-0 bg-blue-500/10 rounded-lg blur-md"></div>
                  <div className="counter-digits relative flex items-center justify-center min-w-[160px] h-16 rounded-lg border border-blue-500/30 bg-gray-900/50 backdrop-blur-sm px-6">
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className="absolute inset-0 animate-pulse-glow opacity-10 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                      <div className="absolute h-px w-full top-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
                    </div>
                    
                    {/* ロード中のアニメーション */}
                    {!countLoaded ? (
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-6 w-6 bg-blue-500/20 rounded"></div>
                        <div className="h-6 w-6 bg-blue-500/20 rounded"></div>
                        <div className="h-6 w-6 bg-blue-500/20 rounded"></div>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <span className="digit-animation text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-title-glow">
                          {applicantCount}
                          <span className="text-xs align-top ml-1">名</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-indicator mt-16 cursor-pointer relative z-10 flex flex-col items-center" onClick={scrollToInterviews}>
            <p className="text-gray-400 mb-2">インタビューを見る</p>
            <div className="scroll-arrow text-blue-500 animate-bounce relative mx-auto">
              <div className="absolute inset-0 blur-md bg-blue-500 opacity-30 rounded-full"></div>
              <FaChevronDown size={24} className="relative z-10" />
            </div>
          </div>
        </header>

        <main>
          <section className="intro py-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">3ヶ月で世界を変える</h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              昨年のハッカソンでは、革新的なアイデアと情熱的なエンジニアが集結し、<br></br>驚くべき成果を生み出しました。次はあなたの番です。
            </p>
          </section>

          <section className="interviews py-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">参加者インタビュー</h2>
            
            {interviews.length > 0 && (
              <div className="interview-swiper-container relative mx-auto max-w-5xl">
                <Swiper
                  modules={[Navigation, Pagination, EffectCreative]}
                  effect="creative"
                  creativeEffect={{
                    prev: {
                      shadow: true,
                      translate: ['-20%', 0, -1],
                    },
                    next: {
                      translate: ['100%', 0, 0],
                    },
                  }}
                  slidesPerView={1}
                  spaceBetween={30}
                  navigation
                  pagination={{ clickable: true }}
                  loop={true}
                  onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                  className="interview-swiper rounded-xl overflow-hidden"
                >
                  {interviews.map((interview) => (
                    <SwiperSlide key={interview.interviewId}>
                      <div className="interview-card bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl h-full">
                        <div className="interview-content flex flex-col md:flex-row h-full">
                          <div className="interview-image md:w-1/3 relative h-64 md:h-auto">
                            {interview.imageUrl && (
                              <Image
                                src={interview.imageUrl}
                                alt={interview.alt}
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            )}
                          </div>
                          <div className="interview-text p-8 md:w-2/3 flex flex-col justify-between">
                            <div>
                              <h3 className="text-2xl font-bold mb-2 text-white">
                                {interview.name} <span className="text-sm font-normal text-blue-400 ml-2">{interview.title}</span>
                              </h3>
                              <div className={styles.interviewContent}>
                                <p className={styles.interviewText}>
                                  <span className="absolute -left-4 top-0 text-3xl text-blue-500/30">&ldquo;</span>
                                  {isPremiumUser && interview.fullContent 
                                    ? interview.fullContent 
                                    : interview.content}
                                  <span className="absolute -bottom-4 right-0 text-3xl text-blue-500/30">&rdquo;</span>
                                </p>
                                
                                {/* プレミアムコンテンツがあり、プレミアムユーザーでない場合にプレビュー+モザイク+ボタンを表示 */}
                                {!isPremiumUser && interview.content.length > 120 && (
                                  <div className={styles.premiumContentTeaser}>
                                    {/* ダミーのプレミアムコンテンツ（モザイク付き） */}
                                    <p>
                                      検証ツールでどうにかしても無駄です。プレミアム会員になってください
                                    </p>
                                    
                                    {/* 特典の概要（より簡潔に） */}
                                    <div className="mt-2 py-1.5 px-3 bg-blue-900/20 rounded-lg border border-blue-800/30 backdrop-blur-sm">
                                      <h4 className="text-blue-400 flex items-center gap-2 font-medium text-sm mb-1">
                                        <FaStar size={12} />
                                        プレミアム会員特典
                                      </h4>
                                      <ul className="text-gray-300 text-xs space-y-0 opacity-75 flex flex-wrap gap-x-3">
                                        <li>全文読み放題</li>
                                        <li>優先参加権</li>
                                        <li>限定資料公開</li>
                                      </ul>
                                    </div>
                                    
                                    {/* 課金ボタン */}
                                    <button 
                                      className={styles.paymentButton}
                                      onClick={() => handleOpenPaymentModal()}
                                    >
                                      <FaLock size={14} />
                                      これ以降はプレミアム会員のみ閲覧できます
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="like-container flex justify-end mt-4">
                              <LikeButton interviewId={interview.interviewId} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                <div className="interview-counter absolute bottom-4 left-4 z-10 px-4 py-2 rounded-full bg-gray-800/40 backdrop-blur-sm text-gray-300 border border-gray-700/50">
                  <span className="current-page font-bold text-white">{currentIndex + 1}</span> / <span className="total-pages">{interviews.length}</span>
                </div>
              </div>
            )}
          </section>

          <section className="hackathon-gallery py-20">
            <h2 className="section-title text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              前回の<span className="font-extrabold">ハッカソン</span>の様子
            </h2>
            <p className="section-subtitle text-xl text-gray-300 mb-12 text-center">創造性と革新が交わる3日間の熱狂</p>
            
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              effect="coverflow"
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
              }}
              autoplay={{
                delay: 8000,
                disableOnInteraction: false
              }}
              navigation
              pagination={{ clickable: true }}
              onSlideChange={handleSlideChange}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="mb-12"
            >
      
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8798.jpg", "自称モハメド・アリのプレゼン")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8798.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image 
                      src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8798.jpg" 
                      alt="自称モハメド・アリのプレゼン" 
                      fill 
                      className="object-cover" 
                      priority={currentIndex === 0}
                      loading={currentIndex === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">自称モハメド・アリのプレゼン </h3>
                    <p className="text-gray-300">残り一週間で焦って完成させた(してない)とは思えないほど堂々としています</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" 
                       onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8803.jpg", "新しい技術への挑戦")}
                       data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8803.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image 
                      src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8803.jpg" 
                      alt="新しい技術への挑戦" 
                      fill 
                      className="object-cover" 
                      priority={currentIndex === 1}
                      loading={currentIndex <= 2 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">新しい技術への挑戦</h3>
                    <p className="text-gray-300">普段は触る機会のない技術への挑戦はとても良い刺激になりました</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" 
                       onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8819.jpg", "考え抜かれた付加価値")}
                       data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8819.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image 
                      src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8819.jpg" 
                      alt="考え抜かれた付加価値" 
                      fill 
                      className="object-cover" 
                      priority={currentIndex === 2}
                      loading={currentIndex <= 3 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">考え抜かれた付加価値</h3>
                    <p className="text-gray-300">「ユーザーにどう感じてもらいたいか？」を軸に開発することでプロダクト志向のエンジニアに！</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8826.jpg", "こだわった点を解説")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8826.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8826.jpg" alt="こだわった点を解説" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">こだわった点を解説</h3>
                    <p className="text-gray-300">チームごとの色が出てとても楽しいです！</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8836.jpg", "熱い想いが大切")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8836.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8836.jpg" alt="熱い想いが大切" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">熱い想いが大切</h3>
                    <p className="text-gray-300">内容に自信がなくても彼のように堂々とプレゼンすることが大切です</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8822.jpg", "自分の担当した機能の説明")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8822.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8822.jpg" alt="自分の担当した機能の説明" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">自分の担当した機能の説明</h3>
                    <p className="text-gray-300">自分が開発した機能を非エンジニアの方々にもわかりやすく説明するスキルも向上します！</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8839.jpg", "論文発表のごとし")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8839.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8839.jpg" alt="論文発表のごとし" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">論文発表のごとし</h3>
                    <p className="text-gray-300">つい楽しくなって制限時間を忘れても仲間がなんとかしてくれます</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8849.jpg", "結果発表")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8849.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8849.jpg" alt="結果発表" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">結果発表</h3>
                    <p className="text-gray-300">順位ごとにお食事券がもらえます！１位のチームは1回の食事で使いきれないくらい!?</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8850.jpg", "審査員の方々も盛り上げてくれました")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8850.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8850.jpg" alt="審査員の方々も盛り上げてくれました" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">審査員の方々も盛り上げてくれました</h3>
                    <p className="text-gray-300">皆さん楽しそうに発表を聞いてくれるので、緊張しないで発表できました！</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60 cursor-pointer group" onClick={() => openImageViewer("https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8873.jpg", "学校祭の後のような達成感")} data-full-src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8873.jpg">
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 z-10 flex items-center justify-center">
                      <div className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8873.jpg" alt="学校祭の後のような達成感" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">学校祭の後のような達成感</h3>
                    <p className="text-gray-300">真剣に取り組めば取り組むほど、その後の達成感は大きくなります</p>
                  </div>
                </div>
              </SwiperSlide>
              
            </Swiper>
          </section>

          <section className="themes-section py-20">
            <div className="themes-container">
              <h2 className="concept-title text-3xl md:text-4xl font-bold mb-16 text-center text-white">
                <span className="text-blue-500">3</span>ヶ月で世界を変える<span className="text-blue-500">最小</span>のプロダクトをつくろう
              </h2>
              
              <div className="themes-grid mb-20">
                <h3 className="themes-heading text-2xl font-semibold mb-8 text-white text-center">テーマ例</h3>
                <div className="theme-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="theme-card group perspective">
                    <div className="card-inner relative w-full h-64 transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                      <div className="card-front absolute inset-0 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center backface-hidden">
                        <FaBuilding className="text-blue-400 text-4xl mb-4" />
                        <h4 className="text-xl font-semibold text-white">自社の課題を解決する</h4>
                      </div>
                      <div className="card-back absolute inset-0 bg-blue-900/30 backdrop-blur-sm border border-blue-800/50 rounded-xl p-8 flex items-center justify-center rotate-y-180 backface-hidden">
                        <p className="text-white text-center">日々の業務で感じている課題をテクノロジーで解決しましょう</p>
                      </div>
                    </div>
                  </div>
                  <div className="theme-card group perspective">
                    <div className="card-inner relative w-full h-64 transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                      <div className="card-front absolute inset-0 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center backface-hidden">
                        <FaTools className="text-blue-400 text-4xl mb-4" />
                        <h4 className="text-xl font-semibold text-white">社内で役立つツールを作る</h4>
                      </div>
                      <div className="card-back absolute inset-0 bg-blue-900/30 backdrop-blur-sm border border-blue-800/50 rounded-xl p-8 flex items-center justify-center rotate-y-180 backface-hidden">
                        <p className="text-white text-center">業務効率化や社内コミュニケーションを促進するツールを開発しましょう</p>
                      </div>
                    </div>
                  </div>
                  <div className="theme-card group perspective">
                    <div className="card-inner relative w-full h-64 transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                      <div className="card-front absolute inset-0 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center backface-hidden">
                        <FaGlobe className="text-blue-400 text-4xl mb-4" />
                        <h4 className="text-xl font-semibold text-white">社会課題をゆるくハックする</h4>
                      </div>
                      <div className="card-back absolute inset-0 bg-blue-900/30 backdrop-blur-sm border border-blue-800/50 rounded-xl p-8 flex items-center justify-center rotate-y-180 backface-hidden">
                        <p className="text-white text-center">身近な社会問題に対して、技術的なアプローチで解決策を提案しましょう</p>
                      </div>
                    </div>
                  </div>
                  <div className="theme-card group perspective">
                    <div className="card-inner relative w-full h-64 transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                      <div className="card-front absolute inset-0 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center backface-hidden">
                        <FaRocket className="text-blue-400 text-4xl mb-4" />
                        <h4 className="text-xl font-semibold text-white">新規事業系</h4>
                      </div>
                      <div className="card-back absolute inset-0 bg-blue-900/30 backdrop-blur-sm border border-blue-800/50 rounded-xl p-8 flex items-center justify-center rotate-y-180 backface-hidden">
                        <p className="text-white text-center">未来のビジネスチャンスを見据えた斬新なアイデアを形にしましょう</p>
                      </div>
                    </div>
                  </div>
                  <div className="theme-card group perspective">
                    <div className="card-inner relative w-full h-64 transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                      <div className="card-front absolute inset-0 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center backface-hidden">
                        <FaGrinStars className="text-blue-400 text-4xl mb-4" />
                        <h4 className="text-xl font-semibold text-white">あったら楽しい◯◯</h4>
                      </div>
                      <div className="card-back absolute inset-0 bg-blue-900/30 backdrop-blur-sm border border-blue-800/50 rounded-xl p-8 flex items-center justify-center rotate-y-180 backface-hidden">
                        <p className="text-white text-center">遊び心溢れるアイデアも大歓迎。楽しさがイノベーションを生み出します</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="recruitment-info">
                <h3 className="themes-heading text-2xl font-semibold mb-8 text-white text-center">募集要項</h3>
                <div className="recruitment-content max-w-3xl mx-auto">
                  <div className="recruitment-text bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
                    <p className="text-gray-300 text-lg text-center mb-8">普段の勉強のアウトプットをしたい人、1人だと勉強する気が起きない人、とりあえずハッカソンというものに興味がある人。</p>
                    <div className="edge-line h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8"></div>
                    <div className="cta-banner py-4 relative text-center overflow-hidden">
                      <h4 className="text-2xl font-bold text-white z-10 relative">さぁ、一歩踏み出そう</h4>
                      <div className="glitch-effect absolute inset-0 bg-blue-500/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cta py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              あなたの<span className="text-blue-500">挑戦</span>を待っています
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              何もできなくてOK！ボタンひとつだけでも仲間と話し合って作ってみませんか？
            </p>
            
            {/* 募集期間表示 */}
            <div className="application-period mb-6">
              <div className="period-badge inline-block py-2 px-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  <span className="font-semibold">参加者募集期間</span>: 2025年4月14日(月) 〜 2025年4月25日(金)
                </p>
                <p className="text-sm text-blue-300">
                  <span className="font-semibold">視聴者募集期間</span>:  〜 2025年8月15日(金)
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="apply-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                onClick={handleOpenModal}
              >
                今すぐ応募する <FaArrowRight className="ml-2" />
              </button>
              
              <button 
                className="online-viewer-btn bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer border border-purple-500/30"
                onClick={handleOpenOnlineViewerModal}
              >
                オンライン視聴で参加 <FaArrowRight className="ml-2" />
              </button>
            </div>

            {/* 参加者カウンター表示 */}
            <div className="counters-container flex flex-col md:flex-row justify-center gap-6 mt-8">
              <div className="counter-box">
                <div className="counter-label text-gray-400 text-sm mb-2">現在の参加申込者数</div>
                <div className="counter-value relative flex items-center">
                  <div className="counter-bg absolute inset-0 bg-blue-500/10 rounded-lg blur-md"></div>
                  <div className="counter-digits relative flex items-center justify-center min-w-[120px] h-12 rounded-lg border border-blue-500/30 bg-gray-900/50 backdrop-blur-sm px-6">
                    {!countLoaded ? (
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-4 w-4 bg-blue-500/20 rounded"></div>
                        <div className="h-4 w-4 bg-blue-500/20 rounded"></div>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-blue-400">{applicantCount}<span className="text-xs align-top ml-1">名</span></span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="counter-box">
                <div className="counter-label text-gray-400 text-sm mb-2">オンライン視聴登録者数</div>
                <div className="counter-value relative flex items-center">
                  <div className="counter-bg absolute inset-0 bg-purple-500/10 rounded-lg blur-md"></div>
                  <div className="counter-digits relative flex items-center justify-center min-w-[120px] h-12 rounded-lg border border-purple-500/30 bg-gray-900/50 backdrop-blur-sm px-6">
                    {!countLoaded ? (
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-4 w-4 bg-purple-500/20 rounded"></div>
                        <div className="h-4 w-4 bg-purple-500/20 rounded"></div>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-purple-400">{onlineViewerCount}<span className="text-xs align-top ml-1">名</span></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-12 text-center border-t border-gray-800">
          <div className="footer-content text-gray-400">
            <p className="mb-2">&copy; 2025 社内ハッカソン運営チーム</p>
          </div>
        </footer>
      </div>

      {/* 応募モーダル */}
      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        openPaymentModal={handleOpenPaymentModal}
      />
      
      {/* オンライン視聴モーダル */}
      <OnlineViewerModal 
        isOpen={isOnlineViewerModalOpen} 
        onClose={handleCloseOnlineViewerModal} 
      />
      
      {/* 課金モーダル */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* ギャラリー画像ビューワーモーダル */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={closeImageViewer}
          ></div>
          <div className="relative max-w-5xl w-full max-h-screen p-4 animate-zoomIn">
            <button 
              className="absolute top-4 right-4 text-white z-10 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              onClick={closeImageViewer}
            >
              <FaTimes size={20} />
            </button>
            <div className="relative overflow-hidden rounded-lg border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              
              {/* ローディングスピナー */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm">
                  <div className="loading-container flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-3">
                      <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
                      <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-purple-400 animate-spin animate-duration-1000 animate-reverse"></div>
                    </div>
                    <p className="text-blue-300 text-sm animate-pulse">画像を読み込み中...</p>
                  </div>
                </div>
              )}
              
              {/* メイン画像 */}
              <img 
                src={selectedImage} 
                alt={selectedImageAlt} 
                className={`w-full h-full object-contain relative z-10 transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsImageLoading(false)}
                fetchPriority="high"
              />
            </div>
            <p className="text-white text-center mt-4 text-sm opacity-70">{selectedImageAlt}</p>
          </div>
        </div>
      )}
    </>
  );
}
