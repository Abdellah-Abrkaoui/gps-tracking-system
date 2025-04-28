import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ searchTerm = "", onSearch = () => {} }) => {
  const [term, setTerm] = useState(searchTerm);

  useEffect(() => {
    setTerm(searchTerm);
  }, [searchTerm]);

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setTerm("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      {/* Search Input */}
      <input
        type="text"
        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        placeholder="Search devices by ID or hardware ID..."
        value={term}
        onChange={handleChange}
      />

      {/* Clear Search Button */}
      {term && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition duration-200"
          type="button"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
