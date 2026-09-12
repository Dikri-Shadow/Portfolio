import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, RotateCcw, Send, Sparkles, X } from "lucide-react";
type Message = {
  role: "user" | "assistant";
  text: string;
  source?: "ollama" | "fallback";
  relatedSection?: string;
  relatedCapability?: string;
};
const prompts = [
  "What can Dikriana do?",
  "Tell me about the IT Support experience.",
  "What technologies are used in this portfolio?",
  "What is Dikriana currently learning?",
  "Is Dikriana available for internship?",
  "Show backend capabilities.",
];
export function PortfolioAssistant({
  open,
  setOpen,
  onCapability,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onCapability?: (id: string) => void;
}) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask about Dikriana’s verified experience, capabilities, education, or internship availability.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, setOpen]);
  async function ask(question: string) {
    const clean = question.trim();
    if (!clean || busy) return;
    setMessages((v) => [...v, { role: "user", text: clean }]);
    setInput("");
    setBusy(true);
    setError(false);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: clean }),
      });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as {
        answer: string;
        source: "ollama" | "fallback";
        relatedSection?: string;
        relatedCapability?: string;
      };
      setMessages((v) => [
        ...v,
        {
          role: "assistant",
          text: data.answer,
          source: data.source,
          relatedSection: data.relatedSection,
          relatedCapability: data.relatedCapability,
        },
      ]);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }
  return (
    <>
      <button
        className="ask-launcher"
        onClick={() => setOpen(true)}
        aria-label="Open Ask Dikriana"
      >
        <Sparkles size={18} />
        <span>Ask Dikriana</span>
      </button>
      {open && (
        <div
          className="assistant-shell"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
        >
          <div className="assistant-head">
            <div>
              <span>
                <Bot size={17} />
              </span>
              <div>
                <b id="assistant-title">Ask Dikriana</b>
                <small>Answers from verified portfolio data</small>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X />
            </button>
          </div>
          <div className="assistant-messages" aria-live="polite">
            {messages.map((m, i) => (
              <div className={`assistant-message ${m.role}`} key={i}>
                <p>{m.text}</p>
                {m.role === "assistant" && m.source && (
                  <small>
                    {m.source === "ollama" ? "Local AI" : "Verified fallback"}
                  </small>
                )}
                {m.relatedSection && (
                  <button
                    onClick={() => {
                      document
                        .getElementById(m.relatedSection!)
                        ?.scrollIntoView({ behavior: "smooth" });
                      if (m.relatedCapability)
                        onCapability?.(m.relatedCapability);
                      setOpen(false);
                    }}
                  >
                    View {m.relatedSection}
                  </button>
                )}
              </div>
            ))}
            {busy && (
              <div className="assistant-message assistant loading">
                <i />
                <i />
                <i />
                <span className="sr-only">Preparing answer</span>
              </div>
            )}
            {error && (
              <div className="assistant-error">
                Assistant is temporarily unavailable.
                <button
                  onClick={() => {
                    const last = [...messages]
                      .reverse()
                      .find((m) => m.role === "user");
                    if (last) void ask(last.text);
                  }}
                >
                  <RotateCcw size={14} /> Retry
                </button>
              </div>
            )}
          </div>
          {messages.length === 1 && (
            <div className="assistant-prompts">
              {prompts.map((p) => (
                <button key={p} onClick={() => void ask(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}
          <form className="assistant-input" onSubmit={submit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask about experience or capabilities…"
              aria-label="Question for Ask Dikriana"
            />
            <button
              disabled={busy || input.trim().length < 2}
              aria-label="Send question"
            >
              <Send size={17} />
            </button>
          </form>
          <div className="assistant-footer">
            <span>No chat history is stored.</span>
            <button
              onClick={() => {
                setMessages([
                  {
                    role: "assistant",
                    text: "Conversation cleared. What would you like to know?",
                  },
                ]);
                setError(false);
              }}
            >
              Clear conversation
            </button>
          </div>
        </div>
      )}
    </>
  );
}
