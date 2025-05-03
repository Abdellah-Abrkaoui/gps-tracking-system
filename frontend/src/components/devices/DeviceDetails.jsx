import React from "react";
import { X, Calendar, Hash, Key } from "lucide-react";
import { formatDate } from "../../utils/formateDate.js";

const DeviceDetails = ({ device, onClose, isOpen }) => {
  if (!isOpen) return null;
  return (
    <>
      {/* Semi-transparent background layer */}
      <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-40"></div>

      {/* Popup panel */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Device Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Hash className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500 font-medium">Device ID</p>
                <p className="text-gray-900 truncate">{device.id}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Key className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500 font-medium">Hardware ID</p>
                <p className="text-gray-900 font-mono truncate">
                  {device.hardware_id}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500 font-medium">
                  Creation Date
                </p>
                <p className="text-gray-900">{formatDate(device.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceDetails;
