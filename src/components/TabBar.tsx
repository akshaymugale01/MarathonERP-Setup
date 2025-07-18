import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../stores/tabStores';
import { MdClose, MdRefresh } from 'react-icons/md';

export function TabBar() {
  const { tabs, activeTabId, removeTab, setActiveTab, refreshTab, refreshKey } = useTabStore();
  const navigate = useNavigate();

  if (tabs.length === 0) return null;

  const handleTabClick = (id: string, path: string) => {
    setActiveTab(id);
    navigate(path);
  };

  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeTab(id);
  };

  return (
    <div className="flex bg-white gap-2 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleTabClick(tab.id, tab.path)}
          className={`flex items-center gap-2 mt-2 px-4 py-2 cursor-pointer min-w-[120px] max-w-[200px] 
            ${activeTabId === tab.id ? 'bg-red-800 text-white rounded-t' : 'hover:bg-red-50'}`}
        >
          <span className="truncate flex-1 text-sm">{tab.label}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const isCurrentTab = tab.path === window.location.pathname;
                refreshTab(tab.id);
                if (isCurrentTab) {
                  // Force a remount while staying on the same route
                  navigate(tab.path, { replace: true });
                }
              }}
              className={`${
                activeTabId === tab.id ? 'text-white hover:text-gray-200' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <MdRefresh size={16} />
            </button>
            <button
              onClick={(e) => handleCloseTab(e, tab.id)}
              className={`${
                activeTabId === tab.id ? 'text-white hover:text-gray-200' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <MdClose size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
