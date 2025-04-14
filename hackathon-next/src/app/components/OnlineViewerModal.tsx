'use client';

import { useState, useEffect } from 'react';
import { FaSpinner, FaTimes, FaCheck, FaUserAlt, FaBuilding, FaComment } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

interface OnlineViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  department: string;
  name: string;
  notes: string;
}

export default function OnlineViewerModal({ isOpen, onClose }: OnlineViewerModalProps) {
  const [formData, setFormData] = useState<FormData>({
    department: '',
    name: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');

  // セッションIDの取得または生成
  useEffect(() => {
    let id = localStorage.getItem('online_viewer_session_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('online_viewer_session_id', id);
    }
    setSessionId(id);

    // 既存のデータの取得
    const fetchViewerData = async () => {
      try {
        const response = await fetch('/api/online-viewers', {
          headers: {
            'x-session-id': id
          }
        });

        const data = await response.json();

        if (data.exists && data.data) {
          setFormData({
            department: data.data.department || '',
            name: data.data.name || '',
            notes: data.data.notes || ''
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error('オンライン視聴者データの取得に失敗しました:', error);
      }
    };

    if (isOpen) {
      fetchViewerData();
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    submitForm();
  };

  // 実際のフォーム送信処理
  const submitForm = async () => {
    setIsLoading(true);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/online-viewers', {
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
      console.error('オンライン視聴登録の送信に失敗しました:', error);
      setErrors({ submit: '送信中にエラーが発生しました。もう一度お試しください。' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>

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
            オンライン視聴登録フォーム
          </h2>
          {!isSubmitted && (
            <p className="text-gray-300">
              以下のフォームに必要事項を入力し、オンライン視聴の登録を完了してください
            </p>
          )}
        </div>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <FaCheck className="text-green-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">登録完了！</h3>
            <p className="text-gray-300 text-center">
              オンライン視聴の登録が完了しました。当日の配信をお楽しみに！
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6">
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
                className={`w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border ${errors.department ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="例: デザイン・システム部"
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
                className={`w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border ${errors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="例: 茶木 太郎"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* その他 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaComment className="mr-2 text-blue-400" />
                その他（任意）
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="オンライン参加に関する質問や要望などがあればご記入ください"
              ></textarea>
            </div>

            {/* エラーメッセージ */}
            {errors.submit && (
              <div className="p-3 bg-red-900/40 border border-red-800 rounded-lg">
                <p className="text-red-300 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>送信中...</span>
                  </>
                ) : (
                  <span>登録する</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 