import DevicesCard from "../components/devices/DevicesCard";
import DeviceTable from "../components/devices/DevicesTable";
import Pagination from "../components/devices/Pagination";
import Modal from "../components/devices/Modal";
import DeviceDetails from "../components/devices/DeviceDetails";
import deviceController from "../controllers/DevicesController";
import { useState, useEffect } from "react";


function Devices() {
  const [allDevices, setAllDevices] = useState([]); // Remplace dummyDevices par tableau vide
  const [devices, setDevices] = useState([]); // Idem
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    hardwareId: "",
    createdAt: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDevices = devices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(devices.length / itemsPerPage);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

   const fetchDevices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const devicesData = await deviceController.getAllDevices();
      console.log("Données reçues:", devicesData); // Check data 
      setDevices(devicesData);
      setAllDevices(devicesData)
    } catch (err) {
      console.error("Erreur complète:", err); // Log error
      setError(err.message || "Failed to load devices");
    } finally {
      setIsLoading(false);
    }
  };
  

  const resetForm = () => {
    setFormData({
      id: "",
      hardwareId: "",
      createdAt: "",
    });
  };


  

  const handleAddDevice = () => {
    setCurrentDevice(null);
    setIsEditing(false);
    resetForm();
    setIsModalOpen(true);
  };

  const handleViewDevice = (device) => {
    setCurrentDevice(device);
    setIsDetailsOpen(true);
  };

  const handleEditDevice = (device) => {
    setCurrentDevice(device);
    setIsEditing(true);
    setFormData({
      id: device.id,
      hardwareId: device.hardwareId,
      createdAt: device.createdAt,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      // Formatage des données pour l'API
      const devicedata = {
        hardware_id: formData.hardwareId,
        // Si API attend une date specifique
        created_at: formData.createdAt || new Date().toISOString(),
      };
  
      if (isEditing) {
        await deviceController.updateDevice(currentDevice.id, devicedata);
      } else {
        await deviceController.createDevice(devicedata);
      }
  
      
    } catch (err) {
      console.error("Operation failed:", err);
      setError(err.response?.data?.message || err.message || "Operation failed");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      resetForm();
      await fetchDevices();
        }
  };

    const handleDeleteDevice = async (deviceId) => {
      if (!window.confirm("Are you sure you want to delete this device?")) return;
      try {
        await deviceController.deleteDevice(deviceId);
        setAllDevices(allDevices.filter((device) => device.id !== deviceId));
        setDevices(devices.filter((device) => device.id !== deviceId));
        if (currentDevices.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        // Gestion des erreurs
        setError(error.message || "Failed to delete device");
        console.error("Error deleting device:", error);
      }
    };
    

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setDevices(allDevices);
    } else {
      const filtered = allDevices.filter(
        (device) =>
          device.id.toLowerCase().includes(term.toLowerCase()) ||
          device.hardwareId.toLowerCase().includes(term.toLowerCase())
      );
      setDevices(filtered);
      setCurrentPage(1);
    }
  };

  return (
    <div className="mx-4 my-5 sm:mx-7">
      <DevicesCard
        onAddDevice={handleAddDevice}
        totalDevices={allDevices.length}
        deviceCount={devices.length}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />

      <DeviceTable
        devices={currentDevices}
        onView={handleViewDevice}
        onEdit={handleEditDevice}
        onDelete={handleDeleteDevice}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={devices.length}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Device" : "Add New Device"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hardware ID
              </label>
              <input
                type="text"
                name="hardwareId"
                value={formData.hardwareId || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            {isEditing && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Creation Date
                </label>
                <p className="text-sm text-gray-500">
                  {new Date(formData.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
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

      {/* Device Details Modal */}
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
