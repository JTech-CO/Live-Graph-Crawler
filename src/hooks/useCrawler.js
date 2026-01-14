import { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { searchService } from '../services/searchService';
import { calculateReliability } from '../utils/reliability';

/**
 * useCrawler Hook
 * 프론트엔드에서 직접 API를 호출하는 커스텀 훅
 */
export const useCrawler = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const { query, source_type = 'all', time_range = 'recent_1year' } = params;

      const expandedQuery = await geminiService.expandQuery(query);

      let fileType = null;
      let siteFilter = null;

      if (source_type === 'pdf') {
        fileType = 'pdf';
      } else if (source_type === 'arxiv') {
        siteFilter = 'arxiv.org';
      }

      const searchResults = await searchService.search(
        expandedQuery,
        10,
        fileType,
        siteFilter
      );

      const validatedResults = [];
      
      for (const result of searchResults) {
        const validation = await geminiService.validateResult(
          result.title,
          result.snippet
        );

        if (validation.valid) {
          const reliabilityInfo = calculateReliability(
            validation.confidence,
            result.display_link
          );

          validatedResults.push({
            title: result.title,
            url: result.url,
            source_name: result.display_link || 'Unknown',
            snippet: result.snippet,
            reliability: reliabilityInfo.level,
            reliability_score: reliabilityInfo.score
          });
        }
      }

      validatedResults.sort((a, b) => 
        (b.reliability_score || 0) - (a.reliability_score || 0)
      );

      setResults(validatedResults);
    } catch (err) {
      const errorMessage = err.message || '검색 중 오류가 발생했습니다.';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search
  };
};
