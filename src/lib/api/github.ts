/**
 * GitHub API 相关函数
 */

export interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
}

/**
 * 将 UTC 时间字符串转为本地时区的 YYYY-MM-DD HH:mm:ss 格式
 */
function formatLocalDateTime(utcDate: string | Date): string {
  const date = new Date(utcDate);

  if (isNaN(date.getTime())) {
    return "无效日期";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 获取文件的最后提交信息
 * 当 GitHub API 返回 403 时，自动切换到服务端 API
 */
export async function fetchLastCommit(
  owner: string,
  repo: string,
  filePath: string,
): Promise<CommitInfo | null> {
  try {
    // 首先尝试直接调用 GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&page=1&per_page=1`,
    );

    // 如果返回 403（rate limit），使用服务端 API
    if (response.status === 403) {
      console.warn("GitHub API rate limit exceeded, using fallback API");
      return fetchLastCommitFromAPI(owner, repo, filePath);
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return null;
    }

    const commit = data[0];
    return {
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split("\n")[0],
      author: commit.committer.login,
      date: formatLocalDateTime(commit.commit.author.date),
    };
  } catch (error) {
    console.error("Error fetching commit info:", error);
    // 发生错误时也尝试使用备用 API
    return fetchLastCommitFromAPI(owner, repo, filePath);
  }
}

/**
 * 通过服务端 API 获取提交信息（带认证）
 */
async function fetchLastCommitFromAPI(
  owner: string,
  repo: string,
  filePath: string,
): Promise<CommitInfo | null> {
  try {
    const response = await fetch(
      `/api/github/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(filePath)}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching commit info from API:", error);
    return null;
  }
}
