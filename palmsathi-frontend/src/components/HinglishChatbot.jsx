import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/mills";

const SUGGESTED_QUESTIONS = [
    "FFB harvest ke baad kitne ghante mein mill deliver karein?",
    "Mature palm ko kitna fertilizer chahiye?",
    "NMEO-OP subsidy ke liye kaise apply karein?",
    "Ganoderma disease ke symptoms kya hain?",
    "Mill price govt minimum se kam ho toh kya karein?",
];

export default function HinglishChatbot() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Namaste! Main PalmSathi Bot hoon 🌴 Oil palm farming ke baare mein kuch bhi poochho — harvest timing, fertilizer, subsidies, ya mill booking. Main Hinglish mein help karunga!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend(text) {
        const userMessage = text || input.trim();
        if (!userMessage || loading) return;

        const newMessages = [...messages, { role: "user", content: userMessage }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        // Add empty assistant message that will be filled by streaming
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        try {
            const response = await sendChatMessage(
                newMessages.map((m) => ({ role: m.role, content: m.content }))
            );

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                const lines = text.split("\n").filter((l) => l.startsWith("data: "));

                for (const line of lines) {
                    const data = JSON.parse(line.replace("data: ", ""));
                    if (data.done) break;
                    if (data.chunk) {
                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                role: "assistant",
                                content: updated[updated.length - 1].content + data.chunk,
                            };
                            return updated;
                        });
                    }
                }
            }
        } catch (err) {
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: "Sorry, kuch error aa gaya. Thodi der baad try karein.",
                };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "1.5rem",
                    right: "1.5rem",
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#1B4332",
                    color: "white",
                    fontSize: "1.5rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isOpen ? "✕" : "🌴"}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div style={{
                    position: "fixed",
                    bottom: "5rem",
                    right: "1.5rem",
                    width: "360px",
                    height: "500px",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                    overflow: "hidden",
                    border: "1px solid #f3f4f6",
                }}>

                    {/* Header */}
                    <div style={{ backgroundColor: "#1B4332", padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>🌴</span>
                        <div>
                            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "white", fontSize: "0.875rem", margin: 0 }}>
                                PalmSathi Bot
                            </p>
                            <p style={{ fontFamily: "Inter, sans-serif", color: "#40916C", fontSize: "0.7rem", margin: 0 }}>
                                Oil palm farming advisor • Hinglish
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                                <div style={{
                                    maxWidth: "80%",
                                    padding: "0.625rem 0.875rem",
                                    borderRadius: msg.role === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                                    backgroundColor: msg.role === "user" ? "#1B4332" : "#F8F4E9",
                                    color: msg.role === "user" ? "white" : "#1B4332",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "0.8rem",
                                    lineHeight: 1.5,
                                }}>
                                    {msg.content || (loading && i === messages.length - 1 ? "..." : "")}
                                </div>
                            </div>
                        ))}

                        {/* Suggested questions — show only at start */}
                        {messages.length === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
                                    Suggested questions:
                                </p>
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        style={{
                                            backgroundColor: "#f0fdf4",
                                            border: "1px solid #bbf7d0",
                                            borderRadius: "0.5rem",
                                            padding: "0.375rem 0.625rem",
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: "0.72rem",
                                            color: "#166534",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: "0.75rem", borderTop: "1px solid #f3f4f6", display: "flex", gap: "0.5rem" }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Kuch bhi poochho..."
                            disabled={loading}
                            style={{
                                flex: 1,
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.5rem",
                                padding: "0.5rem 0.75rem",
                                fontSize: "0.8rem",
                                fontFamily: "Inter, sans-serif",
                                outline: "none",
                            }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            style={{
                                backgroundColor: "#40916C",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                padding: "0.5rem 0.875rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontFamily: "Inter, sans-serif",
                                opacity: loading || !input.trim() ? 0.6 : 1,
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}