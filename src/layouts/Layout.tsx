import { FaBell, FaUser, FaCommentDots, FaThLarge } from "react-icons/fa";
import { useState } from "react";
import SetupSideBar from "./SetupSideBar";
import { Outlet } from "react-router-dom";
// import { Outlet } from "react-router-dom";

export default function Layout() {
  const [activeTab, setActiveTab] = useState("Setup");
  const renderSidebar = () => {
    if (activeTab === "Setup") return <SetupSideBar />;
    // if (activeTab === "Home") return <HomeSidebar />;
    // if (activeTab === "Dashboard") return <DashboardSidebar />;
    return null;
  };
  return (
    <div className="flex h-screen w-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Navbar */}
        <nav className="flex justify-between items-center bg-white px-6 py-2 border-b border-red-200 shadow-sm">
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
            <FaUser />
          </div>
        </nav>

        {/* Sidebar */}
        {/* {activeTab === "Home" && <p>Home Sidebar</p>}
        {activeTab === "Dashboard" && <p>Dashboard Sidebar</p>}
        {activeTab === "Setup" && <SetupSideBar />} */}

        {/* Render the Sidebar based on tab */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {/* <div className="w-[250px] overflow-y-auto border-r border-gray-200"> */}
            {renderSidebar()}
          {/* </div> */}

          {/* Main content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="min-w-full overflow-x-auto">
              <h1 className="text-xl font-semibold text-gray-800 mb-4">
                {activeTab} Content
              </h1>
              <Outlet />
            </div>
          </main>
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
    </div>
  );
}
