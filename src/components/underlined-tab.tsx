import React from "react";

interface TabItem {
  key: string;
  title: string;
  // 可以根据需要添加图标等属性
}

interface UnderlinedTabProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

/**
 * 带有下划线指示器的标签页导航组件
 */
export const UnderlinedTab: React.FC<UnderlinedTabProps> = ({
  tabs,
  activeKey,
  onChange,
}) => {
  return (
    <div className="flex gap-2 mb-6 border-b border-fd-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-6 py-2.5 font-medium transition-colors relative ${
            activeKey === tab.key
              ? "text-fd-primary"
              : "text-fd-muted-foreground hover:text-fd-foreground"
          }`}
        >
          {tab.title}
          {activeKey === tab.key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fd-primary" />
          )}
        </button>
      ))}
    </div>
  );
};
