'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTools, FaCode, FaLaptopCode } from 'react-icons/fa';

// チームとメンバーのデータ型定義
interface TeamMember {
  id: string;
  name: string;
  role: string;
  tools: string[];
  technologies: string[];
  comment: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  product: {
    name: string;
    description: string;
  };
  members: TeamMember[];
}

// チームとメンバーのデータ
const teams: Team[] = [
  {
    id: "team-alpha",
    name: "イノ☆リティカ島のナミチャグラキム共和国",
    description: "",
    imageUrl: "/images/ino2.png",
    product: {
      name: "meguru",
      description: "フードロス削減サービス"
    },
    members: [
      {
        id: "alpha-1",
        name: "浪川 豊",
        role: "ディレクター",
        tools: ["-"],
        technologies: ["-"],
        comment: ""
      },
      {
        id: "alpha-2",
        name: "島津 恵",
        role: "バックエンドエンジニア",
        tools: ["Cursor", "Docker", "AWS", "Firebase", "GraphQL"],
        technologies: ["Go", "TypeScript"],
        comment: "がんばります！"
      },
      {
        id: "alpha-3",
        name: "リティカ",
        role: "エンジニア",
        tools: ["VSCode", "Windsurf", "Cursor"],
        technologies: ["React", "Laravel", "Next.js"],
        comment: ""
      },
      {
        id: "alpha-4",
        name: "小倉 奈々実",
        role: "デザイナー",
        tools: ["Figma", "Photoshop", "Illustrator", "VSCode", "Excel"],
        technologies: ["-"],
        comment: "雑用担当になりそうですがよろしくお願いします！企画とデザイン頑張ります。"
      },
      {
        id: "alpha-5",
        name: "猪野 萌夏",
        role: "デザイナー",
        tools: ["-"],
        technologies: ["Figma"],
        comment: ""
      },
      {
          id: "alpha-6",
          name: "木村 真人",
          role: "エンジニア",
          tools: ["-"],
          technologies: ["Laravel", "React", "TypeScript"],
          comment: ""
        },
        {
          id: "alpha-7",
          name: "茶木 涼",
          role: "エンジニア",
          tools: ["Cursor", "MCP", "GoogleNoteBookLM", "imageFX"],
          technologies: ["Go", "NEXT.js", "Python"],
          comment: "今年こそ優勝を手にして2年連続アワード9を受賞します"
        }
    ]
  },
  {
    id: "team-beta",
    name: "ギャラクシーケンタウロス東京",
    description: "",
    imageUrl: "/images/iwasaki.jpg",
    product: {
      name: "日本人の気疲れを癒す新感覚のSNS",
      description: "気疲れを解消するコミュニケーションプラットフォーム"
    },
    members: [
      {
        id: "beta-1",
        name: "杉村 玲奈",
        role: "ディレクター",
        tools: ["-"],
        technologies: ["-"],
        comment: ""
      },
      {
        id: "beta-2",
        name: "村上享",
        role: "デザイナー",
        tools: ["Figma"],
        technologies: ["Next.js"],
        comment: "めっちゃ良い物を作りたいです。宜しくお願い致します"
      },
      {
        id: "beta-3",
        name: "須賀 仁一",
        role: "アプリエンジニア",
        tools: ["Cursor", "Figma", "AWS", "Docker"],
        technologies: ["RubyonRails", "Dart"],
        comment: ""
      },
      {
        id: "beta-4",
        name: "小関 涼平",
        role: "全てを取り扱う者",
        tools: ["Cursor"],
        technologies: ["TypeScript", "Go", "Kotlin"],
        comment: "ネイティブアプリ作ってみたいです。"
      },
      {
        id: "beta-5",
        name: "井後梨菜",
        role: "デザイナー",
        tools: ["-"],
        technologies: ["-"],
        comment: ""
      },
      {
        id: "beta-6",
        name: "岩崎 健太郎",
        role: "バックエンドエンジニア",
        tools: ["VSCode", "AWS", "GitHub", "Actions", "PostgreSQL"],
        technologies: ["RubyonRails", "Laravel"],
        comment: ""
      },
      {
        id: "beta-7",
        name: "伊澤 遼介",
        role: "シリコンバレーエンジニア",
        tools: ["秀丸エディタ"],
        technologies: ["jQuery"],
        comment: ""
      }
    ]
  },
  {
    id: "team-gamma",
    name: "スーパーウルトラジャパン",
    description: "",
    imageUrl: "/images/super.jpg",
    product: {
      name: "気持ちスタンプ日記",
      description: "感情を可視化する新しい日記アプリ"
    },
    members: [
      {
        id: "gamma-1",
        name: "木村 沙恵子",
        role: "ディレクター",
        tools: ["-"],
        technologies: ["-"],
        comment: ""
      },
      {
        id: "gamma-2",
        name: "大高 拓己",
        role: "アプリエンジニア",
        tools: ["-"],
        technologies: ["-"],
        comment: ""
      },
      {
        id: "gamma-3",
        name: "太田 圭一",
        role: "デザイナー",
        tools: ["Figma"],
        technologies: ["Python"],
        comment: ""
      },
      {
        id: "gamma-4",
        name: "東海林 拓真",
        role: "デザイナー",
        tools: ["Figma", "Photoshop", "Illustrator", "Excel", "Git"],
        technologies: ["Java"],
        comment: "理解しきっていませんが、迷うことなく挑戦させていただきます🔥"
      },
      {
        id: "gamma-5",
        name: "浜口・チャーリー・裕介",
        role: "アシスタント・オフィサー",
        tools: ["Vim"],
        technologies: ["DISCO"],
        comment: ""
      },
      {
        id: "gamma-6",
        name: "咽原 レイナ",
        role: "デザイナー",
        tools: ["-"],
        technologies: ["-"],
        comment: "がんばります！"
      },
      {
        id: "gamma-7",
        name: "平野宇教",
        role: "エンジニア",
        tools: ["-"],
        technologies: ["-"],
        comment: ""
      }
    ]
  },
  {
    id: "team-delta",
    name: "蒼々しいやつら",
    description: "",
    imageUrl: "/images/aoao.jpg",
    product: {
      name: "ランチマッチングサービス",
      description: "ランチタイムを通じた新しい出会いの場"
    },
    members: [
      {
        id: "delta-1",
        name: "宇野 智水",
        role: "ディレクター",
        tools: ["-"],
        technologies: ["-"],
        comment: "知識には欠けますが、やる気と元気はあります！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！よろしくお願いします！！！！！！！！！！！！！！！！"
      },
      {
        id: "delta-2",
        name: "松﨑 千尋",
        role: "ディレクター",
        tools: ["-"],
        technologies: ["-"],
        comment: ""
      },
      {
        id: "delta-3",
        name: "新谷 嘉朗",
        role: "デザイナー",
        tools: ["Figma"],
        technologies: ["React", "Next.js"],
        comment: ""
      },
      {
        id: "delta-4",
        name: "青山 有希",
        role: "フロントエンドエンジニア",
        tools: ["Cursor"],
        technologies: [""],
        comment: "フロント側の対応をやりたいです〜"
      },
      {
        id: "delta-5",
        name: "矢島 和花菜",
        role: "デザイナー",
        tools: ["Figma", "Illustrator"],
        technologies: [""],
        comment: ""
      },
      {
        id: "delta-6",
        name: "新井 俊也",
        role: "ガジェットエンジニア",
        tools: ["2B鉛筆"],
        technologies: ["日本語"],
        comment: ""
      },
      {
        id: "delta-7",
        name: "ケーシャブ",
        role: "エンジニア",
        tools: ["AWS", "Trae", "Supabase", "GraphQL", "TensorFlow", "PyTorch", "PostgreSQL", "Redis", "Kubernetes"],
        technologies: ["Rust", "Go", "Lisp", "Elixir", "Laravel", "Python"],
        comment: ""
      }
    ]
  }
];

