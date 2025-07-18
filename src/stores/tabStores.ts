import { create } from 'zustand';

export interface Tab {
  id: string;
  label: string;
  path: string;
  icon?: string;
  key?: number;
}

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  refreshKey: Record<string, number>;
  addTab: (tab: Omit<Tab, 'id'>) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  refreshTab: (id: string) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  tabs: [],
  activeTabId: null,
  refreshKey: {},
  addTab: (tab) => {
    set((state) => {
      const id = `${tab.path}-${Date.now()}`;
      // Don't add if tab with same path already exists
      if (state.tabs.some((t) => t.path === tab.path)) {
        // Just activate the existing tab
        const existingTab = state.tabs.find((t) => t.path === tab.path);
        if (existingTab) {
          return { activeTabId: existingTab.id };
        }
      }
      return {
        tabs: [...state.tabs, { ...tab, id }],
        activeTabId: id,
      };
    });
  },
  removeTab: (id) => {
    set((state) => {
      const newTabs = state.tabs.filter((tab) => tab.id !== id);
      let newActiveTabId = state.activeTabId;
      
      // If we're removing the active tab, activate the last remaining tab
      if (state.activeTabId === id && newTabs.length > 0) {
        newActiveTabId = newTabs[newTabs.length - 1].id;
      } else if (newTabs.length === 0) {
        newActiveTabId = null;
      }
      
      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    });
  },
  setActiveTab: (id) => set({ activeTabId: id }),
  refreshTab: (id) => {
    set((state) => {
      const tab = state.tabs.find(t => t.id === id);
      if (!tab) return state;

      return {
        ...state,
        tabs: state.tabs.map(t => 
          t.id === id 
            ? { ...t, key: (t.key || 0) + 1 }
            : t
        )
      };
    });
  },
}));
