import React, { useState, useEffect } from "react";
import userController from "../controllers/userController";
import AddUserModal from "../components/users/AddUserModal";
import EditUserModal from "../components/users/EditUserModal";
import { AdUnits } from "@mui/icons-material";
// import { getUserRole } from "../utils/authHelper";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    is_admin: false,
    devices: [],
  });

  const [editUser, setEditUser] = useState({
    id: "",
    username: "",
    password: "",
    is_admin: false,
    devices: [],
  });

  // Pagination constants
  const usersPerPage = 5;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userController.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      setError(error.message || "Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditUser({
      id: user.id,
      username: user.username,
      password: "",
      is_admin: user.is_admin,
      devices: [...user.devices],
    });
    setShowEditModal(true);
  };

  const handleAddUser = async () => {
    try {
      await userController.createUser(newUser);
      setShowAddModal(false);
      setNewUser({ username: "", password: "", is_admin: false, devices: [] });
      await fetchUsers();
   }catch (error) {
      setError(error.message || "Failed to add user");
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      // Only send password if it's not empty
      const userToUpdate = {
        ...editUser,
        ...(editUser.password ? {} : { password: undefined }),
      };

      await userController.updateUser(editUser.id, userToUpdate);
      setShowEditModal(false);
      await fetchUsers();
    } catch (error) {
      setError(error.message || "Failed to update user");
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await userController.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      setError(error.message || "Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

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

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Add User"}
        </button>
      </div>

      {isLoading && users.length === 0 ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border border-gray-200">ID</th>
                  <th className="py-2 px-4 border border-gray-200">Username</th>
                  <th className="py-2 px-4 border border-gray-200">Admin</th>
                  <th className="py-2 px-4 border border-gray-200">Devices</th>
                  <th className="py-2 px-4 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border border-gray-200">
                      {user.id}
                    </td>
                    <td className="py-2 px-4 border border-gray-200">
                      {user.username}
                    </td>
                    <td className="py-2 px-4 border border-gray-200">
                      {user.is_admin ? "Admin" : "User"}
                    </td>
                    <td className="py-2 px-4 border border-gray-200">
                      {user.devices.length > 0
                        ? user.devices.map((deviceId) => (
                            <span
                              key={deviceId}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full mr-2"
                            >
                              <AdUnits className="text-blue-300" />
                              {deviceId}
                            </span>
                          ))
                        : "No devices"}
                    </td>
                    <td className="py-2 px-4 border border-gray-200">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-2 py-1 mr-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
              >
                &lt; Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 mx-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
              >
                Next &gt;
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddUserModal
        show={showAddModal}
        newUser={newUser}
        setNewUser={setNewUser}
        toggleDeviceSelection={(deviceId) => {
          setNewUser((prevUser) => ({
            ...prevUser,
            devices: prevUser.devices.includes(deviceId)
              ? prevUser.devices.filter((id) => id !== deviceId)
              : [...prevUser.devices, deviceId],
          }));
        }}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        show={showEditModal}
        editUser={editUser}
        setEditUser={setEditUser}
        toggleDeviceSelection={(deviceId) => {
          setEditUser((prevUser) => ({
            ...prevUser,
            devices: prevUser.devices.includes(deviceId)
              ? prevUser.devices.filter((id) => id !== deviceId)
              : [...prevUser.devices, deviceId],
          }));
        }}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateUser}
      />
    </div>
  );
};

export default Users;
