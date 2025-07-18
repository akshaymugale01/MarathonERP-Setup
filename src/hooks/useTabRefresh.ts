import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTabStore } from '../stores/tabStores';

export function useTabRefresh() {
  const location = useLocation();
  const { tabs, refreshKey } = useTabStore();
  
  useEffect(() => {
    // Find the tab for the current path
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab && refreshKey[currentTab.id]) {
      // Force a remount of all components under this route
      window.location.reload();
    }
  }, [refreshKey, location.pathname, tabs]);
}
