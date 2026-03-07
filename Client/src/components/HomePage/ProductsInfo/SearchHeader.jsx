import { Link } from "react-router-dom";
const SearchHeader = ({ category, subCate }) => {
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


    </>
  );
};

export default SearchHeader;
