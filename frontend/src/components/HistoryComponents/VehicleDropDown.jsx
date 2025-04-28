import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Car } from 'lucide-react';

const VehicleDropdown = ({ vehicles, selectedVehicle, onSelectVehicle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (vehicle) => {
    onSelectVehicle(vehicle);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-72 p-3 text-left bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center">
          <Car className="mr-2 h-5 w-5 text-blue-800" />
          <span className="font-medium">
            {selectedVehicle ? selectedVehicle.name : 'Select a vehicle'}
          </span>
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <ul className="py-1 max-h-60 overflow-auto">
            {vehicles.map((vehicle) => (
              <li 
                key={vehicle.id}
                className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
                  selectedVehicle?.id === vehicle.id ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleSelect(vehicle)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{vehicle.name}</span>
                  <span className="text-sm text-gray-500">{vehicle.licensePlate}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {vehicle.year} · {vehicle.model}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VehicleDropdown;
