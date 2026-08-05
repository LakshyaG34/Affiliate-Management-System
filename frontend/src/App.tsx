import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  lazy,
  Suspense,
} from "react";


const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const MyProfile = lazy(() => import("@/pages/MyProfile"));

const Purchase = lazy(() => import("@/pages/Purchase"));

const CommissionManagement = lazy(
  () => import("@/pages/admin/CommissionManagement")
);

const CommissionHistory = lazy(
  () => import("@/pages/CommissionHistory")
);

const PayoutManagement = lazy(
  () => import("@/pages/admin/PayoutManagement")
);

const PayoutHistory = lazy(
  () => import("@/pages/PayoutHistory")
);

const CommissionSettings = lazy(
  () => import("@/pages/admin/CommissionSettings")
);

const MyReferrals = lazy(
  () => import("@/pages/MyReferral")
);

import LazyLoader from "@/components/LazyLoader";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import Layout from "@/components/Layout";

function App() {
  return (
    <>
      <Suspense fallback={<LazyLoader />}>
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
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/admin/commissions" element={<CommissionManagement />} />
              <Route path="/my-commissions" element={<CommissionHistory />} />
              <Route path="/payouts-history" element={<PayoutHistory />} />
              <Route path="/admin/payouts" element={<PayoutManagement />} />
              <Route path="/admin/commission-settings" element={<CommissionSettings />} />
              <Route path="/referrals" element={<MyReferrals />} />
            </Route>

            {/* Default */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

export default App;