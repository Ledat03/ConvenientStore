import { useState } from "react";

const FilterProducts = ({ filters, onFilterChange }) => {
  // FilterSection component logic
  const FilterSection = ({ title, options, selected, onChange, type, showMore = false }) => {
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
    { id: "in-stock", label: "In stock" },
    { id: "low-stock", label: "Low Stock" },
    { id: "out-of-stock", label: "Out of stock" },
  ];

  const saleOptions = [
    { id: "clearance", label: "Clearance sale" },
    { id: "voucher", label: "Voucher" },
    { id: "regular", label: "Regular price" },
  ];

  const materialOptions = [
    { id: "cotton", label: "Cotton" },
    { id: "upholstered", label: "Upholstered" },
    { id: "metal", label: "Metal" },
    { id: "wood", label: "Wood" },
  ];

  const categoryOptions = [
    { id: "chair", label: "Chair" },
    { id: "divan", label: "Divan" },
    { id: "sofa", label: "Sofa" },
    { id: "sectional", label: "Sectional" },
  ];

  const featureOptions = [
    { id: "outdoor", label: "Outdoor" },
    { id: "adjustable", label: "Adjustable" },
    { id: "swivel", label: "Swivel" },
    { id: "handmade", label: "Handmade" },
  ];

  return (
    <aside className="sidebar">
      <FilterSection title="Availability" options={availabilityOptions} selected={filters.availability} onChange={(value) => onFilterChange("availability", value)} type="checkbox" />
      <FilterSection title="Sale" options={saleOptions} selected={filters.sale} onChange={(value) => onFilterChange("sale", value)} type="checkbox" />

      <FilterSection title="Material" options={materialOptions} selected={filters.material} onChange={(value) => onFilterChange("material", value)} type="checkbox" showMore={true} />

      <FilterSection title="Category" options={categoryOptions} selected={filters.category} onChange={(value) => onFilterChange("category", value)} type="checkbox" showMore={true} />

      <div className="sidebar__filter-section">
        <h3 className="sidebar__title">Price</h3>
        <div className="sidebar__price-range">
          <div>
            <input type="range" min="0" max="1500" value={filters.priceRange[0]} onChange={(e) => onFilterChange("priceRange", [Number.parseInt(e.target.value), filters.priceRange[1]])} className="sidebar__slider" />
            <input type="range" min="0" max="1500" value={filters.priceRange[1]} onChange={(e) => onFilterChange("priceRange", [filters.priceRange[0], Number.parseInt(e.target.value)])} className="sidebar__slider" />
          </div>
          <div className="sidebar__labels">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <FilterSection title="Features" options={featureOptions} selected={filters.features} onChange={(value) => onFilterChange("features", value)} type="checkbox" showMore={true} />
    </aside>
  );
};

export default FilterProducts;
