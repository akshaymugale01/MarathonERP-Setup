import { FaBell, FaUser, FaCommentDots } from "react-icons/fa";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ModalLayout() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const navigate = useNavigate();
  const user_name = localStorage.getItem("UserName");
  const department = localStorage.getItem("department");

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
    toast.success("Logged out Successfully!", {
      position: "top-center"
    });
  };

  const handleBackToSetup = () => {
    navigate("/setup");
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Main content without sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        {/* <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <nav className="flex justify-between items-center bg-white px-6 py-2 border-b border-red-200 shadow-sm">
            <div className="flex items-center gap-4"> */}
              {/* <button
                onClick={handleBackToSetup}
                className="text-red-800 hover:text-red-900 font-semibold px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                ← Back to Setup
              </button> */}
              {/* <div className="text-2xl font-bold text-red-800 tracking-wide">
                <img
                  src="https://marathon.in/wp-content/uploads/2018/12/marathon-logo_500px.png"
                  alt="Marathon Logo"
                  className="w-48 h-auto"
                />
              </div> */}
            {/* </div> */}

            {/* Right side icons */}
            {/* <div className="flex items-center gap-6">
              <FaBell className="w-6 h-6 text-red-800 cursor-pointer hover:text-red-900" />
              <FaCommentDots className="w-6 h-6 text-red-800 cursor-pointer hover:text-red-900" />
              <div
                onClick={() => setIsUserModalOpen(!isUserModalOpen)}
                className="cursor-pointer"
              >
                <FaUser className="w-6 h-6 text-red-800 hover:text-red-900" />
              </div>
            </div> */}
          {/* </nav>
        </div> */}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6  ">
          <div className="max-w-7xl mx-auto ">
            <Outlet />
          </div>
        </main>
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-10 right-4 animate-slide-down bg-white rounded-lg shadow-lg w-96 p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* User Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                <FaUser className="text-3xl text-gray-600" />
              </div>

              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {user_name || ""}
              </h2>
              <p className="text-gray-600 mb-1">{department || ""}</p>
              <p className="text-gray-600 text-sm">aslockated@gmail.com</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {}}
                className="w-full bg-red-800 text-white py-3 px-4 rounded hover:bg-red-900 transition-colors"
              >
                Manage Account
              </button>
              <button
                onClick={handleLogout}
                className="w-full border border-red-800 text-red-800 py-3 px-4 rounded hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
