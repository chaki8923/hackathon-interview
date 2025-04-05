'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSpinner, FaTimes, FaCheck, FaUserAlt, FaBuilding, FaCode, FaTools, FaComment, FaPlus, FaStar, FaLock } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  openPaymentModal?: () => void;
}

interface FormData {
  department: string;
  name: string;
  languages: string[];
  tools: string[];
  notes: string;
}

export default function ApplicationModal({ isOpen, onClose, openPaymentModal }: ApplicationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    department: '',
    name: '',
    languages: [],
    tools: [],
    notes: ''
  });
  
  // Language and tools suggestions
  const languageSuggestions = [
    'JavaScript', 'TypeScript', 'Python', 'Laravel','RubyonRails','React','Next.js','Lisp','Java', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 
    'Ruby', 'C++', 'Dart', 'Scala', 'Haskell', 'Clojure', 'Elixir', 'F#'
  ];

  const toolSuggestions = [
    'Figma','Photoshop','Illustrator','Windsurf','VSCode','Cursor','Excel','Docker', 'Kubernetes', 'AWS', 'Firebase', 'GraphQL', 'TensorFlow', 'PyTorch',
    'Git', 'GitHub Actions', 'CircleCI', 'Jenkins', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'
  ];

  // Refs for detecting clicks outside of suggestion boxes
  const languageInputRef = useRef<HTMLDivElement>(null);
  const toolsInputRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  // UI state for suggestions
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);
  const [showToolSuggestions, setShowToolSuggestions] = useState(false);
  const [languageQuery, setLanguageQuery] = useState('');
  const [toolQuery, setToolQuery] = useState('');
  
  // Filter suggestions based on query
  const filteredLanguageSuggestions = languageSuggestions.filter(lang => 
    lang.toLowerCase().includes(languageQuery.toLowerCase()) && 
    !formData.languages.includes(lang)
  );
  
  const filteredToolSuggestions = toolSuggestions.filter(tool => 
    tool.toLowerCase().includes(toolQuery.toLowerCase()) && 
    !formData.tools.includes(tool)
  );

  // Handle clicks outside of suggestion boxes
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageInputRef.current && !languageInputRef.current.contains(event.target as Node)) {
        setShowLanguageSuggestions(false);
      }
      if (toolsInputRef.current && !toolsInputRef.current.contains(event.target as Node)) {
        setShowToolSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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
            languages: data.data.languages ? data.data.languages.split(',').map((l: string) => l.trim()) : [],
            tools: data.data.tools ? data.data.tools.split(',').map((t: string) => t.trim()) : [],
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
      setLanguageQuery('');
      setToolQuery('');
      setShowLanguageSuggestions(false);
      setShowToolSuggestions(false);
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

  // Handle language and tool input changes
  const handleLanguageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguageQuery(e.target.value);
  };

  const handleToolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolQuery(e.target.value);
  };

  // Add a language tag
  const addLanguage = (language: string) => {
    if (!formData.languages.includes(language) && language.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
      setLanguageQuery('');
    }
  };

  // Add a tool tag
  const addTool = (tool: string) => {
    if (!formData.tools.includes(tool) && tool.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, tool]
      }));
      setToolQuery('');
    }
  };

  // Remove a language tag
  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  // Remove a tool tag
  const removeTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t !== tool)
    }));
  };

  // Add custom language when Enter is pressed
  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && languageQuery.trim() !== '') {
      e.preventDefault();
      if (filteredLanguageSuggestions.length > 0) {
        addLanguage(filteredLanguageSuggestions[0]);
      } else {
        addLanguage(languageQuery);
      }
    }
  };

  // Add custom tool when Enter is pressed
  const handleToolKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && toolQuery.trim() !== '') {
      e.preventDefault();
      if (filteredToolSuggestions.length > 0) {
        addTool(filteredToolSuggestions[0]);
      } else {
        addTool(toolQuery);
      }
    }
  };
  
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [showPremiumWarning, setShowPremiumWarning] = useState<boolean>(false);
  
  // Check premium status on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isPremium = localStorage.getItem('premium_user') === 'true';
      setIsPremiumUser(isPremium);
    }
  }, [isOpen]);
  
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

  // フォーム送信前のプレミアムチェック
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // If user is not premium, show warning modal
    if (!isPremiumUser) {
      setShowPremiumWarning(true);
      return;
    }
    
    // Otherwise proceed with normal submission
    submitForm();
  };
  
  // 実際のフォーム送信処理
  const submitForm = async () => {
    setIsLoading(true);
    
    // Convert arrays to comma-separated strings for API
    const submissionData = {
      ...formData,
      languages: formData.languages.join(', '),
      tools: formData.tools.join(', ')
    };
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/applicants', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(submissionData)
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
  
  // Handle subscription flow
  const handleSubscribe = () => {
    setShowPremiumWarning(false);
    if (openPaymentModal) {
      openPaymentModal();
    }
  };
  
  // Proceed without premium
  const handleProceedWithoutPremium = () => {
    setShowPremiumWarning(false);
    submitForm();
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
                className={`w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border ${
                  errors.department ? 'border-red-500' : 'border-gray-700'
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
                className={`w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="例: 新井 俊也（とっしー）"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* 使用してみたい言語 */}
            <div ref={languageInputRef}>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaCode className="mr-2 text-blue-400" />
                使用してみたい技術
              </label>
              
              {/* Selected language tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.languages.map((language, index) => (
                  <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900/50 text-blue-300 border border-blue-800">
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="ml-2 text-blue-400 hover:text-white"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Language input field */}
              <div className="relative">
                <input
                  type="text"
                  value={languageQuery}
                  onChange={handleLanguageInputChange}
                  onFocus={() => setShowLanguageSuggestions(true)}
                  onKeyDown={handleLanguageKeyDown}
                  className="w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="言語を入力または選択してください"
                />
                
                {/* Add button for custom entry */}
                {languageQuery.trim() !== '' && (
                  <button
                    type="button"
                    onClick={() => addLanguage(languageQuery)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                  >
                    <FaPlus size={14} />
                  </button>
                )}
                
                {/* Suggestion dropdown */}
                {showLanguageSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredLanguageSuggestions.length > 0 ? (
                      filteredLanguageSuggestions.map((language, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center"
                          onClick={() => addLanguage(language)}
                        >
                          <FaPlus size={10} className="mr-2 text-blue-400" />
                          {language}
                        </div>
                      ))
                    ) : (
                      <div className="">
                        
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* 使用したいツール */}
            <div ref={toolsInputRef}>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <FaTools className="mr-2 text-blue-400" />
                使用したいツール
              </label>
              
              {/* Selected tool tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tools.map((tool, index) => (
                  <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-900/50 text-purple-300 border border-purple-800">
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      className="ml-2 text-purple-400 hover:text-white"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Tool input field */}
              <div className="relative">
                <input
                  type="text"
                  value={toolQuery}
                  onChange={handleToolInputChange}
                  onFocus={() => setShowToolSuggestions(true)}
                  onKeyDown={handleToolKeyDown}
                  className="w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="ツールを入力または選択してください"
                />
                
                {/* Add button for custom entry */}
                {toolQuery.trim() !== '' && (
                  <button
                    type="button"
                    onClick={() => addTool(toolQuery)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    <FaPlus size={14} />
                  </button>
                )}
                
                {/* Suggestion dropdown */}
                {showToolSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredToolSuggestions.length > 0 ? (
                      filteredToolSuggestions.map((tool, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center"
                          onClick={() => addTool(tool)}
                        >
                          <FaPlus size={10} className="mr-2 text-purple-400" />
                          {tool}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 italic">
                        {toolQuery === '' ? 'ツールを入力して検索またはクリックして選択' : '該当するツールがありません'}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
      
      {/* Premium Warning Modal */}
      {showPremiumWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>
          
          <div className="relative z-[70] w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 mx-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
            
            {/* 閉じるボタン */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => setShowPremiumWarning(false)}
            >
              <FaTimes size={24} />
            </button>
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <FaStar className="text-yellow-400" size={32} />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">おっとっと！プレミアム課金はお済みですか？</h2>
              <p className="text-gray-300">
                プレミアム会員になると優先参加権とVIPテーブルでの閲覧が可能になります！
              </p>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                <FaLock size={14} />
                プレミアム特典
              </h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <span>ハッカソン優先参加権</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <span>発表5分延長権</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <span>VIPテーブルでの閲覧</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleSubscribe}
                className="py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaStar size={16} />
                課金する
              </button>
              
              <button
                onClick={handleProceedWithoutPremium}
                className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors"
              >
                課金せず応募する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 