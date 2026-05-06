import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const path = searchParams.get("path");

  if (!owner || !repo || !path) {
    return NextResponse.json(
      { error: "Missing required parameters: owner, repo, path" },
      { status: 400 },
    );
  }

  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    // 如果有 GitHub Token，添加到请求头
    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}&page=1&per_page=1`,
      { headers },
    );

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch commit info from GitHub" },
        { status: response.status },
      );
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No commits found" },
        { status: 404 },
      );
    }

    const commit = data[0];
    const commitInfo = {
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split("\n")[0],
      author: commit.committer?.login || commit.commit.author.name,
      date: formatLocalDateTime(commit.commit.author.date),
    };

    return NextResponse.json(commitInfo);
  } catch (error) {
    console.error("Error fetching commit info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
