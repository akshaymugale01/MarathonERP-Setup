import React from 'react';
import { useTabStore } from '../stores/tabStores';

export function withTabRefresh<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithTabRefreshComponent(props: P) {
    const { refreshKey } = useTabStore();
    const location = window.location.pathname;
    const currentTabId = Object.keys(refreshKey).find(id => id.startsWith(location));
    const refreshCount = currentTabId ? refreshKey[currentTabId] : 0;

    // Re-mount component when refreshCount changes
    return <WrappedComponent key={refreshCount} {...props} />;
  };
}
