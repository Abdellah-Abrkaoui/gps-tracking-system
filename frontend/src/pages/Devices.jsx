import { useState, useEffect } from "react";
import DevicesCard from "../components/devices/DevicesCard";
import DeviceTable from "../components/devices/DevicesTable";
import Pagination from "../components/devices/Pagination";
import Modal from "../components/devices/Modal";
import DeviceDetails from "../components/devices/DeviceDetails";
import deviceController from "../controllers/DevicesController";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [totalDevices, setTotalDevices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [formData, setFormData] = useState({ hardware_id: "" });

  
  useEffect(() => {
    fetchDevices();
  }, [currentPage, searchTerm]);

  const fetchDevices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const data = await deviceController.getAllDevicespage(itemsPerPage, offset);
      let filteredItems = data.items;

      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        filteredItems = filteredItems.filter((device) => {
          const id = device.id?.toString().toLowerCase() || "";
          const hwid = device.hardware_id?.toLowerCase() || "";
          return id.includes(term) || hwid.includes(term);
        });
      }

      setDevices(filteredItems);
      setTotalDevices(data.total);
    } catch (err) {
      console.error("Failed to load devices:", err);
      setError(err.message || "Failed to load devices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddDevice = () => {
    setIsEditing(false);
    setFormData({ hardware_id: "" });
    setIsModalOpen(true);
  };

  const handleEditDevice = (device) => {
    setIsEditing(true);
    setCurrentDevice(device);
    setFormData({ hardware_id: device.hardware_id, created_at: device.created_at });
    setIsModalOpen(true);
  };

  const handleViewDevice = (device) => {
    setCurrentDevice(device);
    setIsDetailsOpen(true);
  };

  const handleDeleteDevice = async (id) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      await deviceController.deleteDevice(id);
      fetchDevices();
    } catch (error) {
      setError(error.message || "Failed to delete device");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await deviceController.updateDevice(currentDevice.id, formData);
      } else {
        await deviceController.createDevice({
          ...formData,
          created_at: new Date().toISOString(),
        });
      }
      setIsModalOpen(false);
      fetchDevices();
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to save device");
    }
  };

  const totalPages = Math.ceil(totalDevices / itemsPerPage);

  return (
    <div className="mx-4 my-5 sm:mx-7">
      <DevicesCard
        onAddDevice={handleAddDevice}
        totalDevices={totalDevices}
        deviceCount={devices.length}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />

      <DeviceTable
        devices={devices}
        onView={handleViewDevice}
        onEdit={handleEditDevice}
        onDelete={handleDeleteDevice}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalDevices}
      />

      {/* Modal for Add/Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Device" : "Add Device"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hardware ID
              </label>
              <input
                type="text"
                name="hardware_id"
                value={formData.hardware_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Save Changes" : "Add Device"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {currentDevice && (
        <DeviceDetails
          device={currentDevice}
          onClose={() => setIsDetailsOpen(false)}
          isOpen={isDetailsOpen}
        />
      )}
    </div>
  );
}

export default Devices;
