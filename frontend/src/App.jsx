import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import History from "./pages/History";
import Users from "./pages/Users";
import RequireAuth from "./components/RequireAuth";
import AdminRoute from "./utils/adminRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
