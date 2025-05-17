import React, { useEffect, useState } from "react";
import deviceController from "../../controllers/DevicesController.js";

const EditUserModal = ({
  show,
  editUser,
  setEditUser,
  toggleDeviceSelection,
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Device states and pagination
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [limit] = useState(50); // Number of devices per page
  const [offset, setOffset] = useState(0);
  const [totalDevices, setTotalDevices] = useState(null);

  useEffect(() => {
    const fetchAllDevices = async () => {
      setDevicesLoading(true);
      let allDevices = [];
      let currentOffset = 0;

      try {
        while (true) {
          const data = await deviceController.getAllDevices(limit, currentOffset);
          allDevices = [...allDevices, ...data.items];
          setTotalDevices(data.total);

          if (allDevices.length >= data.total) {
            break; // all devices loaded
          }

          currentOffset += limit;
        }
        setDevices(allDevices);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setDevicesLoading(false);
      }
    };

    fetchAllDevices();
  }, [limit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!editUser.username.trim()) {
      setError("Username is required");
      return;
    }

    if (editUser.password && editUser.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (editUser.password && editUser.password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (err) {
      console.error(err);
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit User</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Username *
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
                required
              />
            </div>

            {/* Password Field (optional) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={editUser.password}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
                minLength={6}
              />
            </div>

            {/* Password Confirmation (only if password is being changed) */}
            {editUser.password && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  minLength={6}
                />
              </div>
            )}

            {/* Device Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Assigned Devices ({editUser.devices.length})
              </label>
              <div className="max-h-40 overflow-y-auto rounded-md border border-gray-300 p-3 space-y-2">
                {devicesLoading ? (
                  <p className="text-sm text-gray-500">Loading devices...</p>
                ) : (
                  devices
                    .slice()
                    .sort((a, b) => a.id - b.id)
                    .map((device) => (
                      <div key={device.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`device-${device.id}`}
                          checked={editUser.devices.includes(device.id)}
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
                id="edit-is-admin"
                checked={editUser.is_admin}
                onChange={(e) =>
                  setEditUser({ ...editUser, is_admin: e.target.checked })
                }
                className="h-4 w-4"
              />
              <label htmlFor="edit-is-admin" className="text-sm text-gray-700">
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
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
