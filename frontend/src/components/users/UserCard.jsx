import React from "react";
import { UserPlus, Users } from "lucide-react";
import SearchBar from "../users/SearchBar"; // Adjust the path if needed

function UserCard({
  searchTerm = "",
  userCount = 0,
  totalUsers = 0,
  onAddUser = () => {},
  onSearch = () => {},
  isLoading = false,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title */}
        <div className="flex items-center">
          <Users className="h-7 w-7 text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">User Manager</h1>
        </div>

        {/* Status and Add Button */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <span className="text-gray-600 text-sm text-center sm:text-left">
            {searchTerm
              ? `Showing ${userCount} of ${totalUsers} users`
              : `${totalUsers} users total`}
          </span>
          <button
            onClick={onAddUser}
            className="flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-150"
            disabled={isLoading}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            <span className="font-medium text-sm">
              {isLoading ? "Loading..." : "Add User"}
            </span>
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

export default UserCard;
