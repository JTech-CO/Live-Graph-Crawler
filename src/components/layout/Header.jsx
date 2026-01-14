/**
 * Header Component
 * 로고(125px) 및 사이트 타이틀(24px)
 */
const Header = () => {
  return (
    <header className="bg-white text-center py-8">
      <div className="mb-4">
        {/* TODO: 로고 이미지 추가 */}
        <div className="w-[125px] h-[125px] mx-auto bg-gray-200 rounded"></div>
      </div>
      <h1 className="text-site-title font-bold text-text-main">
        Live Graph Crawler
      </h1>
    </header>
  );
};

export default Header;
