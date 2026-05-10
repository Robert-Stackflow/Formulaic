/**
 * PV 统计 API 相关函数
 */

import { pvConfig } from "@/config/pv";

export interface PVData {
  page_pv: number;
  page_uv: number;
  site_pv: number;
  site_uv: number;
}

/**
 * 获取页面 PV/UV 数据
 */
export async function fetchPVData(): Promise<PVData | null> {
  try {
    const response = await fetch(pvConfig.apiUrl, {
      method: "POST",
      headers: {
        "x-bsz-referer": location.href,
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    // console.error("Error fetching PV data:", error);
    return null;
  }
}
