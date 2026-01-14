/**
 * Skeleton Component
 * 로딩 스켈레톤 UI
 */
const Skeleton = () => {
  return (
    <div className="entry animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
};

export default Skeleton;
