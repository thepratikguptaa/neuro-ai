import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(request) {
    try {
        const { message } = await request.json();

        const stream = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: message }],
            stream: true,
        });

        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({ content })}\n\n`
                            )
                        );
                    }
                }
                controller.close();
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        return Response.json(
            {
                error: "Failed to process streaming request",
            },
            { status: 500 }
        );
    }
}
