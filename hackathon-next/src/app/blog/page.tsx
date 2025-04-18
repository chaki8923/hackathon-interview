'use client';

import { FaClock, FaUser, FaCalendar, FaTimes, FaCheck, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './blog.module.scss';
import ApplicationModal from '../components/ApplicationModal';

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

export default function Blog() {
  // モーダル表示のための状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // LocalStorageから課金状態を取得
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      const isPremium = localStorage.getItem('premium_user') === 'true';
      setIsPremiumUser(isPremium);
    }
  }, []);

  // モーダルを開く関数
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる関数
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 課金モーダルを開く関数
  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  // 課金モーダルを閉じる関数
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  // 支払い完了後の処理
  const handlePaymentComplete = () => {
    // LocalStorageに情報を保存済みなので、ステートだけ更新
    setIsPremiumUser(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header with back link */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>トップページに戻る</span>
          </Link>
          <div className="text-sm text-gray-400">ハッカソンブログ</div>
          {isPremiumUser && (
            <div className="bg-blue-900/30 px-3 py-1 rounded-full text-xs text-blue-300 border border-blue-800/30">
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-500" size={12} />
                プレミアム会員
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Blog post */}
        <article className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-xl mb-10">
          {/* Blog header */}
          <div className="p-6 md:p-8 border-b border-gray-800">
            <h1 className={`text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 ${styles.glowHeading}`}>
              ハッカソンに参加したいけれど…「忙しくて時間がない」「足を引っ張りそう」「自信がない」方必見！！
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <FaCalendar size={14} />
                <span>2025年3月15日</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUser size={14} />
                <span>ハッカソン運営チーム</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock size={14} />
                <span>読了時間: 約5分</span>
              </div>
            </div>
          </div>

          {/* Blog content */}
          <div className={`prose prose-invert prose-blue max-w-none p-6 md:p-8 ${styles.blogContent}`}>
            <p className="text-lg leading-relaxed mb-6">
              ハッカソンってワクワクする反面、
            </p>
            
            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>本業や家事で忙しい</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>技術力に自信がなくてチームに迷惑をかけそう</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>そもそも自分なんかが参加していいのか…</span>
              </li>
            </ul>
            
            <p className="mb-8">
              と尻込みしてしまう方も多いはず。
              でも、大丈夫。ちょっとした工夫とマインドセットの切り替えで、あなたもハッカソンデビューできます！
            </p>

            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
              1. 忙しくて時間がない…を乗り越える３つのテクニック
            </h2>
            
            <h3 className="text-lg font-semibold text-purple-300 mb-2">「スモールタスク化」</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>コードを書く時間が取れなくても、アイデア出しや資料作りは10～15分でもOK。</li>
              <li>朝の通勤時間やランチ後の15分でToDoを整理しよう。</li>
            </ul>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「ペア・モブプログラミング」活用</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>一人で悶々とするより、ペアで短時間取り組むほうが進捗アップ。</li>
              <li>事前にペア相手と日時を決め、一緒に触るだけでも経験値になる。</li>
            </ul>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「外注・アウトソース感覚」</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>デザインやドキュメント作成は、社内のデザイナーや他チームにお願いしてもOK。</li>
              <li>自分のコアスキルに集中でき、全体のクオリティが上がる。</li>
            </ul>

            <div className={styles.responsiveImage}>
              <Image
                src="/images/busy.jpg"
                alt="カレンダーに小さなタスクをびっしり書き込む様子"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
              2. 「足を引っ張りそう…」という不安を和らげる方法
            </h2>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「役割分担＋ショートサイクル」</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>チーム立ち上げ時に「私は雑務担当」「私は調査担当」など役割を分ける。</li>
              <li>1～2時間ごとに成果を共有し、早めにフォローを受けられる体制を作る。</li>
            </ul>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「ドキュメント重視の開発」</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>コードをいきなり書かず、まずはREADMEや画面遷移図を作成。</li>
              <li>ドキュメントがあると誰が見てもわかりやすく、リファクタの手間も減る。</li>
            </ul>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「コードレビュー／ペアチェック」</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>事前に「ここだけレビューしてほしい」と伝えることで、負担を小分けにできる。</li>
              <li>小さい変更を複数回に分けてPRすることで、チームがキャッチアップしやすくなる。</li>
            </ul>

            <div className={styles.responsiveImage}>
              <Image
                src="/images/huan.jpg"
                alt="ホワイトボードに役割を書き出すチーム"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
              3. 「自信がない…」をポジティブに変える思考法
            </h2>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「失敗＝学び」のマインドセット</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>正解を当てにいくより、挑戦中のエラーやトラブルこそ価値がある。</li>
              <li>「後で振り返って、こうすればよかった」を素直にメモしておこう。</li>
            </ul>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「小さな成功体験」を積む</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>簡単な機能（ボタン1つ動く、APIレスポンスが見える）でもOK。</li>
              <li>ステップごとに「動いた！」をチームに報告し、自信のビルドアップ。</li>
            </ul>

            <h3 className="text-lg font-semibold text-purple-300 mb-2">「強みを活かす」</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>コーディング以外にも、企画、UI/UX、プレゼン資料作成、タイムキーパー…</li>
              <li>チームに必要な役割は多様。あなたの得意を前面に出そう。</li>
            </ul>

            <div className={styles.responsiveImage}>
              <Image
                src="/images/ageage.jpg"
                alt="小さな成果を喜ぶ人の表情"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
              4. &#34;参加ハードル&#34;をグッと下げるコツ
            </h2>

            <ul className="list-disc pl-5 space-y-3 mb-6">
              <li><span className="text-purple-300 font-semibold">事前チュートリアル参加</span>：ハッカソン前に短時間で基本環境だけセットアップ</li>
              <li><span className="text-purple-300 font-semibold">Slack/Discordの質問チャンネル活用</span>：開催中常に聞ける場があると安心</li>
              <li><span className="text-purple-300 font-semibold">初心者向けテーマのチーム</span>：最初からハッカソン&#34;初心者歓迎&#34;チームに応募</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2">
              まとめ：まずは「やってみる」を選ぼう！
            </h2>

            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>小さく分けて時間を捻出</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>チームワークで「誰かがフォロー」</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>小さな成功を自信に変える</span>
              </li>
            </ul>

            <p className="mb-4">
              迷っている間にも時間は過ぎていきます。
              「忙しい」「不安」「自信不足」は誰もが通る道。
              まずはエントリーしてみること、それが<span className={styles.highlight}>最大の一歩</span>です。
            </p>

            <div className={styles.responsiveImage}>
              <Image
                src="/images/chaki.jpeg"
                alt="PCの前で笑顔でガッツポーズをする人"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-lg font-semibold text-blue-300 mt-8 mb-4">
              あなたの挑戦をチーム一同、全力で応援します！
              ぜひぜひ、一緒に楽しみましょう😊
            </p>
          </div>

          {/* Call to Action */}
          <div className="p-6 md:p-8 bg-blue-900/20 border-t border-blue-800/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">今すぐハッカソンに参加しませんか？</h3>
                <p className="text-gray-300">エントリー締め切りは2025年4月25日です。</p>
              </div>
              <button 
                onClick={handleOpenModal}
                className={styles.ctaButton}
              >
                <span>応募する</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      </main>

      <footer className="py-12 text-center border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p className="text-gray-400">&copy; 2025 社内ハッカソン運営チーム</p>
        </div>
      </footer>

      {/* 応募モーダル */}
      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        openPaymentModal={handleOpenPaymentModal}
      />

      {/* 課金モーダル */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
} 