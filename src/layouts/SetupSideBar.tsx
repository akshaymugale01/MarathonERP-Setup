import { motion, AnimatePresence } from "framer-motion";
// import { label, title } from "framer-motion/client";
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
            { label: "User", path: "/setup/admin/users" },
            { label: "Name Titles", path: "/setup/admin/name-titles" },
            { label: "Department", path: "/setup/admin/department" },
            { label: "Designation", path: "/setup/admin/designation" },
            { label: "Division", path: "/setup/admin/division" },
            { label: "Development Type", path: "/setup/admin/dev-type" },
            { label: "Band", path: "/setup/admin/band" },
            { label: "Branch", path: "/setup/admin/branch" },
            { label: "User Groups", path: "/setup/admin/user-groups" },
            { label: "Approval Matrix", path: "/setup/admin/approval-matrix" },
          ],
        },
        {
          title: "Template",
          links: [
            { label: "Report Templates", path: "/setup/admin/report-templates" },
            { label: "Gate No.", path: "/setup/admin/gate-number" },
          ],
        },
        {
          title: "Settings",
          links: [
          { label: "Ip-Configuration", path: "/setup/admin/ip-configurations" },
            { label: "Role Create & Assign", path: "/setup/admin/roles" },
          ],
        },
      ],
    },
    {
      name: "General",
      icon: MdDashboardCustomize,
      subSections: [
        {
          title: "Masters",
          links: [
            { label: "Countres", path: "/setup/general/countries" },
            { label: "State", path: "/setup/general/states" },
            { label: "Cities", path: "/setup/general/cities" },
            { label: "Location", path: "/setup/general/locations" },
            { label: "Organization", path: "/setup/general/organizations" },
            { label: "Companies", path: "/setup/general/companies" },
            { label: "Projects", path: "/setup/general/projects" },
            { label: "Sub-Projects", path: "/setup/general/sub-projects" },
            { label: "Wings", path: "/setup/general/wings" },
            { label: "Floor", path: "/setup/general/floors" },
            { label: "UOM", path: "/setup/general/uoms" },
            { label: "Stores", path: "/setups/general/stores" },
          ],
        },
        {
          title: "Settings",
          links: [
            { label: "UOM Conversion", path: "/setup/general/uom-conversion" },
            { label: "Term & Conditions", path: "/setup/general/term-conditions" },
          ],
        },
      ],
    },
    {
      name: "Engg.",
      icon: MdEngineering,
      subSections: [
        {
          title: "Master",
          links: [
            { label: "BOQ Mapping", path: "/setup/engineering/boq-mapping" },
            { label: "Work Category", path: "/setup/engineering/work-category" },
            { label: "Work Sub-Category", path: "/setup/engineering/work-category" },
            { label: "Labor Types", path: "/setup/engineering/labor-types" },
            { label: "Labor Sub-Types", path: "/setup/engineering/labor-sub-types" },
            { label: "Labor", path: "/setup/engineering/labor" },
          ],
        },
      ],
    },
    {
      name: "Purchase",
      icon: MdLocalGroceryStore,
      subSections: [
        {
          title: "Master",
          links: [
            { label: "Material Types", path: "/setup/purchase/material-types" },
            { label: "Material SubType", path: "/setup/purchase/material-sub-types" },
            { label: "Material Brands", path: "/setup/purchase/material-brands" },
            { label: "Generic Info", path: "/setup/purchase/generic-info" },
            { label: "Color Master", path: "/setup/purchase/color-master" },
            { label: "Budget Types", path: "/setup/purchase/budget-types" },
            { label: "Material", path: "/setup/purchase/material" },
            { label: "Major Materials", path: "/setup/purchase/major-material" },
            { label: "User & Materials Types", path: "/setup/purchase/major-material" },

          ],
        },
      ],
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
    <div className="flex">
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

      <AnimatePresence>
        {/* Right Sub Sidebar (only visible if a module is active and has subSections) */}
        {Array.isArray(currentModule?.subSections) &&
          currentModule.subSections.length > 0 && (
            <motion.aside
              initial={{ x: -64, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -64, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-64 bg-gray-50 border-r p-4"
            >
              {/* <aside className="w-64 bg-gray-60 border-r border p-4" > */}
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
              {/* </aside> */}
            </motion.aside>
          )}
      </AnimatePresence>
    </div>
  );
}
