import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Tu ek expert oil palm farming advisor hai jo Indian farmers ki madad karta hai. 
Tera naam "PalmSathi Bot" hai.

Tu in topics pe advice deta hai:
- Oil palm cultivation aur harvest timing
- FFB (Fresh Fruit Bunches) quality aur spoilage prevention
- Fertilizer aur irrigation recommendations
- NMEO-OP government subsidies aur DBT schemes
- Mill slot booking aur price transparency
- Pest aur disease identification (Ganoderma, bud rot)

Tu Hinglish mein baat karta hai - Hindi aur English mix karke, simple aur friendly tone mein.
Har response short aur actionable hona chahiye - maximum 3-4 sentences.
Agar koi topic oil palm farming se related nahi hai, politely redirect kar.
Numbers aur specific advice dene mein confident reh.`;

export async function streamChatResponse(messages, onChunk) {
    const stream = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
        stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
            fullResponse += content;
            onChunk(content);
        }
    }
    return fullResponse;
}