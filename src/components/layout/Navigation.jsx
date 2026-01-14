/**
 * Navigation Component
 * Primary Color 배경의 네비게이션 박스
 */
const Navigation = () => {
  return (
    <nav className="nav-box mt-4">
      <div className="flex justify-center space-x-4">
        <a href="#" className="text-white hover:underline">
          Home
        </a>
        <span className="text-white">|</span>
        <a href="#" className="text-white hover:underline">
          About
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
