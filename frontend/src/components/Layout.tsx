import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 9999 }}
        toastStyle={{ 
          marginTop: '60px',
          zIndex: 9999 
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex">
        {/* Sidebar - always visible */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-6">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-[200px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;