import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid content parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const apiEndpoint = process.env.LLM_API_ENDPOINT;
    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_MODEL || "gpt-4o-mini";

    if (!apiEndpoint || !apiKey) {
      console.error(
        "Missing LLM_API_ENDPOINT or LLM_API_KEY environment variables",
      );
      return new Response(
        JSON.stringify({ error: "LLM configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "你是专业的博客摘要生成助手，任务是将博客正文总结为若干句简洁、通顺、重点突出的摘要，适合在博客列表页展示。\n规则：\n1. 只保留核心内容、关键方法、核心结论，不添加冗余信息\n2. 语言精炼、客观、正式，适合公开阅读\n3. 严格只输出纯文本摘要，不使用任何格式、符号、标题、解释、换行\n4. 不要思考过程，不要额外内容，直接返回最终摘要\n5. 参考示例：本文讲解了基于 Next.js 接入 OpenAI API 实现博客摘要生成，包含接口设计、流式响应处理和前端整合落地全过程",
          },
          {
            role: "user",
            content: `请为以下内容生成博客摘要:\n\n${content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error(`LLM API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: "Failed to generate summary" }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
