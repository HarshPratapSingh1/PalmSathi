import { streamChatResponse } from "../services/groqService.js";

export async function chat(req, res) {
    try {
        const { messages } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: "Messages are required." });
        }

        // Set headers for SSE streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        await streamChatResponse(messages, (chunk) => {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        });

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}