import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      {/* <ToastContainer
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
      /> */}

      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />

      {/* Body */}
      <div className="flex">
        {/* Sidebar - hidden on mobile by default, shown when toggled */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar} 
        />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
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