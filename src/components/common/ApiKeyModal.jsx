import { useState, useEffect } from 'react';
import { apiKeys } from '../../utils/apiKeys';

/**
 * API 키 입력 모달 컴포넌트
 */
const ApiKeyModal = ({ isOpen, onClose, onSave }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [googleSearchKey, setGoogleSearchKey] = useState('');
  const [googleEngineId, setGoogleEngineId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(apiKeys.getGeminiApiKey());
      setGoogleSearchKey(apiKeys.getGoogleSearchApiKey());
      setGoogleEngineId(apiKeys.getGoogleSearchEngineId());
    }
  }, [isOpen]);

  const handleSave = () => {
    apiKeys.setGeminiApiKey(geminiKey.trim());
    apiKeys.setGoogleSearchApiKey(googleSearchKey.trim());
    apiKeys.setGoogleSearchEngineId(googleEngineId.trim());
    onSave();
    onClose();
  };

  const handleClear = () => {
    setGeminiKey('');
    setGoogleSearchKey('');
    setGoogleEngineId('');
    apiKeys.clearAllKeys();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-main">API 키 설정</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-main">
                Gemini API 키
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Gemini API 키를 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-text-muted mt-1">
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Google AI Studio에서 발급받기
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-text-main">
                Google Custom Search API 키
              </label>
              <input
                type="password"
                value={googleSearchKey}
                onChange={(e) => setGoogleSearchKey(e.target.value)}
                placeholder="Google Search API 키를 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-text-muted mt-1">
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Google Cloud Console에서 발급받기
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-text-main">
                Google Custom Search Engine ID
              </label>
              <input
                type="text"
                value={googleEngineId}
                onChange={(e) => setGoogleEngineId(e.target.value)}
                placeholder="Search Engine ID를 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-text-muted mt-1">
                <a 
                  href="https://programmablesearchengine.google.com/controlpanel/create" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  Custom Search Engine 생성하기
                </a>
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              <strong>보안 주의:</strong> API 키는 브라우저 로컬 스토리지에 저장되며, 
              이 컴퓨터에서만 사용됩니다. 공용 컴퓨터에서는 사용 후 삭제하세요.
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                저장
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-200 text-text-main rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                모두 삭제
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-text-main rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
