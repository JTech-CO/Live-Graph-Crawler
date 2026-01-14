/**
 * SearchBar Component
 * 검색바 (Enter 키 입력 시 검색)
 */
const SearchBar = ({ value, onChange, onSearch, placeholder }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleClick = () => {
    onSearch(value);
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-primary text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        검색
      </button>
    </div>
  );
};

export default SearchBar;
