import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(request) {
    try {
        const { message } = await request.json();

        const completion = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: message }],
        });

        return Response.json({
            response: completion.choices[0].message.content,
        });
    } catch (error) {
        return Response.json(
            {
                error: "Failed to process request",
            },
            { status: 500 }
        );
    }
}
