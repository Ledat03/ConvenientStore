import { useState } from "react";

const FilterProducts = ({ filters, onFilterChange, filterData, subCate, onValueChange, fetchByFilter, setFilters }) => {

  const FilterSection = ({ title, options, selected, onChange, type, showMore = true }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const handleCheckboxChange = (optionId) => {
      const newSelected = selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId];
      onChange(newSelected);
    };
    const displayOptions = () => {
      if (options) return showMore && !showAll ? options.slice(0, 4) : options;
      return [];
    };
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
            {options.map((option) => (
              <label key={option.id} className="filter-section__option">
                <input type="checkbox" checked={selected.includes(option.id)} onChange={() => handleCheckboxChange(option.id)} className="filter-section__checkbox" />
                {option.label}
              </label>
            ))}

            {showMore && options.length > 4 && (
              <button className="filter-section__button" onClick={() => setShowAll(true)}>
                {showAll ? "See less" : "See more"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };


  const UnitOptions = filterData ? filterData.unit.map((item) => ({ id: item, label: item })) : []

  const BrandOptions = filterData ? filterData.brand.map((item) => ({ id: item, label: item })) : [];

  const categoryOptions = filterData ?
    filterData.subCategory.map((item) => ({ id: item, label: item, })) : []

  return (
    <>
      {filterData != null && (
        <aside className="sidebar">
          <FilterSection title="Đơn Vị Tính" options={UnitOptions} selected={filters.unit} onChange={(value) => onFilterChange("unit", value)} type="checkbox" showMore={true} />
          {subCate == null && <FilterSection title="Loại Sản Phẩm" options={categoryOptions} selected={filters.subCategory} onChange={(value) => onFilterChange("subCategory", value)} type="checkbox" showMore={true} />}
          <FilterSection title="Brand" options={BrandOptions} selected={filters.brand} onChange={(value) => onFilterChange("brand", value)} type="checkbox" />
          <div className="sidebar__filter-section">
            <h3 className="sidebar__title">Price</h3>
            <div className="sidebar__price-range">
              <div>
                <input type="number" value={filters.priceRange[0]} onChange={(e) => onValueChange("0", e.target.value)} className="sidebar__slider" min={0} max={1000000} placeholder="0" />
                <input type="number" value={filters.priceRange[1]} onChange={(e) => onValueChange("1", e.target.value)} className="sidebar__slider" min={0} max={1000000} placeholder="1000000" />
              </div>
            </div>
          </div>
          <div className="sidebar__ButtonGroup">
            <button className="sidebar__Button" onClick={() => {
              fetchByFilter(filters)
            }}>Apply</button>
            <button className="sidebar__Button" onClick={() => {
              const temp = {
                category: filters.category,
                subCate: filters.subCate,
                search: filters.search,
                promotion: filters.promotion,
                unit: [],
                subCategory: [],
                priceRange: ["", ""],
                brand: [],
                page: 0
              }
              fetchByFilter(temp);
              setFilters((prev) => ({
                ...prev,
                unit: [],
                subCategory: [],
                priceRange: ["", ""],
                brand: [],
                page: 0
              }))
            }}>Clear</button>
          </div>
        </aside>
      )}
    </>
  );
};

export default FilterProducts;
