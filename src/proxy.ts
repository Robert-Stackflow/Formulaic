import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientIdentifier } from "@/lib/client-identity";

// Aggressive rate limiting during attack
const EDGE_RATE_LIMIT = {
  limit: 1000, // Reduced from 80 to 30 requests per minute
  windowMs: 60_000,
} as const;

// Known malicious bot user-agents
const BLOCKED_USER_AGENTS = [
  "python-requests",
  "curl",
  "wget",
  "go-http-client",
  "scrapy",
  "headless",
  "phantom",
  "selenium",
  "bot",
  "crawler",
  "spider",
] as const;

const RETRY_MESSAGE = {
  error: "Too many requests from this source. Please slow down.",
};
const BLOCKED_MESSAGE = { error: "Access denied." };

function applyRateLimitHeaders(
  headers: Headers,
  limit: number,
  remaining: number,
  reset: number
) {
  headers.set("RateLimit-Limit", limit.toString());
  headers.set("RateLimit-Remaining", Math.max(0, remaining).toString());
  headers.set("RateLimit-Reset", reset.toString());
}

function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const lowerUA = userAgent.toLowerCase();
  return BLOCKED_USER_AGENTS.some((blocked) => lowerUA.includes(blocked));
}

const PROTECTED_PATHS = ["/discuss", "/todos", "/settings"];

export async function proxy(request: NextRequest) {
  // 1. 限流和UA拦截（所有请求都生效）
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  // Block known malicious bots
  const userAgent = request.headers.get("user-agent");
  if (isBlockedUserAgent(userAgent)) {
    return NextResponse.json(BLOCKED_MESSAGE, { status: 403 });
  }

  const identity = `${getClientIdentifier(request)}|edge`;
  const state = consumeRateLimit(identity, EDGE_RATE_LIMIT);

  const headers = new Headers();
  applyRateLimitHeaders(headers, state.limit, state.remaining, state.reset);

  if (!state.allowed) {
    headers.set("Retry-After", state.retryAfter.toString());
    return NextResponse.json(RETRY_MESSAGE, {
      status: 429,
      headers,
    });
  }

  // 2. 登录保护（仅指定路径）
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (isProtected) {
    const token = await getToken({ req: request });
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 限流头部合并到最终响应
  const response = NextResponse.next();
  for (const [key, value] of headers.entries()) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  // Protect all routes except static assets and images
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, etc (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
