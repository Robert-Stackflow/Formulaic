import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid content parameter" },
        { status: 400 },
      );
    }

    const apiEndpoint = process.env.AI_API_ENDPOINT || "https://api.cloudchewie.com/blog/summary";

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.AI_API_KEY && {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        }),
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error(`AI API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: response.status },
      );
    }

    const summaryText = await response.text();

    return new NextResponse(summaryText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
