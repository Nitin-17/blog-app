import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef } from "react";

const Dropdown = ({ options = [], handleCategory, selectedCategory }) => {
  const [selected, setSelected] = useState(
    selectedCategory || "Select a category"
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
    handleCategory(value);
  };

  return (
    <div ref={dropdownRef} className="relative w-48">
      {/* Dropdown Toggle */}
      <div
        onClick={toggleDropdown}
        className="flex flex-row justify-between font-medium text-[14px] cursor-pointer border border-gray-300 rounded-md px-4 py-2 bg-white"
      >
        <span>{selected}</span>
        {options.length > 0 && (
          <span className="ml-2">
            <FontAwesomeIcon icon={faAngleDown} size="xs" />
          </span>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && options.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          {options.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item.value)}
              className="block px-4 py-2 text-[14px] text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              {item.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
