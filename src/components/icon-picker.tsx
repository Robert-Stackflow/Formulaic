"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";

const popularIcons = [
  { name: "MessageCircle", label: "对话" },
  { name: "Lightbulb", label: "想法" },
  { name: "Bug", label: "错误" },
  { name: "Sparkles", label: "特性" },
  { name: "BookOpen", label: "文档" },
  { name: "Code", label: "代码" },
  { name: "Rocket", label: "发布" },
];

const allIconCategories = [
  {
    category: "常用",
    icons: [
      "Mail",
      "Phone",
      "Video",
      "Calendar",
      "MessageCircle",
      "Clock",
      "Bell",
      "Star",
      "Heart",
      "ThumbsUp",
      "Flag",
      "Bookmark",
    ],
  },
  {
    category: "界面",
    icons: [
      "Home",
      "Menu",
      "Search",
      "Settings",
      "User",
      "Users",
      "Lock",
      "Unlock",
      "Eye",
      "EyeOff",
      "Edit",
      "Trash2",
    ],
  },
  {
    category: "文件",
    icons: [
      "File",
      "FileText",
      "Folder",
      "FolderOpen",
      "Download",
      "Upload",
      "Save",
      "Copy",
      "Clipboard",
      "Paperclip",
    ],
  },
  {
    category: "媒体",
    icons: [
      "Image",
      "Film",
      "Music",
      "Volume2",
      "VolumeX",
      "Play",
      "Pause",
      "Camera",
      "Mic",
      "Video",
    ],
  },
  {
    category: "导航",
    icons: [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "ChevronLeft",
      "ChevronRight",
      "ChevronUp",
      "ChevronDown",
      "ChevronsLeft",
      "ChevronsRight",
    ],
  },
  {
    category: "状态",
    icons: [
      "CheckCircle2",
      "XCircle",
      "AlertCircle",
      "AlertTriangle",
      "Info",
      "HelpCircle",
      "Plus",
      "Minus",
      "X",
      "Check",
    ],
  },
  {
    category: "开发",
    icons: [
      "Code",
      "Terminal",
      "GitBranch",
      "GitCommit",
      "GitMerge",
      "GitPullRequest",
      "Package",
      "Cpu",
      "Server",
      "Database",
    ],
  },
  {
    category: "商业",
    icons: [
      "Briefcase",
      "Building",
      "TrendingUp",
      "TrendingDown",
      "DollarSign",
      "CreditCard",
      "ShoppingCart",
      "Tag",
      "Target",
      "Award",
    ],
  },
  {
    category: "社交",
    icons: [
      "Share2",
      "Send",
      "MessageSquare",
      "AtSign",
      "Hash",
      "Smile",
      "Laugh",
      "Frown",
      "Meh",
      "ThumbsDown",
    ],
  },
  {
    category: "工具",
    icons: [
      "Wrench",
      "Hammer",
      "Scissors",
      "Ruler",
      "Compass",
      "Palette",
      "Paintbrush",
      "Droplet",
      "Sun",
      "Moon",
    ],
  },
  {
    category: "对象",
    icons: [
      "Book",
      "BookOpen",
      "Newspaper",
      "Globe",
      "Map",
      "MapPin",
      "Coffee",
      "Gift",
      "Key",
      "Shield",
    ],
  },
  {
    category: "特殊",
    icons: [
      "Sparkles",
      "Zap",
      "Flame",
      "Lightbulb",
      "Rocket",
      "Trophy",
      "Crown",
      "Feather",
      "Anchor",
      "Umbrella",
    ],
  },
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({
  value,
  onChange,
  label = "图标",
}: IconPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIconCategories = allIconCategories
    .map((cat) => ({
      ...cat,
      icons: cat.icons.filter((icon) =>
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.icons.length > 0);

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-fd-foreground">
        {label}
      </label>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {popularIcons.map((icon) => (
          <button
            key={icon.name}
            type="button"
            onClick={() => onChange(icon.name)}
            className={`p-3 rounded-md border-2 transition-all flex flex-col items-center gap-1 ${
              value === icon.name
                ? "border-fd-primary bg-fd-primary/10"
                : "border-fd-border hover:border-fd-primary/50"
            }`}
            title={icon.label}
          >
            <IconRenderer iconName={icon.name} className="w-5 h-5" />
            <span className="text-xs text-fd-muted-foreground">
              {icon.label}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className={`p-3 rounded-md border-2 transition-all flex flex-col items-center gap-1 ${
            !popularIcons.some((icon) => icon.name === value)
              ? "border-fd-primary bg-fd-primary/10"
              : "border-dashed border-fd-border hover:border-fd-primary/50"
          }`}
        >
          {!popularIcons.some((icon) => icon.name === value) ? (
            <IconRenderer iconName={value} className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          <span className="text-xs text-fd-muted-foreground">更多</span>
        </button>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary text-sm"
        placeholder="当前选择"
        readOnly
      />

      {/* 图标选择器弹窗 */}
      {showPicker && (
        <div className="fixed inset-0 bg-fd-background/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-fd-card border border-fd-border rounded-lg w-full max-w-3xl max-h-[80vh] shadow-lg animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-fd-border">
              <h3 className="text-lg font-semibold text-fd-foreground">
                选择图标
              </h3>
              <button
                onClick={() => {
                  setShowPicker(false);
                  setSearchQuery("");
                }}
                className="p-1 hover:bg-fd-muted rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-fd-border">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索图标..."
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
              {filteredIconCategories.map((category) => (
                <div key={category.category} className="pb-8">
                  <h4 className="text-sm font-medium text-fd-muted-foreground mb-3">
                    {category.category}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {category.icons.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => {
                          onChange(iconName);
                          setShowPicker(false);
                          setSearchQuery("");
                        }}
                        className={`relative group p-4 rounded-md border-2 transition-all hover:scale-105 flex items-center justify-center flex-shrink-0 ${
                          value === iconName
                            ? "border-fd-primary bg-fd-primary/10"
                            : "border-fd-border hover:border-fd-primary/50"
                        }`}
                      >
                        <IconRenderer iconName={iconName} className="w-5 h-5" />
                        <span className="absolute bottom-full mb-2 px-2 py-1 bg-fd-popover text-fd-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[70]">
                          {iconName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
