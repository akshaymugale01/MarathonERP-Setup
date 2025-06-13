// import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  MdAdminPanelSettings,
  MdDashboardCustomize,
  MdEngineering,
  MdLocalGroceryStore,
  MdPayments,
  MdPeopleAlt,
} from "react-icons/md";
import { Link } from "react-router-dom";

export default function SetupSideBar() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const sidebarSections = [
    {
      name: "Admin",
      icon: MdAdminPanelSettings,
      subSections: [
        {
          title: "Masters",
          links: [
            { label: "User", path: "/admin/users" },
            { label: "Name Titles", path: "/admin/name-titles" },
            { label: "Department", path: "/admin/department" },
            { label: "Designation", path: "/admin/designation" },
            { label: "Division", path: "/admin/division" },
            { label: "Development Type", path: "/admin/dev-type" },
            { label: "Band", path: "/admin/band" },
            { label: "Branch", path: "/admin/branch" },
            { label: "User Groups", path: "/admin/user-groups" },
            { label: "Approval Matrix", path: "/admin/approval-matrix" },
          ],
        },
        {
          title: "Template",
          links: [
            { label: "Report Templates", path: "/admin/report-templates" },
            { label: "Gate No.", path: "/admin/gate-no" },
          ],
        },
        {
          title: "Settings",
          links: [
            { label: "Ip-Configuration", path: "/admin/ip-configuration" },
            { label: "Role Create & Assign", path: "/admin/roles" },
          ],
        },
      ],
    },
    {
      name: "General",
      icon: MdDashboardCustomize,
      subSections: [
        {
          title: "General",
          links: [{ label: "Akshay", path: "/general/akshay" }],
        },
      ],
    },
    {
      name: "Engg.",
      icon: MdEngineering,
      subSections: [
        {
          title: "123",
          links: [{ label: "Engineering", path: "/engineering/123" }],
        },
      ],
    },
    {
      name: "Purchase",
      icon: MdLocalGroceryStore,
    },
    {
      name: "Vendor",
      icon: MdPeopleAlt,
    },
    {
      name: "Finance",
      icon: MdPayments,
    },
  ];

  const currentModule = sidebarSections.find(
    (mod) => mod?.name === activeModule
  );

  const handleModuleClick = (name: string) => {
    setActiveModule((prev) => (prev === name ? null : name));
  };

  return (
    <div className="flex h-screen">
      {/* Left Icon Sidebar */}
      <aside className="w-20 bg-white border-r border-red-200 flex flex-col items-center py-4">
        {sidebarSections.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => handleModuleClick(name)}
            className={`flex flex-col items-center justify-center w-16 h-16 mb-2 rounded ${
              activeModule === name ? "bg-red-100" : "hover:bg-red-50"
            }`}
          >
            <Icon className="" size={24} />
            <span className="text-[10px] text-gray-600 mt-1">{name}</span>
          </button>
        ))}
      </aside>

      {/* <AnimatePresence> */}
        {/* Right Sub Sidebar (only visible if a module is active and has subSections) */}
        {Array.isArray(currentModule?.subSections) &&
          currentModule.subSections.length > 0 && (
            // <motion.aside
            //   initial={{ x: 100, opacity: 0 }}
            //   animate={{ x: 0, opacity: 1 }}
            //   exit={{ x: -64, opacity: 0 }}
            //   transition={{ duration: 0.3 }}
            //   className="w-64 bg-gray-50 border-r border  p-4"
            // >
            <aside className="w-64 bg-gray-60 border-r border p-4" >
              {currentModule.subSections.map((section) => (
                <div key={section.title} className="mb-4">
                  <h4 className="font-semibold text-red-800 text-sm mb-2">
                    {section.title}
                  </h4>
                  <ul className="flex flex-col gap-1">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.path}
                          onClick={() => setActiveModule(null)}
                          className="block text-sm text-gray-800 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            {/* </motion.aside> */}
            </aside>
          )}
      {/* </AnimatePresence> */}
    </div>
  );
}