// メンバーの詳細モーダルコンポーネント
const MemberDetailModal = ({ member, onClose }: { member: TeamMember | null, onClose: () => void }) => {
  if (!member) return null;
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 背景クリックでモーダルを閉じる（モーダル自体のクリックは伝播させない）
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 300,
          bounce: 0.5
        }}
        style={{
          maxWidth: '42rem',
          width: '100%',
          borderRadius: '1rem',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          background: 'linear-gradient(to bottom right, #1a202c, #2a4365)'
        }}
      >
        {/* 背景エフェクト */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundSize: '25px 25px',
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
        }}></div>
        
        {/* 装飾要素 */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '16rem',
          height: '16rem',
          borderRadius: '100%',
          filter: 'blur(100px)',
          marginRight: '-8rem',
          marginTop: '-8rem',
          background: 'rgba(59, 130, 246, 0.1)'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '16rem',
          height: '16rem',
          borderRadius: '100%',
          filter: 'blur(100px)',
          marginLeft: '-8rem',
          marginBottom: '-8rem',
          background: 'rgba(139, 92, 246, 0.1)'
        }}></div>
        
        {/* サイバーパンク風の装飾ライン */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #3182ce, #9f7aea, #ed64a6)'
          }}
        ></motion.div>
        
        {/* 閉じるボタン */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            color: '#9ca3af',
            transition: 'color 0.2s',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div style={{ padding: '2rem', position: 'relative', zIndex: 10 }}>
          {/* ヘッダー部分 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 style={{
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              fontWeight: 700,
              marginBottom: '0.25rem',
              background: 'linear-gradient(to right, #63b3ed, #b794f4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              {member.name}
            </h2>
            <p style={{ color: '#93c5fd', marginBottom: '1.5rem' }}>{member.role}</p>
            
            {member.comment && member.comment.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  marginBottom: '1.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(30, 58, 138, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)'
                }}></div>
                
                <p style={{ 
                  fontSize: '1rem',
                  lineHeight: '1.5rem',
                  color: '#e2e8f0',
                  paddingLeft: '0.5rem', 
                  fontStyle: 'italic'
                }}>
                  &quot;{member.comment}&quot;
                </p>
              </motion.div>
            )}
          </motion.div>
          
          {/* 技術スタック */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: '2rem' }}
          >
            <h3 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '1.125rem', 
              lineHeight: '1.75rem', 
              fontWeight: 600, 
              color: 'white', 
              marginBottom: '0.75rem' 
            }}>
              <FaCode style={{ marginRight: '0.5rem', color: '#60a5fa' }} />
              <span>使用したい技術</span>
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {member.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ 
                    delay: 0.2 + (index * 0.05),
                    type: "spring",
                    stiffness: 200
                  }}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    border: '1px solid rgba(29, 78, 216, 0.5)',
                    backgroundColor: 'rgba(30, 64, 175, 0.5)',
                    color: '#93c5fd'
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          {/* 使用ツール */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '1.125rem', 
              lineHeight: '1.75rem', 
              fontWeight: 600, 
              color: 'white', 
              marginBottom: '0.75rem' 
            }}>
              <FaTools style={{ marginRight: '0.5rem', color: '#c084fc' }} />
              <span>使用したいツール</span>
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {member.tools.map((tool, index) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ 
                    delay: 0.3 + (index * 0.05),
                    type: "spring",
                    stiffness: 200
                  }}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    border: '1px solid rgba(91, 33, 182, 0.5)',
                    backgroundColor: 'rgba(76, 29, 149, 0.5)',
                    color: '#c4b5fd'
                  }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* サイバーパンク風アニメーションパーティクル */}
        {[
          { top: '5rem', right: '2.5rem', size: '0.75rem', color: '#3b82f6', delay: 0.5 },
          { top: '10rem', left: '2.5rem', size: '0.5rem', color: '#8b5cf6', delay: 0.6 },
          { bottom: '5rem', right: '5rem', size: '1rem', color: '#06b6d4', delay: 0.7 }
        ].map((particle, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: particle.delay, duration: 0.3 }}
            style={{
              position: 'absolute',
              top: particle.top,
              right: particle.right,
              bottom: particle.bottom,
              left: particle.left,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '9999px'
            }}
          ></motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// チームカードコンポーネント
const TeamCard = ({ team, index, onMemberClick }: { team: Team, index: number, onMemberClick: (member: TeamMember) => void }) => {
  const [showMembers, setShowMembers] = useState(false);
  
  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      style={{
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #1f2937',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        marginBottom: '3rem'
      }}
    >
      {/* チームヘッダー */}
      <div style={{ position: 'relative', height: '28rem', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(17, 24, 39, 0.9))',
          zIndex: 10
        }}></div>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Image 
            src={team.imageUrl} 
            alt={team.name} 
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'top'
            }}
          />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '1.5rem', zIndex: 10 }}>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
              fontWeight: 700,
              color: 'white',
              marginBottom: '0.25rem'
            }}
          >
            {team.name}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            style={{ color: '#93c5fd' }}
          >
            {team.description}
          </motion.p>
        </div>
      </div>
      
      {/* プロダクトセクション */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
        style={{
          margin: '1.5rem',
          marginBottom: '0',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'relative'
        }}
      >
        {/* グラデーションボーダー */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: index === 0 
            ? 'linear-gradient(to right, #3b82f6, #60a5fa)' 
            : index === 1 
            ? 'linear-gradient(to right, #8b5cf6, #a78bfa)'
            : index === 2 
            ? 'linear-gradient(to right, #10b981, #34d399)'
            : 'linear-gradient(to right, #f59e0b, #fbbf24)'
        }}></div>
        
        {/* パーティクルエフェクト */}
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '1rem',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : index === 2 ? '#10b981' : '#f59e0b',
          opacity: 0.7,
          boxShadow: `0 0 10px ${index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : index === 2 ? '#10b981' : '#f59e0b'}`
        }}></div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: index === 0 
                ? 'rgba(59, 130, 246, 0.2)' 
                : index === 1 
                ? 'rgba(139, 92, 246, 0.2)'
                : index === 2 
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${index === 0 ? 'rgba(59, 130, 246, 0.5)' : index === 1 ? 'rgba(139, 92, 246, 0.5)' : index === 2 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
              marginRight: '0.75rem',
              fontSize: '0.875rem',
              color: 'white',
              fontWeight: 600
            }}>
              🚀
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'white',
              margin: 0
            }}>
              プロダクト
            </h3>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            style={{
              marginBottom: '0.75rem'
            }}
          >
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              background: index === 0 
                ? 'linear-gradient(to right, #60a5fa, #93c5fd)' 
                : index === 1 
                ? 'linear-gradient(to right, #a78bfa, #c4b5fd)'
                : index === 2 
                ? 'linear-gradient(to right, #34d399, #6ee7b7)'
                : 'linear-gradient(to right, #fbbf24, #fcd34d)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '0.5rem',
              lineHeight: '1.6'
            }}>
              {team.product.name}
            </h4>
            <p style={{
              color: '#e2e8f0',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              opacity: 0.9
            }}>
              {team.product.description}
            </p>
          </motion.div>
          
          {/* 装飾的な要素 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: index * 0.3
              }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : index === 2 ? '#10b981' : '#f59e0b'
              }}
            ></motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                delay: index * 0.3 + 0.2
              }}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? '#60a5fa' : index === 1 ? '#a78bfa' : index === 2 ? '#34d399' : '#fbbf24'
              }}
            ></motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity,
                delay: index * 0.3 + 0.4
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? '#93c5fd' : index === 1 ? '#c4b5fd' : index === 2 ? '#6ee7b7' : '#fcd34d'
              }}
            ></motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* メンバーリスト */}
      <div style={{ padding: '1.5rem' }}>
        <div 
          onClick={toggleMembers}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.3s ease',
            marginBottom: '1rem',
            backgroundColor: 'rgba(55, 65, 81, 0.3)',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
          className="team-header-toggle"
        >
          <h3 style={{
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            fontWeight: 600,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          }}>
            <FaLaptopCode style={{ marginRight: '0.5rem', color: '#60a5fa' }} />
            <span>チームメンバー</span>
            <motion.span
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              style={{ 
                marginLeft: '0.75rem', 
                fontSize: '0.875rem', 
                color: '#93c5fd',
                fontWeight: 'normal'
              }}
            >
              {showMembers ? '（閉じる）' : '（クリックして表示）'}
            </motion.span>
          </h3>
          <motion.div
            animate={{ rotate: showMembers ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.3)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(59, 130, 246, 0.5)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
        
        <motion.div 
          className="team-members-grid"
          initial={false}
          animate={{ 
            height: showMembers ? 'auto' : 0,
            opacity: showMembers ? 1 : 0
          }}
          transition={{ 
            height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
            opacity: { duration: 0.3, delay: showMembers ? 0.1 : 0 }
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gap: '1rem',
            overflow: 'hidden'
          }}
        >
          {team.members.map((member, memberIndex) => (
            <motion.div
              key={member.id}
              className="member-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: showMembers ? 1 : 0, 
                scale: showMembers ? 1 : 0.9,
                y: showMembers ? 0 : 20
              }}
              transition={{ 
                delay: memberIndex * 0.05,
                duration: 0.3
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => onMemberClick(member)}
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                backdropFilter: 'blur(4px)',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <h4 style={{ color: 'white', fontWeight: 500, marginBottom: '0.25rem' }}>{member.name}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#93c5fd' }}>{member.role}</p>
              
              {member.comment && member.comment.trim() !== '' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{ 
                    marginTop: '0.75rem',
                    borderLeft: '2px solid rgba(96, 165, 250, 0.7)',
                    paddingLeft: '0.75rem',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: -1,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#60a5fa'
                    }}
                  />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.375rem', 
                    color: '#e2e8f0',
                    fontStyle: 'italic'
                  }}>
                    &quot;{member.comment}&quot;
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  useEffect(() => {
    
    // メディアクエリのスタイルを追加
    const style = document.createElement('style');
    style.innerHTML = `
      @media (min-width: 768px) {
        .team-members-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .evaluation-criteria-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) {
        .team-members-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .evaluation-criteria-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      .member-card:hover {
        border-color: rgba(59, 130, 246, 0.5);
      }
      .team-header-toggle {
        position: relative;
        overflow: hidden;
      }
      .team-header-toggle:hover {
        background-color: rgba(55, 65, 81, 0.5) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .team-header-toggle:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(to right, #3b82f6, #8b5cf6);
        transition: opacity 0.3s ease;
        opacity: 0.7;
      }
      .team-header-toggle:hover:before {
        opacity: 1;
      }
      .team-header-toggle:active {
        transform: translateY(0);
      }
      
      /* ロゴのグロウエフェクト */
      @keyframes logoGlow {
        0% {
          filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));
        }
        50% {
          filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.9)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.5));
        }
        100% {
          filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));
        }
      }
      
      .logo-glow {
        animation: logoGlow 3s ease-in-out infinite;
      }
      
      /* メタリックエフェクト */
      .logo-container {
        position: relative;
      }
      
      .logo-container::before {
        content: '';
        position: absolute;
        top: -10%;
        left: -10%;
        right: -10%;
        bottom: -10%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transform: rotate(25deg);
        pointer-events: none;
        z-index: 2;
        animation: metalShine 6s ease-in-out infinite;
      }
      
      @keyframes metalShine {
        0% {
          opacity: 0;
          transform: translate(-100%, -100%) rotate(25deg);
        }
        10%, 100% {
          opacity: 0;
        }
        50% {
          opacity: 0.5;
          transform: translate(100%, 100%) rotate(25deg);
        }
      }
    `;
    document.head.appendChild(style);
    
    // ESCキーでモーダルを閉じる
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.head.removeChild(style);
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  
  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };
  
  const handleCloseModal = () => {
    setSelectedMember(null);
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030712',
      color: 'white'
    }}>
      {/* ヘッダー */}
      <header style={{
        borderBottom: '1px solid #1f2937',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            color: '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            <FaArrowLeft size={16} />
            <span>トップページに戻る</span>
          </Link>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>ハッカソンメンバー</div>
        </div>
      </header>

      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '1rem',
        paddingTop: '0',
        paddingBottom: '3rem'
      }}>
        {/* ロゴヒーローセクション */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ 
            textAlign: 'center', 
            marginBottom: '3rem',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            borderRadius: '1rem',
            padding: '3rem 1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            marginTop: '2rem'
          }}
        >
          {/* メタリックな装飾要素 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #f59e0b)',
          }}></div>
          
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '-5%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
            filter: 'blur(40px)',
            borderRadius: '50%',
            transform: 'rotate(-15deg)',
            zIndex: 0
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '-5%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0) 70%)',
            filter: 'blur(40px)',
            borderRadius: '50%',
            transform: 'rotate(15deg)',
            zIndex: 0
          }}></div>
          
          {/* ロゴ */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.2, 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            style={{
              position: 'relative',
              zIndex: 1,
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div style={{
              position: 'relative',
              width: '440px', 
              height: '280px',
              filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))',
              transform: 'perspective(1000px) rotateX(5deg)',
            }}
            className="logo-container"
            >
              <Image
                src="/images/logo.jpg"
                alt="ハッカソンロゴ"
                fill
                style={{ 
                  objectFit: 'contain',
                }}
                className="logo-glow"
              />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(2.25rem, 8vw, 3rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              background: 'linear-gradient(to right, #60a5fa, #c084fc, #f472b6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              position: 'relative',
              zIndex: 1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            ハッカソン参加メンバー
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
              color: '#d1d5db',
              maxWidth: '48rem',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            全28名・4チームがそれぞれの強みを活かして挑戦します！
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
              position: 'relative',
              zIndex: 1
            }}
          >
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 5px #3b82f6', '0 0 15px #3b82f6', '0 0 5px #3b82f6'] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#3b82f6' }}
            ></motion.div>
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 5px #8b5cf6', '0 0 15px #8b5cf6', '0 0 5px #8b5cf6'] 
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.3
              }}
              style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#8b5cf6' }}
            ></motion.div>
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 5px #ec4899', '0 0 15px #ec4899', '0 0 5px #ec4899'] 
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.6
              }}
              style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#ec4899' }}
            ></motion.div>
          </motion.div>
        </motion.div>
        
        {/* チーム一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {teams.map((team, index) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              index={index}
              onMemberClick={handleMemberClick}
            />
          ))}
        </div>
      </main>
      
      {/* フッター */}
      <footer style={{
        padding: '3rem 0',
        textAlign: 'center',
        borderTop: '1px solid #1f2937'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <p style={{ color: '#9ca3af' }}>&copy; 2025 社内ハッカソン運営チーム</p>
        </div>
      </footer>
      
      {/* 審査項目と審査基準セクション */}
      <section style={{
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #1f2937',
        padding: '4rem 0'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.875rem, 5vw, 2.25rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              background: 'linear-gradient(to right, #60a5fa, #c084fc)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              審査項目と審査基準
            </h2>
            <p style={{ color: '#d1d5db', maxWidth: '48rem', margin: '0 auto' }}>
              全6項目、各5点満点（合計30点満点）で評価します
            </p>
          </motion.div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            position: 'relative'
          }}
          className="evaluation-criteria-grid"
          >
            {/* 項目1: 企画力 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #334155',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to right, #3b82f6, #60a5fa)'
              }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    marginRight: '0.75rem'
                  }}>1</span>
                  企画力
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>着眼点のユニークさ、視点の新しさ</li>
                    <li style={{ marginBottom: '0.5rem' }}>解決すべき課題や狙いの明確さ</li>
                    <li>社会性・共感性のあるテーマか</li>
                  </ul>
                </div>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid rgba(51, 65, 85, 0.5)'
                }}>
                  <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>スコア目安</h4>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.25rem' }}>5：着想・構想が非常に優れており、意義も明確</li>
                    <li style={{ marginBottom: '0.25rem' }}>4：よく練られた企画で、ユニークさもある</li>
                    <li style={{ marginBottom: '0.25rem' }}>3：筋は通っているがやや一般的</li>
                    <li style={{ marginBottom: '0.25rem' }}>2：新しさや具体性に欠ける</li>
                    <li>1：意図や意義が不明瞭</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* 項目2: 技術力 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #334155',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to right, #8b5cf6, #a78bfa)'
              }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    marginRight: '0.75rem'
                  }}>2</span>
                  技術力
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>実装の難易度や工夫</li>
                    <li style={{ marginBottom: '0.5rem' }}>技術スタックの挑戦性</li>
                    <li>コードや構造の設計力</li>
                  </ul>
                </div>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid rgba(51, 65, 85, 0.5)'
                }}>
                  <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>スコア目安</h4>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.25rem' }}>5：高度な技術と工夫、構造も洗練</li>
                    <li style={{ marginBottom: '0.25rem' }}>4：応用的な技術と丁寧な実装</li>
                    <li style={{ marginBottom: '0.25rem' }}>3：標準的な構成で安定</li>
                    <li style={{ marginBottom: '0.25rem' }}>2：簡易実装、やや物足りない</li>
                    <li>1：テンプレート中心、独自性に乏しい</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* 項目3: 完成度 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #334155',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to right, #10b981, #34d399)'
              }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    marginRight: '0.75rem'
                  }}>3</span>
                  完成度
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>想定機能が実装されているか</li>
                    <li style={{ marginBottom: '0.5rem' }}>デモ可能な状態か</li>
                    <li>バグやエラーの有無</li>
                  </ul>
                </div>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid rgba(51, 65, 85, 0.5)'
                }}>
                  <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>スコア目安</h4>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.25rem' }}>5：安定して動作、仕上がりも高水準</li>
                    <li style={{ marginBottom: '0.25rem' }}>4：十分に使える状態、丁寧に作られている</li>
                    <li style={{ marginBottom: '0.25rem' }}>3：基本機能あり、多少荒削り</li>
                    <li style={{ marginBottom: '0.25rem' }}>2：動作不安定、機能未完</li>
                    <li>1：完成に至らず、動作困難</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* 項目4: 体験・デザイン */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #334155',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to right, #f59e0b, #fbbf24)'
              }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    marginRight: '0.75rem'
                  }}>4</span>
                  体験・デザイン
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>操作のしやすさ、直感性</li>
                    <li style={{ marginBottom: '0.5rem' }}>見た目・構成のわかりやすさ</li>
                    <li>ユーザーを意識した設計</li>
                  </ul>
                </div>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid rgba(51, 65, 85, 0.5)'
                }}>
                  <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>スコア目安</h4>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.25rem' }}>5：AI活用が非常に的確で、プロダクト価値を明確に高めている</li>
                    <li style={{ marginBottom: '0.25rem' }}>4：活用意図が明確で、実装にも工夫が見られる</li>
                    <li style={{ marginBottom: '0.25rem' }}>3：効果的に活用されているが、目新しさや工夫はやや控えめ</li>
                    <li style={{ marginBottom: '0.25rem' }}>2：AIを使っているが、目的や活かし方に曖昧さがある</li>
                    <li>1：AI活用なし、または使用しているが効果や意図が読み取れない</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* 項目5: プロセス・取り組み姿勢 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #334155',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to right, #ec4899, #f472b6)'
              }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    border: '1px solid rgba(236, 72, 153, 0.5)',
                    marginRight: '0.75rem'
                  }}>5</span>
                  プロセス・取り組み姿勢
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>チーム内の連携・役割分担</li>
                    <li style={{ marginBottom: '0.5rem' }}>中間発表やフィードバックの活用</li>
                    <li style={{ marginBottom: '0.5rem' }}>限られた期間の中での工夫と継続的な進行</li>
                    <li>発表時の時間配分・構成（限られた時間内で伝える工夫）</li>
                  </ul>
                </div>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid rgba(51, 65, 85, 0.5)'
                }}>
                  <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>スコア目安</h4>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.25rem' }}>5：進め方に一貫性があり、発表も時間内でわかりやすく構成されていた</li>
                    <li style={{ marginBottom: '0.25rem' }}>4：連携や改善の姿勢が見え、発表も概ね適切な時間配分</li>
                    <li style={{ marginBottom: '0.25rem' }}>3：特に問題なく進行・発表されていた</li>
                    <li style={{ marginBottom: '0.25rem' }}>2：連携や発表構成にやや粗さが見える</li>
                    <li>1：プロセスが曖昧、発表も時間配分に問題あり</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* 項目6: AI活用 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #334155',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to right, #06b6d4, #22d3ee)'
              }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid rgba(6, 182, 212, 0.5)',
                    marginRight: '0.75rem'
                  }}>6</span>
                  AI活用
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>プロダクトにAI技術をどう組み込んだか</li>
                    <li style={{ marginBottom: '0.5rem' }}>AI活用が課題解決や体験価値にどう貢献しているか</li>
                    <li>モデル選定やプロンプト設計に工夫があるか</li>
                  </ul>
                </div>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid rgba(51, 65, 85, 0.5)'
                }}>
                  <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>スコア目安</h4>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.25rem' }}>5：AI活用が非常に的確で、プロダクト価値を明確に高めている</li>
                    <li style={{ marginBottom: '0.25rem' }}>4：活用意図が明確で、実装にも工夫が見られる</li>
                    <li style={{ marginBottom: '0.25rem' }}>3：効果的に活用されているが、目新しさや工夫はやや控えめ</li>
                    <li style={{ marginBottom: '0.25rem' }}>2：AIを使っているが、目的や活かし方に曖昧さがある</li>
                    <li>1：AI活用なし、または使用しているが効果や意図が読み取れない</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* メンバー詳細モーダル */}
      {selectedMember && (
        <MemberDetailModal 
          member={selectedMember} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
} 