'use client';

import { useEffect, useRef, useState } from 'react';

export default function BackgroundEffect() {
  const canvasRef = useRef(null);
  const [effect, setEffect] = useState('hyperspeed'); // 'hyperspeed' or 'letterglitch'
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  // エフェクト切り替え用のキーイベント
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        setEffect(prev => prev === 'hyperspeed' ? 'letterglitch' : 'hyperspeed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // タイマーのセットアップ
  const showControlButton = () => {
    setIsVisible(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  // エフェクトが変更されたときにボタンを表示
  useEffect(() => {
    showControlButton();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [effect]);

  // Canvas実装
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // キャンバスサイズ設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // アニメーションフレーム参照
    let animationFrame;
    
    // 1. Hyperspeedエフェクト用のパーティクル
    const particles = [];
    
    // パーティクル初期化
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        speed: Math.random() * 5 + 5,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`
      });
    }
    
    // 2. LetterGlitchエフェクト用の文字
    const letters = [];
    const chars = "HACKATHON2025";
    const letterCount = chars.length;
    
    // 文字の初期化
    for (let i = 0; i < letterCount; i++) {
      const x = canvas.width / 2 - (letterCount * 30) / 2 + i * 30;
      letters.push({
        char: chars[i],
        x: x,
        y: canvas.height / 2,
        originalX: x,
        originalY: canvas.height / 2,
        glitchTime: 0,
        fontSize: 60,
        color: '#3B82F6',
        opacity: 0.5
      });
    }
    
    // Hyperspeedアニメーション関数
    const animateHyperspeed = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      particles.forEach(particle => {
        particle.z -= particle.speed;
        
        if (particle.z <= 0) {
          particle.z = 1000;
          particle.x = Math.random() * canvas.width - centerX;
          particle.y = Math.random() * canvas.height - centerY;
        }
        
        const scale = 1000 / particle.z;
        const x2d = particle.x * scale + centerX;
        const y2d = particle.y * scale + centerY;
        const r = Math.max(0.5, 3 * scale);
        
        if (x2d >= 0 && x2d <= canvas.width && y2d >= 0 && y2d <= canvas.height) {
          ctx.beginPath();
          ctx.fillStyle = particle.color;
          ctx.arc(x2d, y2d, r, 0, Math.PI * 2);
          ctx.fill();
          
          // 光る効果
          const glow = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, r * 3);
          glow.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x2d, y2d, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };
    
    // LetterGlitchアニメーション関数
    const animateLetterGlitch = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      letters.forEach((letter, index) => {
        // ランダムにグリッチする時間を決定
        if (Math.random() < 0.03) {
          letter.glitchTime = Math.random() * 10;
        }
        
        // グリッチ効果
        let offsetX = 0;
        let offsetY = 0;
        
        if (letter.glitchTime > 0) {
          offsetX = (Math.random() - 0.5) * 10;
          offsetY = (Math.random() - 0.5) * 10;
          letter.glitchTime--;
          ctx.globalAlpha = Math.min(1, letter.opacity * 1.5);
        } else {
          ctx.globalAlpha = letter.opacity;
        }
        
        // 文字の再配置（ウィンドウサイズ変更に対応）
        letter.x = canvas.width / 2 - (letterCount * 30) / 2 + index * 30 + offsetX;
        letter.y = canvas.height / 2 + offsetY;
        
        // 文字描画
        ctx.font = `bold ${letter.fontSize}px monospace`;
        ctx.fillStyle = letter.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 文字の描画
        ctx.fillText(letter.char, letter.x, letter.y);
        
        // グリッチしている時はエフェクトを追加
        if (letter.glitchTime > 0) {
          // 赤/青のずれ効果
          ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
          ctx.fillText(letter.char, letter.x - 2, letter.y);
          ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
          ctx.fillText(letter.char, letter.x + 2, letter.y);
        }
        
        // 光る効果
        if (letter.glitchTime > 0) {
          const gradient = ctx.createLinearGradient(
            letter.x - letter.fontSize / 2,
            letter.y - letter.fontSize / 2,
            letter.x + letter.fontSize / 2,
            letter.y + letter.fontSize / 2
          );
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
          gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
          
          ctx.fillStyle = gradient;
          ctx.fillText(letter.char, letter.x, letter.y);
        }
      });
    };
    
    // メインアニメーション関数
    const animate = () => {
      if (effect === 'hyperspeed') {
        animateHyperspeed();
      } else {
        animateLetterGlitch();
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [effect]);
  
  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />
      
      {/* エフェクト切り替えボタン */}
      <div 
        className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onMouseMove={showControlButton}
      >

      </div>
    </>
  );
} 