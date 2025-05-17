import React, { useEffect, useState } from "react";
import deviceController from "../../controllers/DevicesController.js";

const AddUserModal = ({
  show,
  newUser,
  setNewUser,
  toggleDeviceSelection,
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Devices state
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // Si getAllDevices supporte pagination, on peut gérer limit/offset ici, sinon appel simple
        const data = await deviceController.getAllDevices(100, 0); // exemple limit=100 offset=0
        // Supposons data = { items: [...], total, limit, offset }
        setDevices(data.items || []);
      } catch (error) {
        console.error("Failed to fetch devices", error);
      } finally {
        setDevicesLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newUser.username.trim()) {
      setError("Username is required");
      return;
    }
    if (!newUser.password) {
      setError("Password is required");
      return;
    }
    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newUser.password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeviceToggle = (deviceId) => {
    toggleDeviceSelection(deviceId);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New User</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Username *
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password *
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {/* Device Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Assign Devices
              </label>
              <div className="max-h-40 overflow-y-auto rounded-md border border-gray-300 p-3 space-y-2">
                {devicesLoading ? (
                  <p className="text-sm text-gray-500">Loading devices...</p>
                ) : devices.length === 0 ? (
                  <p className="text-sm text-gray-500">No devices available</p>
                ) : (
                  devices
                    .slice()
                    .sort((a, b) => a.id - b.id)
                    .map((device) => (
                      <div key={device.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`device-${device.id}`}
                          checked={newUser.devices.includes(device.id)}
                          onChange={() => handleDeviceToggle(device.id)}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`device-${device.id}`}
                          className="text-sm text-gray-700"
                        >
                          {`Device ${device.id}`}
                        </label>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Admin Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-admin"
                checked={newUser.is_admin}
                onChange={(e) =>
                  setNewUser({ ...newUser, is_admin: e.target.checked })
                }
                className="h-4 w-4"
              />
              <label htmlFor="is-admin" className="text-sm text-gray-700">
                Administrator Privileges
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">↻</span>
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
