/**
 * API 키 관리 유틸리티
 * 로컬 스토리지를 사용하여 API 키를 저장하고 불러옵니다.
 */

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gemini_api_key',
  GOOGLE_SEARCH_API_KEY: 'google_search_api_key',
  GOOGLE_SEARCH_ENGINE_ID: 'google_search_engine_id'
};

/**
 * API 키 저장
 */
export const apiKeys = {
  /**
   * Gemini API 키 저장
   */
  setGeminiApiKey(key) {
    if (key) {
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    }
  },

  /**
   * Google Search API 키 저장
   */
  setGoogleSearchApiKey(key) {
    if (key) {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_SEARCH_API_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEYS.GOOGLE_SEARCH_API_KEY);
    }
  },

  /**
   * Google Search Engine ID 저장
   */
  setGoogleSearchEngineId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_SEARCH_ENGINE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.GOOGLE_SEARCH_ENGINE_ID);
    }
  },

  /**
   * Gemini API 키 가져오기
   */
  getGeminiApiKey() {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
  },

  /**
   * Google Search API 키 가져오기
   */
  getGoogleSearchApiKey() {
    return localStorage.getItem(STORAGE_KEYS.GOOGLE_SEARCH_API_KEY) || '';
  },

  /**
   * Google Search Engine ID 가져오기
   */
  getGoogleSearchEngineId() {
    return localStorage.getItem(STORAGE_KEYS.GOOGLE_SEARCH_ENGINE_ID) || '';
  },

  /**
   * 모든 API 키가 설정되어 있는지 확인
   */
  areAllKeysSet() {
    return !!(
      this.getGeminiApiKey() &&
      this.getGoogleSearchApiKey() &&
      this.getGoogleSearchEngineId()
    );
  },

  /**
   * 모든 API 키 삭제
   */
  clearAllKeys() {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    localStorage.removeItem(STORAGE_KEYS.GOOGLE_SEARCH_API_KEY);
    localStorage.removeItem(STORAGE_KEYS.GOOGLE_SEARCH_ENGINE_ID);
  }
};
