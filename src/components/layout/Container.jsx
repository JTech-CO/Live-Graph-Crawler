/**
 * Container Component
 * 548px 고정 너비, 중앙 정렬, 모바일(568px 이하)에서 100% 너비
 */
const Container = ({ children }) => {
  return (
    <div className="w-full max-w-container mx-auto px-[30px] max-[568px]:px-5 max-[568px]:max-w-none">
      <div className="w-full max-w-content mx-auto max-[568px]:max-w-none">
        {children}
      </div>
    </div>
  );
};

export default Container;
