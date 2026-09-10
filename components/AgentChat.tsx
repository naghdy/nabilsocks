"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { openingMessage, replyTo, starterChips } from "@/lib/agent";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store";
import { SockVisual } from "@/components/SockVisual";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "agent" | "you";
  text: string;
  products?: Product[];
};

export function AgentChat({ teaser = false }: { teaser?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "open", role: "agent", text: openingMessage() },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const scroller = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function speak(text: string) {
    if (!text.trim() || busy) return;
    const you: Message = { id: crypto.randomUUID(), role: "you", text };
    setMessages((prev) => [...prev, you]);
    setInput("");
    setBusy(true);

    window.setTimeout(() => {
      const reply = replyTo(text);
      if (reply.action.type === "add") {
        addItem(reply.action.product.id, reply.action.size, 1);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          text: reply.text,
          products: reply.products,
        },
      ]);
      setBusy(false);
      if (reply.action.type === "navigate") {
        const href = reply.action.href;
        window.setTimeout(() => router.push(href), 700);
      }
    }, 420);
  }

  return (
    <div className="glass flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-cyan uppercase">
            Live channel
          </p>
          <h2 className="font-display text-xl">Nabil · shopping agent</h2>
        </div>
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_#22f0ff]" />
          Mock · no API
        </span>
      </div>

      <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={message.role === "you" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                message.role === "you"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-cyan/15 px-4 py-3 text-sm"
                  : "max-w-[92%] rounded-2xl rounded-bl-sm bg-white/5 px-4 py-3 text-sm"
              }
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                {message.role === "you" ? "You" : "Nabil"}
              </p>
              <p className="mt-1 leading-relaxed">{message.text}</p>
              {message.products && message.products.length > 0 ? (
                <ul className="mt-3 grid gap-2">
                  {message.products.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/30 p-2"
                    >
                      <div className="h-16 w-12 shrink-0">
                        <SockVisual product={product} className="h-full w-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-display block truncate hover:text-cyan"
                        >
                          {product.name}
                        </Link>
                        <p className="truncate text-xs text-muted">{product.tagline}</p>
                        <p className="font-mono text-xs text-cyan">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-cyan/30 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-cyan uppercase"
                        onClick={() => speak(`add ${product.name}`)}
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.div>
        ))}
        {busy ? (
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Nabil is thinking…
          </p>
        ) : null}
      </div>

      <div className="border-t border-white/8 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {starterChips.slice(0, teaser ? 4 : 6).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => speak(chip)}
              className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted uppercase hover:border-cyan/40 hover:text-cyan"
            >
              {chip}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            speak(input);
          }}
        >
          <label className="sr-only" htmlFor={teaser ? "agent-teaser" : "agent-input"}>
            Message Nabil
          </label>
          <input
            id={teaser ? "agent-teaser" : "agent-input"}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Merino, night out, surprise me…"
            className="min-w-0 flex-1 rounded-full border border-white/12 bg-black/40 px-4 py-2.5 text-sm outline-none placeholder:text-muted/70 focus:border-cyan/50"
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded-full bg-cyan px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-black uppercase"
          >
            Send
          </button>
        </form>
        {teaser ? (
          <p className="mt-3 text-center text-xs text-muted">
            Full console lives on{" "}
            <Link href="/agent" className="text-cyan">
              /agent
            </Link>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
