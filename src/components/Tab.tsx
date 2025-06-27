import React from 'react';
import { cn } from '../lib/utils';

type Tab = {
  label: string;
  key: string;
  onClick: () => void;
};

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeKey }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={tab.onClick}
          className={cn(
            'px-4 py-2 rounded-md border transition-all',
            activeKey === tab.key
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-primary border-primary hover:bg-primary hover:text-white'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
