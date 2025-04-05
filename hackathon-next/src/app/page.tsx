'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';
import Image from 'next/image';
import { FaChevronDown, FaArrowRight, FaBuilding, FaTools, FaGlobe, FaRocket, FaGrinStars, FaLock, FaTimes, FaCheck, FaStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';
import LikeButton from './components/LikeButton';
import ApplicationModal from './components/ApplicationModal';

// インタビューデータの型定義
interface Interview {
  id: number;
  interviewId: string;
  name: string;
  title: string;
  content: string;
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

export default function Home() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const polygonsRef = useRef<Array<{x: number, y: number, size: number, angle: number, speed: number}>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // LocalStorageから課金状態を取得
  useEffect(() => {
    console.log("useEffect");
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      const isPremium = localStorage.getItem('premium_user') === 'true';
      console.log("isPremium", isPremium);
      
      setIsPremiumUser(isPremium);
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
  
  // 支払い完了後の処理
  const handlePaymentComplete = async () => {
    // LocalStorageに情報を保存済みなので、ステートだけ更新
    setIsPremiumUser(true);
    // インタビューデータを再取得
    await fetchInterviews();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-3xl">読み込み中...</div>
    </div>;
  }

  return (
    <>
      <canvas id="polygonBackground" className="fixed top-0 left-0 w-full h-full -z-10"></canvas>
      <div className="scroll-progress-container fixed top-0 left-0 w-full h-1 z-50 bg-gray-900/50 backdrop-blur-sm">
        <div 
          className="scroll-progress-bar bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-full" 
          style={{ width: `${scrollY / (document.body.scrollHeight - window.innerHeight) * 100}%` }}
        ></div>
      </div>

      <div className="container mx-auto px-4">
        <header className="min-h-screen flex flex-col items-center justify-center text-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none"></div>
          <div className="header-content relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white tracking-tighter">
              HACKATHON <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">2025</span>
                <span className="absolute inset-0 blur-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 tracking-wide">前回参加者の声 - あなたの挑戦が始まる</p>
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
              昨年のハッカソンでは、革新的なアイデアと情熱的なエンジニアが集結し、驚くべき成果を生み出しました。彼らの経験から、次はあなたの番です。
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
                                alt={interview.name}
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
                                      {interview.fullContent 
                                        ? interview.fullContent.substring(0, 150) // 文字数を150に削減
                                        : `${interview.name}さんのインタビューには続きがあります...`}
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
                delay: 3000,
                disableOnInteraction: false
              }}
              navigation
              pagination={{ clickable: true }}
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
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8798.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">自称モハメド・アリのプレゼン </h3>
                    <p className="text-gray-300">残り一週間で焦って完成させたとは思えないほど堂々としています</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8803.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">新しい技術への挑戦</h3>
                    <p className="text-gray-300">普段は触る機会のない技術への挑戦はとても良い刺激になりました</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8819.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">考え抜かれた付加価値</h3>
                    <p className="text-gray-300">「ユーザーにどう感じてもらいたいか？」を軸に開発することで実務にも良い影響が生まれるはずです！</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8822.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">自分の担当した機能の説明</h3>
                    <p className="text-gray-300">自分が開発した機能を非エンジニアの方々にもわかりやすく説明するスキルも向上します！</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8826.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">こだわった点を説明</h3>
                    <p className="text-gray-300">チームごとの色が出てとても楽しいです！</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8836.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">熱い想いが大切</h3>
                    <p className="text-gray-300">内容に自信がなくても彼のように堂々とプレゼンすることが大切です</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8839.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">論文発表のごとし</h3>
                    <p className="text-gray-300">つい楽しくなって制限時間を忘れても仲間がなんとかしてくれます</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8849.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">結果発表</h3>
                    <p className="text-gray-300">順位ごとにお食事券がもらえます！１位のチームは1回の食事で使いきれないくらい!?</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8850.jpg" alt="プロトタイピング" fill className="object-cover" />
                  </div>
                  <div className="gallery-caption p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">審査員の方々も盛り上げてくれました</h3>
                    <p className="text-gray-300">皆さん楽しそうに発表を聞いてくれるので、緊張しないで発表できました！</p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="gallery-item bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                  <div className="gallery-image relative h-60">
                    <Image src="https://ibj-hack.s3.ap-northeast-1.amazonaws.com/IMG_8873.jpg" alt="プロトタイピング" fill className="object-cover" />
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
              イノベーションの旅に参加しませんか？あなたのアイデアが次の成功ストーリーになるかもしれません。
            </p>
            <button 
              className="apply-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              onClick={handleOpenModal}
            >
              今すぐ応募する <FaArrowRight className="ml-2" />
            </button>
          </section>
        </main>

        <footer className="py-12 text-center border-t border-gray-800">
          <div className="footer-content text-gray-400">
            <p className="mb-2">&copy; 2025 社内ハッカソン運営チーム</p>
            <p>お問い合わせ: hackathon@example.com</p>
          </div>
        </footer>
      </div>

      {/* 応募モーダル */}
      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
      
      {/* 課金モーダル */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
}
