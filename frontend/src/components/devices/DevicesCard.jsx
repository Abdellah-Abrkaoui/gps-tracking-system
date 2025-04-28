import React from "react";
import { Smartphone, CirclePlus } from "lucide-react";
import SearchBar from "./SearchBar";

function DevicesCard({
  searchTerm = "",
  deviceCount = 0,
  totalDevices = 0,
  onAddDevice = () => {},
  onSearch = () => {},
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title Section */}
        <div className="flex items-center">
          <Smartphone className="h-7 w-7 text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Device Manager
          </h1>
        </div>

        {/* Status and Add Button */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <span className="text-gray-600 text-sm text-center sm:text-left">
            {searchTerm
              ? `Showing ${deviceCount} of ${totalDevices} devices`
              : `${totalDevices} devices total`}
          </span>
          <button
            onClick={onAddDevice}
            className="flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-150"
          >
            <CirclePlus className="h-5 w-5 mr-2" />
            <span className="font-medium text-sm">Add Device</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <SearchBar onSearch={onSearch} searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default DevicesCard;
