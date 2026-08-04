import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import MyProfile from "./pages/MyProfile";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import Layout from "@/components/Layout";
import Purchase from "./pages/Purchase";
import CommissionManagement from "./pages/admin/CommissionManagement";
import CommissionHistory from "./pages/CommissionHistory";
import PayoutManagement from "./pages/admin/PayoutManagement";
import PayoutHistory from "./pages/PayoutHistory";

function App() {
  return (
    <>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        pauseOnHover
      /> */}

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/admin/commissions" element={<CommissionManagement />} />
            <Route path="/my-commissions" element={<CommissionHistory />} />
            <Route path="/payouts-history" element={<PayoutHistory />} />
            <Route path="/admin/payouts" element={<PayoutManagement />} />
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;