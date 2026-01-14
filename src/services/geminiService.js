import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKeys } from '../utils/apiKeys';

/**
 * Gemini API 클라이언트 초기화 함수
 */
const getGeminiClient = () => {
  const apiKey = apiKeys.getGeminiApiKey() || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const getModelFlash = () => {
  const client = getGeminiClient();
  return client ? client.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;
};

const getModelPro = () => {
  const client = getGeminiClient();
  return client ? client.getGenerativeModel({ model: 'gemini-1.5-pro' }) : null;
};

/**
 * Gemini API 서비스
 * 쿼리 확장 및 결과 검증을 담당
 */
export const geminiService = {
  /**
   * 사용자 자연어 쿼리를 검색 엔진에 최적화된 키워드로 확장
   * @param {string} userQuery - 사용자 입력 자연어 쿼리
   * @returns {Promise<string>} 확장된 검색 쿼리
   */
  async expandQuery(userQuery) {
    const modelPro = getModelPro();
    if (!modelPro) {
      throw new Error('Gemini API 키가 설정되지 않았습니다. API 키를 입력해주세요.');
    }

    const prompt = `
다음 사용자 검색어를 검색 엔진에 최적화된 키워드로 확장해주세요.
그래프, 차트, 통계 데이터가 포함된 페이지를 찾기 위한 키워드를 포함하세요.

사용자 검색어: ${userQuery}

확장된 쿼리만 반환해주세요. 추가 설명 없이 쿼리만 반환하세요.
`;

    try {
      const result = await modelPro.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Query expansion error:', error);
      throw new Error('쿼리 확장 중 오류가 발생했습니다. API 키를 확인해주세요.');
    }
  },

  /**
   * 검색 결과가 그래프/차트를 포함할 가능성을 검증
   * @param {string} title - 페이지 제목
   * @param {string} snippet - 페이지 스니펫
   * @returns {Promise<{valid: boolean, confidence: number, reason: string}>} 검증 결과
   */
  async validateResult(title, snippet) {
    const modelFlash = getModelFlash();
    if (!modelFlash) {
      // API 키가 없으면 키워드 기반 휴리스틱 사용
      return this._fallbackValidation(title, snippet);
    }

    const prompt = `
다음 웹페이지 정보를 분석하여 그래프, 차트, 통계 데이터가 포함되어 있을 가능성을 평가해주세요.

제목: ${title}
스니펫: ${snippet}

다음 형식으로 JSON으로만 응답해주세요 (다른 텍스트 없이):
{
    "valid": true/false,
    "confidence": 0.0-1.0,
    "reason": "간단한 이유"
}
`;

    try {
      const result = await modelFlash.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            valid: parsed.valid === true || parsed.valid === 'true',
            confidence: parseFloat(parsed.confidence) || 0.5,
            reason: parsed.reason || 'No reason provided'
          };
        }
      } catch (parseError) {
        console.warn('JSON 파싱 실패, 휴리스틱 사용:', parseError);
      }

      return this._fallbackValidation(title, snippet);
    } catch (error) {
      console.error('Validation error:', error);
      return this._fallbackValidation(title, snippet);
    }
  },

  /**
   * 키워드 기반 휴리스틱 검증 (fallback)
   * @private
   */
  _fallbackValidation(title, snippet) {
    const textLower = (title + ' ' + snippet).toLowerCase();
    const graphKeywords = [
      'graph', 'chart', 'figure', 'statistic', 'data visualization',
      '그래프', '차트', '통계', '데이터'
    ];
    const hasKeyword = graphKeywords.some(keyword => textLower.includes(keyword));

    return {
      valid: hasKeyword,
      confidence: hasKeyword ? 0.6 : 0.3,
      reason: 'Keyword-based fallback validation'
    };
  }
};
