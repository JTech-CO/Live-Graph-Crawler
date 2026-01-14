import axios from 'axios';
import { apiKeys } from '../utils/apiKeys';

const BASE_URL = 'https://www.googleapis.com/customsearch/v1';

/**
 * Google Custom Search API 서비스
 */
export const searchService = {
  /**
   * Google Custom Search API를 사용하여 검색 수행
   * @param {string} query - 검색 쿼리
   * @param {number} numResults - 반환할 결과 수 (기본값: 10)
   * @param {string|null} fileType - 파일 타입 필터 (예: "pdf")
   * @param {string|null} siteFilter - 사이트 필터 (예: "arxiv.org")
   * @returns {Promise<Array>} 검색 결과 리스트
   */
  async search(query, numResults = 10, fileType = null, siteFilter = null) {
    const API_KEY = apiKeys.getGoogleSearchApiKey() || import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
    const ENGINE_ID = apiKeys.getGoogleSearchEngineId() || import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

    if (!API_KEY || !ENGINE_ID) {
      throw new Error('Google Search API 키가 설정되지 않았습니다. API 키를 입력해주세요.');
    }

    let searchQuery = query;
    if (fileType) {
      searchQuery += ` filetype:${fileType}`;
    }
    if (siteFilter) {
      searchQuery += ` site:${siteFilter}`;
    }

    const params = {
      key: API_KEY,
      cx: ENGINE_ID,
      q: searchQuery,
      num: Math.min(numResults, 10) // Google API는 최대 10개
    };

    try {
      const response = await axios.get(BASE_URL, { params });
      const data = response.data;

      const results = [];
      if (data.items) {
        for (const item of data.items) {
          results.push({
            title: item.title || '',
            url: item.link || '',
            snippet: item.snippet || '',
            display_link: item.displayLink || ''
          });
        }
      }

      return results;
    } catch (error) {
      if (error.response) {
        // HTTP 에러 (4xx, 5xx)
        console.error('Search API HTTP error:', error.response.status, error.response.data);
        throw new Error(`검색 API 오류: ${error.response.status}`);
      } else if (error.request) {
        // 네트워크 에러
        console.error('Search API request error:', error.message);
        throw new Error('네트워크 연결에 실패했습니다.');
      } else {
        // 기타 에러
        console.error('Search error:', error.message);
        throw new Error('검색 중 오류가 발생했습니다.');
      }
    }
  }
};
