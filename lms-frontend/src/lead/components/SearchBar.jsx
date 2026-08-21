
import React from "react";
import "../../shared/styles/sidebar.css";

function SearchBar({ value, onSearch, placeholder = "Search..." }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onSearch(e.target.value)}
            className="search-bar"
        />
    );
}

export default SearchBar;