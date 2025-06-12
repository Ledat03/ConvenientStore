import { Link } from "react-router-dom";
const SearchHeader = ({ resultCount, sortBy, onSortChange }) => {
  return (
    <>
      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb__link">
          Home
        </Link>
        <span className="breadcrumb__separator">/</span>
        <Link to="/" className="breadcrumb__link">
          Các Loại Sữa
        </Link>
        <span className="breadcrumb__separator">/</span>
        <span className="breadcrumb__current">Sữa</span>
      </nav>

      <div className="search-header">
        <div className="search-header__info">
          <button className="search-header__button"></button>
          <span className="search-header__text"></span>
        </div>
        <div className="search-header__controls">
          <span className="search-header__count">{resultCount} Kết Quả</span>
          <select className="search-header__select" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="recommended">Sắp Xếp Theo</option>
            <option value="price-low">Giá: Từ thấp đến cao</option>
            <option value="price-high">Price: Từ cao đến thấp</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default SearchHeader;
