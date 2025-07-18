import { useTabStore } from '../stores/tabStores';
import { Outlet, useLocation } from 'react-router-dom';

export function TabContent() {
  const { tabs } = useTabStore();
  const location = useLocation();
  
  // Find the current tab
  const currentTab = tabs.find(tab => tab.path === location.pathname);
  
  // Use the tab's key (if it exists) as part of the key for forcing remount
  const contentKey = currentTab ? `${currentTab.path}-${currentTab.key || 0}` : location.pathname;

  return (
    <div key={contentKey}>
      <Outlet />
    </div>
  );
}
