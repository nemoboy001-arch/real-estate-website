"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageSquare, Send, X, ShieldCheck } from "lucide-react";
import { Agent, Property } from "@/data/mockData";

interface AgentChatProps {
  agent: Agent;
  property: Property;
}

interface ChatMessage {
  id: string;
  sender: "client" | "agent";
  text: string;
  timestamp: Date;
}

export default function AgentChat({ agent, property }: AgentChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message from the agent
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "agent",
          text: `Hi! I'm ${agent.name}, the listing agent for ${property.title}. How can I assist you with this property today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [agent, property, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `client-${Date.now()}`,
      sender: "client",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate agent response latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Contextual responses based on user query
    const lowerText = text.toLowerCase();
    let replyText = "";

    const formatPrice = `$${property.price.toLocaleString()}`;
    const isRental = property.category === "rental" || property.listingType === "lease";
    const priceText = isRental ? `${formatPrice} per month` : formatPrice;

    if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("much") || lowerText.includes("fee")) {
      replyText = `The listing price for ${property.title} is ${priceText}. For serious buyers/tenants, we can discuss terms, financing structures, or schedule a formal discussion regarding offers.`;
    } else if (lowerText.includes("visit") || lowerText.includes("tour") || lowerText.includes("view") || lowerText.includes("schedule")) {
      replyText = `I would love to give you a private tour of ${property.title} in ${property.location.city}! You can use the Tour Scheduler panel right here on the page to request a slot, or simply give me a date/time that fits your schedule, and I'll block it out.`;
    } else if (lowerText.includes("negoti") || lowerText.includes("discount") || lowerText.includes("offer")) {
      replyText = `All reasonable offers for ${property.title} are welcome. If you would like to submit a formal written offer or discuss terms, I can coordinate with the owner. Do you have a specific proposal in mind?`;
    } else if (lowerText.includes("amenit") || lowerText.includes("pool") || lowerText.includes("bedroom") || lowerText.includes("bathroom") || lowerText.includes("sqft")) {
      const bedsBaths = property.beds ? `${property.beds} beds and ${property.baths} baths` : "spacious layouts";
      replyText = `${property.title} features ${bedsBaths} spanning ${property.sqft.toLocaleString()} sqft. It also comes equipped with premium features: ${property.amenities.slice(0, 4).join(", ")}. It really is a remarkable space.`;
    } else if (lowerText.includes("location") || lowerText.includes("address") || lowerText.includes("where") || lowerText.includes("neighborhood")) {
      replyText = `The property is located at ${property.location.address} in ${property.location.city}. It's in an excellent, highly-desirable neighborhood with great school zones and walkability.`;
    } else {
      replyText = `Thank you for asking! As an expert in ${agent.specialties.slice(0, 2).join(" & ")}, I can assure you ${property.title} represents a prime asset. Let me know if you would like me to prepare the official brochure, disclosures, or schedule a private viewing.`;
    }

    const agentMsg: ChatMessage = {
      id: `agent-${Date.now()}`,
      sender: "agent",
      text: replyText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, agentMsg]);
    setIsTyping(false);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      {/* Closed Header */}
      {!isOpen ? (
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-12 w-12 shrink-0">
              <Image
                src={agent.photo}
                alt={agent.name}
                fill
                sizes="48px"
                className="rounded-full object-cover border border-slate-100 shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                {agent.name}
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 fill-blue-50/10" />
              </h4>
              <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider">{agent.title}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 text-xs uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Chat Directly With Agent
          </button>
        </div>
      ) : (
        /* Open Chat Panel */
        <div className="flex flex-col h-[450px]">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 shrink-0">
                <Image
                  src={agent.photo}
                  alt={agent.name}
                  fill
                  sizes="36px"
                  className="rounded-full object-cover border border-slate-700 shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  {agent.name}
                  <ShieldCheck className="h-3 w-3 text-blue-400" />
                </h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">{agent.title}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-4 bg-slate-50 space-y-3 scrollbar-none">
            {messages.map((msg) => {
              const isClient = msg.sender === "client";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isClient ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                      isClient
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`block text-[9px] mt-1 text-right ${isClient ? "text-slate-300" : "text-slate-400"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none border border-slate-100 px-4 py-3 shadow-2xs">
                  <div className="flex gap-1 items-center h-2.5">
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about the price, viewings, terms..."
              className="flex-grow rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl p-2.5 transition-colors disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
