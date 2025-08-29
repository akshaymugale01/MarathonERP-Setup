import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { MdEngineering, MdSearch, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useTabStore } from "../stores/tabStores";

export default function HomeSideBar() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addTab } = useTabStore();
  const navigate = useNavigate();

  const sidebarSections = useMemo(
    () => [
      {
        name: "Engineering",
        icon: MdEngineering,
        subSections: [
          {
            title: "Inventory",
            links: [
              {
                label: "Service Indent",
                path: "/home/engineering/service-indent",
              },
              { label: "Work Order", path: "/home/engineering/work-order" },
            ],
          },
        ],
      },
    ],
    []
  );

  const currentModule = sidebarSections.find(
    (mod) => mod?.name === activeModule
  );

  // Search functionality - filter all links across all modules
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: Array<{
      label: string;
      path: string;
      module: string;
      section: string;
    }> = [];

    sidebarSections.forEach((module) => {
      if (module.subSections) {
        module.subSections.forEach((section) => {
          section.links.forEach((link) => {
            if (link.label.toLowerCase().includes(searchQuery.toLowerCase())) {
              results.push({
                ...link,
                module: module.name,
                section: section.title,
              });
            }
          });
        });
      }
    });

    return results;
  }, [searchQuery, sidebarSections]);

  const handleModuleClick = (name: string) => {
    setActiveModule((prev) => (prev === name ? null : name));
  };

  const handleCloseSidebar = () => {
    setActiveModule(null);
    setSearchQuery("");
  };

  return (
    <div className="flex">
      {/* Left Icon Sidebar */}
      <aside className="w-20 bg-white border-r-2 border-red-700 flex flex-col items-center py-4">
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
        {(Array.isArray(currentModule?.subSections) &&
          currentModule.subSections.length > 0) ||
        searchQuery.trim() ? (
          <motion.aside
            initial={{ x: -64, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -64, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-100 bg-white border-r border-red-700 shadow-lg h-screen flex flex-col"
          >
            {/* Fixed Header with Search and Close Button */}
            <div className="p-4 border-b border-gray-400 bg-white">
              {/* Close Button - Red rounded button at top right */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleCloseSidebar}
                  className="bg-red-800 hover:bg-red-900 text-white p-2 rounded-lg transition-colors shadow-md"
                  title="Close sidebar"
                >
                  <MdArrowBack size={20} />
                </button>
              </div>

              {/* Search Input with separate search button */}
              <div className="flex border border-gray-400 rounded-lg overflow-hidden bg-white">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                />
                <button className="px-4 py-3 bg-white hover:bg-gray-50 border-l border-gray-300 transition-colors">
                  <MdSearch size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div
              className="flex-1 overflow-y-auto p-6 custom-red-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#991b1b #e5e7eb",
              }}
            >
              {/* Search Results or Module Content */}
              {searchQuery.trim() ? (
                <div className="space-y-1">
                  {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          addTab({
                            label: result.label,
                            path: result.path,
                          });
                          navigate(result.path);
                          handleCloseSidebar();
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-800 hover:text-red-700 hover:bg-red-50 transition-colors rounded-md"
                      >
                        <div className="font-medium">{result.label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {result.module} → {result.section}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MdSearch
                        size={48}
                        className="mx-auto text-gray-300 mb-2"
                      />
                      <p className="text-gray-500 text-sm">
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                currentModule?.subSections && (
                  <div className="space-y-6">
                    {currentModule.subSections.map((section) => (
                      <div key={section.title}>
                        <h4 className="font-bold text-red-800 text-lg mb-4">
                          {section.title}
                        </h4>
                        <div className="space-y-2">
                          {section.links.map((link) => (
                            <button
                              key={link.label}
                              onClick={() => {
                                addTab({
                                  label: link.label,
                                  path: link.path,
                                });
                                navigate(link.path);
                                setActiveModule(null);
                              }}
                              className="block w-full text-left px-4 py-3 text-gray-800 hover:text-red-700 hover:bg-red-50 transition-colors rounded-md font-medium"
                            >
                              {link.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
