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
          Living room
        </Link>
        <span className="breadcrumb__separator">/</span>
        <span className="breadcrumb__current">Armchair</span>
      </nav>

      <div className="search-header">
        <div className="search-header__info">
          <button className="search-header__button">Hide filters ▼</button>
          <span className="search-header__text">Searched for 'Armchair'</span>
        </div>
        <div className="search-header__controls">
          <span className="search-header__count">{resultCount} results</span>
          <select className="search-header__select" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="recommended">Recommended ▼</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default SearchHeader;
