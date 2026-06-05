"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const QUICK_PROMPTS = [
  { icon: "🏢", text: "I want a job at Google — help me plan" },
  { icon: "📊", text: "Build me a roadmap for data science" },
  { icon: "🏛️", text: "Best government jobs for commerce graduates" },
  { icon: "⚙️", text: "How to crack GATE 2025?" },
];

const SYSTEM_CONTEXT = `You are an expert Indian career counsellor and mentor. You help students and professionals with:
- IT/tech careers (Google, Microsoft, startups, product companies)
- Government exams: UPSC, SSC, GATE, CAT, banking (IBPS, SBI), railways, defence
- Career roadmaps for data science, software engineering, MBA, civil services
- Resume, interview prep, skill-building advice tailored to India

STRICT RULES:
1. NEVER write walls of text. Max 3-4 short sentences per response.
2. Always be conversational — ask ONE follow-up question at the end to understand the user better.
3. When building roadmaps: use numbered steps, one per line, each step concise.
4. Be specific to Indian context (Indian colleges, FAANG India offices, tier-1/2 cities, Indian salary ranges).
5. Sound like a smart, warm mentor — not a textbook.
6. If someone says "I want X", first ask about their current background before giving advice.`;

export default function CareerChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const messages = activeConv?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const t = textareaRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 140) + "px";
  };

  const newChat = () => {
    setActiveId(null);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const createConversation = (firstMessage: Message): Conversation => {
    const title =
      firstMessage.content.length > 40
        ? firstMessage.content.slice(0, 40) + "…"
        : firstMessage.content;
    return {
      id: Date.now().toString(),
      title,
      messages: [firstMessage],
      createdAt: new Date(),
    };
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      const userMsg: Message = { role: "user", content: trimmed };
      let convId = activeId;
      let updatedConversations: Conversation[];

      if (!convId) {
        const newConv = createConversation(userMsg);
        convId = newConv.id;
        updatedConversations = [newConv, ...conversations];
        setConversations(updatedConversations);
        setActiveId(convId);
      } else {
        updatedConversations = conversations.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, userMsg] }
            : c
        );
        setConversations(updatedConversations);
      }

      setLoading(true);

      const currentMessages = updatedConversations.find(
        (c) => c.id === convId
      )!.messages;

      try {
        const res = await fetch("/api/v1/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "user", content: SYSTEM_CONTEXT },
              ...currentMessages,
            ],
          }),
        });

        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const aiText =
          data?.message?.content ||
          data?.content ||
          data?.reply ||
          "Sorry, I couldn't process that. Please try again.";

        const aiMsg: Message = { role: "assistant", content: aiText };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, aiMsg] }
              : c
          )
        );
      } catch {
        const errMsg: Message = {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please check your internet and try again.",
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, errMsg] }
              : c
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [activeId, conversations, loading]
  );

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatMessage = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      const isNumbered = /^\d+[\.\)]\s/.test(line.trim());
      const isBullet = /^[-•]\s/.test(line.trim());
      if (isNumbered || isBullet) {
        return (
          <div key={i} style={{ display: "flex", gap: "8px", margin: "4px 0" }}>
            <span style={{ color: "#4f46e5", fontWeight: 700, minWidth: "20px" }}>
              {isNumbered ? line.trim().match(/^\d+[\.\)]/)?.[0] : "•"}
            </span>
            <span>
              {isNumbered
                ? line.trim().replace(/^\d+[\.\)]\s/, "")
                : line.trim().replace(/^[-•]\s/, "")}
            </span>
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} style={{ height: "6px" }} />;
      return <div key={i}>{line}</div>;
    });
  };

  const timeLabel = (d: Date) => {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "260px" : "0",
          minWidth: sidebarOpen ? "260px" : "0",
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              L
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.3px",
              }}
            >
              LYU Career AI
            </span>
          </div>
          <button
            onClick={newChat}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1.5px solid #4f46e5",
              background: "transparent",
              color: "#4f46e5",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#4f46e5";
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {conversations.length === 0 ? (
            <div
              style={{
                padding: "24px 12px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "12.5px",
                lineHeight: 1.6,
              }}
            >
              Your conversations will appear here
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeId === conv.id ? "#eef2ff" : "transparent",
                  cursor: "pointer",
                  marginBottom: "2px",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (activeId !== conv.id)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (activeId !== conv.id)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: activeId === conv.id ? 600 : 500,
                    color: activeId === conv.id ? "#4f46e5" : "#334155",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "3px",
                  }}
                >
                  {conv.title}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {timeLabel(conv.createdAt)} ·{" "}
                  {conv.messages.length} msg
                  {conv.messages.length !== 1 ? "s" : ""}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#f8fafc",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            height: "56px",
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "7px",
              border: "1px solid #e2e8f0",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: "16px",
              transition: "all 0.15s",
            }}
            title="Toggle sidebar"
          >
            ☰
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.2px",
              }}
            >
              {activeConv ? activeConv.title : "Career AI Assistant"}
            </div>
            <div style={{ fontSize: "11.5px", color: "#10b981", fontWeight: 500 }}>
              ● Online · India Career Expert
            </div>
          </div>
          <div
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              background: "#eef2ff",
              fontSize: "12px",
              fontWeight: 600,
              color: "#4f46e5",
            }}
          >
            AI Powered
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {messages.length === 0 ? (
            /* Empty State */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "32px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 32px rgba(79,70,229,0.25)",
                  }}
                >
                  🎯
                </div>
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0 0 8px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Your Career, Your Way
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    margin: 0,
                    maxWidth: "360px",
                    lineHeight: 1.6,
                  }}
                >
                  Ask me anything about jobs, govt exams, roadmaps, or career
                  planning in India.
                </p>
              </div>

              {/* Quick Prompts */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  maxWidth: "560px",
                  width: "100%",
                }}
              >
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p.text)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "1.5px solid #e2e8f0",
                      background: "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.18s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.borderColor = "#4f46e5";
                      b.style.boxShadow = "0 4px 16px rgba(79,70,229,0.12)";
                      b.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.borderColor = "#e2e8f0";
                      b.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                      b.style.transform = "none";
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "6px" }}>
                      {p.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#334155",
                        lineHeight: 1.4,
                      }}
                    >
                      {p.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: "12px",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#fff",
                        flexShrink: 0,
                        marginBottom: "2px",
                      }}
                    >
                      AI
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "68%",
                      padding: "12px 16px",
                      borderRadius:
                        msg.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      background:
                        msg.role === "user" ? "#4f46e5" : "#ffffff",
                      color: msg.role === "user" ? "#ffffff" : "#1e293b",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      border:
                        msg.role === "assistant"
                          ? "1px solid #e2e8f0"
                          : "none",
                      boxShadow:
                        msg.role === "assistant"
                          ? "0 2px 8px rgba(0,0,0,0.06)"
                          : "0 2px 12px rgba(79,70,229,0.3)",
                      fontWeight: 400,
                    }}
                  >
                    {formatMessage(msg.content)}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    AI
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "18px 18px 18px 4px",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "#4f46e5",
                          animation: "bounce 1.2s infinite",
                          animationDelay: `${d * 0.2}s`,
                          opacity: 0.7,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "16px 20px 20px",
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "10px",
              background: "#f8fafc",
              borderRadius: "14px",
              border: "1.5px solid #e2e8f0",
              padding: "10px 10px 10px 16px",
              transition: "border-color 0.15s",
            }}
            onFocusCapture={(e) =>
              (e.currentTarget.style.borderColor = "#4f46e5")
            }
            onBlurCapture={(e) =>
              (e.currentTarget.style.borderColor = "#e2e8f0")
            }
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKey}
              placeholder="Ask about jobs, exams, roadmaps..."
              rows={1}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "14px",
                color: "#0f172a",
                resize: "none",
                lineHeight: 1.6,
                fontFamily: "inherit",
                maxHeight: "140px",
                overflowY: "auto",
                paddingTop: "2px",
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                border: "none",
                background:
                  input.trim() && !loading ? "#4f46e5" : "#e2e8f0",
                color: input.trim() && !loading ? "#ffffff" : "#94a3b8",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                transition: "all 0.15s",
                flexShrink: 0,
                boxShadow:
                  input.trim() && !loading
                    ? "0 2px 8px rgba(79,70,229,0.3)"
                    : "none",
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #94a3b8",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : (
                "↑"
              )}
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
              fontSize: "11.5px",
              color: "#94a3b8",
            }}
          >
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
