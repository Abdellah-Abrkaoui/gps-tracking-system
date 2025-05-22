import React, { useState, useEffect } from "react";
import userController from "../controllers/userController";
import AddUserModal from "../components/users/AddUserModal";
import EditUserModal from "../components/users/EditUserModal";
import UserCard from "../components/users/UserCard";
import UserTable from "../components/users/UserTable";
import { ArrowUpDown } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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

  const [offset, setOffset] = useState(0);
  const usersPerPage = 6;
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    fetchUsers(offset);
  }, [offset]);

  const fetchUsers = async (offsetValue = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const { items, total } = await userController.getAllUsers(
        usersPerPage,
        offsetValue
      );
      setUsers(items);
      setTotalCount(total);
    } catch (error) {
      setError(error.message || "Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (offset + usersPerPage < totalCount) {
      setOffset(offset + usersPerPage);
    }
  };

  const handlePrevPage = () => {
    if (offset - usersPerPage >= 0) {
      setOffset(offset - usersPerPage);
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
      console.log("Sending to backend:", newUser);
      const createdUser = await userController.createUser(newUser);
      console.log("Created user with devices:", createdUser); // Add this line

      setShowAddModal(false);
      setNewUser({ username: "", password: "", is_admin: false, devices: [] });
      await fetchUsers(offset);
    } catch (error) {
      setError(error.message || "Failed to add user");
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const userToUpdate = {
        ...editUser,
        ...(editUser.password ? {} : { password: undefined }),
      };

      await userController.updateUser(editUser.id, userToUpdate);
      setShowEditModal(false);
      await fetchUsers(offset);
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

  const onSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
    }
    return (
      <ArrowUpDown
        className={`h-4 w-4 ml-1 ${
          sortDirection === "asc"
            ? "text-blue-500"
            : "text-blue-500 transform rotate-180"
        }`}
      />
    );
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    if (sortField === "is_admin") {
      aValue = a.is_admin ? "Admin" : "User";
      bValue = b.is_admin ? "Admin" : "User";
    } else if (sortField === "devices") {
      aValue = a.devices.length;
      bValue = b.devices.length;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <UserCard
        searchTerm={searchTerm}
        userCount={sortedUsers.length}
        totalUsers={users.length}
        onAddUser={() => setShowAddModal(true)}
        onSearch={setSearchTerm}
        isLoading={isLoading}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded relative">
          {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <UserTable
       users={sortedUsers} 
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onSort={onSort}
        getSortIcon={getSortIcon}
        isLoading={isLoading}
        offset={offset}
        usersPerPage={usersPerPage}
        totalCount={totalCount}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

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