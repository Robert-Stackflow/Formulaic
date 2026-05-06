/**
 * Giscus 评论系统相关函数
 */

export interface DiscussionData {
  totalCommentCount: number;
}

export interface GiscusMetadata {
  discussion?: {
    totalCommentCount: number;
    url?: string;
  };
}

/**
 * 监听 Giscus 元数据事件
 * @param pageUrl - 当前页面的 URL 路径，用于过滤特定页面的评论数据
 * @param callback - 接收评论数据的回调函数
 * @returns 清理函数
 */
export function listenGiscusMetadata(
  pageUrl: string,
  callback: (data: DiscussionData) => void,
): () => void {
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== "https://giscus.app") return;

    const giscusData = event.data?.giscus as GiscusMetadata | undefined;
    if (giscusData?.discussion) {
      const discussionUrl = giscusData.discussion.url;
      if (discussionUrl && !discussionUrl.includes(pageUrl)) {
        return;
      }

      callback({
        totalCommentCount: giscusData.discussion.totalCommentCount || 0,
      });
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}
