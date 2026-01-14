/**
 * 신뢰도 계산 유틸리티
 * 도메인 신뢰도를 계산하여 등급을 반환
 */

const HIGH_RELIABILITY_DOMAINS = [
  'statista.com',
  'arxiv.org',
  'nature.com',
  'gartner.com',
  'mckinsey.com'
];

/**
 * 도메인 신뢰도 계산
 * @param {number} confidence - Gemini 검증 신뢰도 (0.0-1.0)
 * @param {string} domain - 도메인 이름
 * @returns {{level: string, score: number}} 신뢰도 정보
 */
export function calculateReliability(confidence, domain) {
  const domainLower = (domain || '').toLowerCase();
  let baseScore = confidence;

  // 도메인 가중치 적용
  if (HIGH_RELIABILITY_DOMAINS.some(highDomain => domainLower.includes(highDomain))) {
    baseScore += 0.2;
  }

  // 점수를 1.0으로 제한
  baseScore = Math.min(baseScore, 1.0);

  let level;
  if (baseScore >= 0.8) {
    level = 'High';
  } else if (baseScore >= 0.5) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  return {
    level,
    score: baseScore
  };
}
