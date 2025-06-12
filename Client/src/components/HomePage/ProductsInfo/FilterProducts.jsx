import { useState } from "react";

const FilterProducts = ({ filters, onFilterChange, filterSubCategory, filterUnit }) => {
  const FilterSection = ({ title, options, selected, onChange, type, showMore = true }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const handleCheckboxChange = (optionId) => {
      const newSelected = selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId];
      onChange(newSelected);
    };

    const displayOptions = showMore && !showAll ? options.slice(0, 4) : options;

    return (
      <div className="filter-section">
        <button className="filter-section__header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3 className="filter-section__title">{title}</h3>
          <span className="filter-section__arrow" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▼
          </span>
        </button>
        {isExpanded && (
          <div>
            {displayOptions.map((option) => (
              <label key={option.id} className="filter-section__option">
                <input type="checkbox" checked={selected.includes(option.id)} onChange={() => handleCheckboxChange(option.id)} className="filter-section__checkbox" />
                {option.label}
              </label>
            ))}

            {showMore && options.length > 4 && (
              <button className="filter-section__button" onClick={() => setShowAll(!showAll)}>
                {showAll ? "See less" : "See more"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Sidebar data
  const availabilityOptions = [
    { id: "in-stock", label: "Còn Hàng" },
    { id: "low-stock", label: "Sắp Hết Hàng" },
    { id: "out-of-stock", label: "Hết Hàng" },
  ];

  const saleOptions = [
    { id: "clearance", label: "Giá Siêu Ưu Đãi" },
    { id: "voucher", label: "Mua Với Voucher" },
    { id: "regular", label: "Mua Với Giá Gốc" },
  ];

  const UnitOptions = filterUnit.map((item) => ({ id: item, label: item }));

  const categoryOptions = filterSubCategory.map((item) => ({
    id: item,
    label: item,
  }));
  return (
    <aside className="sidebar">
      <FilterSection title="Tình trạng" options={availabilityOptions} selected={filters.availability} onChange={(value) => onFilterChange("availability", value)} type="checkbox" />
      <FilterSection title="Ưu Đãi" options={saleOptions} selected={filters.sale} onChange={(value) => onFilterChange("sale", value)} type="" />

      <FilterSection title="Đơn Vị Tính" options={UnitOptions} selected={filters.unit} onChange={(value) => onFilterChange("unit", value)} type="checkbox" showMore={true} />

      <FilterSection title="Loại Sản Phẩm" options={categoryOptions} selected={filters.category} onChange={(value) => onFilterChange("category", value)} type="checkbox" showMore={true} />

      <div className="sidebar__filter-section">
        <h3 className="sidebar__title">Giá</h3>
        <div className="sidebar__price-range">
          <div>
            <input type="range" min="0" max="1000000" step={1000} value={filters.priceRange[0]} onChange={(e) => onFilterChange("priceRange", [Number.parseInt(e.target.value), filters.priceRange[1]])} className="sidebar__slider" />
            <input type="range" min="0" max="1000000" step={1000} value={filters.priceRange[1]} onChange={(e) => onFilterChange("priceRange", [filters.priceRange[0], Number.parseInt(e.target.value)])} className="sidebar__slider" />
          </div>
          <div className="sidebar__labels">
            <span>{filters.priceRange[0].toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
            <span>{filters.priceRange[1].toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterProducts;
