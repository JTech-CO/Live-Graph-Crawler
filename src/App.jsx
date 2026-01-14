import { useState, useEffect } from 'react';
import Container from './components/layout/Container';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import SearchBar from './components/common/SearchBar';
import ResultCard from './components/ui/ResultCard';
import Skeleton from './components/ui/Skeleton';
import ApiKeyModal from './components/common/ApiKeyModal';
import { useCrawler } from './hooks/useCrawler';
import { apiKeys } from './utils/apiKeys';

function App() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeysSet, setApiKeysSet] = useState(false);
  const { results, loading, error, search } = useCrawler();

  useEffect(() => {
    const keysSet = apiKeys.areAllKeysSet();
    setApiKeysSet(keysSet);
    if (!keysSet) {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    if (!apiKeys.areAllKeysSet()) {
      setShowApiKeyModal(true);
      return;
    }
    
    setHasSearched(true);
    await search({
      query: searchQuery,
      source_type: 'all',
      time_range: 'recent_1year'
    });
  };

  const handleApiKeySave = () => {
    setApiKeysSet(apiKeys.areAllKeysSet());
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
      />
      
      <Container>
        <Header />
        <Navigation />
        
        {!apiKeysSet && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-yellow-800">
                API 키가 설정되지 않았습니다. 검색을 사용하려면 API 키를 입력해주세요.
              </span>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 text-sm"
              >
                API 키 설정
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-muted">검색</span>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="text-xs text-link hover:underline"
            >
              API 키 설정
            </button>
          </div>
          <SearchBar 
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder="예: 2024년 반도체 시장 점유율 그래프"
          />
        </div>

        <div className="mt-8">
          {loading && (
            <div className="space-y-4">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          )}

          {error && (
            <div className="text-red-600 p-4 bg-red-50 rounded">
              {error}
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, index) => (
                <ResultCard key={index} result={result} />
              ))}
            </div>
          )}

          {!loading && !error && hasSearched && results.length === 0 && (
            <div className="text-center text-text-muted py-8">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default App;
