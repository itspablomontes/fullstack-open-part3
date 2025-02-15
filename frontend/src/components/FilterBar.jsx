const FilterBar = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Filter: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default FilterBar;
