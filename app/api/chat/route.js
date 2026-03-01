import OpenAI from "openai";

export async function POST(request) {
    console.log("Chat API called");
    try {
        const body = await request.json();
        const { message } = body;
        
        if (!message) {
            return Response.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing in environment variables");
            return Response.json({ error: "API key is not configured" }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://generativelanguage.googleapis.com/v1/openai/",
        });

        console.log("Sending request to Gemini (1.5 Flash) via v1...");
        // ... (rest of completion code)
        const completion = await openai.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful AI assistant. Be concise and helpful.",
                },
                { role: "user", content: message },
            ],
        });

        console.log("Gemini response received");
        let responseContent = completion.choices[0]?.message?.content || "No response received";
        
        if (responseContent !== "No response received") {
            responseContent = responseContent
                .replace(/\*\*([^\*]+)\*\*/g, "<b>$1</b>")
                .replace(/\n/g, "<br>");
        }

        return Response.json({
            response: responseContent,
        });
    } catch (error) {
        console.error("API Route Error:", error);
        return Response.json(
            {
                error: error.message || "An unexpected error occurred",
                details: error.stack
            },
            { status: 500 }
        );
    }
}
