import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/api/mills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const SUGGESTED_QUESTIONS = [
    "FFB harvest ke baad kitne ghante mein mill deliver karein?",
    "Mature palm ko kitna fertilizer chahiye?",
    "NMEO-OP subsidy ke liye kaise apply karein?",
    "Ganoderma disease ke symptoms kya hain?",
    "Mill price govt minimum se kam ho toh kya karein?",
    "Oil palm mein drip irrigation kaise lagayein?",
    "FFB ki quality kaise check karein?",
];

function ChatUI({ messages, input, setInput, loading, handleSend, bottomRef, height = "500px" }) {
    return (
        <div className="flex flex-col overflow-hidden border border-border bg-white rounded-xl" style={{ height }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-background min-h-0 space-y-3">                {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-leaf/20 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">
                            🌴
                        </div>
                    )}
                    <div className={`max-w-[75%] px-3 py-2.5 rounded-xl text-sm font-body leading-relaxed ${msg.role === "user"
                        ? "bg-forest text-white rounded-br-sm"
                        : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
                        }`}>
                        {msg.content || (loading && i === messages.length - 1
                            ? <span className="flex gap-1 items-center py-0.5">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                            : ""
                        )}
                    </div>
                </div>
            ))}

                {/* Suggested questions — only at start */}
                {messages.length === 1 && (
                    <div className="space-y-2 mt-2">
                        <p className="text-xs text-muted-foreground font-body font-medium">Suggested questions:</p>
                        <div className="grid grid-cols-1 gap-1.5">
                            {SUGGESTED_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => handleSend(q)}
                                    className="w-full text-left text-xs font-body bg-accent/50 text-forest px-3 py-2 rounded-lg hover:bg-leaf/10 transition-colors border border-border/50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-white flex gap-2 shrink-0">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Kuch bhi poochho..."
                    disabled={loading}
                    className="flex-1 text-sm"
                />
                <Button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    size="icon"
                    className="shrink-0"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default function HinglishChatbot({ embedded = false }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Namaste! Main PalmSathi Bot hoon 🌴 Oil palm farming ke baare mein kuch bhi poochho — harvest timing, fertilizer, subsidies, ya mill booking. Main Hinglish mein help karunga!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
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
                    try {
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
                    } catch (e) { }
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

    if (embedded) {
        return (
            <ChatUI
                messages={messages}
                input={input}
                setInput={setInput}
                loading={loading}
                handleSend={handleSend}
                bottomRef={bottomRef}
                height="100%"
            />
        );
    }

    return null;
}