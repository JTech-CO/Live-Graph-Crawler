/**
 * ResultCard Component
 * 검색 결과 카드 (.entry 스타일 적용)
 */
const ResultCard = ({ result }) => {
  const { title, url, source_name, snippet, reliability } = result;

  const getReliabilityColor = (reliability) => {
    switch (reliability) {
      case 'High':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <article className="entry">
      <h2 className="entry-title">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-link hover:text-link-hover"
        >
          {title}
        </a>
      </h2>
      
      <div className="entry-content">
        <p>{snippet}</p>
      </div>
      
      <div className="entry-meta">
        <span className="font-semibold">{source_name}</span>
        <span className="mx-2">•</span>
        <span className={getReliabilityColor(reliability)}>
          {reliability} Reliability
        </span>
      </div>
    </article>
  );
};

export default ResultCard;
