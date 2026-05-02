"use client";

import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";
import { pvConfig } from "@/config/pv";

interface PVData {
  page_pv: number;
  page_uv: number;
  site_pv: number;
  site_uv: number;
}

export function PageViews() {
  const [pvData, setPvData] = useState<PVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pvConfig.enabled) {
      setLoading(false);
      return;
    }

    const fetchPV = async () => {
      try {
        const response = await fetch(pvConfig.apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pvConfig.token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setPvData(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch page views:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPV();
  }, []);

  if (!pvConfig.enabled || loading || !pvData) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 text-sm text-fd-muted-foreground border-t border-fd-border pt-4 mt-4">
      <div className="flex items-center gap-1.5">
        <Eye className="w-4 h-4" />
        <span>
          {pvData.page_pv > 0 ? pvData.page_pv : pvData.page_uv} 次浏览
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4" />
        <span>{pvData.page_uv} 位访客</span>
      </div>
    </div>
  );
}
