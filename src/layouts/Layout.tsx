import { FaBell, FaUser, FaCommentDots, FaThLarge } from "react-icons/fa";
import { useState } from "react";
import SetupSideBar from "./SetupSideBar";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import { Outlet } from "react-router-dom";

export default function Layout() {
  const [activeTab, setActiveTab] = useState("Setup");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const navigate = useNavigate();
  const user_name = localStorage.getItem("UserName")
  const department = localStorage.getItem("department")
  console.log("AS", user_name);

  const renderSidebar = () => {
    if (activeTab === "Setup") return <SetupSideBar />;
    // if (activeTab === "Home") return <HomeSidebar />;
    // if (activeTab === "Dashboard") return <DashboardSidebar />;
    return null;
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
    toast.success("Logged out Sucessfully!", {
      position: "top-center"
    })
  };


  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}

        {/* <nav className="flex justify-between items-center bg-white px-6 py-2 border-b border-red-200 shadow-sm"> */}
        <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-white px-6 py-2 border-b border-red-200 shadow-sm">
            <div className="text-2xl font-bold text-red-800 tracking-wide">
              <img
                src="https://marathon.in/wp-content/uploads/2018/12/marathon-logo_500px.png"
                alt="Marathon Logo"
                className="w-48 h-auto"
              />
              {/* MARATHON */}
            </div>

            <div className="space-x-2">
              <button
                className={`px-4 py-1 rounded ${
                  activeTab === "Home"
                    ? "bg-white border border-red-700 text-red-700"
                    : "border border-black text-black"
                }`}
                onClick={() => setActiveTab("Home")}
              >
                Home
              </button>

              <button
                className={`px-4 py-1 rounded ${
                  activeTab === "Dashboard"
                    ? "bg-white border border-red-700 text-red-700"
                    : "border border-black text-black"
                } `}
                onClick={() => setActiveTab("Dashboard")}
              >
                Dashboard
              </button>
              <button
                className={`px-4 py-1 rounded ${
                  activeTab === "Setup"
                    ? "border border-red-700 text-red-700"
                    : "border border-black text-black"
                }`}
                onClick={() => setActiveTab("Setup")}
              >
                Setup
              </button>
            </div>

            <div className="flex gap-4 items-center text-red-900 text-xl">
              <FaBell />
              <FaCommentDots />
              <FaThLarge />
              <button onClick={() => setIsUserModalOpen(true)}>
                <FaUser />
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar */}
        {/* {activeTab === "Home" && <p>Home Sidebar</p>}
        {activeTab === "Dashboard" && <p>Dashboard Sidebar</p>}
        {activeTab === "Setup" && <SetupSideBar />} */}

        {/* Render the Sidebar based on tab */}
        <div>
          <div className="flex mt-10 min-h-screen w-full">
            {/* Sidebar */}
            {/* <div className="w-[250px] overflow-y-auto border-r border-gray-200"> */}
            {renderSidebar()}
            {/* </div> */}
            <div className="justify-center p-10 min-h-screen overflow-y-auto overflow-x-auto w-full">
              <div className="w-full max-w-[1280px]">
                {/* Main content */}
                <main className="flex min-h-0 overflow-y-auto">
                  <div className="min-w-full">
                    {/* <h1 className="text-xl font-semibold text-gray-800 mb-4">
                {activeTab} Content
              </h1> */}
                    <Outlet />
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>

        {/* <aside className="w-20 bg-white border-r border-red-200 flex flex-col  items-center"> */}
        {/* Top Red Chevron Icon */}
        {/* <div className="border border-red-500 rounded-md p-2 my-4">
          <svg height="20" viewBox="0 0 24 24" fill="red">
            <path d="M4 8l8 4 8-4v2l-8 4-8-4z" />
          </svg>
        </div> */}

        {/* Sidebar menu items */}
        {/* <div className="flex flex-col items-center gap-6 w-full">
            {sidebarLinks.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer p-2 hover:bg-red-100 w-full"
              >
                <Icon size={22} />
                <span className="text-[11px]">{name}</span>
              </div>
            ))}
          </div> */}
        {/* </aside> */}

        {/* Page Content */}
        {/* <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main> */}
      </div>

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
              <p className="text-gray-600 mb-1">2</p>
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

    //User Modal Set
  );
}
