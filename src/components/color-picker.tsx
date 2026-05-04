"use client";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const presetColors = [
  { name: "红色", value: "#ef4444" },
  { name: "橙色", value: "#f97316" },
  { name: "琥珀", value: "#f59e0b" },
  { name: "黄色", value: "#eab308" },
  { name: "青柠", value: "#84cc16" },
  { name: "绿色", value: "#22c55e" },
  { name: "翠绿", value: "#10b981" },
  { name: "青色", value: "#14b8a6" },
  { name: "青蓝", value: "#06b6d4" },
  { name: "天蓝", value: "#0ea5e9" },
  { name: "蓝色", value: "#3b82f6" },
  { name: "靛蓝", value: "#6366f1" },
  { name: "紫色", value: "#8b5cf6" },
  { name: "紫红", value: "#a855f7" },
  { name: "洋红", value: "#d946ef" },
  { name: "粉色", value: "#ec4899" },
];

export function ColorPicker({
  value,
  onChange,
  label = "颜色",
}: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-fd-foreground">
        {label}
      </label>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-10 rounded-md border-2 border-fd-border flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary text-sm font-mono"
            placeholder="#3b82f6"
          />
        </div>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {presetColors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`relative group w-10 h-10 rounded-md border-2 transition-all hover:scale-110 ${
              value === color.value
                ? "border-fd-primary ring-2 ring-fd-primary ring-offset-2 ring-offset-fd-background"
                : "border-fd-border hover:border-fd-primary/50"
            }`}
            style={{ backgroundColor: color.value }}
          >
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-fd-popover text-fd-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
