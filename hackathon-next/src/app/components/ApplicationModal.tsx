'use client';

import { useState, useEffect } from 'react';
import { FaSpinner, FaTimes, FaCheck, FaUserAlt, FaBuilding, FaCode, FaTools, FaComment } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  department: string;
  name: string;
  languages: string;
  tools: string;
  notes: string;
}

export default function ApplicationModal({ isOpen, onClose }: ApplicationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    department: '',
    name: '',
    languages: '',
    tools: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  // セッションIDの取得または生成
  useEffect(() => {
    let id = localStorage.getItem('application_session_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('application_session_id', id);
    }
    setSessionId(id);
    
    // 既存のアプリケーションデータの取得
    const fetchApplicationData = async () => {
      try {
        const response = await fetch('/api/applicants', {
          headers: {
            'x-session-id': id
          }
        });
        
        const data = await response.json();
        
        if (data.exists && data.data) {
          setFormData({
            department: data.data.department || '',
            name: data.data.name || '',
            languages: data.data.languages || '',
            tools: data.data.tools || '',
            notes: data.data.notes || ''
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error('応募データの取得に失敗しました:', error);
      }
    };
    
    if (isOpen) {
      fetchApplicationData();
    }
  }, [isOpen]);
  
  // モーダルが閉じられたときにフォームをリセット
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setErrors({});
    }
  }, [isOpen]);
  
  // 入力フィールドの変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.department.trim()) {
      newErrors.department = '所属部署は必須です';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/applicants', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
        }, 2000);
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || '送信に失敗しました。もう一度お試しください。' });
      }
    } catch (error) {
      console.error('応募フォームの送信に失敗しました:', error);
      setErrors({ submit: '送信中にエラーが発生しました。もう一度お試しください。' });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* モーダルコンテンツ */}
      <div className="relative z-10 w-full max-w-2xl bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-6 mx-4 overflow-hidden transition-all transform">
        {/* モーダル上部のグラデーションバー */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        
        {/* 閉じるボタン */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-2">
            ハッカソン応募フォーム
          </h2>
          <p className="text-gray-300">
            以下のフォームに必要事項を入力し、応募を完了してください
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <FaCheck className="text-green-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">応募完了！</h3>
            <p className="text-gray-300 text-center">
              応募が正常に処理されました。ご参加ありがとうございます！
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 所属部署 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaBuilding className="mr-2 text-blue-400" />
                所属部署 <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border ${
                  errors.department ? 'border-red-500' : 'border-gray-700'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="例: 開発部"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-500">{errors.department}</p>
              )}
            </div>
            
            {/* 氏名 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaUserAlt className="mr-2 text-blue-400" />
                氏名 <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="例: 山田 太郎"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* 使用してみたい言語 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaCode className="mr-2 text-blue-400" />
                使用してみたい言語
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="例: TypeScript, Python, Go"
              />
            </div>
            
            {/* 使用したいツール */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaTools className="mr-2 text-blue-400" />
                使用したいツール
              </label>
              <input
                type="text"
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="例: React, Docker, Firebase"
              />
            </div>
            
            {/* その他 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaComment className="mr-2 text-blue-400" />
                その他
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="その他伝えたいことがあればご記入ください"
              />
            </div>
            
            {errors.submit && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-400">{errors.submit}</p>
              </div>
            )}
            
            {/* 送信ボタン */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    送信中...
                  </span>
                ) : isEditing ? (
                  '応募内容を更新する'
                ) : (
                  '応募する'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 