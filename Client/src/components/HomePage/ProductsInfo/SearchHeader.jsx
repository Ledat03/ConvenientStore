import { Link } from "react-router-dom";
const SearchHeader = ({ sortBy, product, category, subCate, setSortBy }) => {
  return (
    <>
      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb__link">
          Home
        </Link>
        <span className="breadcrumb__separator">/</span>
        <Link to={`/products?category=${category}`} className="breadcrumb__link">
          {category}
        </Link>
        {subCate != null && (
          <>
            <span className="breadcrumb__separator">/</span>
            <span className="breadcrumb__current">{subCate}</span>
          </>
        )}
      </nav>

      {
        (product = !null && (
          <div className="search-header">
            <div className="search-header__info">
              <button className="search-header__button"></button>
              <span className="search-header__text"></span>
            </div>
            <div className="search-header__controls">
              <span className="search-header__count">{product?.length} Kết Quả</span>
              <select className="search-header__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Sắp Xếp Theo</option>
                <option value="price-low">Giá: Từ thấp đến cao</option>
                <option value="price-high">Giá: Từ cao đến thấp</option>
              </select>
            </div>
          </div>
        ))
      }
    </>
  );
};

export default SearchHeader;
